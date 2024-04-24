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
notesRouter.post('/notes', async (request, response, next) => {
    const body = request.body

    const note = new Note({
        content: body.content,
        important: body.important || false,
    });

   try {
    const savedNote = await note.save();
    response.status(201).json(savedNote);
   } catch (exception) {
    next(exception)
   }
});


// Single source route
notesRouter.get('/notes/:id', async (request, response, next) => {
    try {
        const note = await Note.findById(request.params.id);

        if (note) {
            response.json(note);
        } else {
            response.status(404).end();
        }
    } catch (exception) {
        next(exception)
    }
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
notesRouter.delete('/notes/:id', async (request, response, next) => {
    try {
        await Note.findByIdAndDelete(request.params.id);
        response.status(204).end();
    } catch (exception) {
        next(exception)
    }
});

module.exports = notesRouter;