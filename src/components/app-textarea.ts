import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { saveDraft } from '../services/mail';
import { initIdle } from '../utils/idle';

// @ts-ignore
// import TextWorker from '../workers/text.js?worker';

//@ts-ignore
import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.min.mjs";

@customElement('app-textarea')
export class AppTextarea extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }

            #text-editor-controls {
                display: flex;
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

              sl-textarea {
                width: 100%;
              }

              sl-textarea::part(base), sl-input::part(base), sl-select::part(control) {
                background: rgb(39 42 53 / 22%);
              }

              sl-textarea::part(textarea) {
                height: 46vh;
              }

              #textAreaSection {
                display: flex;
                justify-content: space-evenly;
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
                display: flex;
                align-items: center;
                justify-content: space-between;
              }
        `
    ];

    @state() fonts: any[] | undefined = undefined;
    @state() preview: any = null;
    @state() previewContent: any = null;
    @state() textPreview: boolean = false;
    @state() textPreviewContent: string | null = null;

    @state() subject: string = "";
    @state() body: string = "";
    @state() address: string = "";

    @state() attachments: any = [];
    @state() loading: boolean = false;

    idleInit: boolean = false;
    worker: any | null = null;
    textWorker: any | null = null;

    previewTextList: string[] = [];

    firstUpdated() {
        const worker = new Worker(new URL('/workers/text.js', import.meta.url), {
          type: 'module'
        });
        this.textWorker = Comlink.wrap(worker);
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


      async updateBody(event: any) {
        this.body = event.target.value;

        // user has started typing
        // lets set up our idle watcher
        if (this.idleInit === false) {
          (window as any).requestIdleCallback(async () => {
            await this.handleIdle();
          });
        }
      }

      async updatePreview(event: any) {
        if (this.textPreview) {
          const content = event.target.value;

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

      openTextPreview() {
        this.textPreview = !this.textPreview;
      }


    render() {
        return html`
        <div id="text-editor-controls">
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
                    <!-- menu items for web safe fonts -->

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

          <section id="textAreaSection">
                <sl-textarea
                  id="contentTextArea"
                  @input="${(event: any) => this.updatePreview(event)}"
                  @change="${(event: any) => this.updateBody(event)}"
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
              </section>

              <div id="textAreaActions">
          <span id="markdownSpan">Supports Markdown</span>

          <sl-button
            class="${classMap({ active: this.textPreview })}"
            id="previewTextButton"
            @click="${() => this.openTextPreview()}"
            >HTML Preview
          </sl-button>
        </div>
        `;
    }
}
