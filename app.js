//jshint esversion:6
require("dotenv").config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/" , function(req , res){
  const query = req.body.cityName;
  const apikey = process.env.API_KEY;
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + apikey;

  https.get(url, function(response){
    console.log(response.statusCode);

    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const icon = weatherData.weather[0].icon;
      const imgURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
      const weatherDescription = weatherData.weather[0].description;
      res.write("<h1>The temperature of " + query + " is " + temp + " degrees celcius</h1>");
      res.write("<h3>The weather is currently : <em>" + weatherDescription + "</em></h3>");
      res.write("<img src=" + imgURL + ">");
      res.send();
    });
  });
});

app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
