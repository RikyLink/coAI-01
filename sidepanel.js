const iframe = document.getElementById('ai-frame');
const overlay = document.getElementById('status-overlay');
const hub = document.getElementById('hub');
const loadingScreen = document.getElementById('loading-screen');
const backBtn = document.getElementById('back-to-hub');
const defaultUrl = "https://aistudio.google.com/prompts/new_chat?model=gemini-3-flash-preview";

const names = {
  "https://aistudio.google.com/prompts/new_chat?model=gemini-3-flash-preview": "AI Studio",
  "https://gemini.google.com/app": "Gemini",
  "https://chat.deepseek.com/": "DeepSeek",
  "https://chatgpt.com/": "ChatGPT",
  "https://claude.ai/new": "Claude"
};

const themeSwitchWrapper = document.querySelector('.theme-switch-wrapper');

function showFeedback(url) {
  const name = names[url] || "Interface";
  overlay.textContent = `SYNC: ${name}`;
  overlay.classList.add('active');
  setTimeout(() => overlay.classList.remove('active'), 2000);
}

function showHub() {
  hub.style.display = 'flex';
  themeSwitchWrapper.style.display = 'block';
  loadingScreen.classList.remove('active');
  iframe.classList.remove('active');
  iframe.src = 'about:blank';
  backBtn.classList.remove('visible');
}

function loadAI(url) {
  hub.style.display = 'none';
  themeSwitchWrapper.style.display = 'none';
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

// Inicialização: verifica se há IA salva
chrome.storage.local.get(['selectedAI'], (result) => {
  if (result.selectedAI && result.selectedAI !== 'hub') {
    loadAI(result.selectedAI);
  } else {
    showHub();
  }
});

// Clique nos cards do hub
document.querySelectorAll('.hub-card').forEach(card => {
  card.addEventListener('click', () => {
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

// Click na assinatura do github
document.querySelector('.bottom-left-signature').addEventListener('click', () => {
  window.open('https://github.com/RikyLink', '_blank');
});

// Escuta mudanças no storage (ex: menu de contexto)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.selectedAI) {
    const newVal = changes.selectedAI.newValue;
    if (newVal === 'hub') {
      showHub();
    } else if (newVal) {
      loadAI(newVal);
      showFeedback(newVal);
    }
  }
});
// ---- THEME SWITCH ----
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
