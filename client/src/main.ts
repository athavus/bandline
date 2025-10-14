import { mount } from 'svelte'
import './global.css'
import App from './App.svelte'
import { initLanguage } from './lib/stores/language'

// Initialize language system
initLanguage();

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
