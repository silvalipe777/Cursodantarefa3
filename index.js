import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import url from "url";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const POR_PAGINA = 5;

let sugestoes = [];
for (let i = 1; i <= 15; i++) {
  sugestoes.push({ id: i, texto: "Sugestão inicial - " + i });
}

function paginar(page) {
  const total = Math.ceil(sugestoes.length / POR_PAGINA);
  const pagina = Math.max(1, Math.min(page, total));
  const inicio = (pagina - 1) * POR_PAGINA;
  const itens = sugestoes.slice(inicio, inicio + POR_PAGINA);
  return { page: pagina, totalPages: total, itens };
}

app.get("/", (req, res) => {
  const q = url.parse(req.url, true).query;
  const page = parseInt(q.page || "1", 10);
  const data = paginar(page);
  res.sendFile(process.cwd() + "/public/index.html");
});

io.on("connection", (socket) => {

  socket.on("listar", (page) => {
    socket.emit("lista", paginar(page));
  });

  socket.on("criar", (texto) => {
    const nova = {
      id: sugestoes.length + 1,
      texto: texto
    };
    sugestoes.push(nova);
    socket.emit("criada", { mensagem: "Sugestão enviada!", sugestao: nova });
    socket.emit("lista", paginar(1));
  });

  socket.on("mudarPagina", (pagina) => {
    socket.emit("lista", paginar(pagina));
  });

});

httpServer.listen(3000, () => {
  console.log("Servidor em http://localhost:3000");
});

