<h1 align="center">coIA-01</h1>

<p align="center">
  <a href="https://github.com/RikyLink/coAI-01/releases">
    <img src="https://shieldcn.dev/github/RikyLink/coAI-01/release.svg?color=F0ECE5" alt="Release">
  </a>
  <a href="https://github.com/RikyLink/coAI-01/commits">
    <img src="https://shieldcn.dev/github/RikyLink/coAI-01/last-commit.svg?color=F0ECE5" alt="Last Commit">
  </a>
  <img src="https://shieldcn.dev/flag/Br.svg?color=F0ECE5" alt="Brazil">
</p>

---

## ✨ Funcionalidades

- ⚡ **Acesso instantâneo** – clique no ícone, o AI Studio aparece na lateral.
- 🛠️ **Bypass de segurança** – uso de `declarativeNetRequest` para quebrar `X-Frame-Options`.
- 🎨 **Layout otimizado** – CSS que faz o iframe ocupar 100% da área.

---

## 🧩 Instalação

1. Baixe os arquivos para uma pasta local.
2. Acesse `chrome://extensions/` e ative o **Modo do desenvolvedor**.
3. Clique em **"Carregar sem compactação"** e selecione a pasta.
4. Fixe a extensão na barra e clique no ícone da extensão.

---

## 📁 Estrutura

- `manifest.json` – núcleo da extensão (V3)
- `background.js` – gerencia o Side Panel
- `sidepanel.html/css` – contêiner do AI Studio
- `rules.json` – regras de rede para liberar o iframe

---

## 🤖 Prompt (para tutor objetivo)

>Atue como um tutor objetivo. Para cada questão enviada, siga rigorosamente este formato: Resposta Direta: Comece com a alternativa correta (ex: (a) Resposta). Justificativa: Embaixo, forneça uma explicação de no máximo 3 frases explicando o porquê dessa resposta ser a correta e, se necessário, por que as outras estão erradas. Seja direto e use negrito nos termos principais.

---

## ⚖️ Licença

**MIT** – use, modifique e compartilhe à vontade.
