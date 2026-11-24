/* Sem cookies, rastreadores ou dependências externas. */
document.addEventListener('click', function (event) {
  var link = event.target.closest('[data-atos-cta]');
  if (!link) return;
  window.dispatchEvent(new CustomEvent('atos:whatsapp', {
    detail: { label: link.getAttribute('data-atos-cta') }
  }));
});
