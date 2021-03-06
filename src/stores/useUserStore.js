import { defineStore } from 'pinia';
import {
  getAuth,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signOut,
} from 'firebase/auth';
import fbApp from '@/assets/js/services/firebase.js';
import { fbAxios } from '@/assets/js/services/axios';
import router from '@/router/index';
import {
  // check
  ability,
  // set
  abilityBuilder,
  defineAbilitiesFor,
} from '@/assets/js/services/ability.js';
import { registerJournalist } from '@/assets/js/utils/contractUtils';
import { randomIntUUID } from '@/assets/js/utils/cryptoUtils';

const auth = getAuth(fbApp);
let timer = null;

const { can, cannot, rules } = abilityBuilder;

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      /* For all users */
      userId: '',
      email: '',
      bookmarks: {},

      /* For journalists */
      kycId: '',
      isJournalist: false,
      journalistId: null,
      isVerifiedJournalist: false,
      firstName: '',
      lastName: '',
      about: '',
      subjectsOfInterest: '',
      verificationId: null,

      // app local data
      accessToken: '',
      // isMetaMaskConnected: false,
      // isAuthenticated: false,
      __typename: 'User',
    };
  },
  actions: {
    async authenticate(authInfo) {
      const { email } = authInfo;
      const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be in the authorized domains list in the Firebase Console.
        url: `${window.location.origin}/user/auth/finishSignUp`,
        // This must be true.
        handleCodeInApp: true,
      };

      return sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
          // The link was successfully sent. Inform the user.
          // Save the email locally so you don't need to ask the user for it again
          // if they open the link on the same device.
          console.log('Saved email in local storage.');
          window.localStorage.setItem('emailForSignIn', email);
          // ...
        })
        .catch((error) => {
          // const errorCode = error.code;
          // const errorMessage = error.message;
          console.error('Error authenticate: ', error);
          // ...
        });
    },
    login() {
      // Confirm the link is a sign-in with email link.

      if (isSignInWithEmailLink(auth, window.location.href)) {
        // Additional state parameters can also be passed via URL.
        // This can be used to continue the user's intended action before triggering
        // the sign-in operation.
        // Get the email if available. This should be available if the user completes
        // the flow on the same device where they started it.
        let emailForSignIn = window.localStorage.getItem('emailForSignIn');
        if (!emailForSignIn) {
          // User opened the link on a different device. To prevent session fixation
          // attacks, ask the user to provide the associated email again. For example:
          emailForSignIn = window.prompt(
            'Please provide your email for confirmation'
          );
        }
        // The client SDK will parse the code from the link for you.
        signInWithEmailLink(auth, emailForSignIn, window.location.href)
          .then(async (result) => {
            // Clear email from storage.
            console.log('Removed email from local storage.');
            // window.localStorage.removeItem('emailForSignIn');
            const {
              user: { email, uid },
              _tokenResponse: { refreshToken },
            } = result;

            // Getting more validity token using refresh token
            const {
              data: { expires_in, id_token: accessToken },
            } = await fbAxios.post(
              `https://securetoken.googleapis.com/v1/token`,
              { refresh_token: refreshToken, grant_type: 'refresh_token' }
            );

            this.$patch({
              userId: uid,
              accessToken,
            });

            /* Auto login setup */
            const expiresIn = +expires_in * 1000;
            // const expiresIn = 30;
            const tokenExpiration = new Date().getTime() + expiresIn;

            localStorage.setItem('accessToken', this.accessToken);
            localStorage.setItem('userId', this.userId);
            localStorage.setItem('tokenExpiration', tokenExpiration);

            timer = setTimeout(() => {
              this.logout(true);
            }, expiresIn);

            console.log('You are now logged in.');

            this.getOrCreateUser({ userId: this.userId, email });
            // You can access the new user via result.user
            // Additional user info profile not available via:
            // result.additionalUserInfo.profile == null
            // You can check if the user is new or existing:
            // result.additionalUserInfo.isNewUser
          })
          .catch((error) => {
            // Some error occurred, you can inspect the code: error.code
            // Common errors could be invalid email and invalid or expired OTPs.
            console.error('Error login: ', error);
          });
      }
    },
    logout(redirect = false) {
      if (ability.can('authenticated')) {
        signOut(auth)
          .then(() => {
            this.$reset();
            console.log('Signed out.');

            localStorage.removeItem('accessToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('tokenExpiration');
            clearTimeout(timer);

            // permissions
            const { rules: r } = defineAbilitiesFor('anyone');
            ability.update(r);

            if (redirect) {
              router.push({ name: 'AuthForm' });
            }
            // Sign-out successful.
          })
          .catch((error) => {
            console.error('Error in logout: ', error);
          });
      }
    },
    tryLogin() {
      if (ability.cannot('authenticated')) {
        const accessToken = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('userId');
        const tokenExpiration = localStorage.getItem('tokenExpiration');
        const expiresIn = +tokenExpiration - new Date().getTime();

        // if expiresIn negative or 0 then don't autoLogin
        if (expiresIn < 0) {
          return;
        }

        // timer = setTimeout(() => {
        //   this.logout(true);
        // }, expiresIn);

        if (accessToken && userId) {
          this.$patch({ accessToken, userId });
          this.getOrCreateUser({ userId });
        }
      }
    },

    async getOrCreateUser(user) {
      try {
        let data = await fbAxios.get(`/users/${this.userId}/.json`);
        if (!data.data) {
          data = await fbAxios.put(`/users/${this.userId}/.json`, user);
        }
        // Update state
        this.$patch({
          ...data.data,
        });

        // permissions
        can('authenticated');

        if (this.isJournalist && this.isVerifiedJournalist) {
          can('manage', 'News');
        }
        ability.update(rules);

        // setTimeout(() => {
        //   can('manage', 'News');
        //   ability.update(rules);
        // }, 4000);

        // router.push({ name: 'NewsList' });
      } catch (error) {
        console.error('Error getOrCreateUser: ', error);
      }
    },

    async getWalletAccounts() {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        if (accounts.length > 0) {
          can('connected', 'Wallet');
          ability.update(rules);
        }
        return accounts;
      } catch (e) {
        console.error('Error getWalletAccounts: ', e);
      }
    },

    async registerJournalist(formData) {
      // TODO: this should be done from admin panel
      // formData.verificationId = crypto.randomUUID();
      formData.verificationId = randomIntUUID();
      const { about, subjectsOfInterest, ...kycData } = formData;
      try {
        let { data: resData } = await fbAxios.put(
          `/kyc/${this.userId}/.json`,
          kycData
        );
        let { data: updatedUserData } = await fbAxios.patch(
          `/users/${this.userId}/.json`,
          {
            firstName: resData.firstName,
            lastName: resData.lastName,
            about,
            subjectsOfInterest,
            isJournalist: true,
            isVerifiedJournalist: true,
            verificationId: resData.verificationId,
          }
        );
        this.$patch({ ...updatedUserData });

        const {
          verification_id: { _hex },
        } = await registerJournalist(updatedUserData.verificationId);
        // TODO: save journalist id  in firebase and patch local state
        let { data: journalistId } = await fbAxios.patch(
          `/users/${this.userId}/.json`,
          {
            journalistId: parseInt(_hex),
          }
        );
        this.$patch({ ...journalistId });

        // permissions
        if (this.isJournalist && this.isVerifiedJournalist) {
          can('manage', 'News');
          ability.update(rules);
        }
      } catch (e) {
        console.error('Error registerJournalist:', e);
      }
    },
  },
  getters: {
    getFullName: (state) => `${state.firstName} ${state.lastName}`,
    getBookmarkStatus(state) {
      return (id) => {
        if (state?.bookmarks) {
          try {
            Boolean(state?.bookmarks[id]);
          } catch (e) {
            console.log('No property on bookmarks.');
          }
        }
      };
    },
  },
});
