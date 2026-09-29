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
const skeletonScreen = document.getElementById('skeleton-screen');

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

// Inicialização: esconde hub e mostra skeleton primeiro
hub.style.display = 'none';
themeSwitchWrapper.style.display = 'none';

showSkeleton(850).then(() => {
  chrome.storage.local.get(['selectedAI'], (result) => {
    if (result.selectedAI && result.selectedAI !== 'hub') {
      loadAI(result.selectedAI);
    } else {
      showHub();
    }
  });
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
