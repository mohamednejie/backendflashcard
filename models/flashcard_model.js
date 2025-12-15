const mongoose = require('mongoose');

const FlashcardSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true
    },
    answer: {
      type: String,
      trim: true
      // Pour QCM, ceci sera la réponse correcte
    },
    category: {
      type: String,
      default: 'General'
    },
    type: {
      type: String,
      enum: ['text', 'mcq'],
      default: 'text' // 'text' = question ouverte, 'mcq' = choix multiple
    },
    options: {
      type: [String],
      default: [] 
    }
  },
  {
    timestamps: true // createdAt / updatedAt automatiques
  }
);

module.exports = mongoose.model('Flashcard', FlashcardSchema);
