const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const router = express.Router();

router.post('/auth/signup', registerUser); // OK
router.post('/auth/login', loginUser); // OK

module.exports = router;
