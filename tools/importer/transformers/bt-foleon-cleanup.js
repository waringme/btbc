/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for BT Foleon website cleanup
 * Purpose: Remove cookie consent, navigation, footer, and non-content elements
 * Applies to: documents.bt.com Foleon-based pages
 * Tested: /content/integrated-supply-chain/
 * Generated: 2026-03-04
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration of https://documents.bt.com/content/integrated-supply-chain/
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove OneTrust cookie consent banner
    // EXTRACTED: Found <div id="onetrust-consent-sdk"> in captured DOM
    // EXTRACTED: Found <div class="onetrust-pc-dark-filter ot-fade-in"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '.onetrust-pc-dark-filter',
    ]);

    // Remove Foleon navigation bar
    // EXTRACTED: Found <div id="navigation-wrapper"> with nav.im-navigation-bar in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '#navigation-wrapper',
    ]);

    // Remove Foleon expanded menu / page index overlay
    // EXTRACTED: Found <div id="expanded-menu"> with page thumbnails in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '#expanded-menu',
    ]);

    // Remove Foleon previous/next navigation
    // EXTRACTED: Found <div id="im-previous-next-navigation"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '#im-previous-next-navigation',
    ]);

    // Remove modal wrapper
    // EXTRACTED: Found <div id="modal-wrapper"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '#modal-wrapper',
    ]);

    // Remove duplicate mobile sections (Foleon renders both desktop and mobile views)
    // EXTRACTED: Found duplicate sections with .in-viewport-pending class in captured DOM
    // The mobile "contents" section duplicates the desktop card sections
    const mobileSections = element.querySelectorAll('section.in-viewport-pending');
    mobileSections.forEach((section) => {
      section.remove();
    });

    // Remove scroll detection containers (Foleon internal)
    // EXTRACTED: Found <div class="erd_scroll_detection_container"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.erd_scroll_detection_container',
    ]);

    // Fix nested spans common in Foleon content
    // EXTRACTED: Captured DOM showed <span class="sc-cUkrys"><span>text</span></span> pattern
    const nestedSpans = element.querySelectorAll('span > span:only-child');
    for (const span of nestedSpans) {
      span.replaceWith(...span.childNodes);
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'link',
    ]);

    // Remove Foleon volume/audio indicators
    // EXTRACTED: Found <div class="maggie-volume-indicator-topbar"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.maggie-volume-indicator-topbar',
    ]);

    // Clean up empty divs left after element removal
    const emptyDivs = element.querySelectorAll('div:empty');
    emptyDivs.forEach((div) => {
      if (!div.id && !div.className) {
        div.remove();
      }
    });
  }
}
