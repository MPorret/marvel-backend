// IMPORT DES PACKAGES
const axios = require("axios");
const uid = require("uid2"); // uid2 (générer un String aléatoire)
const SHA256 = require("crypto-js/sha256"); // SHA256 (encryptage)
const encBase64 = require("crypto-js/enc-base64"); // enc-Base64

// Initialisation du router
const express = require("express");
const router = express.Router();

// IMPORT DES MODELES
const User = require("../models/user.js");

// ROUTES

// ROUTE SIGNUP : Inscription
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(username, email, password);

    // Vérification que toutes les informations ont été complétées
    if (username && email && password) {
      const isPresent = await User.findOne({ email: email });

      // Si l'email n'est pas déjà présent dans la base de données === si le compte n'existe pas
      if (!isPresent) {
        // Encryptage du mot de passe
        const salt = uid(16);
        const hash = SHA256(password + salt).toString(encBase64);
        const token = uid(16);

        // Création du nouvel utilisateur
        const newUser = new User({
          email,
          account: {
            username,
          },
          token,
          hash,
          salt,
        });

        // Sauvegarde du nouvel utilisateur
        await newUser.save();

        // Informations à renvoyer
        const objectResponse = {
          _id: newUser._id,
          email: newUser.email,
          token: newUser.token,
          account: {
            username: newUser.account.username,
          },
        };
        return res.status(201).json(objectResponse);
      } else {
        return res.status(409).json({ message: "Email already existing" });
      }
    } else {
      return res.status(400).json({ message: "Please, complete the form" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ROUTE LOGIN : Connexion
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const isPresent = await User.findOne({ email: email }); // Nous cherchons le compte avec cet email
      if (isPresent) {
        // Nous vérifions que le compte existe
        const hashToTest = SHA256(password + isPresent.salt).toString(
          encBase64
        );
        if (hashToTest === isPresent.hash) {
          const objectResponse = {
            _id: isPresent._id,
            email: isPresent.email,
            token: isPresent.token,
            account: {
              username: isPresent.account.username,
            },
          };
          return res.status(201).json(objectResponse);
        } else {
          return res
            .status(400)
            .json({ message: `Incorrect password or email` });
        }
      } else {
        return res.status(400).json({ message: `Incorrect email or password` });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Please, complete email and password fields" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ROUTE USER : User page
router.get("/user", async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.findById(id);
    console.log(user);

    // Informations à renvoyer
    const objectResponse = {
      _id: user._id,
      email: user.email,
      token: user.token,
      account: {
        username: user.account.username,
      },
      favorites: { comics: [], characters: [] },
    };
    for (let i = 0; i < user.favorites.comics.length; i++) {
      const newComic = await axios.get(
        `https://lereacteur-marvel-api.herokuapp.com/comic/${user.favorites.comics[i]}?apiKey=${process.env.API_KEY}`
      );
      objectResponse.favorites.comics.push(newComic.data);
      console.log(newComic.data);
    }

    for (let i = 0; i < user.favorites.characters.length; i++) {
      const newCharacter = await axios.get(
        `https://lereacteur-marvel-api.herokuapp.com/character/${user.favorites.characters[i]}?apiKey=${process.env.API_KEY}`
      );
      objectResponse.favorites.characters.push(newCharacter.data);
      console.log(newCharacter.data);
    }
    return res.status(200).json(objectResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
