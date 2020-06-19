import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// Multer is used to upload files ( in this case, the image for the collection point).

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename(request, file, callback){
            const hash = crypto.randomBytes(6).toString('hex');

            const fileName = `${hash}-${file.originalname}`;

            callback(null, fileName);
        }
    }),
};