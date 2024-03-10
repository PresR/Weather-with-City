const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

//displays index.html of root path
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html")
});

//invoked after hitting go in the html form
app.post("/", function(req, res) {

    // takes in the latitude and longitude from the html form
    const latitude = req.body.latitudeInput;
    const longitude = req.body.longitudeInput;

    // build up the URL for the JSON query, API Key is secret and needs to be obtained by signup
    const units = "imperial";
    const apiKey = "d80845cc828106ba8005e5e86e8a8792";
    const url = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&units=" + units + "&APPID=" + apiKey;

    // this gets the data from Open Weather API
    https.get(url, function(response){
        console.log(response.statusCode);

        // gets individual items from Open Weather API
        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            // added new individual items
            const humidity = weatherData.main.humidity;
            const windSpeed = weatherData.wind.speed;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            // displays the output of the results
            res.write("<h1> The weather is " + weatherDescription + "<h1>");
            res.write("<h2>The Temperature at Latitude " + latitude + ", Longitude " + longitude + " is " + temp + " Degrees Fahrenheit<h2>");
            // displays humidity and wind speed
            res.write("<p>Humidity: " + humidity + "%</p>");
            res.write("<p>Wind Speed: " + windSpeed + " mph</p>");
            res.write("<img src=" + imageURL +">");
            res.send();
        });
    });
})


//Code will run on 3000 or any available open port
app.listen(process.env.PORT || 3000, function() {
console.log ("Server is running on port")
});