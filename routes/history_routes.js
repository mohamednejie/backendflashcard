const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history_controller');

// Route pour enregistrer une réponse (POST)
router.post('/record', historyController.recordAttempt);

// Route pour voir l'historique complet d'un user (GET)
router.get('/:userId', historyController.getUserHistory);

// Route pour voir les stats/scores d'un user (GET)
router.get('/stats/:userId', historyController.getUserStats);

module.exports = router;