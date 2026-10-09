const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = "mongodb+srv://agustindm_db_user:AgustinPass2026@cluster0.qbn1oef.mongodb.net/student_db?retryWrites=true&w=majority";


let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGO_URI, { bufferCommands: false });
    isConnected = true;
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}


const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: { type: String, required: true },
  age: { type: Number, required: true }
});

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);


app.get('/', (req, res) => {
  res.send("Server is running!");
});


app.get('/students', async (req, res) => {
  try {
    await connectDB();
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/students', async (req, res) => {
  try {
    await connectDB();
    const newStudent = new Student({
      name: req.body.name,
      course: req.body.course,
      age: req.body.age
    });
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.put('/students/:id', async (req, res) => {
  try {
    await connectDB();
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        course: req.body.course,
        age: req.body.age
      },
      { new: true, runValidators: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.delete('/students/:id', async (req, res) => {
  try {
    await connectDB();
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;