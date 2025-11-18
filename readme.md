# Desafio

Este projeto tem:
1. Uma pagina / com formulario de sugestao e lista paginada.
2. Um servidor Node que guarda tudo em memoria e usa WebSocket.

## Como rodar
1. Abrir o terminal na pasta do projeto.
2. Executar:
npm install
npm start
3. Acessar: http://localhost:3000/

## Fluxo

### Carregar pagina:
Evento listar
{ "page": 1 }

Resposta servidor:
Evento lista
{ "page": 1, "totalPages": X, "itens": [...] }

### Envio do formulario:
Evento criar
"sugestao"

Resposta:
Evento criada
{ "mensagem": "Sugestao enviada!", "sugestao": { "id": X, "texto": "..." } }

### Depois:
Evento lista
{ "page": 1, "totalPages": X, "itens": [...] }

### Mudanca de pagina:
Evento mudarPagina
{ "page": N }

### Resposta:
Evento lista
{ "page": N, "totalPages": X, "itens": [...] }