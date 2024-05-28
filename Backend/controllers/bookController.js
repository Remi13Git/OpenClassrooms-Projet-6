const fs = require('fs');
const path = require('path');
const Book = require('../models/Book');
const mongoose = require('mongoose');

const getBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    const booksArray = books.map(book => ({
      _id: book._id,
      userId: book.userId,
      title: book.title,
      author: book.author,
      imageUrl: book.imageUrl,
      year: book.year,
      genre: book.genre,
      ratings: book.ratings,
      averageRating: book.averageRating
    }));
    res.json(booksArray);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('Error fetching book by id:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const createBook = async (req, res) => {
  console.log('Request body:', req.body);

  // Vérifiez si req.body.book existe
  if (!req.body.book) {
    return res.status(400).json({ message: 'Bad Request: Missing book data' });
  }

  const bookData = JSON.parse(req.body.book);

  const { userId, title, author, year, genre, ratings, averageRating } = bookData;

  console.log('Book data:', { userId, title, author, year, genre, ratings, averageRating });

  // Vérifiez si req.file existe avant d'accéder à req.file.filename
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

  const book = new Book({
    userId,
    title,
    author,
    year,
    genre,
    ratings,
    averageRating,
    imageUrl,
  });

  try {
    const createdBook = await book.save();
    res.status(201).json(createdBook); // Assurez-vous de renvoyer la réponse avec le statut 201
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}



const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Supprimer l'image associée au livre
    const imagePath = path.join(__dirname, '../../Frontend/public', book.imageUrl);
    fs.unlink(imagePath, async (err) => {
      if (err) {
        console.error('Error deleting image file:', err);
        return res.status(500).json({ message: 'Error deleting image file' });
      }

      // Supprimer le livre de la base de données
      try {
        const result = await Book.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 1) {
          res.json({ message: 'Book removed' });
        } else {
          res.status(404).json({ message: 'Book not found' });
        }
      } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

  } catch (error) {
    console.error('Error finding book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getBestRatedBooks = async (req, res) => {
  try {
    const bestRatedBooks = await Book.aggregate([
      {
        $sort: { averageRating: -1 }
      },
      {
        $limit: 3 // Limitez la sortie aux 3 livres les mieux notés
      }
    ]);

    res.json(bestRatedBooks);
  } catch (error) {
    console.error('Error fetching best rated books:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



  

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    let bookData;
    if (req.file) {
      bookData = JSON.parse(req.body.book); // Récupérer les données du livre à partir de la chaîne de caractères
      bookData.imageUrl = `/uploads/${req.file.filename}`;

      // Trouver le livre existant pour obtenir l'URL de l'ancienne image
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      // Supprimer l'ancienne image si elle existe
      if (book.imageUrl) {
        const oldImagePath = path.join(__dirname, '../../Frontend/public', book.imageUrl);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error('Error deleting old image file:', err);
          } else {
            console.log('Old image file deleted:', oldImagePath);
          }
        });
      }
    } else {
      bookData = req.body; // Les données du livre sont directement dans le corps de la requête
    }

    const updatedBook = await Book.findByIdAndUpdate(id, bookData, { new: true });

    if (updatedBook) {
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

  

const rateBook = async (req, res) => {
  try {
    const { userId, rating } = req.body;
    const { id: bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const existingRating = book.ratings.find(r => r.userId.toString() === userId);
    if (existingRating) {
      existingRating.grade = rating;
    } else {
      book.ratings.push({ userId, grade: rating });
    }

    // Calculer averageRating et limiter à 2 chiffres après la virgule
    const averageRating = book.ratings.reduce((sum, r) => sum + r.grade, 0) / book.ratings.length;
    book.averageRating = parseFloat(averageRating.toFixed(2));

    await book.save();
    res.json(book);
  } catch (error) {
    console.error('Error rating book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

  

module.exports = { getBooks, getBookById, createBook, deleteBook, getBestRatedBooks, updateBook, rateBook };
