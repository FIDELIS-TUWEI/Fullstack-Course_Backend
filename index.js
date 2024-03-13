const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const Note = require("./models/note");
const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());
app.disable("x-powered-by");

app.get('/', (request, response) => {
    response.send('Learning Backend Development.')
});

app.get("/api/notes", (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    })
});

// POST request Receiving data
app.post('/api/notes', (request, response) => {
    const body = request.body

    if (body.content === undefined) {
        return response.status(400).json({
            error: "Content missing"
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
    });

    note.save().then(savedNote => {
        response.json(savedNote)
    });
});


// Single source route
app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id).then(note => {
        if (note) {
         response.json(note)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
});

// Resource removal route
app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
});

// Unknown endpoint
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint);

// Error handler middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        response.status(400).send({ error: 'Malformatted Id' })
    }

    next(error);
}

app.use(errorHandler);


const PORT = process.env.PORT || 3001;
app.listen(PORT)
console.log(`Server running on port ${PORT}`);