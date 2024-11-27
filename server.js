// Importa o framework Express.js para criar o servidor web.
import express from "express";
import routes from "./src/routes/postsRoutes.js";

// Cria uma instância do Express.js.
const app = express();
// servir arquivos estaticos
app.use(express.static("uploads"));

routes(app);

// Inicia o servidor na porta 3000 e imprime uma mensagem no console.
app.listen(3000,() => {
    console.log("Servidor escutando...");
});




