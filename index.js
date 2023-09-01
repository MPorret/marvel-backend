// IMPORT DES PACKAGES
require("dotenv").config(); // Permet d'activer les variables d'environnement qui se trouvent dans le fichier `.env`
const express = require("express"); // Import du package express
const mongoose = require("mongoose"); // Import du package mongoose
const app = express(); // Création du serveur
app.use(express.json()); // middleware

mongoose.connect(process.env.MONGODB_URI); // Connexion à la base de données

const cors = require("cors");
app.use(cors());

// IMPORT DES ROUTES
const comicsRoute = require("./routes/comics.js");
app.use(comicsRoute);
const charactersRoute = require("./routes/characters.js");
app.use(charactersRoute);
const userRoute = require("./routes/user.js");
app.use(userRoute);

app.get("/", (req, res) => {
  try {
    res.status(200).json("HomePage");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.all("/*", (req, res) => {
  try {
    res.status(404).json("Not found");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
