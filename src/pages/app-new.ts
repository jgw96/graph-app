import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';

import { classMap } from "lit-html/directives/class-map.js";

import "@dile/dile-toast/dile-toast";
// import "font-select";

import { Router } from "@vaadin/router";

// @ts-ignore
// import TextWorker from '../workers/text.js?worker'

// @ts-ignore
// import AIWorker from '../workers/ai.js?worker';

//@ts-ignore
import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.min.mjs";

import "../components/app-contacts";
import "../components/app-drawing";
import "../components/app-camera";
import "../components/app-dictate";
import "../components/app-files";
import "../components/address-bar";
// import "../components/app-textarea";

import { del } from "idb-keyval";
import { initIdle } from "../utils/idle";
import { getConversation } from "../services/conversation";

@customElement("app-new")
export class AppNew extends LitElement {
  @state() subject: string = "";
  @state() body: string = "";
  @state() address: string = "";

  @state() attachments: any = [];
  @state() loading: boolean = false;

  @state() preview: any = null;
  @state() previewContent: any = null;
  @state() textPreview: boolean = false;
  @state() textPreviewContent: string | null = null;

  @state() aiData: any | null = null;

  @state() replying: boolean = false;
  @state() emailReplyTo: any | null = null;

  @state() pickFiles: boolean = false;
  @state() drawing: boolean = false;

  @state() fonts: any[] | undefined = undefined;

  @state() conversation: any[] | undefined = undefined;

  worker: any | null = null;
  textWorker: any | null = null;

  previewTextList: string[] = [];

  idleInit: boolean = false;

