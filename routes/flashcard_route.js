const express =require('express')
const flashcard= require('../controllers/flashcard_controller');
const cardRoutes =express.Router();
cardRoutes.post('/post',flashcard.createFlachcard);
cardRoutes.get('/get',flashcard.getAllFlachcard);
cardRoutes.patch('/update/:id',flashcard.upadteFlachcard);
cardRoutes.delete('/delete/:id',flashcard.deleteflashcard);
cardRoutes.get('/filter',flashcard.getfalshcardbyfilter);
module.exports=cardRoutes