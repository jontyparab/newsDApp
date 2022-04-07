<template>
  <div class="container">
    <div class="auth">
      <h1 class="mt-md mb-sm">Join us and make a difference!</h1>
      <div class="auth__wrap">
        <div class="auth__tabs">
          <div
            :class="{ active: !isRegister }"
            class="auth__tabs--login p-xs"
            @click="changeAuth('Login')"
          >
            Login
          </div>
          <div
            :class="{ active: isRegister }"
            class="auth__tabs--signup p-xs"
            @click="changeAuth('Register')"
          >
            Register
          </div>
        </div>
        <FormKit
          v-model="authForm"
          type="form"
          :classes="{
            form: 'auth__form py-sm px-sm',
          }"
          incomplete-message="Please enter correct details and try again."
          name="authForm"
          :submit-label="isRegister ? 'Register' : 'Login'"
          :submit-attrs="{
            wrapperClass: 'submit-wrapper mt-sm',
          }"
          @submit="authenticate"
        >
          <h3 class="mb-sm">{{ isRegister ? 'Registration' : 'Login' }}</h3>
          <FormKit
            v-if="isRegister"
            type="text"
            spellcheck="false"
            label="First name"
            :validation="[['required']]"
            name="first_name"
            :preserve="true"
          />
          <FormKit
            v-if="isRegister"
            type="text"
            spellcheck="false"
            label="Last name"
            :validation="[['required']]"
            name="last_name"
            :preserve="true"
          />
          <FormKit
            type="email"
            name="email"
            :validation="[['required'], ['email']]"
            label="Email"
          />
          <!-- <FormKit
            type="password"
            name="password"
            label="Password"
            :validation="[['required'], ['length', 5]]"
            autocomplete="on"
          />
          <FormKit
            v-if="isRegister"
            type="password"
            name="password_confirm"
            label="Confirm password"
            :validation="[['confirm'], ['required']]"
            autocomplete="on"
            :preserve="true"
          /> -->
        </FormKit>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useUserStore } from '../stores/useUserStore';

// import { useAxios } from '@vueuse/integrations/useAxios';
// import { axiosInstance } from '@/assets/js/services/axios';
// const { data, isLoading, isFinished, execute } = useAxios(axiosInstance);

const authForm = reactive({});
let isRegister = ref(true);

const userStore = useUserStore();

const changeAuth = function (s) {
  isRegister.value = s === 'Login' ? false : true;
};

const authenticate = async (e) => {
  if (isRegister.value == true) {
    // TODO: Pass wallet info also to action
    userStore.signUp(authForm);
  } else {
    userStore.login({ ...authForm, walletId: 'my-wallet-id' });
  }
};
</script>
,
