// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const API_KEY = 'YOUR_API_KEY_HERE';
module.exports = API_KEY;

const server = express();

server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());

server.get('/get-weather-details', (req, res) => {

    //const movieToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.movie ? req.body.result.parameters.movie : 'The Godfather';
    //const reqUrl = encodeURI(`http://www.omdbapi.com/?t=${movieToSearch}&apikey=${API_KEY}`);

    const cityName = 'Itu';
    
    callWeatherApi(cityName).then((output) => {
            console.log({ 'fulfillmentText': output });
            res.json({ 'fulfillmentText': output }); // Return the results of the weather API to Dialogflow
        }).catch(() => {
            console.log({ 'fulfillmentText': `I don't know the weather but I hope it's good!` });
            res.json({ 'fulfillmentText': `I don't know the weather but I hope it's good!` });
        });
});


server.listen((process.env.PORT || 9000), () => {
    console.log("Server is up and running...");
});


//const functions = require('firebase-functions');

/*
function callWeatherApi(cityName) {
    return new Promise((resolve, reject) => {
        const openWeatherAPIKey = '15c8fff34911d49e4f2cfb2138499320';
        const host = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=metric&appid=' + openWeatherAPIKey;
        
        console.log('API Request: ' + host);
    
        // Make the HTTP request to get the weather
        http.get(host, (res) => {
            let body = ''; // var to store the response chunks
            res.on('data', (d) => { body += d; }); // store each response chunk
            res.on('end', () => {                
                // After all the data has been received parse the JSON for desired data
                //console.log(JSON.parse(body))

                let response = JSON.parse(body);
                let mainStr        = response['weather'][0]['main'];
                let descriptionStr = response['weather'][0]['description'];
                let cityNameStr    = response['name'];
                let countryStr     = response['sys']['country'];
                let temperatureStr = response['main']['temp'];
                let tempMaxStr     = response['main']['temp_max'];
                let tempMinStr     = response['main']['temp_min'];
                let humidityStr    = response['main']['humidity'];

                let output = `Current conditions in ${cityNameStr} (${countryStr}) ` +
                `are ${descriptionStr} and current temperature is ${temperatureStr} oC ` +
                `with a projected high of ${tempMaxStr} oC and a low of ${tempMinStr} oC ` +
                `and the humidity is expected to be ${humidityStr}%.` 
                //console.log(output);
                
                // Resolve the promise with the output text
                resolve(output);
            });
            res.on('error', (error) => {
                console.log(`Error calling the weather API: ${error}`)
               reject();
            });
        });
    });
}*/

function callWeatherApi(cityName) {
    var output = '';

    return new Promise((resolve, reject) => {
        const wwoApiKey = '545282592af94c15b87174515181412';
        const host      = 'http://api.worldweatheronline.com/premium/v1/weather.ashx?format=json&num_of_days=1' + '&q=' + encodeURIComponent(cityName) + '&key=' + wwoApiKey + '&date=2018-12-14';
            
        console.log('API Request: ' + host);
    
        // Make the HTTP request to get the weather
        http.get(host, (res) => {
            let body = ''; // var to store the response chunks
            res.on('data', (d) => {                 
                body += d; 
            }); // store each response chunk
            res.on('end', () => {

                // After all the data has been received parse the JSON for desired data
                let response = JSON.parse(body);
                
                // After all the data has been received parse the JSON for desired data
                let forecast   = response['data']['weather'][0];
                let location   = response['data']['request'][0];
                let conditions = response['data']['current_condition'][0];
                let currentConditions = conditions['weatherDesc'][0]['value'];
               
                // Create response
                output = `Current conditions in the ${location['type']} 
                ${location['query']} are ${currentConditions} with a projected high of
                ${forecast['maxtempC']}°C or ${forecast['maxtempF']}°F and a low of 
                ${forecast['mintempC']}°C or ${forecast['mintempF']}°F on 
                ${forecast['date']}.`;

                //output = 'Ate aqui, tudo bem!';
                console.log('Debug :' + output);
                console.log('monkey 666');
                
                // Resolve the promise with the output text
                resolve(output);
            });
            res.on('error', (error) => {
                console.log(`Error calling the weather API: ${error}`);
                reject();
            });
        });
    });
}