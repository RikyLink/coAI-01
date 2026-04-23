# 🟣 COLATRON 3000 🟢

<p align="center">
  <img src="https://img.shields.io/badge/VERSION-1.0-blueviolet?style=for-the-badge&logo=googlechrome&logoColor=white" />
  <img src="https://img.shields.io/badge/THEME-EVA--01-713A9B?style=for-the-badge" />
  <img src="https://img.shields.io/badge/LICENSE-MIT-00FF41?style=for-the-badge&labelColor=black" />
</p>

> **STATUS:** SINCRONIZAÇÃO 100% COMPLETA. O Google AI Studio agora reside diretamente no seu Chrome Side Panel.

**Colatron 3000** é uma extensão minimalista e potente projetada para integrar o **Google AI Studio** diretamente na barra lateral do seu navegador. Esqueça o "Alt+Tab" constante; tenha o poder do Gemini sempre à vista enquanto navega.

---

## 🧬 Funcionalidades Core

- ⚡ **Acesso Instantâneo:** Clique no ícone e a interface do AI Studio surge na lateral.
- 🛠️ **Bypass de Segurança:** Utiliza `declarativeNetRequest` para contornar restrições de `X-Frame-Options`, permitindo que o AI Studio rode suavemente dentro de um iframe.
- 🎨 **Layout Otimizado:** CSS customizado para garantir que o frame ocupe 100% da área disponível.

---

## 🛠️ Instalação (Protocolo de Ativação)

Siga os passos abaixo para inicializar o Colatron no seu sistema:

1.  **Download do Código:**
    - Baixe os arquivos deste repositório em uma pasta local no seu computador (ex: `C:\Users\Nome\Documents\Colatron3000`).
2.  **Acesse as Extensões:**
    - Abra o Google Chrome e digite `chrome://extensions/` na barra de endereços.
3.  **Modo do Desenvolvedor:**
    - No canto superior direito, ative a chave **"Modo do desenvolvedor"**.
4.  **Carregar Extensão:**
    - Clique no botão **"Carregar sem compactação"** que apareceu no canto superior esquerdo.
    - Selecione a pasta onde você salvou os arquivos da extensão.
5.  **Fixar e Usar:**
    - Clique no ícone de peça de quebra-cabeça (Extensões) ao lado da barra de busca do Chrome.
    - Encontre o **Colatron 3000** e clique no ícone do alfinete para fixar.
    - **Clique no ícone roxo** e prepare-se para o deploy.

---

## 📐 Estrutura do Sistema

- `manifest.json`: O núcleo da extensão (V3).
- `background.js`: Gerencia o comportamento de abertura do Side Panel.
- `sidepanel.html/css`: A interface visual e o contêiner do AI Studio.
- `rules.json`: Regras de rede para permitir o embedding do site oficial.

---

## ⚖️ Licença

Este projeto está sob a licença **MIT**. Sinta-se livre para modificar, distribuir e evoluir o sistema como desejar.

---

<p align="center">
  <code style="color: #00FF41">"O homem encara sua propria verdade ao atravessar o limiar de sua propria existencia"</code><br>
  <sub>Feito com 💜 e 💚 por Riky.</sub>
</p>
