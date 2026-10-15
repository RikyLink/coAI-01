const iframe = document.getElementById('ai-frame');
const overlay = document.getElementById('status-overlay');
const hub = document.getElementById('hub');
const loadingScreen = document.getElementById('loading-screen');
const backBtn = document.getElementById('back-to-hub');
const defaultUrl = "https://aistudio.google.com/prompts/new_chat?model=gemini-3-flash-preview";

const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const themeOptions = document.querySelectorAll('.theme-option');

// Elementos do modo edição de IA's
const hubGrid = document.querySelector('.hub-grid');
const editAisBtn = document.getElementById('edit-ais-btn');
const editBar = document.getElementById('edit-bar');
const confirmEditBtn = document.getElementById('confirm-edit-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

let editMode = false;
let originalOrder = [];
let draggedCard = null;

const CARD_ORDER_KEY = 'coIA-01-card-order';

// Reseta visualmente o painel de configurações (fechado + sem estado "ativo")
function resetSettingsUI() {
  if (settingsPanel) settingsPanel.classList.remove('open');
  if (settingsBtn) settingsBtn.classList.remove('active');
}

const names = {
  "https://aistudio.google.com/prompts/new_chat?model=gemini-3-flash-preview": "AI Studio",
  "https://gemini.google.com/app": "Gemini",
  "https://chat.deepseek.com/": "DeepSeek",
  "https://chatgpt.com/": "ChatGPT",
  "https://claude.ai/new": "Claude"
};

const themeSwitchWrapper = document.querySelector('.theme-switch-wrapper');
const skeletonScreen = document.getElementById('skeleton-screen');

// ---- LAYOUT DO HUB (default / bento / minimalist) ----
const LAYOUT_KEY = 'coIA-01-hub-layout';
const layoutOptions = document.querySelectorAll('.layout-option');

function applyHubLayout(layout) {
  const valid = layout || 'default';
  if (valid === 'default') {
    document.body.removeAttribute('data-hub-layout');
  } else {
    document.body.setAttribute('data-hub-layout', valid);
  }
  try { localStorage.setItem(LAYOUT_KEY, valid); } catch (_) {}
  layoutOptions.forEach(opt => {
    opt.classList.toggle('active', opt.dataset.layout === valid);
  });
}

// Aplica o layout salvo ANTES de qualquer renderização visual
applyHubLayout(localStorage.getItem(LAYOUT_KEY) || 'default');

// Mostra o skeleton por um tempo e resolve a Promise
function showSkeleton(duration = 800) {
  return new Promise((resolve) => {
    skeletonScreen.classList.add('active');
    setTimeout(() => {
      skeletonScreen.classList.remove('active');
      resolve();
    }, duration);
  });
}

function showFeedback(url) {
  const name = names[url] || "Interface";
  overlay.textContent = `SYNC: ${name}`;
  overlay.classList.add('active');
  setTimeout(() => overlay.classList.remove('active'), 2000);
}

function showCopiedFeedback() {
  overlay.textContent = `TEXTO COPIADO! COLE (CTRL+V)`;
  overlay.classList.add('active');
  setTimeout(() => overlay.classList.remove('active'), 3500);
}

function showToast(text, duration = 2200) {
  overlay.textContent = text;
  overlay.classList.add('active');
  setTimeout(() => overlay.classList.remove('active'), duration);
}

function showHub() {
  hub.style.display = 'flex';
  themeSwitchWrapper.style.display = 'block';
  if (settingsBtn) settingsBtn.style.display = 'flex';
  resetSettingsUI();
  loadingScreen.classList.remove('active');
  iframe.classList.remove('active');
  iframe.src = 'about:blank';
  backBtn.classList.remove('visible');
}

function loadAI(url) {
  hub.style.display = 'none';
  themeSwitchWrapper.style.display = 'none';
  if (settingsBtn) settingsBtn.style.display = 'none';
  resetSettingsUI();
  // Oculta o iframe e exibe a tela de loading
  iframe.classList.remove('active');
  loadingScreen.classList.add('active');

  // Quando o iframe terminar de carregar, remove o loading
  iframe.addEventListener('load', function onLoad() {
    if (iframe.src !== 'about:blank') {
      loadingScreen.classList.remove('active');
      iframe.classList.add('active');
    }
    iframe.removeEventListener('load', onLoad);
  });

  iframe.src = url;
  backBtn.classList.add('visible');
}

// ---- ORDEM DOS CARDS (reordenação) ----
function applyCardOrder() {
  if (!hubGrid) return;
  let saved = [];
  try {
    saved = JSON.parse(localStorage.getItem(CARD_ORDER_KEY) || '[]');
  } catch (_) {
    saved = [];
  }
  if (!Array.isArray(saved) || saved.length === 0) return;

  const cards = Array.from(hubGrid.querySelectorAll('.hub-card'));
  const map = new Map(cards.map(c => [c.dataset.url, c]));

  // Reinsere na ordem salva
  saved.forEach(url => {
    const card = map.get(url);
    if (card) {
      hubGrid.appendChild(card);
      map.delete(url);
    }
  });

  // Cards que não estavam na ordem salva vão para o final
  map.forEach(card => hubGrid.appendChild(card));
}

// Inicialização: esconde hub e mostra skeleton primeiro
hub.style.display = 'none';
themeSwitchWrapper.style.display = 'none';
if (settingsBtn) settingsBtn.style.display = 'none';
resetSettingsUI();

// Aplica a ordem salva ANTES de exibir qualquer coisa
applyCardOrder();

showSkeleton(850).then(() => {
  chrome.storage.local.get(['selectedAI'], (result) => {
    if (result.selectedAI && result.selectedAI !== 'hub') {
      loadAI(result.selectedAI);
    } else {
      showHub();
    }
  });
});

// Clique nos cards do hub (ignorado no modo edição)
document.querySelectorAll('.hub-card').forEach(card => {
  card.addEventListener('click', () => {
    if (editMode) return;
    const url = card.dataset.url;
    chrome.storage.local.set({ selectedAI: url }, () => {
      loadAI(url);
      showFeedback(url);
    });
  });
});

// Botão voltar ao hub
backBtn.addEventListener('click', () => {
  chrome.storage.local.set({ selectedAI: 'hub' }, () => {
    showHub();
  });
});

// ---- MODO EDIÇÃO DE IA's (drag & drop) ----
function enterEditMode() {
  if (!hubGrid) return;
  editMode = true;
  // Guarda a ordem atual para poder cancelar
  originalOrder = Array.from(hubGrid.querySelectorAll('.hub-card')).map(c => c.dataset.url);

  // Garante que estamos no hub e sem configs abertas
  showHub();

  hubGrid.classList.add('edit-mode');
  editBar.classList.add('visible');
  hubGrid.querySelectorAll('.hub-card').forEach(c => {
    c.setAttribute('draggable', 'true');
  });

  showToast('MODO EDIÇÃO ATIVO', 1800);
}

function exitEditMode(save) {
  if (!hubGrid) return;
  editMode = false;
  hubGrid.classList.remove('edit-mode');
  editBar.classList.remove('visible');
  hubGrid.querySelectorAll('.hub-card').forEach(c => {
    c.removeAttribute('draggable');
    c.classList.remove('dragging');
  });
  draggedCard = null;

  if (save) {
    const newOrder = Array.from(hubGrid.querySelectorAll('.hub-card')).map(c => c.dataset.url);
    try {
      localStorage.setItem(CARD_ORDER_KEY, JSON.stringify(newOrder));
    } catch (_) {}
    showToast('ORDEM SALVA!', 1800);
  } else {
    // Restaura a ordem original
    const cards = Array.from(hubGrid.querySelectorAll('.hub-card'));
    const map = new Map(cards.map(c => [c.dataset.url, c]));
    originalOrder.forEach(url => {
      const card = map.get(url);
      if (card) hubGrid.appendChild(card);
    });
    showToast('EDIÇÃO CANCELADA', 1600);
  }
}

if (editAisBtn) {
  editAisBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    enterEditMode();
  });
}

