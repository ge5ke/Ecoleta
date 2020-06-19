import express from 'express';
import multer from 'multer';
import multerConfig from './config/multer'
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';
import { celebrate, Joi } from 'celebrate'; // The sole use of celebrate is making sure that the request comes in the correct shape and if not, a standard exception is returned.


const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();


routes.get('/points/:id', pointsController.show);
routes.get('/points', pointsController.index);
routes.get('/items', itemsController.index);

routes.post('/points',
upload.single('image'),
celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required()
    })
},{
    abortEarly:false
}),
pointsController.create);


//listar pontos /itens
//cadastro de ponto
//listar pontos com filtro
//mostrar um ponto



export default routes;