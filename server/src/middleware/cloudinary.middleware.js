const multer = require('multer')
const path = require('path');

// Multer Configuration
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Cloudinary Configuration
//  cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// Multer-Cloudinary Storage
/* const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Quick_Fundz_docs', // Folder in Cloudinary
    resource_type: 'auto',    // Accept any file type and images
    allowed_formats: ['pdf', 'doc', 'docx'], // Limit file types
  },
});
 */


module.exports = { upload };
