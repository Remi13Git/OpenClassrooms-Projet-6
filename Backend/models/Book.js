const mongoose = require('mongoose');

//Schéma de note
const RatingSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: 'User' },
  grade: { type: Number, required: true },
});

//Schéma de livre
const BookSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: 'User' },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [RatingSchema],
  averageRating: { type: Number, required: true },
});

module.exports = mongoose.model('Book', BookSchema);
