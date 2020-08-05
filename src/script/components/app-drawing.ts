import { LitElement, css, html, customElement } from 'lit-element';

import '@pwabuilder/pwa-inking';

@customElement('app-drawing')
export class AppDrawing extends LitElement {
    static get styles() {
        return css`

          #drawingToolbar {
            display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 16px;
        padding-right: 16px;
        height: 3.6em;

        position: sticky;
        top: 0;
        background: #ffffff57;
        backdrop-filter: blur(10px);
        z-index: 1;
          }

        #drawingToolbar button {
          display: flex;
          justify-content: space-around;
          align-items: center;
          background-color: var(--app-color-secondary);
          color: white;
          border: none;
          font-weight: bold;
          font-size: 1em;
          padding: 6px;
          border-radius: 6px;
          /* min-width: 5em; */
          cursor: pointer;
        }

        #drawingButton {
          position: absolute;
            bottom: 16px;
            right: 16px;
            background: var(--app-color-primary);
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

          @media(prefers-color-scheme: dark) {
            #drawingToolbar {
              background: rgba(41, 41, 41, 0.61);
              color: white;
            }

            :host {
              background-color: #292929;
            }
    
          }
        `
    }

    constructor() {
        super();
      }

      close() {
        const modalElement: any = document.querySelector('ion-modal');
        modalElement.dismiss();
      }

      add() {
        const canvasComp: any = this.shadowRoot?.querySelector('inking-canvas');
        const canvas: HTMLCanvasElement = canvasComp.getCanvas();

        canvas.toBlob((blob) => {
          const modalElement: any = document.querySelector('ion-modal');
          modalElement.dismiss({
            data: blob
          });

          console.log(canvas);
        })
      }

      render() {
        return html`
          <div>
            <div id="drawingToolbar">
              <h3>Add Drawing</h3>

              <button @click="${() => this.close()}">
                Close
              </button>
            </div>

            <inking-canvas name="myInkingCanvas">
              <inking-toolbar canvas="myInkingCanvas"></inking-toolbar>
            </inking-canvas>

            <button id="drawingButton" @click="${() => this.add()}">
              Add

              <ion-icon name="add-outline"></ion-icon>
            </button>
          </div>
        `;
      }
}