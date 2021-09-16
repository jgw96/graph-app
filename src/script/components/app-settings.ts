import {
  LitElement,
  property,
  internalProperty,
  css,
  html,
  customElement,
} from "lit-element";

import { clear, set, get } from "idb-keyval";

@customElement("app-settings")
export class AppSettings extends LitElement {
  @property({ type: Boolean }) openSettings: boolean = false;

  @internalProperty() checked: boolean | null = false;
  @internalProperty() themeChecked: boolean | null = false;
  @internalProperty() chosenTheme: any | undefined;
  @internalProperty() themeColor: string = "#1A1B3E";

  static get styles() {
    return css`
      fast-label {
        margin-top: 12px;
        margin-bottom: 8px;
        font-weight: bold;
      }

      #colorPicker {
        margin-left: 10px;
      }

      #themes {
        margin-bottom: 12px;
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

      @media(max-width: 800px) {
        #settingsBlock {
          inset: 0em;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    console.log(this.checked);

    await this.checkThemeColor();

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

  async clearStorage() {
    await clear();
    localStorage.clear();
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

  async checkThemeColor() {
    const theme = await get("themeColor");

    if (theme) {
      const r: HTMLElement | null = document.querySelector(":root");
      if (r) {
        r.style.setProperty("--gradient-color", theme);
      }

      this.themeColor = theme;
    } else {
      const r: HTMLElement | null = document.querySelector(":root");
      if (r) {
        const rs = getComputedStyle(r);
        this.themeColor = rs.getPropertyValue("--gradient-color");
      }
    }
  }

  async handleThemeColor(ev: InputEvent) {
    console.log((ev.target as any)?.value);

    const r: HTMLElement | null = document.querySelector(":root");
    if (r) {
      r.style.setProperty("--gradient-color", (ev.target as any)?.value);

      await set("themeColor", (ev.target as any)?.value);
    }
  }

  close() {
    this.openSettings = false;
  }

  render() {
    return html`
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
                <fast-label>
                  Customize your theme color
                  <input
                    type="color"
                    id="colorPicker"
                    value="${this.themeColor}"
                    @change="${(ev: InputEvent) => this.handleThemeColor(ev)}"
                  />
                </fast-label>

                <fast-label>
                  Update mail in the background
                  <fast-switch
                    checked="${this.checked}"
                    @change="${(ev: any) => this.updateMail(ev.target.checked)}"
                  >
                    <span slot="checked-message">On</span>
                    <span slot="unchecked-message">Off</span>
                  </fast-switch>
                </fast-label>
      
                <fast-button @click="${() => this.clearStorage()}">
                  Clear Storage
                </fast-button>
              </div>
            </div>
          </div>`
        : null}
    `;
  }
}
