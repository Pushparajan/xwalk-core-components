/**
 * XWalk Card Component
 * A container component for displaying content in a card layout
 */
export class XWalkCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['title', 'elevation'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  private render() {
    const title = this.getAttribute('title');
    const elevation = this.getAttribute('elevation') || '1';

    // TODO: Add support for card actions (buttons in footer)
    // TODO: Add support for card media (images)
    // TODO: Add hover animation option

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
      }

      .card {
        background: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: var(--shadow);
        transition: box-shadow 0.3s ease;
      }

      .card.elevation-1 {
        --shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .card.elevation-2 {
        --shadow: 0 4px 8px rgba(0,0,0,0.15);
      }

      .card.elevation-3 {
        --shadow: 0 8px 16px rgba(0,0,0,0.2);
      }

      .card-title {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 16px 0;
        color: #333;
      }

      .card-content {
        color: #666;
        line-height: 1.6;
      }
    `;

    this.shadowRoot!.innerHTML = `
      ${style.outerHTML}
      <div class="card elevation-${elevation}">
        ${title ? `<h3 class="card-title">${title}</h3>` : ''}
        <div class="card-content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('xwalk-card', XWalkCard);
