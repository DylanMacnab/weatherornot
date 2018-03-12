// Foursquare API Info
const clientId = 'E0KX0H4VRVGAFXFXGI2RK2M4QWJ5T1CIPO1WPECNOZQL12VW';
const clientSecret = 'TMUH4GEYEXXUMF4444C1GR0JKDOIHJZ0GYDTFK5JI0U4IYYR';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';
const imgPrefix = 'https://igx.4sqi.net/img/general/150x200';

// APIXU Info
const apiKey = 'f0e5ebc0c2354f20bc761611180103';
const forecastUrl = 'https://api.apixu.com/v1/forecast.json?key=';
const currentUrl = 'https://api.apixu.com/v1/forecast.json?key=';


// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
const $weatherDivs = [$("#weather1"), $("#weather2"), $("#weather3"), $("#weather4"), $("#weather5"), $("#weather6"), $("#weather7")];
const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const $currentWeather = $('#current');

// AJAX functions

// Get 4 Closest Venues
async function getVenues() {
  const city = $input.val();
  const urlToFetch = url + city + '&venuePhotos=1&limit=10&client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20180311';

  try {
    let response = await fetch(urlToFetch);
    if (response.ok) {
      let jsonResponse = await response.json();
   		let venues = jsonResponse.response.groups[0].items.map(location => location.venue);
			return venues;
    }
  }
  catch(error) {
    console.log(error);
  }

};

// Get Current Weather Conditions
async function getCurrentForecast() {
  const urlToFetch = currentUrl + apiKey + '&q=' + $input.val();
  console.log("Current Forecast URL " + urlToFetch);
  try {
    let response = await fetch(urlToFetch);
    if (response.ok) {
      let jsonResponse = await response.json();
      let current = jsonResponse;
      return current;
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


// Render functions
function renderVenues(venues) {
  $venueDivs.forEach(($venue, index) => {
    let venueContent =
      '<img class="venue-img" src="' + imgPrefix +
      venues[index].photos.groups[0].items[0].suffix + '"/>' +
      '<div class="venue-details"> <h2 class="venue-name">' + venues[index].name + '</h2>' +
      '<h3>Address:</h3>' +
      '<p>' + venues[index].location.address + '</p>' +
      '<p>' + venues[index].location.city + '</p>' +
      '<p>' + venues[index].location.country + '</p></div>';
    $venue.append(venueContent);
  });
  $destination.append('<h2>' + venues[0].location.city + '</h2>');
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

function renderCurrent(current) {
  let currentContent =
  `<div class="current-weather">
    <h2>Currently:</h2>
    <img src="http://${current.current.condition.icon}">
    <p>
      Description: ${current.current.condition.text} <br>
      Temp: ${current.current.temp_f} <br>
      Wind: ${current.current.wind_mph} <br>
      High: ${current.forecast.forecastday[0].maxtemp_f} <br>
      Low: ${current.forecast.forecastday[0].mintemp_f} <br>
      Rain: ${current.forecast.forecastday[0].day.totalprecip_mm} <br>
    </p>
  </div>`;
  $currentWeather.append(currentContent);
}

function executeSearch() {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDivs.forEach(day => day.empty());
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues().then(venues => {
    renderVenues(venues);
  });
  getForecast().then(days => {
    renderForecast(days);
  });
  getCurrentForecast().then(current => {
    renderCurrent(current);
  });
  return false;
}

$submit.click(executeSearch);
