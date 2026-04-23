const iframe = document.getElementById('ai-frame');
const defaultUrl = "https://aistudio.google.com/prompts/new_chat?model=gemini-3-flash-preview";

// Carrega a IA salva ou a padrão ao abrir
chrome.storage.local.get(['selectedAI'], (result) => {
  iframe.src = result.selectedAI || defaultUrl;
});

// Escuta mudanças no storage para trocar a IA em tempo real
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.selectedAI) {
    iframe.src = changes.selectedAI.newValue;
  }
});