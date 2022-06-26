import axios from 'axios';
import { firebaseConfig } from './firebase';

/**
 * Base axios module
 * A collection has multiple documents.
 * A document can have fields (JSON properties) and/or collections.
 * A collection cannot have *direct* child collection.
 * A document cannot have a *direct* child document.
 * @module axios
 */

// export default axios.create({
//   baseURL: `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   params: {
//     key: firebaseConfig.apiKey,
//   },
// });

export const fbAxios = axios.create({
  baseURL: `https://news-dapp-default-rtdb.firebaseio.com/`,
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    key: firebaseConfig.apiKey,
  },
});

export const nodeAxios = axios.create({
  baseURL: `http://localhost:3002/`,
});
