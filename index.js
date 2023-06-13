const PWAInstaller = require('./src/pwa-installer.vue')

const VuePWAInstaller = {
    install: function(Vue) {
        Vue.component('pwa-installer', PWAInstaller)
    }
}

module.exports = VuePWAInstaller
