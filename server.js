const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors')
const device = require('express-device');
const path = require('path');
const bodyParser = require("body-parser");


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodemysql'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log(`db connected`)
})
dotenv.config({ path: './config/config.env' });
const newfileapp = require('./Routes/newfile')

const app = express();
app.use(cors())
app.use(device.capture());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//Create DB

app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE nodemysql';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Database created...');
    });
})

//Create table
app.get('/createposttable', (req, res) => {

    let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, country VARCHAR(255), states VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Post table created...');
    })
});

//user Req for data
app.get('/countrycode', (req, res) => {
    //fetching the ip address through express req object
    const ipAddress = req.ip;
    let deviceType = req.device.type;
    let data = {
        stateName: req.query.name
    };
    let sql = `SELECT  count(country_code) AS numCount,(country_code), imgURL  FROM CITIES WHERE NAME LIKE '${data.stateName}%' group by country_Code order by count(*) desc LIMIT 10`;
    db.query(sql, [data.stateName], (err, result) => {
        if (err) throw err;
        res.send(result);
        console.log(result)
    })
});

//get cookie data from db
app.get('/history', (req, res) => {
    let data = {
        gId: req.query.id
    }
    let sql = `SELECT history, userID FROM userdata  WHERE gId = ${data.gId} ORDER BY userID DESC LIMIT 10`;
    db.query(sql, [data.gId], (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

//user req for posting cookie data to DB
app.post("/addcookie", (req, res) => {
    console.log(req.body.history);
    let x = req.body.history;
    let y = req.body.gId;
    let z = req.body.email;
    let sql = `INSERT INTO userdata (history, gId, email) VALUES ("${x}", "${y}", "${z}")`;
    db.query(sql, [x, y, z], (err, result) => {
        if (err) throw err;
        res.send(result);
    })
    // return res.send('hello')
})

//user req to remove history from DB
app.post("/removehistory", (req, res) => {
    let x = req.body.history;
    let y = req.body.gId;
    console.log(x, y)
    let sql = `DELETE FROM userdata WHERE gId=${y} AND history ="${x}"`;
    db.query(sql, [x, y], (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

//user req for trending values on page load
app.get('/', (req, res) => {
    //fetching the ip address through express req object
    const ipAddress = req.ip;
    let userLanguage = req.acceptsLanguages();
    //get languages preferences from req header
    if (userLanguage[0] == "en-US") {
        let x = req.headers['user-agent']
        if (x.indexOf("Mobile") !== -1) {
            res.sendFile(path.join(__dirname, '/phone/index.html'));
        }
        if (x.indexOf("Mobile") == -1) {
            res.sendFile(path.join(__dirname, '/desktop/index.html'));
        }
    }

});

//user req for trending values on page load
app.get('/fullScreen', (req, res) => {
    //fetching the ip address through express req object
    const ipAddress = req.ip;
    let deviceType = req.device.type;
    let x = req.headers['user-agent']
    if (x.indexOf("Mobile") !== -1) {
        res.sendFile(path.join(__dirname, '/phone/fullScreen.html'));
    }
    if (x.indexOf("Mobile") == -1) {
        res.sendFile(path.join(__dirname, '/desktop/index.html'));
    }
});




const PORT = process.env.PORT || 5000;

const searchController = require('./searchController');
app.route('/search').get(searchController.search);
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
app.use("/static", express.static('static'));


