const express = require('express');
const { getBooks, getBookById, createBook, deleteBook, getBestRatedBooks, updateBook, rateBook } = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const { upload } = require('../middleware/multerConfig');
const { optimizeImage } = require('../middleware/optimizeImage');

//Route pour afficher les livres
router.get('/books', getBooks);

//Route pour afficher les meilleurs livres
router.get('/books/bestrating', getBestRatedBooks);

//Route pour afficher un livre via son ID
router.get('/books/:id', getBookById);

//Route pour ajouter un livre
router.post('/books', protect, upload.single('image'), optimizeImage, createBook); 

//Route pour modifier un livre
router.put('/books/:id', protect, upload.single('image'), optimizeImage, updateBook);

//Route pour supprimer un livre
router.delete('/books/:id', protect, deleteBook);

//Route pour ajouter une note
router.post('/books/:id/rating', protect, rateBook);

module.exports = router;


