/**
 * XWalk Button Component
 * A customizable button web component
 */
export class XWalkButton extends HTMLElement {
  private button: HTMLButtonElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.button = document.createElement('button');
  }

  static get observedAttributes() {
    return ['variant', 'disabled', 'size'];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  private setupEventListeners() {
    // Click event handler
    this.button.addEventListener('click', (e) => {
      if (!this.hasAttribute('disabled')) {
        this.dispatchEvent(new CustomEvent('xwalk-click', {
          bubbles: true,
          composed: true,
          detail: { originalEvent: e }
        }));
      }
    });

    // Keyboard navigation support (Enter, Space)
    this.button.addEventListener('keydown', (e) => {
      if (!this.hasAttribute('disabled')) {
        // Handle Enter and Space keys
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); // Prevent default space scrolling
          this.button.click(); // Trigger the click event
        }
      }
    });

    // TODO: Add loading state with spinner
  }

  private render() {
    const variant = this.getAttribute('variant') || 'default';
    const size = this.getAttribute('size') || 'medium';
    const disabled = this.hasAttribute('disabled');

    this.button.disabled = disabled;
    this.button.innerHTML = '<slot></slot>';
    this.button.className = `btn btn-${variant} btn-${size}`;

    const style = document.createElement('style');
    style.textContent = `
      .btn {
        font-family: system-ui, -apple-system, sans-serif;
        font-weight: 500;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .btn-small { padding: 6px 12px; font-size: 14px; }
      .btn-medium { padding: 10px 20px; font-size: 16px; }
      .btn-large { padding: 14px 28px; font-size: 18px; }

      .btn-default {
        background: #f0f0f0;
        color: #333;
      }
      .btn-default:hover:not(:disabled) {
        background: #e0e0e0;
      }

      .btn-primary {
        background: #007bff;
        color: white;
      }
      .btn-primary:hover:not(:disabled) {
        background: #0056b3;
      }

      .btn-danger {
        background: #dc3545;
        color: white;
      }
      .btn-danger:hover:not(:disabled) {
        background: #c82333;
      }

      /* Focus-visible styles for better accessibility */
      .btn:focus {
        outline: none;
      }

      .btn:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
      }

      .btn-default:focus-visible {
        outline-color: #007bff;
      }

      .btn-primary:focus-visible {
        outline-color: #0056b3;
        box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.25);
      }

      .btn-danger:focus-visible {
        outline-color: #721c24;
        box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.25);
      }

      /* TODO: Add ripple effect on click */
    `;

    this.shadowRoot!.innerHTML = '';
    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(this.button);
  }
}

customElements.define('xwalk-button', XWalkButton);
