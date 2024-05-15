const config = require('./utils/config');
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
require("express-async-errors");
const app = express();
const notesRouter = require('./controllers/notes');
const usersRouter = require("")
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

mongoose.set("strictQuery", false);

logger.info('Connecting to MongoDB Database...');

// database connection
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB Database');
    })
    .catch((error) => {
        logger.error('Error connecting to MongoDB Database', error.message);
    });

app.use(express.json());
app.use(cors());
app.use(middleware.requestLogger)
app.disable("x-powered-by");

app.get('/', (request, response) => {
    response.send('Learning Backend Development.')
});

app.use('/api/v1/notes', notesRouter);
app.use('/api/v1/users', usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;