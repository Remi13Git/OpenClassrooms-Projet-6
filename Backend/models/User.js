const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Schéma d'utilisateur
const UserSchema = new mongoose.Schema({
  email: { 
    type: String,
    required: true, 
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Veuillez entrer une adresse email valide.'] // Regex pour valider le format d'email
  },
  password: { 
    type: String, 
    required: true 
  },
});

// Méthode pour comparer le mot de passe entré avec le mot de passe haché dans la base de données
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
