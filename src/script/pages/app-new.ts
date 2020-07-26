import { LitElement, css, html, customElement, property } from 'lit-element';
import '@dile/dile-toast/dile-toast';

import { sendMail } from '../services/mail';
import { Router } from '@vaadin/router';


@customElement('app-new')
export class AppNew extends LitElement {

  @property({ type: String }) subject: string = '';
  @property({ type: String }) body: string = '';
  @property({ type: String }) address: string = '';

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
              justify-content: flex-end;
              background: #ffffff69;
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
            width: 5em;
            cursor: pointer;
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

          @media(prefers-color-scheme: dark) {
              #newEmailActions {
                background: rgb(29 29 29 / 78%);
              }
          }
        `
  }

  async send() {
    const recip = [
      {
        emailAddress: {
          address: this.address
        }
      }
    ]

    try {
      await sendMail(this.subject, this.body, recip);

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

  render() {
    return html`
        <div>
          <div id="subjectBar">
            <input @change="${(event: any) => this.updateAddress(event)}" type="text" id="recip" placeholder="test@email.com">
            <input @change="${(event: any) => this.updateSubject(event)}" type="text" id="subject" placeholder="Subject..">
          </div>

          <textarea @change="${(event: any) => this.updateBody(event)}" placeholder="Content of email..."></textarea>

          <div id="newEmailActions">
            <button @click="${() => this.goBack()}" id="backButton">
              Back

              <ion-icon name="chevron-back-outline"></ion-icon>
             </button>

            <button @click="${() => this.send()}">
              Send

              <ion-icon name="mail-outline"></ion-icon>
            </button>
          </div>
        </div>

        <dile-toast id="myToast" duration="3000"></dile-toast>
    `
  }
}