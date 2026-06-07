const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectToDb = require('./db/db');
const cookieParser = require('cookie-parser');
const userRoutes = require("./routes/user.routes")
const taskRoutes = require('./routes/task.routes')
const chatRoutes = require('./routes/chat.routes')
const fileRoutes = require('./routes/file.routes')

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

app.use('/tasks', taskRoutes)

app.use('/chat', chatRoutes)

app.use('/files', fileRoutes)

module.exports = app;