# Sugestões com WebSocket

Sistema de sugestões com estado guardado no servidor usando Express e Socket.IO.

## Como rodar

1. Instale as dependências: `npm install`
2. Inicie o servidor: `node index.js`
3. Acesse no navegador: http://localhost:3000

## O que acontece quando você usa o site

### Acessar a página e enviar uma sugestão

Quando você abre a página, o navegador faz um GET na rota "/" pra pegar o HTML.

Logo que a página carrega, o Socket.IO conecta automaticamente. O servidor cria um estado pra essa conexão com a página atual começando em 1, e já manda a lista de sugestões dessa página.

Quando você preenche o campo e clica em enviar, o navegador manda o texto da sugestão pro servidor via WebSocket (evento "criar"). O servidor adiciona na lista, responde com uma mensagem de sucesso e atualiza a lista pra todos que estão conectados.

### Mudar de página

Quando você clica em "Anterior" ou "Próxima", o navegador manda pro servidor só a direção que você quer ir (evento "mudarPagina" com "anterior" ou "proxima"), sem informar o número da página.

O servidor sabe em qual página você está porque guarda isso no estado da sua conexão. Ele atualiza a página e manda de volta a nova lista de sugestões.

Não tem nenhum reload ou redirecionamento, tudo acontece via WebSocket.
