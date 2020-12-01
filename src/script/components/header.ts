import { clear } from 'idb-keyval';
import { LitElement, css, html, customElement, property, internalProperty } from 'lit-element';

import '../components/app-login';


@customElement('app-header')
export class AppHeader extends LitElement {

  @property({ type: String }) title: string = 'PWA Starter';
  @property({ type: Object }) user: any = null;

  @internalProperty() authed: boolean = false;
  @internalProperty() openSettings: boolean = false;
  @internalProperty() checked: boolean | null = false;

  static get styles() {
    return css`
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 16px;
        padding-right: 16px;
        height: 3.6em;

        position: sticky;
        top: 0;
        background: #ffffff57;
        backdrop-filter: blur(10px);
        z-index: 1;
      }

      header h1 {
        margin-top: 0;
        margin-bottom: 0;
        font-size: 18px;
        font-weight: bold;
        color: var(--app-color-primary);
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

      @media(prefers-color-scheme: light) {
        #settingsContainer {
          background: rgba(255, 255, 255, 0.3);
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

      #settingsActions {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      #settingsActions fast-button {
        margin-top: 8px;
      }

      #settingsButton {
        margin-right: 1em;
      }

      #settingsButton ion-icon {
        font-size: 2em;
      }

      pwa-auth::part(signInButton), #authName {
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

      @media(prefers-color-scheme: dark) {
        header {
          background: rgba(41, 41, 41, 0.61);
        }

        header h1 {
          color: white;
        }

        header mgt-login {
          --color: white;
        }
      }

      @media(max-width: 800px) {
        #settingsBlock {
          inset: 0;
        }
      }

      @media(max-width: 340px) {
        #settingsButton {
          display: none
        }
      }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    console.log(this.checked);

    const registration = await navigator.serviceWorker.getRegistration();
    if (registration && 'periodicSync' in registration) {
      const tags = await (registration as any).periodicSync.getTags();
      // Only update content if sync isn't set up.
      if (!tags.includes('mail-sync')) {
        this.checked = false;
      }
      else {
        this.checked = true;
      }
    } else {
      // If periodic background sync isn't supported, always update.

      this.checked = false;
    }
  }

  openSettingsModal() {
    this.openSettings = true;
  }

  close() {
    this.openSettings = false;
  }

  async updateMail(value: boolean) {
    if (value === true) {
      const status = await (navigator.permissions as any).query({
        name: 'periodic-background-sync',
      });
      if (status.state === 'granted') {
        // Periodic background sync can be used.

        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && 'periodicSync' in registration) {
          try {
            await (registration as any).periodicSync.register('mail-sync', {
              // An interval of one day.
              minInterval: 24 * 60 * 60 * 1000,
            });
          } catch (error) {
            // Periodic background sync cannot be used.
            console.error(error);
          }
        }
      } else {
        // Periodic background sync cannot be used.
        console.log("background sync not supported");
      }
    }
    else {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && 'periodicSync' in registration) {
        await (registration as any).periodicSync.unregister('mail-sync');
      }
    }
  }

  async clearStorage() {
    await clear();
    localStorage.clear();
  }

  render() {
    return html`
      <header>
        <h1>Mail GO</h1>

        ${this.openSettings ? html`<div id="settingsContainer">
          <div id="settingsBlock">
            <div id="settingsHeader">
              <h3>Settings</h3>

              <fast-button @click="${() => this.close()}">
                <ion-icon name="close-outline"></ion-icon>
              </fast-button>
            </div>

            <div id="settingsActions">
              <fast-switch checked="${this.checked}" @change="${(ev: any) => this.updateMail(ev.target.checked)}">
                Update Mail in the Background
                <span slot="checked-message">On</span>
                <span slot="unchecked-message">Off</span>
              </fast-switch>

              <fast-button @click="${() => this.clearStorage()}">
                Clear Storage
              </fast-button>
            </div>
          </div>
        </div>` : null}

        <div id="headerActions">
          <fast-button @click="${() => this.openSettingsModal()}" id="settingsButton" appearance="lightweight">
            <ion-icon name="settings-outline"></ion-icon>
          </fast-button>
          <app-login></app-login>
        </div>
      </header>
    `;
  }
}