  static get styles() {
    return css`
      sl-button::part(content) {
        align-items: center;
        display: flex;
        justify-content: space-between;
      }

      #replyBlock iframe {
        height: 78vh;
      }

      #convoBlock ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      #convoBlock ul iframe {

      }

      #main-block.replying {
        position: fixed;
        right: 1em;
        bottom: 83px;
        width: 36em;
        border-radius: 12px;
        box-shadow: #000000c2 0px 3px 11px 2px;
        opacity: 0;
        backdrop-filter: blur(34px);

        animation-name: slideup;
        animation-duration: 0.3s;
        animation-delay: 0.5s;
        animation-fill-mode: forwards;
      }

      sl-textarea::part(base) {
        border-radius: 12px;
      }


      #appNewBody {
        padding: 14px;
      }

      #sendButton::part(base) {
        color: white;
      }

      #toneDialog {
        --width: 80vw;
      }

      app-dictate {
        margin-right: 10px;
      }

      #more-actions-drawer::part(body) {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      #text-editor-controls {
        display: none;
        justify-content: flex-end;
        align-items: center;
        margin-bottom: 6px;
      }

      #text-editor-controls label {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 4px;
      }

      #text-editor-controls sl-select,
      #text-editor-controls sl-number-field {
        min-width: 6em;
        width: 8em;
      }

      label[for="font-select"] {
        gap: 4px;
        flex-direction: row-reverse !important;
        align-items: center;
      }

      #replyingHeader {
        margin-top: 0;
        font-size: 1.4em;
      }

      .scrolling {
        height: 90vh;
        overflow-y: scroll;
      }

      #replyEmailSection {
        width: 100%;

        border: solid 2px var(--app-color-primary);
        border-radius: 6px;
        background: white;
      }

      #appNewBody::-webkit-scrollbar {
        width: 8px;
        background: #222222;
        border-radius: 4px;
      }

      sl-textarea {
        width: 100%;
      }

      sl-textarea::part(base), sl-input::part(base), sl-select::part(control) {
        background: rgb(39 42 53 / 84%);
      }

      sl-textarea::part(textarea) {
        height: 46vh;
      }

      #textAreaSection {
        display: flex;
        justify-content: space-evenly;
      }

      #previewTextButton {
        margin-top: 10px;
        border-radius: 20px;
        padding-left: 10px;
        padding-right: 10px;
      }

      @media (prefers-color-scheme: light) {
        sl-textarea::part(control),
        sl-input::part(control) {
          color: black;
        }
      }

      #textPreview {
        width: 80vw;
        border: solid 1px var(--sl-color-primary-700);;
        margin-left: 2em;
        padding: 0px 1em 1em;
        margin-top: 4px;

        border-radius: 2px;

        animation-name: slideinright;
        animation-duration: 300ms;
      }

      #textAreaActions {
        align-items: center;
        justify-content: space-between;

        display: none;
      }

      #aiMessage,
      #markdownSpan {
        font-size: 10px;
      }

      @media (max-width: 800px) {
        .aiCheck {
          display: none;
        }

        app-dictate {
          margin-right: 4px;
        }

        #moreActionsMobile {
          display: initial;
          margin-right: 4px;
        }

        #aiMessage {
          font-size: 10px;
          position: absolute;
          bottom: 2em;
        }

        #previewTextButton {
          display: none;
        }

        #textAreaActions {
          margin-top: 1em;
        }
      }

      #previewActionsBlock {
        display: flex;
        justify-content: flex-end;
      }

      #toxicityReport {
        list-style: none;
        overflow-y: scroll;
        height: 50vh;
        padding: 0;
        margin: 0;
      }

      #toxicityReport::-webkit-scrollbar {
        width: 8px;
        background: #222222;
        border-radius: 4px;
      }

      #happyReport {
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 2em;
        flex-direction: column;
      }

      #happyReport img {
        height: 8em;
      }

      @media (max-width: 800px) {
        #happyReport {
          text-align: center;
        }

        #happyReport img {
          height: 4em;
        }

        #toxicityReport {
          padding: 0;
          margin: 0;
          overflow: hidden;
        }
      }

      #toxicityReport h4 {
        margin-bottom: 0;
        font-weight: bold;
        font-size: 1.2em;
      }

      #toxicityReport h4.bad {
        color: red;
      }

      sl-progress {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 99;
      }

      #previewBlock,
      #aiBlock {
        background: #181818e8;
        backdrop-filter: blur(10px);
        position: absolute;
        z-index: 9999;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;

        animation-name: fadeIn;
        animation-duration: 280ms;
      }

      #preview,
      #aiData {
        background: #303030;
        position: absolute;
        top: 5em;
        z-index: 9999;
        bottom: 5em;
        left: 5em;
        right: 5em;
        border-radius: 4px;

        padding: 1em 2em;
      }

      @media (max-width: 800px) {
        #preview,
        #aiData {
          inset: 1em;
        }
      }

      #preview img {
        max-height: 76%;
        object-fit: contain;
        width: 100%;
      }

      #previewHeader,
      #aiBlockHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1em;
      }

      #newEmailActions {
        position: fixed;
        bottom: env(keyboard-inset-height, 12px);
        backdrop-filter: blur(10px);
        padding: 12px;
        display: flex;

        left: 12px;
        right: 12px;
        bottom: 12px;
        border-radius: 8px;

        justify-content: space-between;
        align-items: center;
        background: #ffffff69;
      }

      ion-fab {
        bottom: 5em;
      }

      ion-fab sl-button {
        --background: var(--app-color-primary);
        --color: white;
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

      #attachButton,
      .aiCheck {
        margin-right: 12px;
      }

      #subjectBar {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
      }

      sl-textarea {
        width: 100%;
      }

      sl-textarea::part(control) {
        height: 60vh;
        width: 100%;
        overflow: hidden;
      }

      #subjectBar sl-input {
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
        width: 90%;
      }

      @media (max-width: 800px) {
        #addressBlock #recip.contacts {
          width: 80%;
        }
      }

      #attachmentsBlock {
        position: fixed;
        width: 100%;
        left: 0;
        right: 0;
        padding-bottom: 10px;
      }

      #attachmentsList {
        margin: 0;
        padding: 0;
        display: flex;
        overflow-x: scroll;
      }

      #attachmentsList::-webkit-scrollbar {
        display: none;
      }

      #attachedImage {
        display: flex;
        justify-content: space-between;
        align-items: center;
        bottom: 3.4em;
        background: #686bd2;
        color: white;
        object-fit: contain;
        animation-name: slideinleft;
        animation-duration: 300ms;
        max-height: 3em;
        margin-left: 12px;
        border-radius: 4px;
        cursor: pointer;
      }

      #attachedImage:hover {
        animation: shake 0.3s;
        animation-fill-mode: forwards;
      }

      #attachedDoc {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #2b2b2b;
        padding: 8px;
        margin-left: 16px;
        border-radius: 4px;
      }

      #attachedDoc:hover {
        animation: shake 0.3s;
        animation-fill-mode: forwards;
      }

      #drawingButton {
        position: absolute;
        bottom: 4em;
        right: 16px;
        background: var(--app-color-secondary);
        color: white;
        color: white;
        font-weight: bold;
        font-size: 1em;
        min-width: 5em;
        cursor: pointer;
        border-width: initial;
        border-style: none;
        border-color: initial;
        border-image: initial;
        padding: 6px;
        border-radius: 6px;
      }

      h2 {
        font-size: 2em;
      }

      #newEmailActions #attachButton {
        display: none;
      }

      #previewActionsBlock sl-button {
        background: red;
      }

      @media (min-width: 800px) {
        #attachedImage {
          border-radius: 6px;
          right: initial;
          left: 16px;
          bottom: 4em;
        }

        #moreActionsMobile {
          display: none;
        }

        ion-fab {
          display: none;
        }

        #newEmailActions #attachButton {
          display: block;
        }

        #attachedImage img {
          border-radius: 6px;
        }
      }

      inking-canvas::part(canvas) {
        min-width: 154px !important;
        height: 70vh !important;
        width: 98vw !important;
      }

      #drawing-button {
        margin-right: 12px;
      }

      @media (max-width: 800px) {
        inking-canvas::part(canvas) {
          height: 66vh !important;
          width: 94vw !important;
        }

        #drawing-button {
          margin-right: 4px;
        }
      }

      @media (screen-spanning: single-fold-vertical) {
        #appNewBody {
          display: grid;
          grid-template-columns: 48% 48%;
          grid-gap: 47px;
        }

        #subjectBar {
          margin-right: 4px;
        }

        #addressBlock span {
          display: none;
        }

        #recip {
          width: 80%;
        }

        #textAreaActions {
          display: none;
        }

        #newEmailActions {
          padding-right: 6px;
        }

        #aiBlock {
          width: 50vw;
          left: initial;
          right: 0;
        }

        #aiData {
          inset: 0;
          margin-left: 12px;
        }

        inking-canvas::part(canvas) {
          width: 47vw !important;
        }
      }

      @media (max-width: 420px) {
        app-dictate {
          display: none;
        }
      }

      @media (prefers-color-scheme: dark) {
        #newEmailActions {
          background: rgb(41 41 68 / 48%);
        }

        h2 {
          color: white;
        }

        sl-drawer::part(panel) {
          background: #24242866;
          backdrop-filter: blur(20px);
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0.2;
        }

        to {
          opacity: 1;
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

      @keyframes slideinright {
        from {
          transform: translateX(50px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes shake {
        0% {
          transform: translateX(0);
        }
        25% {
          transform: translateX(10px);
        }

        50% {
          transform: translateX(-10px);
        }
        100% {
          transform: translateX(0px);
        }
      }

      @keyframes slideup {
        from {
          transform: translateY(300px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @media (prefers-color-scheme: light) {
        #appNewBody::-webkit-scrollbar,
        #toxicityReport::-webkit-scrollbar,
        #attachmentsList::-webkit-scrollbar {
          background: #ffffff;
        }
      }
    `;
  }