if (confirmEditBtn) {
  confirmEditBtn.addEventListener('click', () => exitEditMode(true));
}

if (cancelEditBtn) {
  cancelEditBtn.addEventListener('click', () => exitEditMode(false));
}

// -- Drag & Drop handlers --
if (hubGrid) {
  hubGrid.addEventListener('dragstart', (e) => {
    if (!editMode) return;
    const card = e.target.closest('.hub-card');
    if (!card) return;
    draggedCard = card;
    card.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    // Firefox exige setData
    try { e.dataTransfer.setData('text/plain', card.dataset.url || ''); } catch (_) {}
  });

  hubGrid.addEventListener('dragend', () => {
    if (draggedCard) draggedCard.classList.remove('dragging');
    draggedCard = null;
  });

  hubGrid.addEventListener('dragover', (e) => {
    if (!editMode || !draggedCard) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const target = e.target.closest('.hub-card');
    if (!target || target === draggedCard) return;

    const rect = target.getBoundingClientRect();
    const before = e.clientY < rect.top + rect.height / 2;

    if (before) {
      if (target.previousElementSibling !== draggedCard) {
        hubGrid.insertBefore(draggedCard, target);
      }
    } else {
      if (target.nextElementSibling !== draggedCard) {
        hubGrid.insertBefore(draggedCard, target.nextSibling);
      }
    }
  });

  hubGrid.addEventListener('drop', (e) => {
    if (!editMode) return;
    e.preventDefault();
  });
}

