<template>
  <div class="installer-wrap" v-if="show">
    <div class="mini-ui" v-if="!fullScreen">
      <img  @click="toggleFullScreen" class="icon" src="data:image/png;base64,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">
    </div>
    <div class="install-wrap" v-if="fullScreen">
      <div class="inner">
        <div class="header">
          <div class="title">Install {{ appName }}</div>
          <div class="close" @click.prevent="handleCloseOverlay">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <line x1="18" y1="6" x2="6" y2="18"></line> <line x1="6" y1="6" x2="18" y2="18"></line> </svg>
          </div>
        </div>
        <div class="details">
          <img alt="app icon" class="logo"
               :src="logo">
          <div class="text">
            <div>{{ appName }}</div>
          </div>
        </div>
        <div class="content" v-if="isIOS">
          <ol>
            <li>點擊
              <svg class="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24pt" height="24pt"> <defs> <clipPath id="_clipPath_HosR97ASCZxQVuWAAHmJPqHP3lWFWok3"> <rect width="24" height="24"></rect> </clipPath> </defs> <g clip-path="url(#_clipPath_HosR97ASCZxQVuWAAHmJPqHP3lWFWok3)"> <path d=" M 16.209 8.323 L 16.209 6.314 L 21.309 6.295 L 21.411 23.958 L 2.608 23.906 L 2.589 6.269 L 8.011 6.336 L 7.985 8.32 L 5.189 8.349 L 5.067 21.562 L 18.871 21.756 L 18.728 8.323 L 16.209 8.323 Z M 7.432 4.537 L 11.988 0 L 16.568 4.46 L 15.215 5.696 L 13.617 4.383 L 13.572 15.609 L 10.486 15.557 L 10.463 4.383 L 9.111 5.812 L 7.432 4.537 Z " fill-rule="evenodd" fill="rgb(0,122,255)"></path> </g> </svg>
            </li>
            <li>
              滾動並選擇 <span class="add-home">加入主畫面 <svg class="icon" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 46 48">
          <path fill="rgb(255,255,255)" fill-opacity="1.000" d="M 0.00 0.00 Q 23.00 0.00 46.00 0.00 Q 46.00 24.00 46.00 48.00 Q 23.00 48.00 0.00 48.00 Q 0.00 24.00 0.00 0.00 Z M 44.7215 12.4275 A 9.11 9.11 0 0 0 35.6274 3.3016 L 10.9274 3.2585 A 9.11 9.11 0 0 0 1.8016 12.3526 L 1.7585 37.0125 A 9.11 9.11 0 0 0 10.8526 46.1384 L 35.5526 46.1815 A 9.11 9.11 0 0 0 44.6784 37.0874 L 44.7215 12.4275 Z"/>
          <path fill="rgb(2,2,2)" fill-opacity="1.000" d="M 44.6784 37.0874 A 9.11 9.11 0 0 1 35.5526 46.1815 L 10.8526 46.1384 A 9.11 9.11 0 0 1 1.7585 37.0125 L 1.8016 12.3526 A 9.11 9.11 0 0 1 10.9274 3.2585 L 35.6274 3.3016 A 9.11 9.11 0 0 1 44.7215 12.4275 L 44.6784 37.0874 Z M 41.5007 12.6520 A 6.34 6.34 0 0 0 35.1718 6.3010 L 11.1918 6.2591 A 6.34 6.34 0 0 0 4.8408 12.5880 L 4.7993 36.3680 A 6.34 6.34 0 0 0 11.1282 42.7190 L 35.1082 42.7609 A 6.34 6.34 0 0 0 41.4592 36.4320 L 41.5007 12.6520 Z"/>
          <path fill="rgb(255,255,255)" fill-opacity="1.000" d="M 41.4592 36.4320 A 6.34 6.34 0 0 1 35.1082 42.7609 L 11.1282 42.7190 A 6.34 6.34 0 0 1 4.7993 36.3680 L 4.8408 12.5880 A 6.34 6.34 0 0 1 11.1918 6.2591 L 35.1718 6.3010 A 6.34 6.34 0 0 1 41.5007 12.6520 L 41.4592 36.4320 Z M 20.93 22.94 L 13.82 23.06 A 1.29 0.97 15.7 0 0 12.94 23.40 Q 12.10 24.29 12.59 25.48 A 0.84 0.79 79.8 0 0 13.31 26.01 L 20.77 26.21 A 0.75 0.69 0.9 0 1 21.50 26.90 Q 21.50 29.77 21.50 32.37 Q 21.50 32.47 21.40 33.61 Q 21.24 35.40 23.13 35.26 Q 25.09 35.11 25.00 33.00 L 24.75 27.21 A 1.07 0.93 -2.3 0 1 25.79 26.24 L 33.19 26.00 A 0.81 0.80 -80.6 0 0 33.91 25.48 Q 34.24 24.62 33.91 23.77 A 0.79 0.78 80.0 0 0 33.19 23.26 L 25.47 23.00 A 0.73 0.72 -89.2 0 1 24.77 22.27 L 24.73 14.81 A 0.81 0.77 12.1 0 0 24.24 14.09 Q 22.84 13.48 21.88 14.43 A 1.41 1.01 74.6 0 0 21.55 15.32 L 21.45 22.43 A 0.52 0.52 -89.4 0 1 20.93 22.94 Z"/>
          <path fill="rgb(2,2,2)" fill-opacity="1.000" d="M 24.73 14.81 L 24.77 22.27 A 0.73 0.72 -89.2 0 0 25.47 23.00 L 33.19 23.26 A 0.79 0.78 80.0 0 1 33.91 23.77 Q 34.24 24.62 33.91 25.48 A 0.81 0.80 -80.6 0 1 33.19 26.00 L 25.79 26.24 A 1.07 0.93 -2.3 0 0 24.75 27.21 L 25.00 33.00 Q 25.09 35.11 23.13 35.26 Q 21.24 35.40 21.40 33.61 Q 21.50 32.47 21.50 32.37 Q 21.50 29.77 21.50 26.90 A 0.75 0.69 0.9 0 0 20.77 26.21 L 13.31 26.01 A 0.84 0.79 79.8 0 1 12.59 25.48 Q 12.10 24.29 12.94 23.40 A 1.29 0.97 15.7 0 1 13.82 23.06 L 20.93 22.94 A 0.52 0.52 -89.4 0 0 21.45 22.43 L 21.55 15.32 A 1.41 1.01 74.6 0 1 21.88 14.43 Q 22.84 13.48 24.24 14.09 A 0.81 0.77 12.1 0 1 24.73 14.81 Z"/>
        </svg></span>
            </li>
            <li>
              從主屏幕打開 <img alt="app icon" class="logo icon"
                          :src="logo"
                          style="color:transparent !important;"> 應用程序
            </li>
          </ol>
        </div>
        <div v-if="!isIOS">
          <button class="btn btn-install" @click.stop="dispatchInstallPrompt">Install as PWA</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const WebClipDetect = {
  getDevice() {
    let ua = String(navigator.userAgent);
    return ua.match(/iPhone|iPod/) ? 'iPhone' : (ua.match(/iPad/) ? 'iPad' : this.isPadPro() );
  },
  isPadPro() {
    if ((navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 0) || navigator.platform === 'iPad') {
      return 'iPad';
    }
    return null
  },
  isIPhone() {
    return this.getDevice() == 'iPhone';
  },
  isIPad() {
    return this.getDevice() == 'iPad';
  },
  isPWA() {
    return navigator.standalone === true || !!(window.matchMedia('(display-mode: standalone)').matches);
  },
  isIos() {
    return !!(this.getDevice())
  },
  isSafari() {
    return !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
  },
  getIosDevice() {
    return this.getDevice();
  }
};


