const notesRouter = require('express').Router();
const Note = require('../models/note');
const User = require('../models/user');

notesRouter.get("/notes", async (request, response) => {
    const notes = await Note.find({});
    response.json(notes);
});

// POST request Receiving data
notesRouter.post('/notes', async (request, response, next) => {
    const body = request.body;

    const user = await User.findById(body.userId)

    const note = new Note({
        content: body.content,
        important: body.important === undefined ? false : body.important,
        user: user.id
    });

    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();
    
    response.status(201).json(savedNote);
   
});


// Single source route
notesRouter.get('/notes/:id', async (request, response, next) => {
    const note = await Note.findById(request.params.id);

    if (note) {
        response.json(note);
    } else {
        response.status(404).end();
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
    await Note.findByIdAndDelete(request.params.id);
    response.status(204).end();
    
});

module.exports = notesRouter;