const iframe = document.getElementById('ai-frame');
const overlay = document.getElementById('status-overlay');
const hub = document.getElementById('hub');
const backBtn = document.getElementById('back-to-hub');
const defaultUrl = "https://aistudio.google.com/prompts/new_chat?model=gemini-3-flash-preview";

const names = {
  "https://aistudio.google.com/prompts/new_chat?model=gemini-3-flash-preview": "AI Studio",
  "https://gemini.google.com/app": "Gemini",
  "https://chat.deepseek.com/": "DeepSeek",
  "https://chatgpt.com/": "ChatGPT"
};

function showFeedback(url) {
  const name = names[url] || "Interface";
  overlay.textContent = `SYNC: ${name}`;
  overlay.classList.add('active');
  setTimeout(() => overlay.classList.remove('active'), 2000);
}

function showHub() {
  hub.style.display = 'flex';
  iframe.classList.remove('active');
  iframe.src = 'about:blank';
  backBtn.classList.remove('visible');
}

function loadAI(url) {
  hub.style.display = 'none';
  iframe.src = url;
  iframe.classList.add('active');
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