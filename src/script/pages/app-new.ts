import { LitElement, css, html, customElement, property } from 'lit-element';
import { sendMail } from '../services/mail';

@customElement('app-new')
export class AppNew extends LitElement {

    @property({ type: String}) subject: string = '';
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
        console.log(this.subject, this.body, this.address);

        const recip = [
            {
                emailAddress: {
                    address: this.address
                }
            }
        ]
        await sendMail(this.subject, this.body, recip);
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
            <button @click="${() => this.send()}">Send</button>
          </div>
        </div>
        `
    }
}