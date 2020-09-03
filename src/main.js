import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify'
import ElementUi from 'element-ui'
import ViewUI from 'view-design'
import axios from 'axios'
import './element'
import qs from "qs"
import  quillEditor  from 'vue-quill-editor'

import 'view-design/dist/styles/iview.css';
import 'vuetify/dist/vuetify.css'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/public.css';

import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';


Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(ElementUi)
Vue.use(ViewUI);
Vue.use(quillEditor);


//axios
Vue.prototype.$http = axios;
axios.defaults.baseURL = "http://api.haipi.com/api"
axios.defaults.timeout = 2000;
Vue.prototype.$qs = qs;

export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg',
  },
})

new Vue({
  router,
  vuetify: new Vuetify(),
  render: h => h(App)
}).$mount('#app')
