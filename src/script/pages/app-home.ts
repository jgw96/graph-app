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
      pwa-install {
        position: fixed;
        bottom: 16px;
        right: 16px;
      }

      #introBlock {
        font-weight: bold;
        text-align: center;
        background: white;
        border-radius: 20px;
        padding: 6px;
      }

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

        backdrop-filter: blur(10px);
        background: #d3d3d3bf;
      }

      ul li:nth-child(-n+8) {
        animation-name: slidein;
        animation-duration: 300ms;
      }


      @media(min-width: 1000px) {
        ul {
          padding-left: 12em;
          padding-right: 12em;
        }
      }

      @media (min-width: 1200px) {
        ul {
          display: grid;
          padding-left: 14em;
          padding-right: 14em;
          grid-gap: 10px;
          grid-template-columns: 50% 50%;
        }

        ul li {
          display: flex;
          flex-direction: column;
        }

        ul li #nameBlock {
          flex-grow: 1;
        }

        #introBlock {
          margin-left: 16em;
          margin-right: 16em;
        }
      }

      ul li h3 {
        margin-bottom: 5px;
        font-size: 16px;
        margin-top: 10px;
      }

      #actions {
        display: flex;
        justify-content: flex-end;
      }

      #actions button {
        background: var(--app-color-primary);
        color: white;
        border: none;
        font-weight: bold;
        font-size: 1em;
        padding: 6px;
        border-radius: 6px;
        width: 5em;
      }

      #nameBlock {
        font-size: 14px;
      }

      ul li #name {
        color: var(--app-color-primary);
      }

      @keyframes slidein {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
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

        ${this.mail ? html`<ul>
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
        })}
        </ul>` : html`<div id="introBlock">
        Sign in to quickly access your latest email and save them for offline use! Powered by the Microsoft Graph.
      </div>`}

        <pwa-install>Install Offline Mail</pwa-install>
      </div>


    `;
  }
}