/* SnailSploit commercial funnel events.
 * These are non-PII dataLayer events; Google Tag Manager must map them to GA4.
 * A CTA click is NOT a qualified lead or a confirmed form submission.
 */
(function () {
  'use strict';
  document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest
      ? event.target.closest('a[data-ss-cta]') : null;
    if (!link) return;
    var context = link.getAttribute('data-ss-cta') || 'unknown';
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'service_cta_click',
      cta_context: context,
      target_type: link.hash === '#form' ? 'contact_form' : 'service_page'
    });
  });
}());
