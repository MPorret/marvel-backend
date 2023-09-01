// IMPORT DES PACKAGES
const axios = require("axios");

// Initialisation du router
const express = require("express");
const router = express.Router();

const User = require("../models/user");

// ROUTE CHARACTERS : show all characters
router.get("/characters", async (req, res) => {
  try {
    const limit = 100;
    const skip = limit * (req.query.page - 1);
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${
        process.env.API_KEY
      }&name=${req.query.name && req.query.name}&limit=${limit}&skip=${skip}`
    );
    response.data.search = [];
    for (let i = 0; i < response.data.results.length; i++) {
      response.data.search.push({ id: i, name: response.data.results[i].name });
    }
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ROUTE CHARACTER : show a character
router.get("/character/:characterId", async (req, res) => {
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/character/${req.params.characterId}?apiKey=${process.env.API_KEY}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ROUTE FAVORITES : add a favorite character
router.post("/addcharacter", async (req, res) => {
  try {
    const { userId, characterId } = req.body;
    const user = await User.findById(userId);
    const isPresent = await user.favorites.characters.indexOf(characterId);
    if (isPresent === -1) {
      user.favorites.characters.push(characterId);

      user.save();
      res.status(201).json(user);
    } else {
      res.status(400).json({ message: "Already in favorites" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;