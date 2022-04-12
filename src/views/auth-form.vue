<template>
  <div class="container">
    <div class="auth mx-auto">
      <h1 class="mt-md mb-sm">Join us for a better experience!</h1>
      <div class="auth__wrap">
        <div class="auth__tabs">
          <div class="auth__tabs--login active py-xs">
            {{ mailSent ? 'Complete' : 'Authenticate' }}
          </div>
        </div>
        <FormKit
          v-if="!mailSent"
          v-model="authForm"
          type="form"
          :classes="{
            form: 'auth__form py-sm px-sm',
          }"
          incomplete-message="Please enter correct details and try again."
          name="authForm"
          submit-label="Send link"
          :submit-attrs="{
            wrapperClass: 'submit-wrapper mt-sm',
          }"
          @submit="authenticate"
        >
          <h3 class="mb-sm">
            {{ mailSent ? 'Check your inbox.' : 'Login or Register' }}
          </h3>
          <!-- <FormKit
            v-if="isSignUp"
            type="text"
            spellcheck="false"
            label="Full name"
            :validation="[['required']]"
            name="fullName"
            :preserve="true"
          /> -->
          <FormKit
            type="email"
            name="email"
            help-class="mt-xs"
            :validation="[['required'], ['email']]"
            label="Email"
            help="A login link will be sent to your provided email address."
          />
          <!-- <FormKit
            type="password"
            name="password"
            label="Password"
            :validation="[['required'], ['length', 5]]"
            autocomplete="on"
          />
          <FormKit
            v-if="isSignUp"
            type="password"
            name="password_confirm"
            label="Confirm password"
            :validation="[['confirm'], ['required']]"
            autocomplete="on"
            :preserve="true"
          /> -->
        </FormKit>
        <div v-else class="auth__mail-sent p-sm">
          <p>
            Go to your <b>inbox</b> (or spam) and click the link to log into
            your account.
          </p>
          <p class="mt-xs">
            If you have received the mail you can safely close this tab.
          </p>
          <small class="text-info mt-sm" @click="showTryAgainBtn = true">
            Did not receive any mail?
          </small>
          <base-button
            v-if="showTryAgainBtn"
            class="formkit-input bg-secondary text-white ms-auto mt-sm"
            @click="tryAgain"
          >
            &#8617; Try again
          </base-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useUserStore } from '../stores/useUserStore';
import { delay } from '@/assets/js/utils/async';

// import { useAxios } from '@vueuse/integrations/useAxios';
// import { axiosInstance } from '@/assets/js/services/axios';
// const { data, isLoading, isFinished, execute } = useAxios(axiosInstance);

const authForm = reactive({});

const showTryAgainBtn = ref(false);
const mailSent = ref(false);
const userStore = useUserStore();

const authenticate = async (e) => {
  await userStore.authenticate(authForm);
  await delay(1000);
  mailSent.value = true;
};

const tryAgain = async () => {
  showTryAgainBtn.value = false;
  mailSent.value = false;
};
</script>
,
