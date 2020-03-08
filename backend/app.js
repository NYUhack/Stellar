const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const hello = require('./routes/credentials/hello');
const donation = require('./routes/credentials/donation');
const login = require('./routes/credentials/login');

const functions = require('./functions');

app.use(session({
  secret: functions.makeid(8),
  resave: true,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/Login')));
app.use('/', hello);
app.use('/donation', donation);
app.use('/login', login);
app.listen(3000, () => {
  console.log('starts listening 3000');
});

