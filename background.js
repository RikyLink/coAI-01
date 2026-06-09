// Configura o painel lateral para abrir ao clicar no ícone da extensão
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Cria os menus de contexto (tanto no ícone quanto nas páginas)
chrome.runtime.onInstalled.addListener(() => {
  // Remove todos os menus antigos para evitar duplicação
  chrome.contextMenus.removeAll(() => {
    // ----- MENU NO ÍCONE DA EXTENSÃO (clique direito no ícone) -----
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

    chrome.contextMenus.create({
      id: "chatgpt",
      parentId: "select-ai",
      title: "ChatGPT",
      contexts: ["action"]
    });

    // ----- MENU NAS PÁGINAS (clique direito em qualquer site) -----
    chrome.contextMenus.create({
      id: "page-select-ai",
      title: "🤖 Abrir Colatron com IA",
      contexts: ["page"]
    });

    chrome.contextMenus.create({
      id: "page-ai-studio",
      parentId: "page-select-ai",
      title: "Google AI Studio",
      contexts: ["page"]
    });

    chrome.contextMenus.create({
      id: "page-gemini",
      parentId: "page-select-ai",
      title: "Gemini",
      contexts: ["page"]
    });

    chrome.contextMenus.create({
      id: "page-deepseek",
      parentId: "page-select-ai",
      title: "DeepSeek",
      contexts: ["page"]
    });

    chrome.contextMenus.create({
      id: "page-chatgpt",
      parentId: "page-select-ai",
      title: "ChatGPT",
      contexts: ["page"]
    });
  });
});

// Escuta cliques nos menus de contexto
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const urls = {
    // Menus do ícone da extensão
    "ai-studio": "https://aistudio.google.com/prompts/new_chat?model=gemini-3-flash-preview",
    "gemini": "https://gemini.google.com/app",
    "deepseek": "https://chat.deepseek.com/",
    "chatgpt": "https://chatgpt.com/",
    // Menus das páginas
    "page-ai-studio": "https://aistudio.google.com/prompts/new_chat?model=gemini-3-flash-preview",
    "page-gemini": "https://gemini.google.com/app",
    "page-deepseek": "https://chat.deepseek.com/",
    "page-chatgpt": "https://chatgpt.com/"
  };

  // Verifica se o clique foi em uma das opções de IA
  if (urls[info.menuItemId]) {
    // Salva a IA escolhida no storage
    chrome.storage.local.set({ selectedAI: urls[info.menuItemId] }, () => {
      // Se o clique veio do menu da página, abre o painel lateral automaticamente
      if (info.menuItemId.startsWith("page-") && tab && tab.id) {
        chrome.sidePanel.open({ tabId: tab.id }).catch(err => {
          console.error("Erro ao abrir painel lateral:", err);
        });
      }
    });
  }
});