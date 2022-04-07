import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import { createPinia } from 'pinia';

// Packages
import { VueClipboard } from '@soerenmartius/vue3-clipboard';
import VueSocialSharing from 'vue-social-sharing';
import { dragscrollNext } from 'vue-dragscroll';
import { plugin as formkitPlugin, defaultConfig } from '@formkit/vue';
import { abilitiesPlugin } from '@casl/vue';
import { ability } from '@/assets/js/services/ability.js';

// Styles
import './assets/sass/main.scss';

const app = createApp(App);
app.use(VueClipboard);
app.use(VueSocialSharing);
app.use(formkitPlugin, defaultConfig);
app.use(abilitiesPlugin, ability);
app.directive('dragscroll', dragscrollNext);
app.use(createPinia());
app.use(router);

app.mount('#app');
