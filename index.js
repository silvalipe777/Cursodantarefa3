import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const POR_PAGINA = 5;

let sugestoes = [];
for (let i = 1; i <= 15; i++) {
  sugestoes.push({ id: i, texto: "Sugestão inicial -" + i });
}


const conexoesEstado = new Map();

function paginar(page) {
  const total = Math.ceil(sugestoes.length / POR_PAGINA);
  const pagina = Math.max(1, Math.min(page, total));
  const inicio = (pagina - 1) * POR_PAGINA;
  const itens = sugestoes.slice(inicio, inicio + POR_PAGINA);
  return { page: pagina, totalPages: total, itens };
}

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});

io.on("connection", (socket) => {

  const estadoConexao = {
    id: socket.id,
    paginaAtual: 1
  };
  conexoesEstado.set(socket.id, estadoConexao);

  console.log(`Conexão estabelecida: ${socket.id}`);
  console.log(`Estados ativos: ${conexoesEstado.size}`);

  socket.emit("lista", paginar(estadoConexao.paginaAtual));
  socket.emit("estado", { id: socket.id, paginaAtual: estadoConexao.paginaAtual });

  socket.on("mudarPagina", (direcao) => {
    const estado = conexoesEstado.get(socket.id);
    if (!estado) return;

    const totalPaginas = Math.ceil(sugestoes.length / POR_PAGINA);

    if (direcao === "proxima" && estado.paginaAtual < totalPaginas) {
      estado.paginaAtual++;
    } else if (direcao === "anterior" && estado.paginaAtual > 1) {
      estado.paginaAtual--;
    }

 
    conexoesEstado.set(socket.id, estado);


    socket.emit("lista", paginar(estado.paginaAtual));
    socket.emit("estado", { id: socket.id, paginaAtual: estado.paginaAtual });
  });


  socket.on("criar", (texto) => {
    const nova = {
      id: sugestoes.length + 1,
      texto: texto
    };
    sugestoes.push(nova);


    socket.emit("criada", { mensagem: "Sugestão enviada com sucesso!", sugestao: nova });


    conexoesEstado.forEach((estado, id) => {
      const clientSocket = io.sockets.sockets.get(id);
      if (clientSocket) {
        clientSocket.emit("lista", paginar(estado.paginaAtual));
      }
    });
  });


  socket.on("disconnect", () => {
    conexoesEstado.delete(socket.id);
    console.log(`Conexão encerrada: ${socket.id}`);
    console.log(`Estados ativos: ${conexoesEstado.size}`);
  });
});

httpServer.listen(3000, () => {
  console.log("Servidor em http://localhost:3000");
});
