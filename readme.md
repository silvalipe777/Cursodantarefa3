# Sugestões com WebSocket

Projeto de sugestões em tempo real usando Socket.IO.

## Como rodar

1. Baixa as dependências: npm install
2. Roda o servidor: node index.js
3. Abre o navegador em: http://localhost:3000

## O que acontece quando você usa o site

### Quando você acessa a página e envia uma sugestão

**O que o navegador pede pro servidor:**
- Faz um GET / pra pegar a página HTML com o formulário

**O que o navegador manda via WebSocket:**
Logo que abre a página: envia listar com o número da página pega da URL ou usa 1 por padrã. Quando você preenche e envia o formulário: envia criar com o texto da sugestão o formulário não recarrega a página porque tem um preventDefault() bloqueando

**O que o servidor responde:**
Depois do listar: manda de volta lista com {page, totalPages, itens}
Depois do criar: manda criada com {mensagem, sugestao} e logo depois manda a lista atualizada da página 1

### Quando você muda de página na lista

**O que o navegador pede pro servidor:**
Já pediu o HTML antes quando acessou pela primeira vez

**O que o navegador mada via WebSocket:**
No primeiro acesso: listar com a página que tá na URL usa URLSearchParams pra pegar isso
Quando você clica em "Anterior" ou "Próxima": listar com o número da página nova

**O que o servidor responde:**
Manda lista com{page, totalPages, itens} da página que você pediu

**Detalhes importantes:**
Toda vez que você muda de página, a URL atualiza automaticamente usando pushState fica tipo ?page=2
O número da página vem da URL usando window.location.search e URLSearchParams
Se não tiver nada na URL, assume página 1