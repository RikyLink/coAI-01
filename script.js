(function() {
  'use strict';

  const statusOverlay = document.getElementById('status-overlay');
  const cards = document.querySelectorAll('.hub-card');
  const themeCheckbox = document.querySelector('.theme-switch__checkbox');

  // Função para exibir status overlay
  function showStatus(text) {
    statusOverlay.textContent = text;
    statusOverlay.classList.add('active');
  }

  // Função para esconder status overlay
  function hideStatus() {
    statusOverlay.classList.remove('active');
  }

  // --- TEMA ESCURO/CLARO ---
  function applyTheme(isDark) {
    if (isDark) {
      document.body.classList.add('dark-mode');
      themeCheckbox.checked = true;
    } else {
      document.body.classList.remove('dark-mode');
      themeCheckbox.checked = false;
    }
  }

  // Carregar tema salvo
  const savedTheme = localStorage.getItem('coIA-01-theme');
  if (savedTheme === 'dark') {
    applyTheme(true);
  } else {
    applyTheme(false);
  }

  // Listener do toggle
  if (themeCheckbox) {
    themeCheckbox.addEventListener('change', function() {
      if (this.checked) {
        applyTheme(true);
        localStorage.setItem('coIA-01-theme', 'dark');
      } else {
        applyTheme(false);
        localStorage.setItem('coIA-01-theme', 'light');
      }
    });
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