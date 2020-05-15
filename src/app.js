const express = require('express');
const path = require('path');
const hbs = require('hbs');
const async = require('async');
const request = require('request');
const app = express();

const port = process.env.PORT || 3000;

//Define paths for config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');


//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

//setup handlebars engine and location
app.set('view engine', 'hbs')
app.set('views', viewPath);
hbs.registerPartials(partialsPath);

//Fetch api from rapidAPI

// var options = {
//     method: 'GET',
//     url: 'https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats',
//     headers: {
//         'x-rapidapi-key': 'b32d3767d9msh4f3b8fe2b8d6e7bp150402jsncb3c6ec8bb49'
//     },
//     json: true
// };

app.get('/', (req, res, next) => {
    // const async = require('async');
    //const request = require('request');

    function httpGet(url, callback) {
        const options = {
            url: url,
            json: true
        };
        request(options,
            function (err, res, body) {
                callback(err, body);
            }
        );
    }

    const urls = [
        "https://coronavirus-19-api.herokuapp.com/countries",
        "https://coronavirus-19-api.herokuapp.com/all",
        "https://coronavirus-19-api.herokuapp.com/countries/Myanmar"
    ];

    async.map(urls, httpGet, function (err, response) {
        if (err) return console.log(err);
        console.log(response[1]);
        console.log(response[0])
        let allCountry = response[0];
        let myanmar = response[2];
        let world = response[1];
        res.render('index', {
            title: 'Covid-19 Tracker',
            name: 'Linn Linn Htet',
            world: world,
            allCountry: allCountry,
            myanmar: myanmar
        })
    });

})
app.get('/help', (req, res, next) => {
    res.render('help', {
        title: 'Help',
        name: 'Linn Linn Htet'
    });
})
app.get('/about', (req, res, next) => {
    res.render('about', {
        title: 'About',
        name: 'Linn Linn Htet'
    });
})
app.get('/covid-status', (req, res) => {
    if (!req.query.country) {
        return res.send({
            error: 'You must provide a country'
        })
    }
    request(options, (err, response) => {
        let data = response.body.data;
    })
    res.send({
        products: req.query.country
    })
})
app.get('*', (req, res, next) => {
    res.render('404', {
        title: 'Error',
        name: 'Linn Linn Htet'
    });
})
app.listen(port, (err) => {
    if (!err) {
        console.log('Server is running on port ' + port);
    }
})

// https://coronavirus-19-api.herokuapp.com/countries/{countryName} //by country

// https://coronavirus-19-api.herokuapp.com/countries //all country

// https://coronavirus-19-api.herokuapp.com/all //world