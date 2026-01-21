/*
 * Accordion Block
 * Recreate an accordion with enhanced UX
 * https://www.hlx.live/developer/block-collection/accordion
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const items = [];

  [...block.children].forEach((row) => {
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';

    // Add visual indicator icon for expand/collapse state
    const icon = document.createElement('span');
    icon.className = 'accordion-icon';
    icon.setAttribute('aria-hidden', 'true'); // Decorative only

    summary.append(...label.childNodes, icon);

    // Accessibility: explicit button role and aria attributes
    summary.setAttribute('role', 'button');
    summary.setAttribute('aria-expanded', 'false');

    // decorate accordion item body
    const body = row.children[1];
    body.className = 'accordion-item-body';

    // decorate accordion item
    const details = document.createElement('details');
    details.className = 'accordion-item';

    // Preserve Universal Editor instrumentation
    moveInstrumentation(row, details);

    details.append(summary, body);

    // Enhanced accessibility and analytics tracking
    details.addEventListener('toggle', () => {
      const isOpen = details.open;
      summary.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      // Analytics tracking hook
      if (isOpen) {
        const labelText = summary.textContent.trim();
        // Dispatch custom event for analytics integration
        details.dispatchEvent(new CustomEvent('accordion:open', {
          bubbles: true,
          detail: { label: labelText, element: details },
        }));
      }
    });

    items.push(details);
    row.replaceWith(details);
  });

  // Optional: Single expansion mode (uncomment to enable)
  // This ensures only one accordion item is open at a time
  /*
  items.forEach((details) => {
    details.addEventListener('toggle', () => {
      if (details.open) {
        items.forEach((other) => {
          if (other !== details && other.open) {
            other.open = false;
          }
        });
      }
    });
  });
  */
}
