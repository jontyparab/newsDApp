import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userId: '',
      walletId: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      agency: undefined,
      role: 'admin',
      isAuthenticated: false,
      __typename: 'User'
    };
  },
  actions: {},
  getters: {},
});
