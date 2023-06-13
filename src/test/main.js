import Vue from "vue";
import App from "../pwa-installer.vue";
import env from "env";

new Vue({
    render: h => h(App),
}).$mount('#app');

/**
 * install/uninstall sw
 */
if ('serviceWorker' in navigator) {
    if (env.PWA_DISABLED) {
        navigator.serviceWorker.getRegistration().then((registration) => {
            registration && registration.unregister();
        })
    } else {
        const swPath = env.IS_DEVELOPMENT ? '/service-worker.js' : '/pwa-installer/service-worker.js'
        navigator.serviceWorker.register(swPath);
    }
}
