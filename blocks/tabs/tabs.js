// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const buttons = [];

  // Helper function to activate a tab
  function activateTab(button, tabpanel) {
    // Hide all panels and deselect all tabs
    block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
      panel.setAttribute('aria-hidden', true);
    });
    buttons.forEach((btn) => {
      btn.setAttribute('aria-selected', false);
      btn.setAttribute('tabindex', '-1');
    });

    // Show selected panel and activate tab
    tabpanel.setAttribute('aria-hidden', false);
    button.setAttribute('aria-selected', true);
    button.setAttribute('tabindex', '0');
    button.focus();

    // Analytics tracking hook
    const labelText = button.textContent.trim();
    button.dispatchEvent(new CustomEvent('tab:select', {
      bubbles: true,
      detail: { label: labelText, tabId: button.id },
    }));
  }

  // decorate tabs and tabpanels
  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);

    // decorate tabpanel
    const tabpanel = block.children[i];
    const originalTabpanel = tabpanel.cloneNode(true);
    tabpanel.className = 'tabs-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // Preserve Universal Editor instrumentation
    moveInstrumentation(originalTabpanel, tabpanel);

    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tab.innerHTML;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.setAttribute('tabindex', i === 0 ? '0' : '-1');

    // Click handler
    button.addEventListener('click', () => {
      activateTab(button, tabpanel);
    });

    // Keyboard navigation (Arrow keys, Home, End)
    button.addEventListener('keydown', (e) => {
      const currentIndex = buttons.indexOf(button);
      let newIndex = currentIndex;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          newIndex = (currentIndex + 1) % buttons.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          newIndex = (currentIndex - 1 + buttons.length) % buttons.length;
          break;
        case 'Home':
          e.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          newIndex = buttons.length - 1;
          break;
        default:
          return;
      }

      if (newIndex !== currentIndex) {
        const targetPanel = block.querySelector(`#${buttons[newIndex].getAttribute('aria-controls')}`);
        activateTab(buttons[newIndex], targetPanel);
      }
    });

    buttons.push(button);
    tablist.append(button);
    tab.remove();
  });

  block.prepend(tablist);
}
