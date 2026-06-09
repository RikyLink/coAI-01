// Configura o painel lateral para abrir ao clicar no ícone da extensão
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Cria os menus de contexto (tanto no ícone quanto nas páginas)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    // ----- MENU NO ÍCONE DA EXTENSÃO -----
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

    chrome.contextMenus.create({
      id: "copilot",
      parentId: "select-ai",
      title: "Copilot",
      contexts: ["action"]
    });

    // ----- MENU NAS PÁGINAS -----
    chrome.contextMenus.create({
      id: "page-select-ai",
      title: "🤖 Abrir coIA-01 com IA",
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

    chrome.contextMenus.create({
      id: "page-copilot",
      parentId: "page-select-ai",
      title: "Copilot",
      contexts: ["page"]
    });
  });
});

// Escuta cliques nos menus de contexto
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const urls = {
    "ai-studio": "https://aistudio.google.com/prompts/new_chat?model=gemini-3-flash-preview",
    "gemini": "https://gemini.google.com/app",
    "deepseek": "https://chat.deepseek.com/",
    "chatgpt": "https://chatgpt.com/",
    "copilot": "https://copilot.microsoft.com/",
    "page-ai-studio": "https://aistudio.google.com/prompts/new_chat?model=gemini-3-flash-preview",
    "page-gemini": "https://gemini.google.com/app",
    "page-deepseek": "https://chat.deepseek.com/",
    "page-chatgpt": "https://chatgpt.com/",
    "page-copilot": "https://copilot.microsoft.com/"
  };

  if (urls[info.menuItemId]) {
    // Open the side panel immediately to preserve the user gesture
    if (info.menuItemId.startsWith("page-") && tab && tab.id) {
      chrome.sidePanel.open({ tabId: tab.id }).catch(err => {
        console.error("Erro ao abrir painel lateral:", err);
      });
    }
    // Then update the storage (the side panel will pick up the URL change)
    chrome.storage.local.set({ selectedAI: urls[info.menuItemId] });
  }
});