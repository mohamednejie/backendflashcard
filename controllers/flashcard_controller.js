const Flashcard = require('../models/flashcard_model');

// CREATE
exports.createFlachcard = async (req, res) => {
  try {
    const { question, answer, category, type, options } = req.body;

    // Validation simple
    if (!question || !type) {
      return res.status(400).json({ status: 'fail', message: 'Question et type requis' });
    }

    if (type === 'mcq') {
      if (!options || !Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ status: 'fail', message: 'Les QCM doivent avoir au moins 2 options' });
      }
      if (!answer || !options.includes(answer)) {
        return res.status(400).json({ status: 'fail', message: 'La réponse correcte doit être incluse dans les options' });
      }
    }

    const card = await Flashcard.create({
      question,
      answer: answer || '',
      category: category || 'General',
      type,
      options: options || []
    });

    res.status(201).json({ status: 'success', data: card });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// GET ALL
exports.getAllFlachcard = async (req, res) => {
  try {
    const flashcards = await Flashcard.find();
    res.status(200).json({ status: 'success', data: flashcards });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// UPDATE
exports.upadteFlachcard = async (req, res) => {
  try {
    const card = await Flashcard.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!card) {
      return res.status(404).json({ status: 'fail', message: 'Flashcard non trouvée' });
    }

    res.status(200).json({ status: 'success', data: card });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// DELETE
exports.deleteflashcard = async (req, res) => {
  try {
    const card = await Flashcard.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({ status: 'fail', message: 'Flashcard non trouvée' });
    }
    res.status(200).json({ status: 'success', data: null, message: 'Flashcard supprimée avec succès' });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// FILTER BY CATEGORY
exports.getfalshcardbyfilter = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ status: 'fail', message: 'Veuillez fournir une catégorie' });
    }

    const flashcards = await Flashcard.find({ category });

    if (!flashcards || flashcards.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Aucune flashcard trouvée pour cette catégorie' });
    }

    res.status(200).json({ status: 'success', results: flashcards.length, data: flashcards });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
