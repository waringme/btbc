/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block
 *
 * Source: https://documents.bt.com/content/integrated-supply-chain/
 * Base Block: hero
 *
 * Block Structure (from block library example):
 * - Row 1: Background image (optional)
 * - Row 2: Content (heading + CTA)
 *
 * Source HTML Pattern (Foleon):
 * <section class="... ripley__Block--block__fw ...">
 *   <div class="... ripley__Block--wrapper-inner">
 *     <div class="... viewer-background video">
 *       <img src="...">  <!-- background image -->
 *     </div>
 *     <div class="... im-row">
 *       <div class="... im-column">
 *         <h1>Heading</h1>
 *         <a href="..."><div class="im-button">CTA text</div></a>
 *       </div>
 *     </div>
 *   </div>
 * </section>
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  // Extract background image
  // VALIDATED: Found <div class="viewer-background video"> containing <img> in captured DOM
  const bgContainer = element.querySelector('.viewer-background');
  const bgImage = bgContainer ? bgContainer.querySelector('img') : null;

  // Extract heading
  // VALIDATED: Found <h1> inside .im-column in captured DOM
  const heading = element.querySelector('h1') ||
                  element.querySelector('h2') ||
                  element.querySelector('[class*="title"]');

  // Extract CTA link
  // VALIDATED: Found <a> wrapping <div class="im-button"> in captured DOM
  const ctaButton = element.querySelector('.im-button');
  const ctaLink = ctaButton ? ctaButton.closest('a') : null;

  // Build cells array matching hero block library structure
  const cells = [];

  // Row 1: Background image (optional)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content (heading + CTA)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (ctaLink) {
    // Create clean link element preserving href and text
    const link = document.createElement('a');
    link.href = ctaLink.href;
    link.textContent = ctaButton.textContent.trim();
    contentCell.push(link);
  }
  cells.push(contentCell);

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
