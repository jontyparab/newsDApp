<template>
  <nav class="navbar py-xs px-sm">
    <router-link :to="{ name: 'NewsList' }" class="logo me-auto">
      <img
        class="logo__img px-xs"
        src="@/assets/images/icons/logo.svg"
        alt="Logo Ipsum Company"
      />
    </router-link>
    <!-- <ul class="navbar__nav-items px-xs">
      <li class="navbar__nav-item is-active">All News</li>
      <li class="navbar__nav-item">Business</li>
      <li class="navbar__nav-item">Politics</li>
      <li class="navbar__nav-item">Tech</li>
      <li class="navbar__nav-item">Science</li>
      <li class="navbar__nav-item">Sports</li>
      <li class="navbar__nav-item">Environment</li>
      <li class="navbar__nav-item">Weather</li>
    </ul> -->
    <div class="user-options ms-auto">
      <icon-button
        v-if="can('authenticated')"
        icon="account-circle-fill"
        color="var(--color-secondary)"
        @click="menus.menuBar = true"
      ></icon-button>
      <base-button
        v-else
        class="px-sm py-xs bg-secondary text-white"
        @click="router.push({ name: 'AuthForm' })"
      >
        Login
      </base-button>
    </div>
    <menu-bar
      v-if="menus.menuBar"
      :item-list="menuOptions"
      @close-menu="closeMenu('menuBar')"
    ></menu-bar>
  </nav>
  <!-- <button @click="toggleDarkMode">TOGGLE</button> -->
</template>

<script setup>
import { ref, reactive, onMounted, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useAbility } from '@/assets/js/services/ability.js';
import { useUserStore } from '@/stores/useUserStore.js';
import { useRouter } from 'vue-router';
import {
  enable as enableDarkMode,
  disable as disableDarkMode,
  // auto as followSystemColorScheme,
  // exportGeneratedCSS as collectCSS,
  isEnabled as isDarkReaderEnabled,
} from 'darkreader';

// for checking ability from template
const { can } = useAbility();

// console.log(can('manage', 'News'));
// setTimeout(() => {
//   console.log(can('manage', 'News'));
// }, 2000);

const router = useRouter();

const userStore = useUserStore();
const { logout, getWalletAccounts } = userStore;
// const {  } = storeToRefs(userStore);

const isMetamaskSupported = ref(false);
const address = ref(false);

const menus = reactive({
  menuBar: false,
});

/*
`can` function does not provide latest values if you pass as prop. 
computed, watcher nothing seems to work.
Hence we just pass the conditions and check in child component.
*/

const menuOptions = reactive([
  {
    icon: 'home',
    name: 'Home',
    to: { name: 'NewsList' },
    conditions: [['default']],
  },
  {
    icon: 'wallet-3-line',
    name: 'Connect Wallet',
    to: { path: '' },
    callback: connectWallet,
    conditions: [['authenticated']],
  },
  {
    icon: 'user-star-line',
    name: 'Join as a Journalist',
    to: { name: 'JournalistRegisterForm' },
    conditions: [['manage', 'News']],
  },
  {
    icon: 'newspaper-line',
    name: 'Publish Article',
    to: { name: 'NewsForm' },
    conditions: [['manage', 'News']],
  },
  {
    icon: 'folder-user-line',
    name: 'My Articles',
    to: { path: '' },
    conditions: [['manage', 'News']],
  },
  {
    icon: 'moon-line',
    name: 'Toggle Theme',
    to: { path: '' },
    callback: toggleDarkMode,
    conditions: [['authenticated']],
  },
  {
    icon: 'logout-circle-line',
    name: 'Sign Out',
    to: { path: '' },
    callback: logout,
    conditions: [['authenticated']],
  },
]);

function toggleDarkMode() {
  return isDarkReaderEnabled()
    ? disableDarkMode()
    : enableDarkMode({
        brightness: 95,
        contrast: 95,
      });
}

async function connectWallet() {
  try {
    const accounts = await getWalletAccounts();
    console.log(accounts[0]);
  } catch (e) {
    console.log('Fail to connect: ', e);
  }
}

const closeMenu = (name) => {
  menus[name] = false;
};

onMounted(() => {
  isMetamaskSupported.value = typeof window.ethereum !== undefined;
});
</script>
