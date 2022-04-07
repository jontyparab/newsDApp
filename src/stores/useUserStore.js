import { defineStore } from 'pinia';
import axios from '@/assets/js/services/axios';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userId: '',
      walletId: 'my-wallet-id',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      agency: undefined,
      isAuthenticated: false,
      __typename: 'User',
    };
  },
  actions: {
    async signUp(authInfo) {
      console.log(authInfo);
      try {
        const data = await axios.patch(
          `/users/${this.walletId}.json`,
          authInfo
        );
        console.log(data);
      } catch (error) {
        console.error('Error signing up: ', error);
      }
    },
    async login(authInfo) {
      console.log(authInfo);
      try {
        const data = await axios.get(`/users/${authInfo.walletId}.json`);
        // TODO: Map data to state
        console.log(data);
      } catch (error) {
        console.error('Error logging in: ', error);
      }
    },
  },
  getters: {},
});
