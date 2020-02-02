import Vue from 'vue';

// Need to load the ToastService first
import ToastService from 'primevue/toastservice';
Vue.use(ToastService);

// AutoComplete
import AutoComplete from 'primevue/autocomplete';
Vue.component('AutoComplete', AutoComplete);
// Button
import Button from 'primevue/button';
Vue.component('Button', Button);
// DataView
import DataView from 'primevue/dataview';
Vue.component('DataView', DataView);
// Dialog
import Dialog from 'primevue/dialog';
Vue.component('Dialog', Dialog);
// InputText
import InputText from 'primevue/inputtext';
Vue.component('InputText', InputText);
// Tabs
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
Vue.component('TabView', TabView);
Vue.component('TabPanel', TabPanel);
// Toast
import Toast from 'primevue/toast';
Vue.component('Toast', Toast);
// ValidationMessage
import ValidationMessage from 'primevue/validationmessage';
Vue.component('ValidationMessage', ValidationMessage);
