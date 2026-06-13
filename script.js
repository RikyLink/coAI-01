(function() {
  'use strict';

  const statusOverlay = document.getElementById('status-overlay');
  const cards = document.querySelectorAll('.hub-card');
  const themeCheckbox = document.querySelector('.theme-switch__checkbox');
  const navLinks = document.querySelectorAll('.nav-link');

  // Elementos do download dinâmico
  const downloadCard = document.querySelector('.hub-card[data-download]');
  const versionDescSpan = document.getElementById('version-desc');
  const versionBadge = document.getElementById('version-badge');

  // Controle robusto do status overlay (evita race condition nos timeouts)
  let statusTimeout = null;

  function showStatus(text, duration = 2500) {
    // Limpa qualquer timeout pendente antes de criar um novo
    if (statusTimeout) {
      clearTimeout(statusTimeout);
      statusTimeout = null;
    }
    statusOverlay.textContent = text;
    statusOverlay.classList.add('active');
    // Auto-esconde após a duração especificada
    statusTimeout = setTimeout(() => {
      hideStatus();
    }, duration);
  }

  function hideStatus() {
    if (statusTimeout) {
      clearTimeout(statusTimeout);
      statusTimeout = null;
    }
    statusOverlay.classList.remove('active');
  }

  // --- BUSCA AUTOMÁTICA DA ÚLTIMA VERSÃO NO GITHUB ---
  async function updateDownloadUrl() {
    if (!downloadCard) return;

    // Mostra estado de carregamento
    if (versionDescSpan) versionDescSpan.textContent = 'Buscando versão...';
    if (versionBadge) versionBadge.textContent = 'v...';

    // Adiciona classe de loading para feedback visual
    downloadCard.classList.add('loading');

    try {
      const response = await fetch('https://api.github.com/repos/RikyLink/coAI-01/releases/latest');
      if (!response.ok) throw new Error('Falha ao buscar release');
      const release = await response.json();
      const tagName = release.tag_name;
      const assets = release.assets;

      let assetUrl = null;
      if (assets && assets.length) {
        const sevenZipAsset = assets.find(asset => asset.name.endsWith('.7z'));
        if (sevenZipAsset) assetUrl = sevenZipAsset.browser_download_url;
        else assetUrl = assets[0].browser_download_url;
      }

      if (assetUrl) {
        downloadCard.setAttribute('data-url', assetUrl);
        if (versionBadge) versionBadge.textContent = tagName || 'latest';
        if (versionDescSpan) versionDescSpan.textContent = tagName ? 'coAI-01 ' + tagName : 'coAI-01 Latest';
      } else {
        // Mantém o fallback já definido no HTML
        if (versionDescSpan) versionDescSpan.textContent = tagName ? 'coAI-01 ' + tagName : 'coAI-01 Latest (fallback)';
      }
      if (versionBadge) versionBadge.textContent = tagName || 'latest';
    } catch (error) {
      console.warn('Erro ao obter release do GitHub:', error);
      // Mantém o fallback do HTML, apenas atualiza o texto
      if (versionDescSpan) versionDescSpan.textContent = 'coAI-01 Latest';
      if (versionBadge) versionBadge.textContent = 'latest';
    } finally {
      downloadCard.classList.remove('loading');
    }
  }

  // --- NAVEGAÇÃO SUAVE + LINK ATIVO ---
  function setActiveLink(activeHref) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === activeHref) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
          setActiveLink(targetId);
        }
      }
    });
  });

  // Atualiza link ativo ao fazer scroll manual
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const sections = ['#hub', '#install', '#about'];
      let current = '#hub';
      sections.forEach(id => {
        const el = document.querySelector(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 3) {
            current = id;
          }
        }
      });
      setActiveLink(current);
    }, 80);
  });

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
        const name = card.getAttribute('data-name') || 'coAI-01';
        if (url) {
          showStatus('Iniciando download de ' + name);
          window.open(url, '_blank');
        } else {
          showStatus('Aguardando informações do servidor...');
        }
      }
    });
  });

  // Inicializa link ativo baseado no hash da URL
  const initialHash = window.location.hash || '#hub';
  setActiveLink(initialHash);
  if (initialHash !== '#hub') {
    setTimeout(() => {
      const targetEl = document.querySelector(initialHash);
      if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  // Buscar a URL da última release assim que a página carregar
  updateDownloadUrl();
})();
