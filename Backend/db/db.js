const mongoose = require('mongoose');

// To connect db with mongoose
function connectToDb(){
    mongoose.connect(process.env.DB_CONNECT)
        .then(() => console.log('Connected to DB'))
        .catch(err => console.log(err));
}

module.exports = connectToDb;