const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());
app.disable("x-powered-by");

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
];

const password = process.env.PASSWORD;

const url = 
    `mongodb+srv://fidel-korir:${password}@fullstack-course.dwdrrrv.mongodb.net/fs-course?retryWrites=true&w=majority&appName=Fullstack-Course`

mongoose.set('strictQuery', false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

const note = new Note({
    content: 'Mongoose makes things easy',
    date: new Date(),
    important: true
});

app.get('/', (request, response) => {
    response.send('Learning Backend Development.')
});

app.get("/api/notes", (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    })
});

// generate Id
const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    
    return maxId + 1;
}

// POST request Receiving data
app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: "Content missing"
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId(),
    }

    notes = notes.concat(note);

    response.json(note)
});


// Single source route
app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(note => {
        return note.id === id
    });

    if (note) {
        return response.json(note);
    } else {
        return response.status(404).end()
    }
});

// Resource removal route
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id)

    response.status(204).end();
})

const PORT = process.env.PORT || 3001;
app.listen(PORT)
console.log(`Server running on port ${PORT}`);