import { LitElement, css, html, customElement, internalProperty } from 'lit-element';

@customElement('app-camera')
export class AppCamera extends LitElement {

    @internalProperty() mediaStream: MediaStream | null = null;
    @internalProperty() imageCapture: any | null = null;

    static get styles() {
        return css`
      #camera {
        background: #0b0b0b;
        position: fixed;
        inset: 0px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        z-index: 9999;
      }
      #camera video {
        width: 100%;
        border-radius: 4px;
        min-height: 300px;
      }
      #camera #cameraActions, #camera #cameraActions fast-button {
        width: 100%;

      }
      #closeBlock {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
      #closeBlock fast-button ion-icon {
        font-size: 2em;
        color: white;
      }
      @media(screen-spanning: single-fold-vertical) {
        #camera {
          right: calc(env(fold-left) + 33px);
        }
      }
      @media(min-width: 1000px) {
        #camera #cameraActions {
          display: flex;
          justify-content: center;
        }
        
        #camera #cameraActions fast-button {
         width: 28%;
         height: 2.4em;
        }
      }
    `
    }

    constructor() {
        super();
    }

    async firstUpdated() {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment"
            }, audio: false
        });
        const videoEl = this.shadowRoot?.querySelector("video");

        if (videoEl) {
            videoEl.srcObject = this.mediaStream;

            this.setupCamera();
        }
    }

    setupCamera() {
        const track = this.mediaStream?.getTracks()[0];
        this.imageCapture = new (window as any).ImageCapture(track);
    }

    async takePicture() {
        const blob = await this.imageCapture.takePhoto();
        console.log(blob);

        const tracks = this.mediaStream?.getTracks();

        tracks?.forEach((track) => {
            track.stop();
        })

        const modalElement: any = document.querySelector('ion-modal');
        modalElement.dismiss({
            data: blob
        });
    }

    close() {
        const modalElement: any = document.querySelector('ion-modal');
        modalElement.dismiss();
    }

    render() {
        return html`
        <fast-design-system-provider>
            <div id="camera">
                <div id="closeBlock">
                    <fast-button @click="${() => this.close()}" appearance="lightweight">
                        <ion-icon name="close-outline"></ion-icon>
                    </fast-button>
                </div>
                <video autoplay></video>
        
                <div id="cameraActions">
                    <fast-button @click="${() => this.takePicture()}">
                        Take Picture
                    </fast-button>
                </div>
            </div>
        </fast-design-system-provider>
    `
    }

}