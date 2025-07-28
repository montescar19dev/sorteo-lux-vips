// server/middleware/upload.js
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name:   process.env.CLOUDINARY_CLOUD_NAME,
  api_key:      process.env.CLOUDINARY_API_KEY,
  api_secret:   process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'sorteo-vip-receipts', 
    allowed_formats: ['jpg','jpeg','png'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

// **Aquí** definimos el filtro de tipos MIME
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg','image/png'];
  // si el mimetype NO está en allowed, cb(null,false),
  // multer seguirá sin rechazar con excepción; luego en tu ruta ves req.file===undefined
  cb(null, allowed.includes(file.mimetype));
};

export default multer({ storage, fileFilter });
