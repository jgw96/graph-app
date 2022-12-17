import { LitElement, css, html } from "lit";

import { customElement, state, property } from "lit/decorators.js";

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';

import { login, logout, getAccount, getPhoto } from "../services/auth";

@customElement("app-login")
export class AppLogin extends LitElement {
  @property() userAccount: any = null;

  @state() imageBlob: string | null = null;

  static get styles() {
    return css`
      :host {
        color: white;
        height: 36px;
      }

      sl-button[variant="default"]::part(base), sl-input::part(base) {
        background-color: #181818;
        color: white;
        border: none;
      }

      #logoutButton,
      #loginButton {
        background-color: transparent;
        width: initial;

        color: white;
        height: 22px;
        margin: 0;
        padding: 0;

        -webkit-app-region: no-drag;
        app-region: no-drag;
      }

      #logoutButton::part(content) {
        display: flex;
        align-items: center;
      }

      #logoutButton img {
        animation-name: fadeIn;
        animation-duration: 280ms;
      }

      #logoutButton img,
      #logoutButton sl-skeleton {
        border-radius: 50%;
        width: 22px;
        margin-left: 8px;
      }

      #logoutButtonContent {
        display: flex;
        align-items: center;
        justify-content: space-between;
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
    if (
      window.location.href.includes("newEmail") &&
      this.userAccount === null
    ) {
      setTimeout(async () => {
        this.userAccount = await getAccount();
        console.log(this.userAccount);

        let event = new CustomEvent("authed", {
          detail: {
            authed: true,
          },
        });
        this.dispatchEvent(event);
      }, 1200);
    } else {
      setTimeout(async () => {
        this.userAccount = await getAccount();
        console.log(this.userAccount);

        let event = new CustomEvent("authed", {
          detail: {
            authed: true,
          },
        });
        this.dispatchEvent(event);

        const blob = await getPhoto();
        console.log(blob);
        this.imageBlob = URL.createObjectURL(blob);
      }, 1200);
    }
  }

  async login() {
    try {
      await login();
    } catch (err) {
      console.error(err);
    }
  }

  async logout() {
    try {
      sessionStorage.clear();

      await logout();
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    return html`
      ${this.userAccount
        ? html`<div>
            <sl-button size="small" @click="${() => this.logout()}" id="logoutButton"
              >
              <div id="logoutButtonContent">
                <span>Logout</span>
                ${this.imageBlob
                  ? html`<img .src="${this.imageBlob}" alt="profile photo" />`
                  : html`<sl-skeleton
                      shape="circle"
                    ></sl-skeleton>`}
              </div>
              </sl-button
            >
          </div> `
        : html`
        <sl-button
            part="loginButton"
            @click="${() => this.login()}"
            id="loginButton"
            size="small"
            >Login with Microsoft</sl-button
          >
          `}
    `;
  }
}