export default {
  name: "pwa-installer",

  props: {
    logo: {
      type: String,
      default() {
        return `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTk1MiIgaGVpZ2h0PSI3MzQuOTM1IiBiYXNlUHJvZmlsZT0iZnVsbCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTk1MiA3MzQuOTMiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDE5NTIgNzM0LjkzIiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCBmaWxsPSIjM0QzRDNEIiBmaWxsLW9wYWNpdHk9IjEiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iLjIiIGQ9Ik0gMTQzNi42Miw2MDMuMzA0TCAxNDkzLjAxLDQ2MC43MDVMIDE2NTUuODMsNDYwLjcwNUwgMTU3OC41NiwyNDQuMzlMIDE2NzUuMiwwLjAwMDUyODMzNkwgMTk1Miw3MzQuOTMzTCAxNzQ3Ljg3LDczNC45MzNMIDE3MDAuNTcsNjAzLjMwNEwgMTQzNi42Miw2MDMuMzA0IFoiLz48cGF0aCBmaWxsPSIjNUEwRkM4IiBmaWxsLW9wYWNpdHk9IjEiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iLjIiIGQ9Ik0gMTI2Mi40Nyw3MzQuOTM1TCAxNTU4Ljc5LDAuMDAxNTY1OTNMIDEzNjIuMzQsMC4wMDI1NDI1TCAxMTU5LjY0LDQ3NC45MzNMIDEwMTUuNSwwLjAwMzUxOTA2TCA4NjQuNDk5LDAuMDAzNTE5MDZMIDcwOS43MzEsNDc0LjkzM0wgNjAwLjU4NSwyNTguNTE3TCA1MDEuODEyLDU2Mi44MTlMIDYwMi4wOTYsNzM0LjkzNUwgNzk1LjQyNyw3MzQuOTM1TCA5MzUuMjg0LDMwOS4wMjVMIDEwNjguNjMsNzM0LjkzNUwgMTI2Mi40Nyw3MzQuOTM1IFoiLz48cGF0aCBmaWxsPSIjM0QzRDNEIiBmaWxsLW9wYWNpdHk9IjEiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iLjIiIGQ9Ik0gMTg2LjQ3Niw0ODIuNjQzTCAzMDcuNDc5LDQ4Mi42NDNDIDM0NC4xMzMsNDgyLjY0MyAzNzYuNzcyLDQ3OC41NTIgNDA1LjM5Niw0NzAuMzdMIDQzNi42ODksMzczLjk2MkwgNTI0LjE0OCwxMDQuNTE2QyA1MTcuNDg0LDkzLjk1MzUgNTA5Ljg3Niw4My45NjY3IDUwMS4zMjQsNzQuNTU2OUMgNDU2LjQxOSwyNC44NTIgMzkwLjcxOSwwLjAwMDQwNjI2NSAzMDQuMjIyLDAuMDAwNDA2MjY1TCAtMy44MTQ3ZS0wMDYsMC4wMDA0MDYyNjVMIC0zLjgxNDdlLTAwNiw3MzQuOTMzTCAxODYuNDc2LDczNC45MzNMIDE4Ni40NzYsNDgyLjY0MyBaIE0gMzQ2LjY0MiwxNjkuMDc5QyAzNjQuMTgyLDE4Ni43MzIgMzcyLjk1MSwyMTAuMzU1IDM3Mi45NTEsMjM5Ljk1QyAzNzIuOTUxLDI2OS43NzIgMzY1LjIzOCwyOTMuNDI0IDM0OS44MTMsMzEwLjkwNkMgMzMyLjkwMywzMzAuMzMxIDMwMS43NjYsMzQwLjA0MyAyNTYuNDA0LDM0MC4wNDNMIDE4Ni40NzYsMzQwLjA0M0wgMTg2LjQ3NiwxNDIuNTk4TCAyNTYuOTE4LDE0Mi41OThDIDI5OS4xOTUsMTQyLjU5OCAzMjkuMTAzLDE1MS40MjUgMzQ2LjY0MiwxNjkuMDc5IFoiLz48L2c+PC9zdmc+`;
      },
    },
    appName: {
      type: String,
      default() {
        return `Sample PWA`;
      }
    }
  },

  data() {
    return {
      canInstallPrompt: false,
      fullScreen: false,
    };
  },

  computed:{
    isIOS() {
      return WebClipDetect.isIos();
    },
    isDebug() {
      const q = new URLSearchParams(location.search);
      return q.has('debug');
    },
    isPWA() {
      return WebClipDetect.isPWA();
    },
    show() {
      if (this.isPWA) {
        return false;
      }
      return !this.isDebug && this.supportPWA;
    },
    chromeSupport() {
      if (!(navigator.getInstalledRelatedApps instanceof Function)) {
        return false;
      }
      return this.canInstallPrompt;
    },
    supportPWA() {
      return (WebClipDetect.isSafari() && WebClipDetect.isIos()) || this.chromeSupport;
    }
  },

  created() {
    this.canShowInstallButton();
    window.addEventListener('appinstalled', this.handlePWAInstalled);
  },

  beforeDestroy() {
    window.removeEventListener('appinstalled', this.handlePWAInstalled);
  },

  methods: {
    toggleFullScreen() {
      this.fullScreen = !this.fullScreen;
    },
    handleCloseOverlay() {
      this.fullScreen = false;
    },
    handlePWAInstalled() {
      this.canInstallPrompt = false;
    },
    canShowInstallButton() {
      const ok = !!(window.promptEvent);
      if (ok) {
        this.canInstallPrompt = true;
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        const handler = (event) => {
          window.removeEventListener("beforeinstallprompt", handler);

          event.preventDefault();
          window.promptEvent = event;
          this.canInstallPrompt = true;
          resolve();
        };

        window.addEventListener('beforeinstallprompt', handler);
      })
    },
    dispatchInstallPrompt() {
      const promptEvent = window.promptEvent;

      if (promptEvent) {
        promptEvent.prompt();  // Wait for the user to respond to the prompt
        promptEvent.userChoice
            .then(choice => {
              if (choice.outcome === 'accepted') {
                console.log('User accepted');
              } else {
                console.log('User dismissed');
              }
            })
      }
    },
  }
}
</script>

