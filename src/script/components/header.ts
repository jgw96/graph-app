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
import "../components/install-button";

@customElement("app-header")
export class AppHeader extends LitElement {
  @property({ type: String }) title: string = "PWA Starter";
  @property({ type: Object }) user: any = null;

  @internalProperty() authed: boolean = false;
  @internalProperty() openSettings: boolean = false;

  static get styles() {
    return css`
      :host {
        position: fixed;
        left: calc(env(titlebar-area-x, 0) - 6px);
        top: env(titlebar-area-y, 0);
        width: env(titlebar-area-width, 100%);
        height: env(titlebar-area-height, 33px);
        -webkit-app-region: drag;

        z-index: 1;
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

      /*keeping seperate for the future */
      @media(prefers-color-scheme: light) {
        header {
          background: transparent;
          color: black;
        }

        header h1 {
          color: black;
        }

        #settingsButton ion-icon {
          color: black;
        }

      }

      @media (prefers-color-scheme: dark) {
        header {
          background: transparent;
        }
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

        header {
          background: #050622;
          z-index: 9999;
        }
      }

      @media (prefers-color-scheme: light) and (max-width: 800px) {
        header {
          background: rgb(237 235 233);
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

  async openSettingsModal() {
    this.openSettings = true;

    let event = new CustomEvent('open-settings', {
      detail: {
        message: true
      }
    });
    this.dispatchEvent(event);
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

  render() {
    return html`
      <header>
        <h1>Mail GO</h1>

        <div id="headerActions" class=${classMap({inapp: (navigator as any).windowControlsOverlay.visible === true})} >
          <install-button></install-button>
          
          <fast-button
            @click="${() => this.openSettingsModal()}"
            id="settingsButton"
            appearance="lightweight"
          >
            <ion-icon name="settings-outline"></ion-icon>
          </fast-button>

          <app-login
            @authed="${(event: any) => this.userAuthed(event.target.value)}"
          ></app-login>
        </div>
      </header>
    `;
  }
}
