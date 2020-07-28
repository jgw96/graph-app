import { LitElement, css, html, customElement, property } from 'lit-element';

import { login, logout, getAccount } from '../services/auth';

@customElement('app-login')
export class AppLogin extends LitElement {

    @property() userAccount: any = null;

    static get styles() {
        return css`
          #logoutButton {
            display: flex;
            width: initial;
            justify-content: space-around;
            align-items: center;
            background-color: transparent;
            border: solid 1px;
            border-color: var(--app-color-secondary);
            color: var(--app-color-secondary);
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            padding: 6px;
            padding-left: 12px;
            padding-right: 12px;
            border-radius: 6px;
          }

          #loginButton {
            display: flex;
            width: initial;
            justify-content: space-around;
            align-items: center;
            background-color: transparent;
            border: solid 1px;
            border-color: var(--app-color-primary);
            color: var(--app-color-primary);
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            padding: 6px;
            padding-left: 12px;
            padding-right: 12px;
            border-radius: 6px;
          }
        `
    }

    constructor() {
        super();
    }

    firstUpdated() {
        setTimeout(async () => {
            this.userAccount = await getAccount();
            console.log(this.userAccount);
        }, 1200)
    }

    async login() {
        try {
            await login();
        }
        catch (err) {
            console.error(err);
        }
    }

    async logout() {
        try {
            await logout();
        }
        catch (err) {
            console.error(err);
        }
    }

    render() {
        return html`
          ${this.userAccount ? html`<button @click="${() => this.logout()}" id="logoutButton">Logout</button>` : html`<button @click="${() => this.login()}" id="loginButton">Login</button>`}
        `
    }
}
