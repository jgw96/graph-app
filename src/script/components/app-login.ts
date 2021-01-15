import { LitElement, css, html, customElement, property, internalProperty } from "lit-element";

import { login, logout, getAccount, getPhoto } from "../services/auth";

@customElement("app-login")
export class AppLogin extends LitElement {
  @property() userAccount: any = null;

  @internalProperty() imageBlob: string | null = null;

  static get styles() {
    return css`
      #logoutButton {
        background-color: transparent;
        border: solid 1px;
        border-color: var(--app-color-primary);
        color: var(--app-color-primary);
        width: 100px;
      }

      #logoutButton::part(content) {
        display: flex;
        align-items: center;
      }

      #logoutButton img {
        animation-name: fadeIn;
        animation-duration: 280ms;
      }

      #logoutButton img, #logoutButton fast-skeleton {
        border-radius: 50%;
        height: 2em;
        width: 2em;
        margin-left: 8px;
      }

      #loginButton {
        background-color: var(--app-color-primary);
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
            <fast-button @click="${() => this.logout()}" id="logoutButton"
            >Logout ${this.imageBlob ? html`<img .src="${this.imageBlob}" alt="profile photo">` : html`<fast-skeleton
                shape="circle"
            ></fast-skeleton>`}</fast-button>
            </div>
            `
        : html` <fast-button @click="${() => this.login()}" id="loginButton"
            >Login with Microsoft</fast-button
          >`}
    `;
  }
}
