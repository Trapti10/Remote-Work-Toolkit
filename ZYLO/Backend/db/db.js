const mongoose = require('mongoose');

// To connect db with mongoose
function connectToDb(){
    mongoose.connect(process.env.ATLAS_STRING)
        .then(() => console.log('Connected to DB'))
        .catch(err => console.log(err));
}

module.exports = connectToDb;