// Permite que o painel lateral abra ao clicar no ícone da extensão
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
// Cria o menu de contexto ao instalar
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "select-ai",
    title: "🤖 Selecionar Interface IA",
    contexts: ["action"]
  });

  chrome.contextMenus.create({
    id: "ai-studio",
    parentId: "select-ai",
    title: "Google AI Studio",
    contexts: ["action"]
  });

  chrome.contextMenus.create({
    id: "gemini",
    parentId: "select-ai",
    title: "Gemini",
    contexts: ["action"]
  });

  chrome.contextMenus.create({
    id: "deepseek",
    parentId: "select-ai",
    title: "DeepSeek",
    contexts: ["action"]
  });
});

// Escuta o clique no menu de contexto
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (["ai-studio", "gemini", "deepseek"].includes(info.menuItemId)) {
    const urls = {
      "ai-studio": "https://aistudio.google.com/prompts/new_chat?model=gemini-3-flash-preview",
      "gemini": "https://gemini.google.com/app",
      "deepseek": "https://chat.deepseek.com/"
    };
    chrome.storage.local.set({ selectedAI: urls[info.menuItemId] });
  }
});
