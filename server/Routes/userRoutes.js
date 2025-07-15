const express = require('express');
const { signup, login, credits } = require('../controllers/userControllers/userAuth');
const creditsAuth = require('../middlewares/creditsAuth');
const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post("/credits", creditsAuth, credits);

module.exports = router;