const config = require('./utils/config');
const express = require("express");
const cors = require("cors");
const app = express();
const notesRouter = require('./controllers/notes');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

mongoose.set("strictQuery", false);

logger.info('Connecting to', config.MONGODB_URI);

// database connection
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB');
    })
    .catch((error) => {
        logger.error('Error connecting to MongoDB', error.message);
    });

app.use(express.json());
app.use(cors());
app.use(middleware.requestLogger)
app.disable("x-powered-by");

app.use('/api/notes', notesRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;