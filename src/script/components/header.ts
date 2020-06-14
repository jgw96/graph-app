import { LitElement, css, html, customElement, property, internalProperty } from 'lit-element';

import '@pwabuilder/pwaauth';

@customElement('app-header')
export class AppHeader extends LitElement {

  @property({ type: String }) title: string = 'PWA Starter';
  @property({ type: Object }) user: any = null;

  @internalProperty() authed: boolean = false;

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
        font-size: 20px;
        font-weight: normal;
        color: var(--app-color-primary);
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
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    const pwaAuth = this.shadowRoot?.querySelector('pwa-auth');

    const name = localStorage.getItem('msal.idtoken');

    if (name) {
      this.authed = true;
    }

    pwaAuth?.addEventListener("signin-completed", (ev: any) => {
      const signIn = ev.detail;
      if (signIn.error) {
        console.error("Sign in failed", signIn.error);
      } else {
        console.log(signIn.providerData);
        if (signIn.providerData.accessToken) {
          localStorage.setItem('token', signIn.providerData.accessToken);
        }
        
        localStorage.setItem('name', signIn.providerData.account.name);

        this.authed = true;

        location.reload();
      }
    });
  }

  render() {
    return html`
      <header>
        <h1>Mail</h1>

        ${this.authed === false ? html`<pwa-auth credentialmode="none" microsoftkey="24438f49-5cef-4d68-9107-14294261cb89" menuPlacement="end"></pwa-auth>` : html`<span>${localStorage.getItem('name')}</span>`}
      </header>
    `;
  }
}