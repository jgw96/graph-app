import { LitElement, css, html, customElement, property } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';
import '@dile/dile-toast/dile-toast';
import { getMail } from '../services/mail';
import { Router } from '@vaadin/router';

@customElement('app-home')
export class AppHome extends LitElement {

  @property({ type: Array }) mail: any[] | null = [];
  @property({ type: Array }) mailCopy: any[] | null = [];

  @property({ type: String }) activeCat: string = 'all';

  static get styles() {
    return css`
      pwa-install {
        position: fixed;
        bottom: 12px;
        left: 16px;
        --install-button-color: var(--app-color-primary) !important;
      }

      #introBlock {
        font-weight: bold;
        text-align: center;
        background: white;
        border-radius: 6px;
        padding: 2em;
        background: rgba(29, 29, 29, 0.78);
        flex-direction: column;
        display: flex;
        align-items: center;
        justify-content: space-between;
        backdrop-filter: blur(10px);
      }

      #introBlock app-login {
        margin-top: 1em;
      }

      #introBlock img {
        height: 24em;
      }

      ul {
        list-style: none;
        padding: 0;
        margin-bottom: 4em;
      }

      ul li {
        background: #e2e2e2;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 1px;
        padding-bottom: 10px;
        border-radius: 6px;

        margin-bottom: 10px;

        backdrop-filter: blur(10px);
        background: #d3d3d3bf;
      }

      ul li:nth-child(-n+14) {
        animation-name: slidein;
        animation-duration: 300ms;
      }

      #filterActions button {
        background-color: transparent;
        border-radius: 0;
        color: grey;
        font-weight: bold;
        font-size: 1em;
        width: 5em;
        cursor: pointer;
        align-items: center;
        border-width: initial;
        border-style: none;
        border-color: initial;
        border-image: initial;
        padding: 6px;
      }

      #filterActions button.selected {
        border-bottom: solid 2px var(--app-color-primary);
        color: var(--app-color-primary);
      }


      @media(min-width: 1000px) {
        ul {
          padding-left: 12em;
          padding-right: 12em;
        }

        #introBlock {
          margin-left: 16em;
          margin-right: 16em;
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
          margin-left: 24em;
          margin-right: 24em;
        }
      }

      ul li h3 {
        margin-bottom: 5px;
        font-size: 16px;
        margin-top: 10px;
      }

      #actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 22px;
      }

      #actions button, #homeToolbar button {
        color: white;
        border: none;
        font-weight: bold;
        font-size: 1em;
        padding: 6px;
        border-radius: 6px;
        width: 5em;
        cursor: pointer;
        align-items: center;

        background-color: var(--app-color-primary);
      }

      #actions button ion-icon, #homeToolbar button ion-icon {
        margin-left: 6px;
      }

      #nameBlock {
        font-size: 12px;
      }

      .preview {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
      }

      ul li #name {
        color: var(--app-color-primary);
      }

      #homeToolbar {
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

      #homeToolbar button {
        display: flex;
        width: initial;
        justify-content: space-around;
        align-items: center;
        background-color: var(--app-color-secondary);
      }

      #homeToolbar #newEmailButton {
        background: var(--app-color-primary);
        margin-left: 12px;
      }

      #homeToolbar button:hover {
        background: var(--app-color-primary);
      }

      #myToast {
        --dile-toast-success-color: var(--app-color-primary);
        --dile-toast-border-radius: 6px;
      }

      @media(prefers-color-scheme: dark) {
        ul li {
          background: rgba(29, 29, 29, 0.78);
          color: white;
        }

        ul li #name {
          color: white;
        }

        #introBlock {
          color: white;
        }

        #homeToolbar {
          background: rgb(29 29 29 / 78%);
        }
      }

      @media(prefers-color-scheme: light) {
        #introBlock {
          background: white;
        }
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

    let mail = sessionStorage.getItem('latestmail');

    if (mail) {
      this.mailCopy = JSON.parse(mail);
      this.mail = this.mailCopy;
    }
    
    setTimeout(async () => {
      await this.getSavedAndUpdate();
    }, 800);
  }

  async getSavedAndUpdate() {
    this.mailCopy = await getMail();
    this.mail = this.mailCopy;

    sessionStorage.setItem('latestmail', JSON.stringify(this.mail));
  }

  getFocused() {
    let focused: any[] = [];

    this.mailCopy?.forEach((mail) => {
      if (mail.inferenceClassification === 'focused') {
        focused.push(mail);
      }
    });

    if (focused.length > 1) {
      this.mail = [...focused];
    }
  }

  getOther() {
    let other: any[] = [];

    this.mailCopy?.forEach((mail) => {
      if (mail.inferenceClassification === 'other') {
        other.push(mail);
      }
    });

    if (other.length > 1) {
      this.mail = [...other];
    }
  }

  read(id: string) {
    Router.go(`/email?id=${id}`);
  }

  newEmail() {
    Router.go("/newEmail");
  }

  async refresh() {
    const newMail = await getMail();

    this.mail = [...newMail];

    let toastElement: any = this.shadowRoot?.getElementById('myToast');
    toastElement?.open('Inbox Refreshed...', 'success');
  }

  setCat(cat: string) {
    this.activeCat = cat;

    if (cat === 'focused') {
      this.getFocused();
    }
    else if (cat === 'other') {
      this.getOther()
    }
    else if (cat === 'all') {
      this.getSavedAndUpdate();
    }
  }

  render() {
    return html`
      <div>

        ${this.mail && this.mail.length > 0 ? html`
          <div id="filterActions">
            <button class=${classMap({ "selected": this.activeCat === 'all' })} @click="${() => this.setCat('all')}">All</button>
            <button class=${classMap({ "selected": this.activeCat === 'focused' })} @click="${() => this.setCat('focused')}">Focused</button>
            <button class=${classMap({ "selected": this.activeCat === 'other' })} @click="${() => this.setCat('other')}">Other</button>
          </div>
        
        <ul>
          ${
        this.mail?.map((email) => {
          return html`
                <li>
                  <h3>${email.subject}</h3>

                  <p class="preview">
                    ${email.bodyPreview}
                  </p>

                  <div id="actions">
                    <span id="nameBlock">from <span id="name">${email.from.emailAddress.name}</span></span>
                    <button @click="${() => this.read(email.id)}">Read</button>
                  </div>
                </li>
              `
        })}
        </ul> 

        <div id="homeToolbar">
          <button @click="${() => this.refresh()}">
            Refresh
            <ion-icon name="reload"></ion-icon>
          </button>

          <button id="newEmailButton" @click="${() => this.newEmail()}">
            New Email
            <ion-icon name="add"></ion-icon>
          </button>
        </div>
        
        ` : html`<div id="introBlock">
        Sign in to quickly access your latest email and save them for offline use! Powered by the Microsoft Graph.

        <app-login></app-login>
      </div>`}

        <pwa-install>Install Offline Mail</pwa-install>

        <dile-toast id="myToast" duration="3000"></dile-toast>
      </div>


    `;
  }
}