import { LitElement, css, html } from "lit";

import { customElement, state } from "lit/decorators.js";

@customElement("app-loading")
export class AppLoading extends LitElement {
  @state() fallbackLoading: boolean = false;

  static get styles() {
    return css`
      #loadingContainer {
        height: 8px;
        width: 90%;
        opacity: 0;
        background: var(--app-color-primary);
        border-radius: 6px;

        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
      }

      sl-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
      }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    if ("animationWorklet" in CSS) {
      // AnimationWorklet is supported!

      // await (CSS as any).animationWorklet.addModule("../workers/loading.js");

      // if (this.shadowRoot) {
      //   //@ts-ignore
      //   new WorkletAnimation(
      //     "loading",
      //     new KeyframeEffect(
      //       this.shadowRoot?.querySelector("#loadingContainer"),
      //       [
      //         {
      //           opacity: 0.5,
      //           transform: "translateX(0)",
      //         },
      //         {
      //           opacity: 1,
      //           transform: "translateX(100%)",
      //         },
      //       ],
      //       {
      //         duration: 2000,
      //         iterations: Number.POSITIVE_INFINITY,
      //       }
      //     ),
      //     document.timeline
      //   ).play();
      // }
    } else {
      this.fallbackLoading = true;
    }
  }

  render() {
    if (this.fallbackLoading) {
      return html`<sl-progress></sl-progress>`;
    } else {
      return html`<div id="loadingContainer"></div> `;
    }
  }
}
