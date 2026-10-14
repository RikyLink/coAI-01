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
      id: "claude",
      parentId: "select-ai",
      title: "Claude",
      contexts: ["action"]
    });

    // ----- MENU NAS PÁGINAS (SEM SELEÇÃO) -----
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
      id: "page-claude",
      parentId: "page-select-ai",
      title: "Claude",
      contexts: ["page"]
    });

    // ----- MENU DE SELEÇÃO DE TEXTO -----
    chrome.contextMenus.create({
      id: "selection-ai",
      title: "🧠 Enviar para a IA...",
      contexts: ["selection"]
    });

    chrome.contextMenus.create({
      id: "selection-ai-studio",
      parentId: "selection-ai",
      title: "Google AI Studio",
      contexts: ["selection"]
    });

    chrome.contextMenus.create({
      id: "selection-gemini",
      parentId: "selection-ai",
      title: "Gemini",
      contexts: ["selection"]
    });

    chrome.contextMenus.create({
      id: "selection-deepseek",
      parentId: "selection-ai",
      title: "DeepSeek",
      contexts: ["selection"]
    });

    chrome.contextMenus.create({
      id: "selection-chatgpt",
      parentId: "selection-ai",
      title: "ChatGPT",
      contexts: ["selection"]
    });

    chrome.contextMenus.create({
      id: "selection-claude",
      parentId: "selection-ai",
      title: "Claude",
      contexts: ["selection"]
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
    "claude": "https://claude.ai/new",
    "page-ai-studio": "https://aistudio.google.com/prompts/new_chat?model=gemini-3-flash-preview",
    "page-gemini": "https://gemini.google.com/app",
    "page-deepseek": "https://chat.deepseek.com/",
    "page-chatgpt": "https://chatgpt.com/",
    "page-claude": "https://claude.ai/new",
    "selection-ai-studio": "https://aistudio.google.com/prompts/new_chat?model=gemini-3-flash-preview",
    "selection-gemini": "https://gemini.google.com/app",
    "selection-deepseek": "https://chat.deepseek.com/",
    "selection-chatgpt": "https://chatgpt.com/",
    "selection-claude": "https://claude.ai/new"
  };

  if (urls[info.menuItemId]) {
    const isSelection = info.menuItemId.startsWith("selection-");
    const isPage = info.menuItemId.startsWith("page-");

    // Copia o texto para a área de transferência usando um script injetado na página atual
    if (isSelection && info.selectionText && tab && tab.id) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (text) => {
          if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).catch(err => console.error("Clipboard API error:", err));
          } else {
            // Fallback usando execCommand se necessário
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
              document.execCommand('copy');
            } catch (error) {
              console.error('Falha ao copiar usando execCommand', error);
            }
            textArea.remove();
          }
        },
        args: [info.selectionText]
      });
      // Salva um alerta no storage para sinalizar ao sidepanel
      chrome.storage.local.set({ copiedTextAlert: Date.now() });
    }

    // Open the side panel immediately to preserve the user gesture
    if ((isPage || isSelection) && tab && tab.id) {
      chrome.sidePanel.open({ tabId: tab.id }).catch(err => {
        console.error("Erro ao abrir painel lateral:", err);
      });
    } else {
      // For action (icon) context, we need the active tab's id
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          chrome.sidePanel.open({ tabId: tabs[0].id }).catch(err => {
            console.error("Erro ao abrir painel lateral:", err);
          });
        }
      });
    }
    // Then update the storage (the side panel will pick up the URL change)
    chrome.storage.local.set({ selectedAI: urls[info.menuItemId] });
  }
});