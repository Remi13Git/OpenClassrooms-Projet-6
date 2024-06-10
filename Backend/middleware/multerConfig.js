const multer = require('multer');
const path = require('path');

//Fonction pour stocker l'image téléchargée
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../Frontend/public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = upload;

module.exports = { upload };