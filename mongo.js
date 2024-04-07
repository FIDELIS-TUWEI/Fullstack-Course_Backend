const mongoose = require("mongoose");

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
};

const password = process.argv[2];

const url = 
    `mongodb+srv://fidel-korir:${password}@fullstack-course.dwdrrrv.mongodb.net/fs-course?retryWrites=true&w=majority&appName=Fullstack-Course`

mongoose.set('strictQuery', false);
mongoose.connect(url);

mongoose.connection.close();