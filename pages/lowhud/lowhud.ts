import { renderPanel } from '@panorama-vue/renderer';
import App from './App.vue';
import './lowhud.scss';

const root = $.GetContextPanel();
renderPanel(root, App);
