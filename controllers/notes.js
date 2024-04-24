const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', (request, response) => {
    response.send('Learning Backend Development.')
});

notesRouter.get("/notes", async (request, response) => {
    const notes = await Note.find({});
    response.json(notes);
});

// POST request Receiving data
notesRouter.post('/notes', (request, response, next) => {
    const body = request.body

    const note = new Note({
        content: body.content,
        important: body.important || false,
    });

    note.save()
        .then(savedNote => {
            response.status(201).json(savedNote)
        }).catch(error => next(error));
});


// Single source route
notesRouter.get('/notes/:id', (request, response, next) => {
    Note.findById(request.params.id).then(note => {
        if (note) {
         response.json(note)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
});

// Edit existing resource route
notesRouter.put('/notes/:id', (request, response, next) => {
    const { content, important } = req.body

    Note.findByIdAndUpdate(request.params.id, { content, important }, { new: true, runValidators: true, context: 'query' })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error));
});

// Resource removal route
notesRouter.delete('/notes/:id', (request, response, next) => {
    Note.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
});

module.exports = notesRouter;