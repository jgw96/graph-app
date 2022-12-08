import { LitElement, css, html, PropertyValueMap } from "lit";

import { customElement, state, property } from "lit/decorators.js";

import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';

@customElement("app-settings")
export class AppSettings extends LitElement {
  @property({ type: Boolean }) openSettings: boolean = false;

  @state() checked: boolean | null = false;
  @state() themeChecked: boolean | null = false;
  @state() chosenTheme: any | undefined;
  @state() themeColor: string = "#1A1B3E";
  @state() primaryColor: string = "#1A1B3E";
  @state() user: any | undefined;
  @state() imageBlob: any | undefined;
  @state() showColorPickers: boolean = false;

  @state() pushChecked: boolean = false;

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

      .settings-block {
        display: flex;

        align-items: center;
        flex-direction: row-reverse;
        gap: 6px;

        width: 95%;
        justify-content: flex-end;
        background: #ffffff0d;
        border-radius: 8px;
        padding: 8px;
        height: 3em;
      }

      .settings-block.themeColor {
        flex-direction: column;
        align-items: flex-start;
        height: initial;
      }

      .settings-block#profileInfo {
        flex-direction: column;
        align-items: flex-start;
        height: fit-content;
      }

      .settings-block#profileInfo img {
        border-radius: 50%;
        height: 5em;
        width: 5em;
      }

      #username {
        font-weight: bold;
        font-size: 1.4em;
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

      sl-drawer::part(panel) {
        overflow: hidden
      }

      sl-drawer ::-webkit-scrollbar {
        display: none;
      }

      @media(prefers-color-scheme: dark) {
        sl-drawer::part(panel) {
          background: #24242866;
          backdrop-filter: blur(20px);
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

        justify-content: space-between;
        gap: 12px;
      }
      #settingsActions fast-button {
        margin-top: 8px;
      }
      @media (max-width: 800px) {
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

    await this.checkPushSubStatus();

    const dialog = this.shadowRoot?.querySelector("sl-dialog");
    if (dialog) {
      dialog.addEventListener("sl-after-show", () => {
        this.openSettings = true;
      });
      dialog.addEventListener("sl-after-hide", () => {
        this.openSettings = false;
      });
    }

    // set up intersection observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          const { getAccount } = await import("../services/auth");
          const userAccount = await getAccount();
          console.log("userAccount", userAccount);
          if (userAccount) {
            this.user = userAccount;

            const { getPhoto } = await import("../services/auth");
            const blob = await getPhoto();
            console.log(blob);
            this.imageBlob = URL.createObjectURL(blob);
          }

          await import ('@shoelace-style/shoelace/dist/components/color-picker/color-picker.js');
          this.showColorPickers = true;
        }
      });
    });

    const settingsBlock = this.shadowRoot?.querySelector(".settings-block");
    if (settingsBlock) {
      observer.observe(settingsBlock);
    }
  }

  protected async updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): Promise<void> {
    if (_changedProperties.has("openSettings")) {
      if (this.openSettings === true) {
        const drawer: any = this.shadowRoot?.querySelector("sl-drawer");
        if (drawer) {
          await drawer.show();
        }
      }
      else {
        const drawer: any = this.shadowRoot?.querySelector("sl-drawer");
        if (drawer) {
          await drawer.hide();
        }
      }
    }
  }

  async clearStorage() {
    const { clear } = await import("idb-keyval");
    await clear();
    localStorage.clear();
  }

  async checkPushSubStatus() {
    const { getPushSubscription } = await import("../services/notifications");
    const subscription = await getPushSubscription();
    console.log("subscription", subscription);
    if (subscription !== null) {
      this.pushChecked = true;
    }
    else {
      this.pushChecked = false;
    }
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
    const { get } = await import("idb-keyval");
    const theme = await get("themeColor");
    const primary = await get("primaryColor");

    if (theme) {
      const r: HTMLElement | null = document.querySelector(":root");
      if (r) {
        r.style.setProperty("--theme-color", theme);
      }

      this.themeColor = theme;
    } else {
      const r: HTMLElement | null = document.querySelector(":root");
      if (r) {
        const rs = getComputedStyle(r);
        this.themeColor = rs.getPropertyValue("--theme-color");
      }
    }

    if (primary) {
      const r: HTMLElement | null = document.querySelector(":root");
      if (r) {
        r.style.setProperty("--gradient-color", primary);
      }

      this.primaryColor = primary;
    } else {
      const r: HTMLElement | null = document.querySelector(":root");
      if (r) {
        const rs = getComputedStyle(r);
        this.primaryColor = rs.getPropertyValue("--gradient-color");
      }
    }
  }

  async handleThemeColor(value: any) {
    console.log(value);

    if (value && value !== "" && value !== "#ffffff") {

      const r: HTMLElement | null = document.querySelector(":root");
      if (r) {
        r.style.setProperty("--theme-color", value);

        const { set } = await import("idb-keyval");
        await set("themeColor", value);
      }
    }
  }

  async handlePrimaryColor(value: any) {
    console.log(value);

    if (value && value !== "" && value !== "#ffffff") {
      const r: HTMLElement | null = document.querySelector(":root");
      if (r) {
        r.style.setProperty("--gradient-color", value);

        const { set } = await import("idb-keyval");
        await set("primaryColor", value);
      }
    }
  }

  close() {
    this.openSettings = false;
  }

  async updatePush(value: boolean) {
    console.log(value);
    // subscribe to push notifications
    if (value === true) {
      const { subscribeToPush, sendSubscriptionToServer } = await import("../services/notifications");

      const sub = await subscribeToPush();
      await sendSubscriptionToServer(sub);
    } else {
      const { unsubscribeFromPush } = await import("../services/notifications");

      await unsubscribeFromPush();
    }
  }

  render() {
    return html`
      <sl-drawer label="Settings">
        <div id="settingsActions">

        <!-- <div class="settings-block">
            <sl-switch ?checked="${this.checked}" @sl-change="${(ev: any) => this.updateMail(ev.target.checked)}">
              <span slot="checked-message">On</span>
              <span slot="unchecked-message">Off</span>

              Update mail in the background
            </sl-switch>
          </div> -->

        <div class="settings-block">
            <sl-switch ?checked="${this.pushChecked}" @sl-change="${(ev: any) => this.updatePush(ev.target.checked)}">
              <span slot="checked-message">On</span>
              <span slot="unchecked-message">Off</span>

              Push Notifications
            </sl-switch>
        </div>

          <!-- <div class="settings-block">

            Clear all app storage

            <sl-button id="storage-button" @click="${() => this.clearStorage()}">
              Clear Storage
            </sl-button>
          </div> -->

          <div class="settings-block" id="profileInfo">
          ${this.imageBlob
                  ? html`<img .src="${this.imageBlob}" alt="profile photo" />`
                  : html`<sl-skeleton
                      shape="circle"
                    ></sl-skeleton>`}

            <span id="username">${this.user?.name}</span>
            <span id="useremail">${this.user?.username}</span>
          </div>

          ${this.showColorPickers ? html`<div class="settings-block themeColor">
            <p>Background Color</p>

            <sl-color-picker inline .value="${this.themeColor}" @sl-change="${(ev: any) => this.handleThemeColor(ev.target!.value)}"
              label="Primary Background Color"></sl-color-picker>
          </div>

          <div class="settings-block themeColor">
            <p>Theme Color</p>

            <sl-color-picker inline value="${this.primaryColor}" @sl-change="${(ev: any) => this.handlePrimaryColor(ev.target!.value)}"
              label="Primary Theme Color"></sl-color-picker>
          </div>` : null}
        </div>
      </sl-drawer>
    `;
  }
}