import { clear, get, set } from "idb-keyval";
import {
  LitElement,
  css,
  html,
  customElement,
  property,
  internalProperty,
} from "lit-element";

import { classMap } from 'lit-html/directives/class-map.js';

import "../components/app-login";


const themes = [
  {
    name: "circles",
    url: "https://unpkg.com/css-houdini-circles/dist/circles.js",
  },
  {
    name: "voronoi",
    url: "https://unpkg.com/css-houdini-voronoi@1.1.2/dist/worklet.js",
  },
];

@customElement("app-header")
export class AppHeader extends LitElement {
  @property({ type: String }) title: string = "PWA Starter";
  @property({ type: Object }) user: any = null;

  @internalProperty() authed: boolean = false;
  @internalProperty() openSettings: boolean = false;
  @internalProperty() checked: boolean | null = false;
  @internalProperty() themeChecked: boolean | null = false;
  @internalProperty() chosenTheme: any | undefined;

  static get styles() {
    return css`
      :host {
        position: fixed;
        left: calc(env(titlebar-area-x, 0) - 6px);
        top: env(titlebar-area-y, 0);
        width: env(titlebar-area-width, 100%);
        height: env(titlebar-area-height, 33px);
        -webkit-app-region: drag;
      }

      #headerActions {
        display: flex;
        align-items: center;

        position: fixed;
        top: 0;
        z-index: 9999;

        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: env(titlebar-area-height, 33px);

        right: 10px;
      }

      .inapp {
        right: 17.4em !important;
      }


      fast-label {
        margin-top: 12px;
        margin-bottom: 8px;
        font-weight: bold;
      }

      #themes {
        margin-bottom: 12px;
      }

      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 5px;
        height: env(titlebar-area-height, 33px);

        position: sticky;
        top: 0;
        z-index: 1;

        background: #212121;
        padding-right: 0px;
        width: env(titlebar-area-width, 100%);
      }

      header h1 {
        margin-top: 0;
        margin-bottom: 0;
        color: white;

        font-size: 14px;
        margin-left: 10px;
        font-weight: normal;
      }

      #settingsContainer {
        background: #181818e8;
        backdrop-filter: blur(10px);
        position: absolute;
        z-index: 9999;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;

        height: 100vh;

        animation-name: fadeIn;
        animation-duration: 280ms;
      }

      #settingsBlock {
        background: #303030;
        position: absolute;
        top: 8em;
        z-index: 9999;
        bottom: 8em;
        left: 8em;
        right: 8em;
        border-radius: 4px;

        padding: 1em 2em;
      }

      @media (screen-spanning: single-fold-vertical) {
        #settingsContainer {
          width: 49vw;
          right: 0;
          left: initial;
        }

        #settingsBlock {
          inset: 0em;
        }
      }

      @media (prefers-color-scheme: light) {
        #settingsContainer {
          background: #ffffffbf;
          backdrop-filter: blur(10px);
        }

        #settingsBlock {
          background: #f5f5f5;
        }

        #settingsBlock fast-switch::part(label) {
          color: black;
        }
      }

      #settingsHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1em;
      }

      #settingsHeader h3 {
        font-size: 1.5em;
        margin-top: 0;
        margin-bottom: 0;
      }

      #settingsActions {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      #settingsActions fast-button {
        margin-top: 8px;
      }

      #settingsButton {
        color: white;
        height: env(titlebar-area-height, 33px);
        margin-right: 0;

        -webkit-app-region: no-drag;
        app-region: no-drag;
      }

      #settingsButton ion-icon {
        font-size: 2em;

        padding-top: 4px;
        height: 19px;
        width: 19px;
      }

      pwa-auth::part(signInButton),
      #authName {
        background: var(--app-color-primary);
        color: white;
        border: none;
        font-size: 12px;
        font-weight: bold;
        padding: 8px;
        width: 6em;
        text-transform: uppercase;
      }

      #authName {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 8em;
        border-radius: 4px;
      }

      span {
        color: white;
        background: var(--app-color-primary);
        padding: 6px;
        border-radius: 20px;
        padding-left: 16px;
        padding-right: 16px;
      }

      @media (prefers-color-scheme: dark) {
        header h1 {
          color: white;
        }

        header mgt-login {
          --color: white;
        }
      }

      @media (max-width: 800px) {
        #settingsBlock {
          inset: 0;
        }

        :host {
          z-index: 9999;
        }
      }

      @media (max-width: 340px) {
        #settingsButton {
          display: none;
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0.2;
        }

        to {
          opacity: 1;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    console.log(this.checked);

    const themeCheck = await get("themed");
    console.log("themeCheck", themeCheck);

    await set("themed", true);

    if (themeCheck && themeCheck === true) {
      this.themeChecked = true;

      const theme = await get("chosenTheme");
      this.chosenTheme = theme;

      let root = document.documentElement;
      root.style.setProperty("--theme", (theme as any).name);

      (window as any).requestIdleCallback(async () => {
        (CSS as any).paintWorklet.addModule(
          (theme as any).url ||
            "https://unpkg.com/css-houdini-circles/dist/circles.js"
        );
      });
    } else if (themeCheck && themeCheck === false) {
      console.log("setting it false");
      this.themeChecked = false;
    } else {
      // on by default
      this.themeChecked = true;

      const theme = await get("chosenTheme");
      this.chosenTheme = theme;

      let root = document.documentElement;
      root.style.setProperty("--theme", (theme as any).name);

      (window as any).requestIdleCallback(async () => {
        (CSS as any).paintWorklet.addModule(
          (theme as any).url ||
            "https://unpkg.com/css-houdini-circles/dist/circles.js"
        );
      });
    }

    const registration = await navigator.serviceWorker.getRegistration();
    if (registration && "periodicSync" in registration) {
      const tags = await (registration as any).periodicSync.getTags();
      // Only update content if sync isn't set up.
      if (!tags.includes("mail-sync")) {
        this.checked = false;
      } else {
        this.checked = true;
      }
    } else {
      // If periodic background sync isn't supported, always update.

      this.checked = false;
    }
  }

  async openSettingsModal() {
    this.openSettings = true;

    await this.updateComplete;

    const themeSelect = this.shadowRoot?.querySelector("#themes");
    console.log("themeSelect", themeSelect);
    (themeSelect as HTMLSelectElement).value = this.chosenTheme;
  }

  close() {
    this.openSettings = false;
  }

  checkPeriodic = async () => {
    const status = await (navigator as any).permissions.query({
      name: "periodic-background-sync",
    });

    if (status.state === "granted") {
      // Periodic background sync can be used.
      const registration: ServiceWorkerRegistration | undefined =
        await navigator.serviceWorker.getRegistration();

      if (registration && "periodicSync" in registration) {
        try {
          await (registration as any).periodicSync.register("mail-sync", {
            // An interval of one day.
            minInterval: 24 * 60 * 60 * 1000,
          });

          Notification.requestPermission(async (status) => {
            console.log("Notification permission status:", status);

            if (status === "granted") {
              const options = {
                body: "We will notify you when new email is recieved in the background",
                icon: "/assets/icons/icon_48.png",
                vibrate: [100],
                data: {
                  dateOfArrival: Date.now(),
                },
                actions: [{ action: "close", title: "Close" }],
              };

              if (registration) {
                await (
                  registration as ServiceWorkerRegistration
                ).showNotification(
                  "Email will sync in the background",
                  options
                );
              }
            }
          });
        } catch (error) {
          // Periodic background sync cannot be used.
          console.error(error);

          this.checked = false;
        }
      }
    } else {
      // Periodic background sync cannot be used.
      console.log("background sync not supported or permission not granted");

      this.checked = false;
    }
  };

  async updateMail(value: boolean) {
    if (value === true) {
      await this.checkPeriodic();
    } else {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && "periodicSync" in registration) {
        await (registration as any).periodicSync.unregister("mail-sync");
      }
    }
  }

  userAuthed(authed: boolean) {
    console.log("user authed", authed);

    let event = new CustomEvent("user-authed", {
      detail: {
        authed: true,
      },
    });
    this.dispatchEvent(event);
  }

  async clearStorage() {
    await clear();
    localStorage.clear();
  }

  async doTheme(iffy: boolean) {
    if (iffy && this.chosenTheme) {
      (CSS as any).paintWorklet.addModule(this.chosenTheme);

      await set("themed", true);
    } else {
      await set("themed", false);
      location.reload();
    }
  }

  async selectTheme(theme: any) {
    this.chosenTheme = theme;

    let root = document.documentElement;
    root.style.setProperty("--theme", theme.name);

    await set("chosenTheme", this.chosenTheme);

    location.reload();
  }

  render() {
    return html`
      <header>
        <h1>Mail GO</h1>

        ${this.openSettings
          ? html`<div id="settingsContainer">
              <div id="settingsBlock">
                <div id="settingsHeader">
                  <h3>Settings</h3>

                  <fast-button @click="${() => this.close()}">
                    <ion-icon name="close-outline"></ion-icon>
                  </fast-button>
                </div>

                <div id="settingsActions">
                  <fast-switch
                    checked="${this.checked}"
                    @change="${(ev: any) => this.updateMail(ev.target.checked)}"
                  >
                    Update Mail in the Background
                    <span slot="checked-message">On</span>
                    <span slot="unchecked-message">Off</span>
                  </fast-switch>

                  <!--<fast-switch
                    checked="${this.themeChecked}"
                    @change="${(ev: any) => this.doTheme(ev.target.checked)}"
                  >
                    Use Background Theme
                    <span slot="checked-message">Yes</span>
                    <span slot="unchecked-message">No</span>
                  </fast-switch>

                  <fast-label for="themes">Available Themes</fast-label>
                  <fast-select
                    @change="${(ev: any) => this.selectTheme(ev.target.value)}"
                    id="themes"
                  >
                    ${themes.map((theme) => {
                      return html`
                        <fast-option
                          .value="${{ name: theme.name, url: theme.url }}"
                          >${theme.name}</fast-option
                        >
                      `;
                    })}
                  </fast-select>-->

                  <fast-button @click="${() => this.clearStorage()}">
                    Clear Storage
                  </fast-button>
                </div>
              </div>
            </div>`
          : null}

        <div id="headerActions" class=${classMap({inapp: (navigator as any).windowControlsOverlay.visible === true})} >
          <!--<fast-button
            @click="${() => this.openSettingsModal()}"
            id="settingsButton"
            appearance="lightweight"
          >
            <ion-icon name="settings-outline"></ion-icon>
          </fast-button>-->

          <app-login
            @authed="${(event: any) => this.userAuthed(event.target.value)}"
          ></app-login>
        </div>
      </header>
    `;
  }
}
