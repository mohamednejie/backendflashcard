const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    flashcard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flashcard',
      required: true
    },
    category: {
      type: String,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    userAnswer: {
      type: String // Optionnel : pour savoir ce que l'user a répondu
    }
  },
  {
    timestamps: true // Pour savoir quand la tentative a eu lieu
  }
);

module.exports = mongoose.model('History', HistorySchema);