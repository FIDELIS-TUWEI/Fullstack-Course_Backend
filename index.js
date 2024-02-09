const express = require("express");
const app = express();

app.use(express.json());

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
]

app.get('/', (request, response) => {
    response.send('Learning Backend Development.')
});

app.get('/api/notes', (request, response) => {
    return response.json(notes);
})

// POST request Receiving data
app.post('/api/notes', (request, response) => {
    const note = request.body
    console.log(note);
    response.json(note);
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

const PORT = 3001;
app.listen(PORT)
console.log(`Server running on port ${PORT}`);