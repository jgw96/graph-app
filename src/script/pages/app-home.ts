import { LitElement, css, html, customElement, property } from 'lit-element';

// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';
import { getMail } from '../services/mail';
import { Router } from '@vaadin/router';

@customElement('app-home')
export class AppHome extends LitElement {

  @property({ type: Array }) mail: any[] | null = null;

  static get styles() {
    return css`
      ul {
        list-style: none;
        padding: 0;
      }

      ul li {
        background: #e2e2e2;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 1px;
        padding-bottom: 10px;
        border-radius: 4px;

        margin-bottom: 10px;
      }

      ul li h3 {
        margin-bottom: 5px;
        font-size: 16px;
        margin-top: 10px;
      }

      #nameBlock {
        font-size: 14px;
      }

      ul li #name {
        color: var(--app-color-primary);
      }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    this.mail = await getMail();
  }

  read(id: string) {
    Router.go(`/email?id=${id}`);
  }

  render() {
    return html`
      <div>

        <ul>
          ${
            this.mail?.map((email) => {
              return html`
                <li>
                  <h3>${email.subject}</h3>
                  <span id="nameBlock">from <span id="name">${email.from.emailAddress.name}</span></span>

                  <div id="actions">
                    <button @click="${() => this.read(email.id)}">Read</button>
                  </div>
                </li>
              `
            })
          }
        </ul>

        <pwa-install>Install PWA Starter</pwa-install>
      </div>


    `;
  }
}