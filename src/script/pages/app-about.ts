import { LitElement, css, html, customElement, property } from 'lit-element';
import { getAnEmail } from '../services/mail';

import { Router } from '@vaadin/router';


@customElement('app-about')
export class AppAbout extends LitElement {

  @property() email: any = null;

  static get styles() {
    return css`
      #back {
        background: var(--app-color-primary);
        color: white;
        border: none;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 8px;
        font-size: 1.4em;
        border-radius: 50%;
      }

      #detailAction h2 {
        margin-right: 4em;
      }

      #detailActions {
        display: flex;
        justify-content: flex-start;
      }

      #detailActions button {
        margin-right: 6px;
        cursor: pointer;
      }

      #loading {
        font-weight: bold;
        background: var(--app-color-primary);
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 20px;
        padding: 8px;

        width: -webkit-fill-available;
        height: 2em;
        padding: 4px;
        margin-right: 25%;
        margin-left: 25%;
      }

      #content {
        width: 100%;

        overflow-y: auto;
        border-radius: 10px;
      }

      #detailBlock {
        height: 91vh;
      }

      @media (min-width: 800px) {
        #detailBlock {
          display: flex;
          justify-content: space-between;
          background: #ffffff8f;
          backdrop-filter: blur(10px);
        }
      }

      @media (max-width: 800px) {
        #detailActions {
          position: fixed;
          bottom: 0;
          backdrop-filter: blur(10px);
          left: 0;
          right: 0;
          padding: 12px;
          display: flex;
          justify-content: flex-end;
          background: #ffffff69;
        }
      }

      @media (prefers-color-scheme: dark) {
        #detailBlock {
          background: #29292987;
          color: white;
        }

        @media (max-width: 800px) {
          #detailActions {
            background: #1c1b1be8;
          }
        }
      }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    const search = new URLSearchParams(location.search);
    const id = search.get('id');

    if (id) {
      const email = await getAnEmail(id);
      console.log(email);
      this.email = email;
    }
  }

  back() {
    Router.go("/");
  }

  async share() {
    if ((navigator as any).share) {
      await (navigator as any).share({
        title: 'Shared Email',
        text: 'Check out this email',
        url: location.href,
      })
    }
  }

  render() {
    return html`
      <div id="detailBlock">

        <section id="detailAction">
          <div id="detailActions">
            <button @click="${() => this.back()}" id="back" aria-label="back button">
              <ion-icon name="arrow-back-outline"></ion-icon>
            </button>

            <button @click="${() => this.share()}" id="back" aria-label="back button">
              <ion-icon name="share-outline"></ion-icon>
            </button>
          </div>

          <h2>${this.email?.subject}</h2>
        </section>

        ${this.email ? html`<div id="content" .innerHTML="${this.email?.body.content}"></div>` : html`<div id="loading">Loading...</div>`}
      </div>
    `;
  }
}