<template>
  <div class="container">
    <div class="auth px-sm">
      <h1 class="mt-md mb-sm">Create or login into your Account</h1>
      <div class="auth__wrap">
        <div class="auth__tabs">
          <div
            :class="{ active: !isSignup }"
            class="auth__tabs--login p-xs"
            @click="changeAuth('Login')"
          >
            Login
          </div>
          <div
            :class="{ active: isSignup }"
            class="auth__tabs--signup p-xs"
            @click="changeAuth('Sign up')"
          >
            Sign up
          </div>
        </div>
        <form class="auth__form p-sm" @submit.prevent="authenticate">
          <h3>{{ isSignup ? 'Registration' : 'Login' }}</h3>
          <base-input-text
            v-show="isSignup"
            spellcheck="false"
            label="First name"
          ></base-input-text>
          <base-input-text
            v-show="isSignup"
            spellcheck="false"
            label="Last name"
          ></base-input-text>
          <base-input-text label="Email"></base-input-text>
          <base-input-text type="password" label="Password"></base-input-text>
          <base-input-text
            v-show="isSignup"
            type="password"
            label="Confirm Password"
          ></base-input-text>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
let isSignup = ref(true);
const changeAuth = function (s) {
  isSignup.value = s === 'Login' ? false : true;
};
const authenticate = function (e) {
  console.log('Authenticate user', e);
};
</script>
,
