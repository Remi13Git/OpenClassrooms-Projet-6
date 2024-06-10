const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const router = express.Router();

//Route pour inscription
router.post('/auth/signup', registerUser);

//Route pour connexion
router.post('/auth/login', loginUser);

module.exports = router;
