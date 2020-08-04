import { LitElement, css, html, customElement, property } from 'lit-element';

import { classMap } from 'lit-html/directives/class-map';

import '@dile/dile-toast/dile-toast';

import { sendMail } from '../services/mail';
import { Router } from '@vaadin/router';

import '../components/app-contacts';


@customElement('app-new')
export class AppNew extends LitElement {

  @property({ type: String }) subject: string = '';
  @property({ type: String }) body: string = '';
  @property({ type: String }) address: string = '';

  @property({}) attachment: any = null;

  static get styles() {
    return css`
        #newEmailActions {
            position: fixed;
              bottom: 0;
              backdrop-filter: blur(10px);
              left: 0;
              right: 0;
              padding: 12px;
              display: flex;
              
              justify-content: space-between;
              align-items: center;
              background: #ffffff69;
          }

          #newEmailActions #newEmailSubActions {
            display: flex;
          }
    
          #newEmailActions button {
            display: flex;
            justify-content: space-around;
            align-items: center;
            background-color: var(--app-color-primary);
            color: white;
            border: none;
            font-weight: bold;
            font-size: 1em;
            padding: 6px;
            border-radius: 6px;
            min-width: 5em;
            cursor: pointer;
          }

          #attachButton {
            margin-right: 12px;
          }
          
          #backButton {
            margin-right: 12px;
            background-color: var(--app-color-secondary) !important;
          }

          #subjectBar {
            display: flex;
            flex-direction: column;
            margin-bottom: 10px;
          }

          textarea {
            height: 60vh;
            width: 100%;
          }

          #subjectBar input {
            border: solid 2px var(--app-color-primary);
            border-radius: 6px;
            padding: 8px;
            margin-bottom: 6px;
          }

          #addressBlock {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          #addressBlock #recip {
            width: 100%;
          }

          #addressBlock #recip.contacts {
            width: 82%;
          }

          #attachedImage {
            position: absolute;
            display: flex;
            justify-content: space-between;
            align-items: center;
            left: 0;
            right: 0;
            bottom: 3.4em;
            background: #686bd2;
            color: white;
            padding-left: 12px;
            animation-name: slideinleft;
            animation-duration: 300ms;
          }

          #attachedImage img {
            width: 6em;
          }

          @media (min-width: 800px) {
            #attachedImage {
              border-radius: 6px;
              right: initial;
              min-width: 16em;
              left: 16px;
              bottom: 4em;
            }

            #attachedImage img {
              border-radius: 0 6px 6px 0;
            }
          }

          @media(prefers-color-scheme: dark) {
              #newEmailActions {
                background: rgb(29 29 29 / 78%);
              }
          }

          @keyframes slideinleft {
            from {
              transform: translateX(-20px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `
  }

  async send() {
    let addresses = this.address.split(",");
    console.log(addresses);

    let recip: any[] = [];

    addresses.forEach((address) => {
      recip.push({
        emailAddress: {
          address: address.trim()
        }
      })
    });

    try {
      await sendMail(this.subject, this.body, recip, this.attachment);

      let toastElement: any = this.shadowRoot?.getElementById('myToast');
      await toastElement?.open('Mail Sent...', 'success');

      Router.go("/");
    }
    catch (err) {
      console.error(err);

      let toastElement: any = this.shadowRoot?.getElementById('myToast');
      await toastElement?.open('Error sending email', 'error');
    }
  }

  goBack() {
    Router.go("/");
  }

  updateSubject(event: any) {
    this.subject = event.target.value;
  }

  updateBody(event: any) {
    this.body = event.target.value;
  }

  updateAddress(event: any) {
    this.address = event.target.value;
  }

  handleContacts(ev: CustomEvent) {
    let recip: any[] = [];

    ev.detail.data.forEach((address: any) => {
      recip.push({
        emailAddress: {
          address: address.trim()
        }
      })
    });

    console.log(recip);

    if (this.address.length > 0) {
      this.address = this.address + ',' + recip[0].emailAddress.address;
    }
    else {
      this.address = recip[0].emailAddress.address;
    }
  }

  async attachFile() {
    const module = await import('browser-nativefs');

    const blob = await module.fileOpen({
      mimeTypes: ['image/*'],
    });

    this.attachment = blob;
  }

  render() {
    return html`
        <div>
          <div id="subjectBar">
            <div id="addressBlock">
              <input class=${classMap({ "contacts": 'contacts' in navigator && 'ContactsManager' in window })} .value="${this.address}" @change="${(event: CustomEvent) => this.updateAddress(event)}" type="text" id="recip" placeholder="test@email.com">
              <app-contacts @got-contacts="${(ev: CustomEvent) => this.handleContacts(ev)}"></app-contacts>
            </div>

            <input @change="${(event: any) => this.updateSubject(event)}" type="text" id="subject" placeholder="Subject..">
          </div>

          <textarea @change="${(event: any) => this.updateBody(event)}" placeholder="Content of email..."></textarea>

          <div id="newEmailActions">
            <button @click="${() => this.goBack()}" id="backButton">
              Back

              <ion-icon name="chevron-back-outline"></ion-icon>
             </button>

             <div id="newEmailSubActions">
              ${this.attachment ? html`<button id="attachButton">Attached</button>` : html`<button @click="${() => this.attachFile()}" id="attachButton">
                Attach File

                <ion-icon name="document-outline"></ion-icon>
              </button>`}

              <button @click="${() => this.send()}">
                Send

                <ion-icon name="mail-outline"></ion-icon>
              </button>
            </div>
          </div>

          ${this.attachment ? html`<div id="attachedImage"><span>Attached: ${this.attachment.name}</span><img src=${URL.createObjectURL(this.attachment)}></div>` : null}
        </div>

        <dile-toast id="myToast" duration="3000"></dile-toast>
    `
  }
}