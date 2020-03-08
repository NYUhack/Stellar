const express = require("express");
const router = express.Router();
const app = express();
const path = require('path');

app.use('/static', express.static(path.join(__dirname, '../../public')));
router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../../public')+'/index.html');
});

module.exports = router;