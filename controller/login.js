const bcrypt = require('bcrypt');
const { User } = require('../models/index');
const { isAuthenticated } = require('../middlewares/auth');

async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            console.log('User not found');
            return res.status(401).send('Email or password is incorrect.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('Invalid password');
            return res.status(401).send('Email or password is incorrect.');
        }

        req.session.user = {
            id: user.idUser,
            email: user.email,
            role: user.role
        };

        console.log('Login successful:', req.session.user);

        // Membuat percabangan untuk mengarahkan berdasarkan role
        if (user.role === 'mahasiswa') {
            return res.redirect('/mahasiswa/dashboard');
        } else {
            return res.redirect('/admin/dashboard');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    login
};