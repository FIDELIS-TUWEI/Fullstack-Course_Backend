const dotenv = require("dotenv")
const mongoose = require("mongoose");

dotenv.config();

const password = process.env.PASSWORD;

const url = 
    `mongodb+srv://fidel-korir:${password}@fullstack-course.dwdrrrv.mongodb.net/fs-course?retryWrites=true&w=majority&appName=Fullstack-Course`

mongoose.set('strictQuery', false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

const note = new Note({
    content: 'Mongoose makes things easy',
    important: true
});

//note.save().then(result => {
//    console.log('Note saved!');
//    mongoose.connection.close();
//})
