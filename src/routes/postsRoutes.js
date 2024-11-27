// Import the Express framework for creating the server and handling routes.
import express from "express";

// Import the Multer middleware for handling file uploads.
import multer from "multer";
import cors from "cors";
// Import functions from postsController.js
import { adicionarUser, listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js";

const corsOptions = {
  origin:"http://localhost:8000",
  optionsSuccessStatus: 200
}

// Configure Multer storage using disk storage
const storage = multer.diskStorage({
  // Define the destination directory for uploaded files
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  // Define the filename for uploaded   
 //files (keep original name)
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

    // Create a Multer instance with the configured storage
    const upload = multer({   
    dest: "./uploads", storage });

    // Define routes function that takes an Express app instance
    const routes = (app) => {
  // Use Express middleware to parse JSON request bodies
  app.use(express.json());

  app.use(cors(corsOptions));    
  // GET route at /posts to list all posts (calls listarPosts function)
  app.get("/posts", listarPosts);

  // POST route at /posts to create a new post (calls postarNovoPost function)
  app.post("/posts", postarNovoPost);

  // POST route at /upload with Multer middleware for single file upload named "imagem" (calls uploadImagem function)
  app.post("/upload", upload.single("imagem"), uploadImagem);

  app.put("/upload/:id", atualizarNovoPost);

  // POST route at /user to add a user (calls adicionarUser function)
  app.post("/user", adicionarUser);
}

// Export the routes function as the default export
export default routes;