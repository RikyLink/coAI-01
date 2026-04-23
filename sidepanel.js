const iframe = document.getElementById('ai-frame');
const overlay = document.getElementById('status-overlay');
const defaultUrl = "https://aistudio.google.com/prompts/new_chat?model=gemini-3-flash-preview";

const names = {
  "https://aistudio.google.com/prompts/new_chat?model=gemini-3-flash-preview": "AI Studio",
  "https://gemini.google.com/app": "Gemini",
  "https://chat.deepseek.com/": "DeepSeek"
};

function showFeedback(url) {
  const name = names[url] || "Interface";
  overlay.textContent = `SYNC: ${name}`;
  overlay.classList.add('active');

  // Remove o feedback após 2 segundos
  setTimeout(() => {
    overlay.classList.remove('active');
  }, 2000);
}

// Carrega a IA salva ou a padrão ao abrir
chrome.storage.local.get(['selectedAI'], (result) => {
  iframe.src = result.selectedAI || defaultUrl;
});

// Escuta mudanças no storage para trocar a IA em tempo real
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.selectedAI) {
    iframe.src = changes.selectedAI.newValue;
    showFeedback(changes.selectedAI.newValue);
  }
});