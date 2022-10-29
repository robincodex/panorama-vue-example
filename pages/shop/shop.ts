import { renderPanel } from '@panorama-vue/renderer';
import App from './App.vue';
import './shop.scss';

const root = $.GetContextPanel();
renderPanel(root, App);
