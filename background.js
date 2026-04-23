// Permite que o painel lateral abra ao clicar no ícone da extensão
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
// Cria o menu de contexto ao instalar
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "open-prompt-box",
    title: "📋 Copiar Prompt do Tutor",
    contexts: ["action"]
  });

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
  if (info.menuItemId === "open-prompt-box") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: showPromptUI
    });
  } else if (["ai-studio", "gemini", "deepseek"].includes(info.menuItemId)) {
    const urls = {
      "ai-studio": "https://aistudio.google.com/prompts/new_chat?model=gemini-3-flash-preview",
      "gemini": "https://gemini.google.com/app",
      "deepseek": "https://chat.deepseek.com/"
    };
    chrome.storage.local.set({ selectedAI: urls[info.menuItemId] });
  }
});

function showPromptUI() {
  const id = 'colatron-prompt-overlay';
  if (document.getElementById(id)) return;

  const promptText = `Atue como um tutor objetivo. Para cada questão enviada, siga rigorosamente este formato:
Resposta Direta: Comece com a alternativa correta (ex: (a) Resposta).
Justificativa: Embaixo, forneça uma explicação de no máximo 3 frases explicando o porquê dessa resposta ser a correta e, se necessário, por que as outras estão erradas.
Seja direto e use negrito nos termos principais.`;

  const container = document.createElement('div');
  container.id = id;
  Object.assign(container.style, {
    position: 'fixed', bottom: '20px', right: '20px', width: '320px',
    backgroundColor: '#1e1e1e', color: '#fff', border: '2px solid #713A9B',
    borderRadius: '12px', padding: '16px', zIndex: '9999999',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)', fontFamily: 'sans-serif', fontSize: '13px'
  });

  const header = document.createElement('div');
  header.innerText = '🟣 COLATRON PROMPT';
  Object.assign(header.style, { fontWeight: 'bold', marginBottom: '10px', color: '#00FF41', borderBottom: '1px solid #333', paddingBottom: '8px' });

  const body = document.createElement('div');
  body.innerText = promptText;
  Object.assign(body.style, { marginBottom: '16px', whiteSpace: 'pre-wrap', opacity: '0.9' });

  const footer = document.createElement('div');
  footer.style.display = 'flex';
  footer.style.gap = '8px';

  const copyBtn = document.createElement('button');
  copyBtn.innerText = 'Copiar';
  Object.assign(copyBtn.style, { flex: '1', padding: '8px', border: 'none', borderRadius: '6px', backgroundColor: '#713A9B', color: '#fff', cursor: 'pointer', fontWeight: 'bold' });

  copyBtn.onclick = () => {
    navigator.clipboard.writeText(promptText);
    copyBtn.innerText = '✅ Copiado!';
    copyBtn.style.backgroundColor = '#00FF41';
    copyBtn.style.color = '#000';
    setTimeout(() => container.remove(), 1500);
  };

  const closeBtn = document.createElement('button');
  closeBtn.innerText = 'Fechar';
  Object.assign(closeBtn.style, { padding: '8px 12px', border: 'none', borderRadius: '6px', backgroundColor: '#333', color: '#ccc', cursor: 'pointer' });
  closeBtn.onclick = () => container.remove();

  footer.appendChild(copyBtn);
  footer.appendChild(closeBtn);
  [header, body, footer].forEach(el => container.appendChild(el));
  document.body.appendChild(container);
}