<style lang="scss">
@import "normalize.css";

$desktop_layout_width: 2048;
$mobile_layout_width: 1536;
$base_rem: 24px;

@function d-vw($target) {
  $vw-context: ($desktop_layout_width*.01) * 1px;
  @return calc($target/$vw-context) * 1vw;
}

@function m-vw($target) {
  $vw-context: ($mobile_layout_width*.01) * 1px;
  @return calc($target/$vw-context) * 1vw;
}

@function rem($target) {
  @return calc($target/$base_rem) * 1rem;
}
html {
  font-size: d-vw($base_rem);
}
@media (max-width: 1024px) {
  html {
    font-size: m-vw($base_rem);
  }
}
.installer-wrap {
  .btn {
    border: 0;
    border-radius: 5px;
    background-color: #000000;
    color: #ffffff;
    cursor: pointer;
  }
  .btn-install {
    display: block;
    padding: 1em;
    margin: 1em 0;
    width: 100%;
  }
  .mini-ui {
    position: fixed;
    z-index: 1100;
    right: -60px;
    bottom: 10px;
    opacity: 0.5;
    cursor: pointer;

    &:hover {
      transition: all 0.5s ease;
      right: 10px;
      opacity: 1;
    }

    > .icon {
      display: inline-block;
      width: 35vw;
      max-width: 150px;
      height: auto;
    }
  }
}
.install-wrap {
  left: 0;
  top: 0;
  position: fixed;
  z-index: 1100;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255,255,255,0.95);
  display: flex;
  justify-content: center;
  align-items: center;

  .inner {
    width: rem(700px);
    background-color: white;
    font-size: rem(32px);
    line-height: 2;
    padding: 0 1em;
    border-radius: 8px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  }

  .header, .details, .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1em;
  }
  .header {
    padding: 1em 0;
  }

  .details {
    border-radius: 5px;
    background-color: rgba(0,0,0,0.1);
  }
  .content {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    li {
      align-items: center;
    }
    ol {
      padding-left: 0.5em;
    }
  }

  .icon {
    width: rem(35px);
    height: auto;
    margin: 0 0.25em;
    vertical-align: baseline;
  }
  .logo {
    width: rem(150px);
    height: auto;

    &.icon {
      width: rem(35px);
    }
  }
  .close {
    cursor: pointer;
  }
  .add-home {
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    padding: 0.25em 1em;
    display: inline-block;
    line-height: 1;

    .icon {
      display: inline-block;
      visibility: visible;
    }
  }
}
</style>
