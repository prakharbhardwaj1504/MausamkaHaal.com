import express from 'express'
import axios from 'axios'
import bodyParser from "body-parser";
import SunCalc from 'suncalc';
import { DateTime } from 'luxon';
import { IANAZone } from 'luxon';

const app=express();
const port=3000;
const API_key="0253e6941a5721432238059c8d116511";

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.get("/",(req,res)=>{
    res.render("index.ejs",{data:"sun will shine"})
})
app.post("/get-loc", async(req,res)=>{
    let city=req.body.name;
    console.log(req.body.name)
    let limit=1;
   try{
    const result = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${API_key}`)
    let lat=result.data[0].lat;
    let long=result.data[0].lon;
    const result2=await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${API_key}`)
    console.log(result2.data)

    const cityName = result2.data.name;
    const temperature = result2.data.main.temp;
    const feels_like= result2.data.main.feels_like;
    const temp_min=result2.data.main.temp_min;
    const temp_max=result2.data.main.temp_max;
    const weatherDescription = result2.data.weather[0].description;
    const windSpeed = result2.data.wind.speed;
    const winddeg = result2.data.wind.deg;
    const humidity = result2.data.main.humidity;
    const icon =result2.data.weather[0].icon;
    const timezoneOffset=result2.data.timezone;

//////////////sunrise and sunset
//     // Specify the date and location
const date = new Date();
const latitude = lat; // Replace with your latitude
const longitude = long; // Replace with your longitude

// Calculate sunrise and sunset times using suncalc
const times = SunCalc.getTimes(date, latitude, longitude);

// Format the times in a readable format (e.g., 8:05am to 9:06pm)
const sunrise = formatTime12hr(times.sunrise);
const sunset = formatTime12hr(times.sunset);

console.log(`Sunrise: ${sunrise}`);
console.log(`Sunset: ${sunset}`);

function formatTime12hr(time) {
    const hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    return `${formattedHours}:${minutes} ${amPm}`;
  }

/////////////////////////////////////////second try according to timezone

// Specify the date, latitude, longitude, and timezone
// const date = new Date();
// const username="prakharbhardwaj1504"
// async function getTimezoneInfo(latitude, longitude) {
//     try {
//       const response = await axios.get(`http://api.geonames.org/timezoneJSON?lat=${lat}&lng=${long}&username=${username}`);
//       return response.data.timezoneId;
//     } catch (error) {
//       console.error(error);
//       return null;
//     }
//   }
  
//   const timezone = await getTimezoneInfo(lat, long); // Replace with the desired timezone

// // Calculate sunrise and sunset times using suncalc
// const times = SunCalc.getTimes(date, lat, long);

// // Convert times to the specified timezone
// const sunrise = DateTime.fromJSDate(times.sunrise, { zone: timezone });
// const sunset = DateTime.fromJSDate(times.sunset, { zone: timezone });

    
/////////////////////////////////////////////wind speed
const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const index = Math.round(( winddeg% 360) / 45);
const winddir=directions[index];

    res.render("index.ejs",{cityName,temperature,weatherDescription,windSpeed,humidity,icon,feels_like,temp_min,temp_max,sunrise,sunset,windSpeed,winddir})
   }
   catch(error){
    console.error(error)
    res.render("index.ejs",{error:"Too Difficult to locate"})
   }

})

app.listen(port,()=>{
    console.log('server started on port 3000')
})
