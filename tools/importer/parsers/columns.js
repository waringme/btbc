/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block
 *
 * Source: https://documents.bt.com/content/integrated-supply-chain/
 * Base Block: columns
 *
 * Block Structure (from block library example):
 * - Row 1: Column 1 content | Column 2 content
 *
 * Source HTML Pattern (Foleon):
 * <section id="intro" class="... ripley__Block--block__fw ...">
 *   <div class="... ripley__Block--wrapper-inner">
 *     <div class="... im-row">
 *       <div class="... im-column">  <!-- left column -->
 *         <h1>Heading</h1>
 *       </div>
 *       <div class="... im-column">  <!-- right column -->
 *         <p>Paragraph 1</p>
 *         <p>Paragraph 2</p>
 *         ...
 *       </div>
 *     </div>
 *   </div>
 * </section>
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  // Find all columns in the row
  // VALIDATED: Found multiple <div class="im-column"> inside .im-row in captured DOM
  const columns = element.querySelectorAll('.im-column');

  // Build cells array - each column becomes a cell in one row
  const row = [];

  columns.forEach((col) => {
    const cellContent = [];

    // Extract headings
    // VALIDATED: Found <h1> in first column of section#intro
    const headings = col.querySelectorAll('h1, h2, h3');
    headings.forEach((h) => cellContent.push(h));

    // Extract paragraphs
    // VALIDATED: Found multiple <p> in second column of section#intro
    const paragraphs = col.querySelectorAll('p');
    paragraphs.forEach((p) => {
      if (p.textContent.trim()) {
        cellContent.push(p);
      }
    });

    // Extract images if present
    const images = col.querySelectorAll('.ripley__Image--image');
    images.forEach((img) => cellContent.push(img));

    // Extract CTA links if present
    const ctas = col.querySelectorAll('.im-button');
    ctas.forEach((cta) => {
      const link = cta.closest('a');
      if (link) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = cta.textContent.trim();
        cellContent.push(a);
      }
    });

    // Only add column if it has content
    if (cellContent.length > 0) {
      row.push(cellContent);
    }
  });

  const cells = [row];

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
