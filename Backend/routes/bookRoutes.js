const express = require('express');
const { getBooks, getBookById, createBook, deleteBook, getBestRatedBooks, updateBook, rateBook } = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const { upload } = require('../middleware/multerConfig');
const { optimizeImage } = require('../middleware/optimizeImage');

router.get('/books', getBooks);
router.get('/books/bestrating', getBestRatedBooks);
router.get('/books/:id', getBookById);
router.post('/books', protect, upload.single('image'), optimizeImage, createBook);
router.put('/books/:id', protect, upload.single('image'), optimizeImage, updateBook);
router.delete('/books/:id', protect, deleteBook);
router.post('/books/:id/rating', protect, rateBook);

module.exports = router;


