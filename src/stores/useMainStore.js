import { defineStore } from 'pinia';
import { useUserStore } from './useUserStore';
import { nodeAxios, fbAxios } from '@/assets/js/services/axios';

export const useMainStore = defineStore('main', {
  state: () => {
    return {};
  },
  actions: {
    async uploadIpfsFile(files) {
      const formData = new FormData();
      formData.append('file', files[0].file);
      formData.append('name', files[0].name);
      try {
        const res = await nodeAxios.post('/uploads/files', formData);
        return res;
      } catch (e) {
        console.log('Error uploadIpfsFile:', e);
      }
    },
    async uploadFbFile(files) {
      const formData = new FormData();
      formData.append('file', files[0].file);
      formData.append('name', files[0].name);
      try {
        const res = await fbAxios.post('/uploads/files', formData);
        return res;
      } catch (e) {
        console.log('Error uploadFbFile:', e);
      }
    },
  },
  getters: {},
});
