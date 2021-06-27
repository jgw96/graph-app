import { LitElement, css, html, customElement } from 'lit-element';

import './app-home';

import { Router } from '@vaadin/router';

import '../components/header';


@customElement('app-index')
export class AppIndex extends LitElement {

  static get styles() {
    return css`
      main {
        padding: 16px;
        margin-top: 33px;
      }

      #routerOutlet app-home, #routerOutlet app-about, #routerOutlet app-index, #routerOutlet app-new {
        display: block;
      }
      
      #routerOutlet > .leaving {
        animation: 160ms fadeOut ease-in-out;
      }
    
      #routerOutlet > .entering {
        animation: 160ms fadeIn linear;
      }

      @media (min-width: 800px) {
        main {
          --colors: #686bd2, #ff0076;
          --min-radius: 20;
          --max-radius: 100;
          --num-circles: 30;
          --min-opacity: 10;
          --max-opacity: 50;

          --voronoi-cell-colors: #686bd2, #ff0076;
          --voronoi-number-of-cells: 25;

          height: 88vh;
        }
      }
    
      @keyframes fadeOut {
        from {
          opacity: 1;
        }
    
        to {
          opacity: 0;
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
    `;
  }

  constructor() {
    super();
  }

  firstUpdated() {
    // For more info on using the @vaadin/router check here https://vaadin.com/router
    const router = new Router(this.shadowRoot?.querySelector('#routerOutlet'));
    router.setRoutes([
      {
        path: "",
        children: [
          ({ path: '/', component: 'app-home', animate: true } as any),
          ({
            path: "/email",
            animate: true,
            component: "app-about",
            action: async() => {
              await import('./app-about.js');
            },
          } as any),
          ({
            path: "/newEmail",
            animate: true,
            component: "app-new",
            action: async() => {
              await import('./app-new.js');
            },
          } as any)
        ]
      }
    ]);
  }

  authed() {
    (this.shadowRoot?.querySelector("#routerOutlet app-home") as any || null)?.getSavedAndUpdate(true);
  }

  render() {
    return html`
      <div>
        <app-header @user-authed="${() => this.authed()}"></app-header>

        <main>
          <div id="routerOutlet"></div>
        </main>
      </div>
    `;
  }
}