const History = require('../models/history_model');
const Flashcard = require('../models/flashcard_model'); // Assure-toi que le chemin est correct

// 1. ENREGISTRER UNE TENTATIVE (L'utilisateur répond à une question)
exports.recordAttempt = async (req, res) => {
  try {
    const { userId, flashcardId, userAnswer } = req.body;

    const card = await Flashcard.findById(flashcardId);
    if (!card) {
      return res.status(404).json({ status: 'fail', message: 'Flashcard non trouvée' });
    }


    const isCorrect = card.answer.trim().toLowerCase() === userAnswer.trim().toLowerCase();

    const newHistory = await History.create({
      user: userId,
      flashcard: flashcardId,
      category: card.category, // On stocke la catégorie ici pour faciliter les stats plus tard
      isCorrect: isCorrect,
      userAnswer: userAnswer
    });

    res.status(201).json({
      status: 'success',
      data: {
        isCorrect,
        correctAnswer: card.answer, // On renvoie la bonne réponse au front
        history: newHistory
      }
    });

  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// 2. OBTENIR L'HISTORIQUE D'UN USER (Liste chronologique)
exports.getUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await History.find({ user: userId })
      .populate('flashcard', 'question answer') // On remplit les infos de la carte
      .sort({ createdAt: -1 }); // Du plus récent au plus ancien

    res.status(200).json({
      status: 'success',
      results: history.length,
      data: history
    });

  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// 3. OBTENIR LES STATISTIQUES (Score total, Score par catégorie, Nb tentatives)
exports.getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const mongoose = require('mongoose');

    // On utilise l'agrégation MongoDB pour calculer les stats rapidement
    const stats = await History.aggregate([
      // 1. Filtrer par utilisateur
      { $match: { user: new mongoose.Types.ObjectId(userId) } },

      // 2. Grouper par catégorie
      {
        $group: {
          _id: "$category", // On groupe par catégorie
          totalAttempts: { $sum: 1 }, // Compteur total pour cette catégorie
          correctAnswers: { 
            $sum: { $cond: ["$isCorrect", 1, 0] } // Si correct +1, sinon +0
          }
        }
      },
      
      // 3. Optionnel : Formater la sortie
      {
        $project: {
          category: "$_id",
          totalAttempts: 1,
          correctAnswers: 1,
          scorePercentage: { 
             $multiply: [ { $divide: ["$correctAnswers", "$totalAttempts"] }, 100 ] 
          }
        }
      }
    ]);

    // Calculer le total global (en additionnant les résultats de l'agrégation ci-dessus)
    let globalTotalAttempts = 0;
    let globalCorrectAnswers = 0;

    stats.forEach(stat => {
      globalTotalAttempts += stat.totalAttempts;
      globalCorrectAnswers += stat.correctAnswers;
    });

    const globalScore = globalTotalAttempts > 0 
      ? (globalCorrectAnswers / globalTotalAttempts) * 100 
      : 0;

    res.status(200).json({
      status: 'success',
      data: {
        global: {
          totalAttempts: globalTotalAttempts,
          totalCorrect: globalCorrectAnswers,
          scorePercentage: Math.round(globalScore)
        },
        byCategory: stats
      }
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