  async firstUpdated() {
    const search = new URLSearchParams(location.search);
    const id = search.get("id");

    if (id) {
      const { getAnEmail } = await import("../services/mail");

      this.emailReplyTo = await getAnEmail(id);
      this.address = this.emailReplyTo.sender.emailAddress.address;

      this.replying = true;

      const ell: any = this.shadowRoot?.querySelector("#appNewBody");
      if (ell) {
        ell.classList.toggle("scrolling");
      }

      const convo = await getConversation(this.emailReplyTo.conversationId);
      console.log("convo", convo);
      if (convo) {
        this.conversation = convo;
      }
    }

    const name = search.get("name");
    console.log("name", name);

    if (name) {
      await this.shareTarget(name);
    }

    const urlToSend = search.get("url");
    if (urlToSend) {
      this.address = urlToSend.replace("mailto:", "");
    }

    await this.fileHandler();

    const worker = new Worker(new URL('/workers/text.js', import.meta.url), {
      type: 'module'
    });
    this.textWorker = Comlink.wrap(worker);

    (window as any).requestIdleCallback(
      async () => {
        const aiWorker = new Worker(new URL('/workers/ai.js', import.meta.url));
        this.worker = Comlink.wrap(aiWorker);
        await this.worker.load();
      },
      {
        timeout: 1000,
      }
    );

    window.requestIdleCallback(async () => {
      await this.doDragDrop();
    }, {
      timeout: 1000
    })
  }

  async doDragDrop() {
    const elem = this.shadowRoot;
    elem?.addEventListener('dragover', (e) => {
      // Prevent navigation.
      e.preventDefault();
    });

    elem?.addEventListener('drop', async (e: any) => {
      e.preventDefault();

      const fileHandlesPromises = [...e.dataTransfer.items]
        .filter((item) => item.kind === 'file')
        .map((item) => item.getAsFileSystemHandle());

      for await (const handle of fileHandlesPromises) {
        console.log(`File: ${handle.name}`);

        const blob = await handle.getFile();
        this.attachments = [blob];
      }
    });
  }

  async handleIdle() {
    console.log("initiing idle");
    const idleDetector = await initIdle();

    this.idleInit = true;

    console.log(idleDetector);

    idleDetector.addEventListener("change", () => {
      const userState = idleDetector.userState;
      const screenState = idleDetector.screenState;
      console.log(`Idle change: ${userState}, ${screenState}.`);

      if (userState === "idle") {
        this.saveToDraft();
      }
    });
  }

  async shareTarget(name: string) {
    const cache = await caches.open("shareTarget");
    const result = [];

    for (const request of await cache.keys()) {
      // If the request URL matches, add the response to the result
      if (
        (request.url.endsWith(".png") && request.url.includes(name)) ||
        request.url.endsWith(".jpg")
      ) {
        result.push(await cache.match(name));
      }
    }

    console.log("share taget result", result);
    if (result[0]) {
      let imageBlob = await result[0].blob();

      if (imageBlob) {
        this.attachments = [imageBlob];
      }
    }
  }

