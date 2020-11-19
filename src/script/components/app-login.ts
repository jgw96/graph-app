import { LitElement, css, html, customElement, property } from 'lit-element';

import { login, logout, getAccount } from '../services/auth';

@customElement('app-login')
export class AppLogin extends LitElement {

    @property() userAccount: any = null;

    static get styles() {
        return css`
          #logoutButton {
            background-color: transparent;
            border: solid 1px;
            border-color: var(--app-color-primary);
            color: var(--app-color-primary);
          }

          #loginButton {
            background-color: var(--app-color-primary);
          }
        `
    }

    constructor() {
        super();
    }

    async firstUpdated() {
        setTimeout(async () => {
            this.userAccount = await getAccount();
            console.log(this.userAccount);
        }, 1200);
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
        ${this.userAccount ? html`<fast-button @click="${() => this.logout()}" id="logoutButton">Logout</fast-button>` : html`
        <fast-button @click="${() => this.login()}" id="loginButton">Login with Microsoft</fast-button>`}
        `
    }
}
