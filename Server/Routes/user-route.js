const express = require('express');
const User = require('../db/Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/sign-up', async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const signupUser = await User.findOne({ email });

    if (signupUser) {
      return res.status(400).json({
        success: false,
        message: ' This email is already registerd , Please login',
      });
    }
    if (password != confirmPassword) {
      return res.status(400).json({
        success: false,
        message: ' Please check the password!',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 2);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    return res.status(200).json({
      success: true,
      message: 'New user signup done successfully',
      newUser,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginUser = await User.findOne({ email });
    console.log('REQ BODY:', req.body);
    console.log('DB User:', await User.findOne({ email: req.body.email }));
    if (!loginUser) {
      return res.status(400).json({
        success: false,
        message: ' This email is not registerd yet, please do signup!',
      });
    }
    const passwordMatch = await bcrypt.compare(password, loginUser.password);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: ' Please check the password!',
      });
    }
    const secret = 'gasudguywegdnw7638bg';
    const token = jwt.sign(
      { id: loginUser._id, name: loginUser.name, role: loginUser.role },
      secret,
      { expiresIn: '5h' }
    );
    return res.status(200).json({
      message: 'You are logged in',
      success: true,
      token,
      user: {
        name: loginUser.name,
      },
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const forgetPasswordUser = await User.findOne({ email });
    if (!forgetPasswordUser) {
      return res.status(400).json({
        success: false,
        message: ' This email is not registerd yet, please do signup!',
      });
    }
    const secret = 'gasudguywegdnw7638bg';
    const token = jwt.sign({ userId: forgetPasswordUser._id }, secret, {
      expiresIn: '5h',
    });
    const trasporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'learnedfrom8@gmail.com',
        pass: 'xjmp kzdy geyr feqz',
      },
    });

    const mailOptions = {
      from: 'learnedfrom8@gmail.com',
      to: email,
      subject: 'PASSWORD RESET EMAIL',
      text: `Hai,
                please reset your password using this token : ${token}`,
    };

    trasporter.sendMail(mailOptions, () => {
      return res
        .status(200)
        .json({ message: 'Password reset email has been send' });
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});
router.post('/reset-password', async (req, res) => {
  try {
    const { email, password, confirmPassword, token } = req.body;
    const resetPassword = await User.findOne({ email });
    if (!resetPassword) {
      return res.status(400).json({
        success: false,
        message: ' This email is not registerd yet, please do signup!',
      });
    }
    if (password != confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please doesnot matching!',
      });
    }
    const secret = 'gasudguywegdnw7638bg';
    const decoded = jwt.verify(token, secret);
    const hashedPassword = await bcrypt.hash(password, 2);

    const updatedPassword = await User.updateOne(
      { email },
      { confirmPassword: password },
      { password: hashedPassword }
    );
    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      updatedPassword,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});
module.exports = router;
