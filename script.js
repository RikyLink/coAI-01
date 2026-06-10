(function() {
  'use strict';

  const statusOverlay = document.getElementById('status-overlay');
  const cards = document.querySelectorAll('.hub-card');

  // Função para exibir status overlay
  function showStatus(text) {
    statusOverlay.textContent = text;
    statusOverlay.classList.add('active');
  }

  // Função para esconder status overlay
  function hideStatus() {
    statusOverlay.classList.remove('active');
  }

  // Event listeners para os cards
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const isDownload = card.hasAttribute('data-download');
      if (isDownload) {
        const url = card.getAttribute('data-url');
        const name = card.getAttribute('data-name') || 'Download';
        if (url) {
          showStatus('Iniciando ' + name);
          window.open(url, '_blank');
          setTimeout(() => {
            if (statusOverlay.textContent.includes(name)) {
              hideStatus();
            }
          }, 2000);
        }
      } else {
        // Se futuramente houver outro tipo de card, poderá ser tratado aqui
      }
    });
  });

})();