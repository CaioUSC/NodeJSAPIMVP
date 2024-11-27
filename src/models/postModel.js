import 'dotenv/config';
// Importa a função que estabelece a conexão com o banco de dados (provavelmente MongoDB).  O arquivo dbConfig.js contém a lógica de conexão.
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";

// Estabelece a conexão com o banco de dados usando a string de conexão obtida da variável de ambiente STRING_CONEXAO.  A palavra chave `await` indica que a execução da linha seguinte irá esperar a conclusão da função `conectarAoBanco`.
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

// Função assíncrona que recupera todos os posts do banco de dados.
export default async function getTodosPosts(){
    // Seleciona o banco de dados "Imersao-instabytes".
    const db = conexao.db("Imersao-instabytes");
    // Seleciona a coleção "posts" dentro do banco de dados.
    const colecao = db.collection("posts");
    // Retorna todos os documentos da coleção como um array.
    return colecao.find().toArray();
}

export async function criarPost(novoPost){
    const db = conexao.db("Imersao-instabytes");
    const colecao = db.collection("posts");
    return colecao.insertOne(novoPost);
}

export async function atualizarPost(id, novoPost){
    const db = conexao.db("Imersao-instabytes");
    const colecao = db.collection("posts");
    const objID = ObjectId.createFromHexString(id);
    return colecao.updateOne({_id: new ObjectId(objID)}, {$set:novoPost});
}

export async function postNewUser(rec){
    const {username, email, password} = rec.body;
    const db = conexao.db("Imersao-instabytes");
    const colecao = db.collection("users");

    // Aqui checar se ja existe um usuario com o mesmo
    // username ou email

    const emailExistente = await colecao.findOne({email});
    if(emailExistente) {
        return "Email ja utilizado por outro usuario"
    }

    const usuarioExistente = await colecao.findOne({username});
    if(usuarioExistente) {
        return "UserName ja utilizado por outro usuario"
    }

    const novoUser = {
        username,
        email,
        password,
        createdAt : new Date()
    }   
    await colecao.insertOne(novoUser);
}