  async fileHandler() {
    if ("launchQueue" in window) {
      (window as any).launchQueue.setConsumer(async (launchParams: any) => {
        if (!launchParams.files.length) {
          return;
        }

        const fileHandle = launchParams.files[0];
        console.log("fileHandle", fileHandle);

        const existingPerm = await fileHandle.queryPermission({
          writable: false,
        });

        if (existingPerm === "granted") {
          const blob = await fileHandle.getFile();

          this.attachments = [...this.attachments, blob];
        } else {
          const request = await fileHandle.requestPermission({
            writable: false,
          });

          if (request === "granted") {
            const blob = await fileHandle.getFile();
            console.log(blob);

            this.attachments = [...this.attachments, blob];
          }
        }
      });
    }
  }

  async reply() {
    this.loading = true;

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

    const htmlBody = await this.textWorker.runMarkdown(this.body);
    console.log(htmlBody);

    try {
      if (recip && htmlBody) {
        const { reply } = await import('../services/mail');
        await reply(this.emailReplyTo.id, htmlBody, recip);

        let toastElement: any = this.shadowRoot?.getElementById("myToast");
        await toastElement?.open("Reply Sent...", "success");

        this.loading = false;

        await del("shareTargetAttachment");
      } else {
        let toastElement: any = this.shadowRoot?.getElementById("myToast");
        await toastElement?.open(
          "Please enter a subject, and a recipient",
          "error"
        );

        this.loading = false;
      }
      Router.go("/");
    } catch (err) {
      console.error(err);

      let toastElement: any = this.shadowRoot?.getElementById("myToast");
      await toastElement?.open("Error sending email", "error");

      this.loading = false;
    }
  }

  async send() {
    this.loading = true;

    let addresses = this.address.split(",");
    console.log(addresses);

    let recip: any[] = [];

    addresses.forEach((address) => {
      if (address.trim().length > 0) {
        recip.push({
          emailAddress: {
            address: address.trim(),
          },
        });
      }
    });

    const htmlBody = await this.textWorker.runMarkdown(this.body);
    console.log(htmlBody);

    const fontFamily = (
      this.shadowRoot?.querySelector("#font-select") as HTMLSelectElement
    )?.value;
    const fontSize = (this.shadowRoot?.querySelector("#font-size") as any)
    .value;

    console.log("font-styles", fontFamily, fontSize);

    const email_style = `<style> * { font-family: ${
      fontFamily || "sans-serif"
    }; font-size: ${fontSize || 12}; } </style>`;
    console.log(email_style);

    try {
      if (
        this.subject &&
        this.subject.length > 1 &&
        recip &&
        recip.length > 0
      ) {
        // im drawing an email
        if (this.drawing === true) {
          const canvasComp: any =
            this.shadowRoot?.querySelector("inking-canvas");
          const canvas: HTMLCanvasElement = canvasComp.getCanvas();

          canvas.toBlob(async (blob) => {
            if (blob) {
              const { sendMail } = await import("../services/mail");

              await sendMail(this.subject, htmlBody, recip, [
                new File([blob], "email", {
                  type: "image/png",
                }),
              ]);
            }
          });
        } else {
          const { sendMail } = await import("../services/mail");
          await sendMail(
            this.subject,
            email_style + htmlBody,
            recip,
            this.attachments
          );
        }

        let toastElement: any = this.shadowRoot?.getElementById("myToast");
        await toastElement?.open("Mail Sent...", "success");

        this.loading = false;

        Router.go("/");

        await del("shareTargetAttachment");
      } else {
        let toastElement: any = this.shadowRoot?.getElementById("myToast");
        await toastElement?.open(
          "Please enter a subject, and a recipient",
          "error"
        );

        this.loading = false;
      }
      //
    } catch (err) {
      console.error(err);

      let toastElement: any = this.shadowRoot?.getElementById("myToast");
      await toastElement?.open("Error sending email", "error");

      this.loading = false;
    }
  }

  goBack() {
    Router.go("/");
  }

  updateSubject(event: any, updatedSubject?: string) {
    if (updatedSubject) {
      this.subject = updatedSubject;
      return;
    } else {
      this.subject = event.target.value;
    }
  }

  async updateBody(value: string) {
    this.body = value;

    // user has started typing
    // lets set up our idle watcher
    if (this.idleInit === false) {
      (window as any).requestIdleCallback(async () => {
        await this.handleIdle();
      });
    }
  }

  async updatePreview(value: any) {
    if (this.textPreview) {
      const content = value;

      if (content) {
        this.previewTextList = [...this.previewTextList, content];
      }

      this.doPreviewWork();
    }
  }

  async doPreviewWork() {
    if (this.textPreview && this.previewTextList) {
      while (this.previewTextList.length > 0) {
        if (
          (navigator as any).scheduling &&
          (navigator as any).scheduling.isInputPending()
        ) {
          console.log("pending");
          setTimeout(this.doPreviewWork);
          return;
        }

        console.log("doing work", this.previewTextList.length);

        const content = this.previewTextList.shift();
        console.log("content", content);

        if (content) {
          this.loading = true;
          this.textPreviewContent = await this.textWorker.runMarkdown(content);
          this.loading = false;
        }
      }
    }
  }

