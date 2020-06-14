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

      #loading {
        font-weight: bold;
        background: var(--app-color-primary);
        color: white;
        width: 8em;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 20px;
        padding: 8px;
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

  render() {
    return html`
      <div>
        <button @click="${() => this.back()}" id="back" aria-label="back button">
          <ion-icon name="arrow-back-outline"></ion-icon>
        </button>

        <h2>${this.email?.subject}</h2>

        ${this.email ? html`<div .innerHTML="${this.email?.body.content}"></div>` : html`<div id="loading">Loading...</div>`}
      </div>
    `;
  }
}