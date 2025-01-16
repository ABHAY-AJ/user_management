const express = require('express');
const User = require('../models/user');
const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST create new user
router.post('/', async (req, res) => {
  const { username, age, hobbies } = req.body;
  if (!username || !age) {
    return res.status(400).json({ message: 'Username and age are required' });
  }

  const newUser = new User({ username, age, hobbies });
  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Error saving user' });
  }
});

// PUT update user
router.put('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { username, age, hobbies } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      {id:userId},
      { username, age, hobbies },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user' });
  }
});

// DELETE user
router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await User.findOneAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;
