const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


const mongoDBAtlasUri = 'mongodb+srv://jayrana241:jay1234@cluster1.lanbjes.mongodb.net/tutorial5?retryWrites=true&w=majority';

mongoose.connect(mongoDBAtlasUri)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch(error => console.error('Error connecting to MongoDB Atlas:', error));



const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    firstName: { type: String, required: true },
  }, { versionKey: false });

const User = mongoose.model('User', userSchema);


app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    if (users) {
      res.status(200).json({ message: "Users retrieved", success: true, users });
    } else {
      res.status(404).json({ message: "No users found", success: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", success: false });
  }
});


app.post('/add', async (req, res) => {
  try {
    const { email, firstName } = req.body;
    if (!email || !firstName) {
      return res.status(400).json({ message: "Missing required fields", success: false });
    }
    const newUser = new User({ email, firstName });
    await newUser.save();
    res.status(201).json({ message: "User added", success: true });
  } catch (error) {
    res.status(500).json({ message: "Error adding user", success: false });
  }
});



app.put('/update/:id', async (req, res) => {
  try {
    const { email, firstName } = req.body;
    if (!email || !firstName) {
      return res.status(400).json({ message: "Missing required fields", success: false });
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    res.status(200).json({ message: "User updated", success: true, updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", success: false });
  }
});

app.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", success: false });
  }
});


app.delete('/delete/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
