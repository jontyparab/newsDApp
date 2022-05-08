import { defineStore } from 'pinia';
import { useUserStore } from './useUserStore';
import { nodeAxios, fbAxios } from '@/assets/js/services/axios';
import app from '@/assets/js/services/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Create a root reference
const storage = getStorage(app);

export const useMainStore = defineStore('main', {
  state: () => {
    return {};
  },
  actions: {
    async uploadIpfsFile(files, path) {
      return ['https://picsum.photos/200/300'];
      // const formData = new FormData();
      // formData.append('file', files[0].file);
      // formData.append('name', files[0].name);
      // try {
      //   const res = await nodeAxios.post(`/uploads/${path}`, formData);
      //   return res;
      // } catch (e) {
      //   console.log('Error uploadIpfsFile:');
      //   throw new Error(e);
      // }
    },
    async uploadFbFile(files, path) {
      if (files?.length) {
        try {
          let promises = [];
          for (const { file } of files) {
            let fn = file.name;
            const fileExt = fn.substring(fn.lastIndexOf('.', fn.length));
            console.log(fileExt, file);
            const fileRef = ref(
              storage,
              `/uploads${path}/${crypto.randomUUID() + fileExt}`
            );
            const metaData = {
              contentType: file.type,
            };
            promises.push(uploadBytes(fileRef, file, metaData));
          }
          const responses = await Promise.all(promises);
          const urls = await Promise.all(
            responses.map(async (res) => {
              const url = await getDownloadURL(res.ref);
              return url;
            })
          );
          console.log('File(s) uploaded successfully to firebase.', urls);
          return urls;
        } catch (e) {
          console.log('Error uploadFbFile:');
          throw new Error(e);
        }
      }
    },
  },
  getters: {},
});
