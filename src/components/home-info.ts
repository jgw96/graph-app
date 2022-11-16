import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

import "../components/app-login";

@customElement("home-info")
export class HomeInfo extends LitElement {
  static styles = [
    css`
      :host {
        display: block;

        overflow-y: hidden;
        height: 92vh;
        overflow-x: hidden;
      }

      #introBlock {
        font-weight: bold;
        text-align: center;
        background: white;
        border-radius: 6px;
        padding: 2em;
        background: rgb(39 42 53 / 84%);
        flex-direction: column;
        display: flex;
        align-items: center;
        justify-content: space-between;
        backdrop-filter: blur(10px);

        animation-name: slidein;
        animation-duration: 300ms;
        animation-fill-mode: forwards;
      }

      #introBlock h2 {
        margin-top: 0;
        margin-bottom: 0;
      }

      #introBlock app-login {
        margin-top: 1em;
      }

      #introBlock app-login::part(loginButton) {
        height: 32px;
      }

      #introBlock img {
        height: 24em;
      }

      #introSpan {
        font-weight: normal;
        font-size: 12px;
        margin-top: 8px;
        color: white;
      }

      #intro-actions {
        display: flex;
        width: 100%;
        justify-content: flex-end;
        margin-bottom: -1em;
      }

      #advBlock {
        animation-name: slidein;
        animation-duration: 300ms;
        animation-fill-mode: forwards;

        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 8px;
      }

      #advBlock::-webkit-scrollbar {
        display: none;
      }

      #advBlock .advOuter {
        flex-direction: column;
        align-items: center;
        display: inline-flex;
      }

      #advBlock .advInner {
        background: rgb(39 42 53 / 84%);
        color: white;
        padding: 1em;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-radius: 8px;
        width: 50vw;
      }

      #advBlock .advInner li {
        font-weight: bold;
      }

      #advBlock .advInner img {
        content-visibility: auto;
      }

      @media (prefers-color-scheme: light) {
        #advBlock .advInner {
          background: white;
          color: black;
        }
      }

      #advBlock .advInner#firstBlock {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }

      #advBlock .advInner#firstBlock img {
        width: 20em;
        margin-right: 4vw;
      }

      #advBlock .advInner#firstBlock ul {
        height: initial;
        overflow: initial;
      }

      #advBlock div img {
        object-fit: contain;
        height: 120px;
        width: 136px;
      }

      #advBlock div p {
        font-weight: bold;
      }

      @media (prefers-color-scheme: dark) {
        #introBlock {
          color: white;
        }
      }

      @media (screen-spanning: single-fold-vertical) {
        #introBlock {
          margin-right: 0em;
          margin-left: calc(env(fold-left) + 2em);
        }

        #advBlock {
          display: none;
        }

        #introBlock {
          margin-right: 0em;
          margin-left: calc(env(fold-left) + 2em);
        }
      }

      @media (min-width: 1200px) {
        #introBlock {
          margin-left: 11em;
          margin-right: 11em;
        }
      }

      @media (min-width: 1000px) {
        #introBlock {
          margin-left: 12em;
          margin-right: 12em;
          align-items: flex-start;
          text-align: start;
        }
      }

      @media (max-width: 800px) {
        #advBlock {
          white-space: initial;
        }

        #intro-actions {
          justify-content: center;
        }

        #advBlock div img {
          height: 8em;
          margin-right: 0;
        }

        #advBlock .advInner {
          text-align: center;
          width: initial;
        }

        #advBlock .advOuter {
          display: initial;
          width: initial;
        }

        #advBlock .advInner#firstBlock {
          flex-direction: column;
        }

        #advBlock .advInner#firstBlock ul {
          margin-bottom: 0;
        }

        #advBlock .advInner#firstBlock ul li {
          margin-bottom: 0;
          font-weight: bold;
        }
      }

      @media (prefers-color-scheme: light) {
        #introSpan {
          color: black;
        }

        #introBlock {
          background: white;
        }
      }
    `,
  ];

  render() {
    return html`
      <div id="introBlock">
        <h2>
          Sign in to quickly access your latest email and save them for offline
          use!
        </h2>

        <span id="introSpan">Powered by the Microsoft Graph.</span>

        <div id="intro-actions">
          <app-login></app-login>
        </div>
      </div>

      <div id="advBlock">
        <div class="advOuter">
          <div class="advInner">
            <img src="/assets/home_one.svg" alt="app icon" />

            <ul>
              <li>Easily access your mail, even when offline!</li>
              <li>Set reminders for your mail that also work offline!</li>
            </ul>
          </div>
        </div>

        <div class="advOuter">
          <div class="advInner">
            <img src="/assets/home_two.svg" />
            <p>
              Even send mail while offline and let us automatically send it once
              you are back online!
            </p>
          </div>
        </div>
      </div>
    `;
  }
}
