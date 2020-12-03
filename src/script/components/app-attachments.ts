import { fileSave } from 'browser-nativefs';
import { LitElement, css, html, customElement, property } from 'lit-element';

@customElement('app-attachments')
export class AppAttachments extends LitElement {
    @property() attachments: any[] | null = null;

    static get styles() {
        return css`
          #attachments {
            display: flex;
            flex-direction: column;
            width: 30vw;
            background: rgb(34, 34, 34);
            padding: 10px;
            border-radius: 8px;
          }

          h3 {
            margin-top: 0;
          }

          ul {
            list-style: none;
            margin: 0;
            padding: 0;

            max-height: 500px;
            overflow-y: auto;
          }

          ul::-webkit-scrollbar {
            width: 8px;
            background: #222222;
            border-radius: 4px;
          }

          li {
            background: var(--background-color);
            padding: 10px;
            border-radius: 6px;
            font-weight: bold;
            margin-bottom: 8px;

            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          li ion-icon {
            font-size: 22px;
          }
        `
    }

    constructor() {
        super();
      }

      firstUpdated() {
        console.log('attach', this.attachments)
      }

      b64toBlob = (b64Data: any, contentType='', sliceSize=512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
      
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
      
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
      
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
      
        const blob = new Blob(byteArrays, {type: contentType});
        return blob;
      }

      async download(attachment: any) {
        const blob = this.b64toBlob(attachment.contentBytes, attachment.contentType);
        console.log(blob)

        await fileSave(blob, {
          fileName: attachment.name,
          extensions: [
            `.${attachment.contentType}`
          ]
        })
      }

      render() {
        return html`
        <div id="attachments">
        
          <h3>Attachments</h3>
          <ul>
            ${
              this.attachments ? 
                this.attachments.map((attachment) => {
                  return html`
                    <li>
                      <span id="name">${attachment.name}</span>

                      <fast-button appearance="stealth" @click="${() => this.download(attachment)}"><ion-icon name="download-outline"></ion-icon></fast-button>
                    </li>
                    
                  `
                })
               : null
            }
            
          </ul>
          </div>
        `;
      }
}