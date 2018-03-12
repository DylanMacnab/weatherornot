// **************************************
// APIXU Info
// **************************************

const apiKey = 'f0e5ebc0c2354f20bc761611180103';
const forecastUrl = 'https://api.apixu.com/v1/forecast.json?key=';
const currentUrl = 'https://api.apixu.com/v1/forecast.json?key=';

// **************************************
// Page Elements
// **************************************

const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
const $weatherDivs = [$("#weather1"), $("#weather2"), $("#weather3"), $("#weather4"), $("#weather5"), $("#weather6"), $("#weather7")];
const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const $currentWeather = $('#current');


// **************************************
// AJAX functions
// **************************************

// Get Current Weather Conditions
async function getCurrentForecast() {
  const urlToFetch = currentUrl + apiKey + '&q=' + $input.val();
  console.log("Current Forecast URL " + urlToFetch);
  try {
    let response = await fetch(urlToFetch);
    if (response.ok) {
      let jsonResponse = await response.json();
      let location = jsonResponse;
      return location;
    }
  }
  catch(error) {
    console.log("error requesting current forecast")
  }
}

// Get 7 Day Forecast
async function getForecast() {
  const urlToFetch = forecastUrl + apiKey + '&q=' + $input.val() + '&days=7';
	//console.log(urlToFetch);
  try {
    let response = await fetch(urlToFetch);
    if (response.ok) {
      let jsonResponse = await response.json();
      console.log(jsonResponse);
      let days = jsonResponse.forecast.forecastday;
      //console.log(days);
      return days;
    }
	}
  catch(error) {
    console.log(error)
  }
};


// **************************************
// Render functions
// **************************************

function renderLocation(location) {
  $destination.append(`<h2 class="location-heading">${location.location.name}<br><span class="location-subheading">${location.location.region}<span></h2>`);
}

function renderForecast(days) {
  $weatherDivs.forEach(($day, index) => {
    let weatherContent =
      '<h2 class="weather-day">' + weekDays[(new Date(days[index].date)).getDay()] + '</h2>' +
      '<img src="http://' + days[index].day.condition.icon + '" class="weather-icon" />' +
      '<div class="weather-temps">' +
      '<h2 class="high">' + Math.round(days[index].day.maxtemp_f) + '</h2>' +
      '<h2 class="low">' + Math.round(days[index].day.mintemp_f) + '</h2>' +
      '</div>';
      $day.append(weatherContent);
  });
}

function renderCurrent(location) {
  let currentContent =
  `<div class="current-weather">
    <img src="http://${location.current.condition.icon}">
    <p>
      Description: ${location.current.condition.text} <br>
      Temp: ${location.current.temp_f} <br>
      Wind: ${location.current.wind_mph} <br>
      High: ${location.forecast.forecastday[0].maxtemp_f} <br>
      Low: ${location.forecast.forecastday[0].mintemp_f} <br>
      Rain: ${location.forecast.forecastday[0].day.totalprecip_mm} <br>
    </p>
  </div>`;
  $currentWeather.append(currentContent);
}

function executeSearch() {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDivs.forEach(day => day.empty());
  $destination.empty();
  $currentWeather.empty();
  $container.css("visibility", "visible");
  getForecast().then(days => {
    renderForecast(days);
  });
  getCurrentForecast().then(location => {
    renderLocation(location);
    renderCurrent(location);
  });
  return false;
}

$submit.click(executeSearch);
