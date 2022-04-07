<template>
  <nav class="navbar px-sm">
    <router-link :to="{ name: 'NewsList' }" class="logo">
      <img
        class="logo__img"
        src="@/assets/images/icons/logo.svg"
        alt="Logo Ipsum Company"
      />
    </router-link>
    <ul class="navbar__nav-items">
      <li class="navbar__nav-item is-active">All News</li>
      <li class="navbar__nav-item">Business</li>
      <li class="navbar__nav-item">Politics</li>
      <li class="navbar__nav-item">Tech</li>
      <li class="navbar__nav-item">Science</li>
      <li class="navbar__nav-item">Sports</li>
      <li class="navbar__nav-item">Environment</li>
      <li class="navbar__nav-item">Weather</li>
    </ul>
    <router-link :to="{ name: 'NewsList' }" class="user-settings">
      <icon-button
        v-if="can('manage', 'User')"
        icon="account-circle-fill"
        color="var(--color-secondary)"
      ></icon-button>
    </router-link>
  </nav>
  <!-- <button @click="toggleDarkMode">TOGGLE</button> -->
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/useUserStore.js';
import {
  ability,
  useAbility,
  abilityBuilder,
} from '../../assets/js/services/ability.js';

const userStore = useUserStore();
const { role } = storeToRefs(userStore);

// for checking ability from template
const { can } = useAbility();

// setTimeout(() => {
//   updateAbility();
// }, 5000);

// const updateAbility = () => {
//   if (['admin'].includes(role.value)) {
//     // for setting rules on ability
//     const { can, rules } = ability;
//     can('manage', 'User');
//     ability.update(rules);
//     console.log(rules);
//   }
// };

// import {
//   enable as enableDarkMode,
//   disable as disableDarkMode,
//   auto as followSystemColorScheme,
//   exportGeneratedCSS as collectCSS,
//   isEnabled as isDarkReaderEnabled,
// } from 'darkreader';

// function toggleDarkMode() {
//   isDarkReaderEnabled()
//     ? disableDarkMode()
//     : enableDarkMode({
//         brightness: 95,
//         contrast: 95,
//       });
// }
</script>
