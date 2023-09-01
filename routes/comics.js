// IMPORT DES PACKAGES
const axios = require("axios");

// Initialisation du router
const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.get("/comics", async (req, res) => {
  try {
    const limit = 100;
    const skip = limit * (req.query.page - 1);
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${
        process.env.API_KEY
      }&title=${req.query.title && req.query.title}&limit=${limit}&skip=${skip}`
    );
    response.data.search = [];
    for (let i = 0; i < response.data.results.length; i++) {
      response.data.search.push({
        id: i,
        name: response.data.results[i].title,
      });
    }
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/comic/:comicId", async (req, res) => {
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comic/${req.params.comicId}?apiKey=${process.env.API_KEY}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ROUTE FAVORITES : add a favorite comic
router.post("/addcomic", async (req, res) => {
  try {
    const { userId, comicId } = req.body;
    const user = await User.findById(userId);
    user.favorites.comics.push(comicId);

    user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
