import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators";

import { classMap } from "lit-html/directives/class-map";

import "@dile/dile-toast/dile-toast";

import { sendMail } from "../services/mail";
import { Router } from "@vaadin/router";

import "../components/app-contacts";

@customElement("dual-new")
export class dualNew extends LitElement {
  @state() subject: string = "";
  @state() body: string = "";
  @state() address: string = "";

  @state() attachment: any = null;

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
        width: 100%;
        margin-bottom: 4em;
        margin-top: 1em;
        height: 100%;
        border-radius: 6px;
      }

      @media (prefers-color-scheme: dark) {
        #newEmailActions {
          background: rgb(29 29 29 / 78%);
        }
      }
    `;
  }

  async send() {
    let addresses = this.address.split(",");
    console.log(addresses);

    let recip: any[] = [];

    addresses.forEach((address) => {
      recip.push({
        emailAddress: {
          address: address.trim(),
        },
      });
    });

    try {
      await sendMail(this.subject, this.body, recip, this.attachment);

      let toastElement: any = this.shadowRoot?.getElementById("myToast");
      await toastElement?.open("Mail Sent...", "success");

      Router.go("/");
    } catch (err) {
      console.error(err);

      let toastElement: any = this.shadowRoot?.getElementById("myToast");
      await toastElement?.open("Error sending email", "error");
    }
  }

  goBack() {
    const modalElement: any = document.querySelector("ion-modal");
    modalElement.dismiss();
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
          address: address.trim(),
        },
      });
    });

    console.log(recip);

    if (this.address.length > 0) {
      this.address = this.address + "," + recip[0].emailAddress.address;
    } else {
      this.address = recip[0].emailAddress.address;
    }
  }

  async attachFile() {
    const module = await import("browser-nativefs");

    const blob = await module.fileOpen({
      mimeTypes: ["image/*"],
    });

    this.attachment = blob;
  }

  render() {
    return html`
      <div>
        <div id="subjectBar">
          <div id="addressBlock">
            <input
              class=${classMap({
                contacts:
                  "contacts" in navigator && "ContactsManager" in window,
              })}
              .value="${this.address}"
              @change="${(event: CustomEvent) => this.updateAddress(event)}"
              type="text"
              id="recip"
              placeholder="test@email.com"
            />
            <app-contacts
              @got-contacts="${(ev: CustomEvent) => this.handleContacts(ev)}"
            ></app-contacts>
          </div>

          <input
            @change="${(event: any) => this.updateSubject(event)}"
            type="text"
            id="subject"
            placeholder="Subject.."
          />
        </div>

        <textarea
          @change="${(event: any) => this.updateBody(event)}"
          placeholder="Content of email..."
        ></textarea>

        ${this.attachment
          ? html`<img
              id="attachedImage"
              src=${URL.createObjectURL(this.attachment)}
            />`
          : null}

        <div id="newEmailActions">
          <button @click="${() => this.goBack()}" id="backButton">
            Back

            <ion-icon name="chevron-back-outline"></ion-icon>
          </button>

          ${this.attachment
            ? html`<button id="attachButton">Attached</button>`
            : html`<button
                @click="${() => this.attachFile()}"
                id="attachButton"
              >
                Attach File

                <ion-icon name="document-outline"></ion-icon>
              </button>`}

          <button @click="${() => this.send()}">
            Send

            <ion-icon name="mail-outline"></ion-icon>
          </button>
        </div>
      </div>

      <dile-toast id="myToast" duration="3000"></dile-toast>
    `;
  }
}
