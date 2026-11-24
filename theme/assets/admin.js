(function () {
  'use strict';
  document.querySelectorAll('.atos-select-image').forEach(function (button) {
    button.addEventListener('click', function () {
      var field = button.dataset.field;
      var picker = wp.media({ title: 'Escolher imagem da ATOS', library: { type: 'image' }, multiple: false, button: { text: 'Usar esta imagem' } });
      picker.on('select', function () {
        var image = picker.state().get('selection').first().toJSON();
        document.getElementById('atos-' + field).value = image.id;
        var preview = document.getElementById('preview-' + field);
        preview.replaceChildren();
        var img = document.createElement('img');
        img.src = image.sizes && image.sizes.medium ? image.sizes.medium.url : image.url;
        img.alt = 'Imagem selecionada';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        preview.appendChild(img);
      });
      picker.open();
    });
  });
  document.querySelectorAll('.atos-clear-image').forEach(function (button) {
    button.addEventListener('click', function () {
      document.getElementById('atos-' + button.dataset.field).value = 0;
      document.getElementById('preview-' + button.dataset.field).replaceChildren();
    });
  });
}());
