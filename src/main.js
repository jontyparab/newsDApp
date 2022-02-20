import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store/index';

// Packages
import { VueClipboard } from '@soerenmartius/vue3-clipboard';
import VueSocialSharing from 'vue-social-sharing';
import { dragscrollNext } from 'vue-dragscroll';

// Styles
import './assets/sass/main.scss';

const app = createApp(App);

app.use(VueClipboard);
app.use(VueSocialSharing);
app.directive('dragscroll', dragscrollNext);
app.use(store);
app.use(router);

app.mount('#app');
