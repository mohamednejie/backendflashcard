const User = require("../models/user_model");
const nodemailer = require('nodemailer');

// REGISTER
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const exist = await User.findOne({ email });
        if (exist) return res.status(400).json({ message: "Email déjà utilisé" });

        await User.create({ username, email, password });

        res.json({ message: "Inscription réussie" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Utilisateur introuvable" });

        if (user.password !== password)
            return res.status(400).json({ message: "Mot de passe incorrect" });

        res.json({ message: "Connexion réussie", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// FORGET PASSWORD → générer un code
exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Vérifier que l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email introuvable" });

        // Générer un code aléatoire à 6 chiffres
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Sauvegarder le code dans la base
        user.resetCode = code;
        await user.save();

        // 🔹 Configurer Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mohamedneji7050@gmail.com',
                pass: 'kgpyponmairtmebs', // App password Gmail
            },
        });

        // 🔹 Options email
        const mailOptions = {
            from: 'mohamedneji7050@gmail.com',
            to: user.email,
            subject: 'Réinitialisation du mot de passe',
            text: `Bonjour ${user.username || ''},\n\nVotre code de réinitialisation est : ${code}\n\nUtilisez-le pour réinitialiser votre mot de passe sur l'application.`,
        };

        // Envoyer l'email
        await transporter.sendMail(mailOptions);

        res.json({
            message: "Code de réinitialisation envoyé par email",
            resetCode: code // facultatif, pour test frontend
        });

    } catch (err) {
        console.error('Erreur forgetPassword:', err);
        res.status(500).json({ error: err.message });
    }
};
// RESET PASSWORD avec code
exports.resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        const user = await User.findOne({ email, resetCode: code });
        if (!user) return res.status(400).json({ message: "Code incorrect" });

        user.password = newPassword;
        user.resetCode = null;
        await user.save();

        res.json({ message: "Mot de passe mis à jour !" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
