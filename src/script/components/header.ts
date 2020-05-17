import { LitElement, css, html, customElement, property } from 'lit-element';

import '@pwabuilder/pwaauth';

@customElement('app-header')
export class AppHeader extends LitElement {

  @property({ type: String }) title: string = 'PWA Starter';
  @property({ type: Object }) user: any = null;

  static get styles() {
    return css`
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 16px;
        padding-right: 16px;
        height: 3.6em;
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
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {

  }

  render() {
    return html`
      <header>
        <h1>Mail</h1>

        <mgt-msal-provider client-id="24438f49-5cef-4d68-9107-14294261cb89"></mgt-msal-provider>
        <mgt-login></mgt-login>
      </header>
    `;
  }
}