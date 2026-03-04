/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block
 *
 * Source: https://documents.bt.com/content/integrated-supply-chain/
 * Base Block: cards
 *
 * Block Structure (from block library example):
 * - Row N: Image cell | Text cell (title + description + CTA)
 *
 * Source HTML Pattern (Foleon):
 * Multiple <section> elements, each containing:
 * <section class="... ripley__Block--block__fw ...">
 *   <div class="... im-row">
 *     <div class="... im-column">
 *       <figure class="ripley__Image--figure-wrapper">
 *         <img class="ripley__Image--image" src="...">
 *       </figure>
 *     </div>
 *     <div class="... im-column">
 *       <h2>Card Title</h2>
 *       <p>Description</p>
 *       <a href="..."><div class="im-button">Read more</div></a>
 *     </div>
 *   </div>
 * </section>
 *
 * NOTE: In the source, each card is a separate full-width section.
 * This parser handles a single card section. The import script
 * should group consecutive card sections into a single Cards block.
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  // Extract image
  // VALIDATED: Found <img class="ripley__Image--image"> inside .ripley__Image--container in captured DOM
  const image = element.querySelector('.ripley__Image--image') ||
                element.querySelector('.ripley__Image--container img') ||
                element.querySelector('figure img');

  // Extract heading
  // VALIDATED: Found <h2> inside .im-column in captured DOM
  const heading = element.querySelector('h2') ||
                  element.querySelector('h1') ||
                  element.querySelector('h3');

  // Extract description paragraph
  // VALIDATED: Found <p> with description text inside .im-column in captured DOM
  const paragraphs = element.querySelectorAll('p');
  let description = null;
  for (const p of paragraphs) {
    const text = p.textContent.trim();
    if (text && text.length > 10) {
      description = p;
      break;
    }
  }

  // Extract CTA link
  // VALIDATED: Found <a> wrapping <div class="im-button"> with "Read more" text in captured DOM
  const ctaButton = element.querySelector('.im-button');
  const ctaLink = ctaButton ? ctaButton.closest('a') : null;

  // Build cells array matching cards block library structure
  // Each row is one card: [image cell, text cell]
  const imageCell = [];
  if (image) {
    imageCell.push(image);
  }

  const textCell = [];
  if (heading) {
    const strong = document.createElement('strong');
    strong.textContent = heading.textContent.trim();
    textCell.push(strong);
  }
  if (description) {
    textCell.push(description);
  }
  if (ctaLink) {
    const link = document.createElement('a');
    link.href = ctaLink.href;
    link.textContent = ctaButton.textContent.trim();
    textCell.push(link);
  }

  const cells = [
    [imageCell, textCell],
  ];

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