  updateAddress(address: string) {
    this.address = address;
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
      mimeTypes: ["image/*", "text/*"],
    });

    console.log(blob);

    this.attachments = [...this.attachments, blob];
  }

  async attachDrawing() {
    const modalElement: any = document.createElement("ion-modal");
    modalElement.component = "app-drawing";
    modalElement.showBackdrop = false;

    // present the modal
    document.body.appendChild(modalElement);
    modalElement.present();

    const data = await modalElement.onDidDismiss();
    console.log(data);

    this.attachments = [...this.attachments, data.data.data];
  }

  async attachPhoto() {
    const modalElement: any = document.createElement("ion-modal");
    modalElement.component = "app-camera";
    modalElement.showBackdrop = false;

    // present the modal
    document.body.appendChild(modalElement);
    modalElement.present();

    const data = await modalElement.onDidDismiss();
    console.log(data);

    this.attachments = [...this.attachments, data.data.data];
  }

  async presentActionSheet() {
    // const actionSheet: any = document.createElement("ion-action-sheet");

    // actionSheet.header = "Attach";
    // actionSheet.cssClass = "my-custom-class";
    // actionSheet.buttons = [
    //   {
    //     text: "Local File",
    //     icon: "document-outline",
    //     handler: async () => {
    //       await actionSheet.dismiss();

    //       await this.attachFile();
    //     },
    //   },
    //   {
    //     text: "OneDrive",
    //     icon: "cloud-outline",
    //     handler: async () => {
    //       await actionSheet.dismiss();

    //       this.pickFiles = true;
    //     },
    //   },
    //   {
    //     text: "Take Photo",
    //     icon: "camera-outline",
    //     handler: async () => {
    //       await actionSheet.dismiss();
    //       await this.attachPhoto();
    //     },
    //   },
    //   {
    //     text: "Drawing",
    //     icon: "brush-outline",
    //     handler: async () => {
    //       await actionSheet.dismiss();

    //       await this.attachDrawing();
    //     },
    //   },
    //   {
    //     text: "Cancel",
    //     icon: "close",
    //     role: "cancel",
    //     handler: () => {
    //       console.log("Cancel clicked");
    //     },
    //   },
    // ];
    // document.body.appendChild(actionSheet);
    // return actionSheet.present();

    const drawer: any = this.shadowRoot?.querySelector("#attach-file-drawer");
    await drawer?.show();
  }

  async openFile(handle: any) {
    const existingPerm = await handle.queryPermission({
      writable: false,
    });

    if (existingPerm === "granted") {
      const file = await handle.getFile();
      console.log(file);

      if (file.type.includes("text")) {
        this.preview = file;
        this.previewContent = await file.text();
      } else {
        this.preview = file;
        this.previewContent = URL.createObjectURL(file);
      }
    } else {
      const request = await handle.requestPermission({
        writable: true,
      });

      if (request === "granted") {
        const blob = await handle.getFile();
        console.log(blob);

        const file = await handle.getFile();
        console.log(file);

        if (file.type.includes("text")) {
          this.preview = file;
          this.previewContent = await file.text();
        } else {
          this.preview = file;
          this.previewContent = URL.createObjectURL(file);
        }
      }
    }

    console.log(this.preview);
  }

  close() {
    this.preview = null;
    this.previewContent = null;

    if (this.aiData) {
      this.aiData = null;
    }
  }

  async doAiCheck() {
    this.loading = true;
    this.aiData = await this.worker?.testInput(this.body);
    console.log("aiData", this.aiData);

    const toneDialog: any = this.shadowRoot?.querySelector("#toneDialog");
    await toneDialog?.show();

    this.loading = false;

    if (this.aiData === null) {
      let toastElement: any = this.shadowRoot?.getElementById("myToast");
      await toastElement?.open("Your email must have text first", "error");
    }
  }

  deleteAttach(handle: any) {
    console.log(handle);

    const newAttach = this.attachments.filter((attachment: any) => {
      if (attachment.name !== handle.name) {
        return attachment;
      }
    });
    this.attachments = newAttach;

    this.close();
  }

  openTextPreview() {
    this.textPreview = !this.textPreview;
  }

  handleDictate(ev: CustomEvent) {
    console.log(ev.detail.messageData);

    let textArray = ev.detail.messageData;
    let completeText = "";

    textArray.forEach((text: string) => {
      completeText = completeText + " " + text;
    });

    this.body = completeText;
    console.log(this.body);

    (
      this.shadowRoot?.querySelector("#contentTextArea") as HTMLInputElement
    ).value = this.body;
  }

  doneDictate() {
    this.loading = false;
  }

  startDictate() {
    this.loading = true;
  }

  async saveToDraft() {
    const drawer: any = this.shadowRoot?.getElementById("sl-drawer");
    drawer?.hide();

    this.loading = true;

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

    const htmlBody = await this.textWorker.runMarkdown(this.body);
    console.log(htmlBody);

    try {
      const { saveDraft } = await import("../services/mail")
      await saveDraft(
        this.subject || "",
        htmlBody,
        recip || [],
        this.attachments || null
      );

      let toastElement: any = this.shadowRoot?.getElementById("myToast");
      await toastElement?.open("Draft Saved...", "success");

      this.loading = false;
    } catch (err) {
      console.error(err);

      let toastElement: any = this.shadowRoot?.getElementById("myToast");
      await toastElement?.open("Error saving draft", "error");

      this.loading = false;
    }
  }

  async moreActions() {
    // const actionSheet: any = document.createElement("ion-action-sheet");

    // actionSheet.header = "Actions";
    // actionSheet.cssClass = "my-custom-class";
    // actionSheet.buttons = [
    //   {
    //     text: "Save As Draft",
    //     icon: "save-outline",
    //     handler: async () => {
    //       await actionSheet.dismiss();

    //       await this.saveToDraft();
    //     },
    //   },
    //   {
    //     text: "AI Toxicity Check",
    //     icon: "happy-outline",
    //     handler: async () => {
    //       await actionSheet.dismiss();

    //       await this.doAiCheck();
    //     },
    //   },
    //   {
    //     text: "Cancel",
    //     icon: "close",
    //     role: "cancel",
    //     handler: () => {
    //       console.log("Cancel clicked");
    //     },
    //   },
    // ];
    // document.body.appendChild(actionSheet);
    // return actionSheet.present();

    const drawer: any = this.shadowRoot?.querySelector("#more-actions-drawer");
    if (drawer) {
      await drawer.show()
    }
  }

  handleDriveAttach(fileData: any) {
    console.log(fileData);

    const attachItem = {
      "@odata.type": "#microsoft.graph.referenceAttachment",
      name: fileData.name,
      sourceUrl: fileData.webUrl,
      providerType: "oneDriveConsumer",
      isFolder: "False",
    };

    this.attachments = [...this.attachments, attachItem];
  }

  closePickFiles(ev: CustomEvent) {
    console.log(ev);
    this.pickFiles = false;
  }

  openPickFiles() {
    this.pickFiles = true;
  }

  handleFontSelect(value: string) {
    const textarea: any | null | undefined =
      this.shadowRoot?.querySelector("sl-textarea")?.shadowRoot?.querySelector("textarea");

    if (textarea) {
      textarea.style.fontFamily = value;
    }
  }

  handleNumberSelect(value: number) {
    const textarea: any | null | undefined =
      this.shadowRoot?.querySelector("sl-textarea")?.shadowRoot?.querySelector("textarea");

    // hack for this component
    const numberField = (
      this.shadowRoot?.querySelector("#font-size") as any
    );
    console.log((numberField as any)?.value);

    if (textarea && numberField) {
      textarea.style.fontSize = `${value}px`;
    }
  }

  async loadMoreFonts() {
    try {
      let fonts: any[] = [];
      const availableFonts = await (window as any).queryLocalFonts();
      for (const fontData of availableFonts) {
        console.log(fontData.postscriptName);
        console.log(fontData.fullName);
        console.log(fontData.family);
        console.log(fontData.style);

        fonts.push(fontData.fullName)
      }

      this.fonts = fonts;
    } catch (err: any) {
      console.error(err.name, err.message);
    }
  }

  async disconnectedCallback() {
    super.disconnectedCallback();

    this.attachments = [];
  }

  render() {
    return html`

    <sl-dialog id="toneDialog" label="Tone Report">
      <div id="toneBody">
      ${this.aiData && this.aiData.length > 0
                  ? html`<ul id="toxicityReport">
                      ${this.aiData.map((dataPoint: any) => {
                        return html`
                          <li>
                            <h4 class="bad">${dataPoint.label}</h4>
                            <p>
                              ${dataPoint.message}
                            </p>
                          </li>
                        `;
                      })}
                    </ul>`
                  : html`<div id="happyReport">
                      <img src="/assets/robot.svg" />
                      <h4>Your email sounds good to us!</h4>
                    </div>`}
      </div>
    </sl-dialog>

      <sl-drawer label="More Actions" placement="bottom" id="more-actions-drawer">
        <sl-button @click="${() => this.saveToDraft()}">
          Save As Draft
        </sl-button>

        <sl-button @click="${() => this.doAiCheck()}">
          Tone Report
        </sl-button>

        <sl-button @click="${() => this.attachFile()}">
          Attach File
          <ion-icon name="document-outline"></ion-icon>
        </sl-button>

        <sl-button @click="${() => this.attachPhoto()}">
          Attach Photo
          <ion-icon name="camera-outline"></ion-icon>
        </sl-button>

        <sl-button @click="${() => this.attachDrawing()}">
          Attach Drawing
          <ion-icon name="brush-outline"></ion-icon>
        </sl-button>
      </sl-drawer>

      <sl-drawer label="Attach" placement="end" id="attach-file-drawer">
        <sl-button @click="${() => this.attachFile()}">
            Attach File
            <ion-icon name="document-outline"></ion-icon>
          </sl-button>

          <sl-button @click="${() => this.attachPhoto()}">
            Attach Photo
            <ion-icon name="camera-outline"></ion-icon>
          </sl-button>
      </sl-drawer>


      <div id="appNewBody">
        ${this.loading ? html`<sl-progress></sl-progress>` : null}
        ${this.emailReplyTo
          ? html`<h2 id="replyingHeader">Replying</h2>`
          : null}

        <div id="subjectBar">
          <div id="addressBlock">
            <span>To:</span>
            <address-bar @address-changed="${(event: CustomEvent) => this.updateAddress(typeof(event) === "string" ? event : event.detail.address)}"></address-bar>
            <app-contacts
              @got-contacts="${(ev: CustomEvent) => this.handleContacts(ev)}"
            ></app-contacts>
          </div>

          ${this.emailReplyTo
            ? null
            : html`<sl-input
                @sl-change="${(event: any) => this.updateSubject(event)}"
                type="text"
                id="subject"
                placeholder="Subject.."
              ></sl-input>`}
        </div>

        ${this.preview
          ? html`<div id="previewBlock">
              <div id="preview">
                <div id="previewHeader">
                  <h3>Preview</h3>

                  <sl-button @click="${() => this.close()}">
                    <ion-icon name="close-outline"></ion-icon>
                  </sl-button>
                </div>
                ${this.preview.type.includes("text")
                  ? html`<span>${this.previewContent}</span>`
                  : html`<img src="${this.previewContent}" />`}

                <div id="previewActionsBlock">
                  <sl-button
                    @click="${() => this.deleteAttach(this.preview)}"
                  >
                    Delete

                    <ion-icon name="trash-outline"></ion-icon>
                  </sl-button>
                </div>
              </div>
            </div>`
          : null}
        <!-- ${this.aiData
          ? html`<div id="aiBlock">
              <div id="aiData">
                <div id="aiBlockHeader">
                  <h3>Toxicity Report</h3>

                  <sl-button @click="${() => this.close()}">
                    <ion-icon name="close-outline"></ion-icon>
                  </sl-button>
                </div>

                ${this.aiData.length > 0
                  ? html`<ul id="toxicityReport">
                      ${this.aiData.map((dataPoint: any) => {
                        return html`
                          <li>
                            <h4 class="bad">${dataPoint.label}</h4>
                            <p>
                              Please remember that your words do affect others.
                            </p>
                          </li>
                        `;
                      })}
                    </ul>`
                  : html`<div id="happyReport">
                      <img src="/assets/robot.svg" />
                      <h4>Your email sounds good to us!</h4>
                    </div>`}

                <span id="aiMessage"
                  >All AI is done locally on your device</span
                >
              </div>
            </div>`
          : null} -->
          <div id="big-block">
          ${this.drawing === false
          ? html` <div id="text-editor-controls">
                <label for="font-select">
                  <sl-select
                    @sl-change="${(event: any) =>
                      this.handleFontSelect(event.target.value)}"
                    id="font-select"
                    name="font-select"
                    placeholder="Font"
                  >
                    ${ this.fonts ? this.fonts.map((font: any) => {
                      return html`<sl-menu-item value="${font}">${font}</sl-menu-item>`;
                    }) : html`
                    <sl-menu-item value="Arial">Arial</sl-menu-item>
                    <sl-menu-item value="cursive">Cursive</sl-menu-item>
                    <sl-menu-item value="Georgia">Georgia</sl-menu-item>
                    <sl-menu-item value="Verdana">Verdana</sl-menu-item>
                    <sl-menu-item value="Courier New">Courier</sl-menu-item>

                    <sl-menu-item value="Times New Roman">Times New Roman</sl-menu-item>
                    <sl-menu-item value="Impact">Impact</sl-menu-item>
                    <sl-menu-item value="Comic Sans MS">Comic Sans</sl-menu-item>
                    <sl-menu-item value="Lucida Console">Lucida Console</sl-menu-item>
                    <sl-menu-item value="Trebuchet MS">Trebuchet</sl-menu-item>
                    <sl-menu-item value="Tahoma">Tahoma</sl-menu-item>
                    <sl-menu-item value="Palatino Linotype">Palatino</sl-menu-item>
                    <sl-menu-item value="Bookman Old Style">
                      Bookman Old Style
                    </sl-menu-item>
                    <sl-menu-item value="Garamond">Garamond</sl-menu-item>
                    <sl-menu-item value="Arial Black">Arial Black</sl-menu-item>
                    <sl-menu-item value="Arial Narrow">Arial Narrow</sl-menu-item>
                    <sl-menu-item value="Arial Rounded MT Bold">
                      Arial Rounded MT Bold
                    </sl-menu-item>`}
                  </sl-select>

                  ${'queryLocalFonts' in window && !this.fonts ? html`<sl-button @click="${() => this.loadMoreFonts()}">Load More Fonts</sl-button>` : null }
                </label>

                <label for="font-size">
                  <sl-input
                    @sl-change="${(event: any) =>
                      this.handleNumberSelect(event.target.value)}"
                    id="font-size"
                    name="font-size"
                    value="12"
                    min="11"
                    max="100"
                    type="number"
                    placeholder="Font Size"
                  >
                  </sl-input>
                </label>
              </div>

              <div id="main-block" class="${classMap({ replying: this.emailReplyTo})}">
              <section id="textAreaSection">
                <sl-textarea
                  id="contentTextArea"
                  @sl-input="${(event: any) => this.updatePreview(event.target.value)}"
                  @sl-change="${(event: any) => this.updateBody(event.target.value)}"
                  placeholder="Content of email..."
                >
                </sl-textarea>

                ${this.textPreview
                  ? html`<div
                      id="textPreview"
                      .innerHTML="${this.textPreviewContent
                        ? this.textPreviewContent
                        : ""}"
                    ></div>`
                  : null}
              </section>`
          : html`<inking-canvas name="myInkingCanvas">
              <inking-toolbar canvas="myInkingCanvas">
                <inking-toolbar-highlighter></inking-toolbar-highlighter>
                <inking-toolbar-pen></inking-toolbar-pen>
                <inking-toolbar-eraser></inking-toolbar-eraser>
              </inking-toolbar>
            </inking-canvas>`}

        <!-- <app-textarea></app-textarea> -->

        <div id="textAreaActions">
          <span id="markdownSpan">Supports Markdown</span>

          <sl-button
            class="${classMap({ active: this.textPreview })}"
            id="previewTextButton"
            @click="${() => this.openTextPreview()}"
            >HTML Preview
          </sl-button>
        </div>

        <div id="replyBlock">
          ${this.emailReplyTo
            ? html`<iframe
                id="replyEmailSection"
                .srcdoc="${this.emailReplyTo.body.content}"
              >
              </iframe>`
            : null}

        </div>

          </div>


        <div id="newEmailActions">
          <sl-button @click="${() => this.goBack()}" id="backButton">
            Back

            <ion-icon name="chevron-back-outline"></ion-icon>
          </sl-button>

          <div id="newEmailSubActions">
            <sl-button circle class="aiCheck" @click="${() => this.saveToDraft()}">
              <ion-icon name="save-outline"></ion-icon>
            </sl-button>

            <sl-button
              id="moreActionsMobile"
              @click="${() => this.moreActions()}"
            >
              More Actions

              <ion-icon name="caret-up-outline"></ion-icon>
            </sl-button>

            <app-dictate
              @got-text="${(ev: CustomEvent) => this.handleDictate(ev)}"
              @done-text="${() => this.doneDictate()}"
              @start-text="${() => this.startDictate()}"
            ></app-dictate>

            <sl-button circle class="aiCheck" @click="${() => this.doAiCheck()}">
              <ion-icon name="happy-outline"></ion-icon>
            </sl-button>

            <sl-button
              id="drawing-button"
              class="aiCheck"
              @click="${() => (this.drawing = !this.drawing)}"
              circle
              >
              <ion-icon name="brush-outline"></ion-icon>
            </sl-button>

            ${this.attachments.length === 0
              ? html`<sl-button
                  @click="${() => this.presentActionSheet()}"
                  id="attachButton"
                  circle
                >
                  <ion-icon name="attach-outline"></ion-icon>
                </sl-button>`
              : null}
            ${this.emailReplyTo
              ? html`<sl-button
                  variant="primary"
                  id="sendButton"
                  @click="${() => this.reply()}"
                >
                  Reply

                  <ion-icon name="mail-outline"></ion-icon>
                </sl-button>`
              : html`<sl-button
                  variant="primary"
                  ?disabled="${this.subject && this.subject.length > 1
                    ? false
                    : true}"
                  id="sendButton"
                  @click="${() => this.send()}"
                >
                  Send

                  <ion-icon name="mail-outline"></ion-icon>
                </sl-button>`}
          </div>
        </div>

        ${this.attachments.length > 0
          ? html`<div id="attachmentsBlock">
              <ul id="attachmentsList">
                ${this.attachments.map((attachment: any) => {
                  if (attachment.type && attachment.type.includes("image")) {
                    return html`
                      <img
                        @click=${() => this.openFile(attachment.handle)}
                        id="attachedImage"
                        src=${URL.createObjectURL(attachment)}
                      />
                    `;
                  } else if (attachment.handle) {
                    return html`
                      <span
                        @click=${() => this.openFile(attachment.handle)}
                        id="attachedDoc"
                        >${attachment.name}</span
                      >
                    `;
                  } else {
                    return html`
                      <span id="attachedDoc">${attachment.name}</span>
                    `;
                  }
                })}
              </ul>
            </div>`
          : null}
        ${this.pickFiles
          ? html`<app-files
              @attach-file="${(ev: CustomEvent) =>
                this.handleDriveAttach(ev.detail.data)}"
              @close-attach="${(ev: CustomEvent) => {
                this.closePickFiles(ev);
              }}"
            ></app-files>`
          : null}
      </div>

      <dile-toast id="myToast" duration="3000"></dile-toast>
    `;
  }
}
