const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

//Fonction pour optimiser l'image (Green Code)
const optimizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  //Direction du fichier à optimiser
  const uploadsDir = path.join(__dirname, '../../Frontend/public/uploads');

  //Direction du fichier optimisé
  const optimizedImagePath = path.join(uploadsDir, `optimized-${req.file.filename}`);

  try {
    const sharpResize = await sharp(req.file.path)
      .resize(800, 800, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFormat('jpeg', { quality: 80 })
      .toFile(optimizedImagePath);

    console.log('Image optimized successfully:', optimizedImagePath);
  
    if (sharpResize){
      // Supprimer l'image originale non optimisée
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error deleting original image file:', err);
        } else {
          console.log('Original image file deleted:', req.file.path);
        }
      });

      // Mettre à jour le chemin du fichier image dans req.file pour utiliser l'image optimisée
      req.file.path = optimizedImagePath;
      req.file.filename = `optimized-${req.file.filename}`;
      
      // Appeler next() une fois que l'optimisation de l'image est terminée
      next();
    }
      
  } catch (error) {
    console.error('Error optimizing image:', error);
    next(error);
  }
};

module.exports = { optimizeImage };
