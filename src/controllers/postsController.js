import getTodosPosts from "../models/postModel.js";
import { postNewUser, criarPost, atualizarPost } from "../models/postModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

export async function listarPosts(rec, res) {
    //Busca todos os posts do banco de dados usando a função getTodosPosts.
    const posts = await getTodosPosts();
    //Responde com o array de posts no formato JSON.
    res.status(200).json(posts);
}

export async function postarNovoPost(req, res){
    const novoPost = req.body;
    try{
        const postCriado = await criarPost(novoPost);
        res.status(201).json(postCriado);
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({message: 'Erro'});
    }
}

export async function uploadImagem(req, res){
    const novoPost = {
        descricao:"",
        imgUrl: req.file.originalname,
        alt: ""
    };

    try{
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        fs.renameSync(req.file.path, imagemAtualizada);
        res.status(201).json(postCriado);
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({message: 'Erro'});
    }
}

export async function atualizarNovoPost(req, res){
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`;

    try{
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imgBuffer);
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }
        
        const postCriado = await atualizarPost(id, post);
        res.status(201).json(postCriado);
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({message: 'Erro'});
    }
}

export async function adicionarUser(rec,res){
    try{
        const user = await postNewUser(rec);
        res.status(201).json({message: user});
    }
    catch(error){
        res.status(500).json({message: 'Erro ao adicionar o usuario', error});
    }
    
} 
