const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectToDb = require('./db/db');
const cookieParser = require('cookie-parser');
const userRoutes = require("./routes/user.routes")

connectToDb();

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));


app.get('/', (req, res)=>{
    res.send("Hello World");
})

app.use('/users', userRoutes);

module.exports = app;