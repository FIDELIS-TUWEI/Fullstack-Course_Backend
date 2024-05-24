const notesRouter = require('express').Router();
const Note = require('../models/note');
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

// logic to get token
const getTokenFrom = request => {
    const authorization = request.get('authorization');
    if (authorization?.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '');
    }
    return null;
}

notesRouter.get("/", async (request, response) => {
    const notes = await Note.find({}).populate('user', { username: 1, name: 1 });
    response.json(notes);
});

// POST request Receiving data
notesRouter.post("/", async (request, response, next) => {
    const body = request.body;

    const decodedToken = jwt.verify(getTokenFrom(request), config.SECRET);
    if (!decodedToken.id) {
        return response.status(401).json({ error: "token invalid" });
    };

    const user = await User.findById(decodedToken.id);

    const note = new Note({
        content: body.content,
        important: body.important === undefined ? false : body.important,
        user: user._id
    });

    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();
    
    response.status(201).json(savedNote);
   
});


// Single source route
notesRouter.get('/:id', async (request, response, next) => {
    const note = await Note.findById(request.params.id);

    if (note) {
        response.json(note);
    } else {
        response.status(404).end();
    }
    
});

// Edit existing resource route
notesRouter.put('/:id', (request, response, next) => {
    const { content, important } = req.body

    Note.findByIdAndUpdate(request.params.id, { content, important }, { new: true, runValidators: true, context: 'query' })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error));
});

// Resource removal route
notesRouter.delete('/:id', async (request, response, next) => {
    await Note.findByIdAndDelete(request.params.id);
    response.status(204).end();
    
});

module.exports = notesRouter;