// Click na assinatura do github
document.querySelector('.bottom-left-signature').addEventListener('click', () => {
  window.open('https://github.com/RikyLink', '_blank');
});

// Escuta mudanças no storage (ex: menu de contexto)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local') {
    if (changes.selectedAI) {
      const newVal = changes.selectedAI.newValue;
      if (newVal === 'hub') {
        showHub();
      } else if (newVal) {
        loadAI(newVal);
        // Exibe feedback de "SYNC" somente se não houver um aviso de "TEXTO COPIADO!" concorrendo
        if (!changes.copiedTextAlert) {
          showFeedback(newVal);
        }
      }
    }

    if (changes.copiedTextAlert) {
      // Delay pequeno para garantir que o painel e animações abram antes de piscar a mensagem
      setTimeout(() => {
        showCopiedFeedback();
      }, 500);
    }
  }
});

// ---- THEME SWITCH (modo claro/escuro) ----
const themeCheckbox = document.querySelector('.theme-switch__checkbox');

function applyTheme(isDark) {
  if (isDark) {
    document.body.classList.add('dark-mode');
    if (themeCheckbox) themeCheckbox.checked = true;
  } else {
    document.body.classList.remove('dark-mode');
    if (themeCheckbox) themeCheckbox.checked = false;
  }
}

// Carregar tema salvo
const savedTheme = localStorage.getItem('coIA-01-theme');
if (savedTheme === 'dark') {
  applyTheme(true);
} else {
  applyTheme(false);
}

// Listener do toggle — transição de gradiente a partir do canto superior direito
const themeTransition = document.getElementById('theme-transition');

// Trava anti-spam: bloqueia novos cliques enquanto a transição roda
let themeLocked = false;
const THEME_LOCK_MS = 800; // duração total da animação + margem

if (themeCheckbox) {
  themeCheckbox.addEventListener('change', function () {
    // Se estiver travado, reverte o estado visual do checkbox e ignora
    if (themeLocked) {
      this.checked = !this.checked;
      return;
    }

    // Ativa a trava imediatamente
    themeLocked = true;

    const isDark = this.checked;

    // 1. Prepara o overlay com a cor do tema de destino
    themeTransition.classList.remove('to-dark', 'to-light', 'active');
    // Force reflow para reiniciar a animação
    void themeTransition.offsetWidth;
    themeTransition.classList.add(isDark ? 'to-dark' : 'to-light', 'active');

    // 2. Troca o tema quando o overlay já cobriu a tela
    setTimeout(() => {
      applyTheme(isDark);
      localStorage.setItem('coIA-01-theme', isDark ? 'dark' : 'light');
    }, 380);

    // 3. Limpa o estado do overlay ao final
    setTimeout(() => {
      themeTransition.classList.remove('active');
    }, 750);

    // 4. Libera a trava após a animação terminar
    setTimeout(() => {
      themeLocked = false;
    }, THEME_LOCK_MS);
  });
}

// ---- SELETOR DE PRESETS DE TEMA (6 paletas × claro/escuro) ----
function applyThemePreset(presetName) {
  if (!presetName || presetName === 'classic') {
    document.body.removeAttribute('data-theme');
  } else {
    document.body.setAttribute('data-theme', presetName);
  }
  localStorage.setItem('coIA-01-theme-preset', presetName);

  // Atualiza o estado ativo dos botões
  themeOptions.forEach(opt => {
    opt.classList.toggle('active', opt.dataset.theme === presetName);
  });
}

// Carrega o preset salvo (padrão: classic)
const savedPreset = localStorage.getItem('coIA-01-theme-preset') || 'classic';
applyThemePreset(savedPreset);

// Toggle do painel
if (settingsBtn && settingsPanel) {
  settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = settingsPanel.classList.toggle('open');
    settingsBtn.classList.toggle('active', isOpen);
  });

  // Clique nas opções de tema
  themeOptions.forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      applyThemePreset(opt.dataset.theme);
    });
  });

  // Clique nas opções de layout
  layoutOptions.forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      applyHubLayout(opt.dataset.layout);
      // Pequeno feedback ao trocar de layout
      showToast(`LAYOUT: ${opt.querySelector('.layout-name').textContent.toUpperCase()}`, 1400);
    });
  });

  // Fecha ao clicar fora
  document.addEventListener('click', (e) => {
    if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
      settingsPanel.classList.remove('open');
      settingsBtn.classList.remove('active');
    }
  });

  // Fecha com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && settingsPanel.classList.contains('open')) {
      settingsPanel.classList.remove('open');
      settingsBtn.classList.remove('active');
    }
  });
}
