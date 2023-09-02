// IMPORT DES PACKAGES
const axios = require("axios");

// Initialisation du router
const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.get("/comics", async (req, res) => {
  try {
    const { userId, page, title } = req.query;

    const limit = 100;
    const skip = limit * (page - 1);
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${
        process.env.API_KEY
      }&title=${title && title}&limit=${limit}&skip=${skip}`
    );
    response.data.search = [];
    for (let i = 0; i < response.data.results.length; i++) {
      response.data.search.push({
        id: i,
        name: response.data.results[i].title,
      });
    }

    if (userId) {
      // get the favorites character of the user
      const user = await User.findById(userId);
      for (let i = 0; i < user.favorites.comics.length; i++) {
        // console.log(user.favorites.comics[i]);
        const favComic = await response.data.results.find(
          (comic) => comic._id === user.favorites.comics[i]
        );
        if (favComic) {
          favComic.favorite = true;
        }
      }
    }

    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ROUTE FAVORITES : toggle (add or remove) a favorite comic
router.post("/togglecomic", async (req, res) => {
  try {
    const { userId, comicId } = req.body;
    const user = await User.findById(userId);
    const isPresent = await user.favorites.comics.indexOf(comicId);

    if (isPresent === -1) {
      user.favorites.comics.push(comicId);
      user.save();
      res.status(201).json(user);
    } else {
      user.favorites.comics.splice(isPresent, 1);
      user.save();
      res.status(201).json({ message: "character deleted" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
