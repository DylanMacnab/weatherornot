// **************************************
// API Info
// **************************************

const apiKey = 'f0e5ebc0c2354f20bc761611180103';
const apiKeyMap = 'AIzaSyCTpMGvNM2o4i-lcsQaMPhdoQt1SC3SIIM';
const forecastUrl = 'https://api.apixu.com/v1/forecast.json?key=';
const currentUrl = 'https://api.apixu.com/v1/forecast.json?key=';
const searchUrl = 'http://api.apixu.com/v1/search.json?key=';
const geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?key=';


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
const $outfit = $('#outfit');
const $searchSuggestions = $('#search-suggestions');
const $findMyLocation = $('#find-my-location');

// **************************************
// AJAX functions
// **************************************

//Get Geolocation City Name
async function findCurrentCity() {
  // check user current location
  navigator.geolocation.getCurrentPosition(success, error);
  // fetches geolocation data if location is known
  async function success(location) {
    let latlng = `${location.coords.latitude},${location.coords.longitude}`;
    const urlToFetch = geocodeUrl + apiKeyMap + '&' + 'result_type=locality' + '&' + 'latlng=' + latlng;
    try {
      let response = await fetch(urlToFetch);
      if (response.ok) {
        let jsonResponse = await response.json();
        console.log(jsonResponse);
        let currentCity = jsonResponse;
        console.log(currentCity);
        console.log(currentCity.results[0].formatted_address);

        // To Do: move this outside data request
        $input.val(currentCity.results[0].formatted_address).focus().trigger(executeSearch());
      }
    }
    catch(error) {
      console.log('reverse google maps geocode error:' + error);
    }
  }
  // log geolocation error
  function error(err) {
    console.log(err);
  }
}


// Get Search Results
async function getSearchSuggestions() {
  const urlToFetch = searchUrl + apiKey + '&q=' + $input.val();
  try {
    let response = await fetch(urlToFetch);
    if (response.ok) {
      let jsonResponse = await response.json();
      let searchSuggestions = jsonResponse;
      return searchSuggestions;
    }
  }
  catch(error) {
    console.log('search error:' + error);
  }
}

// Get Current Weather Conditions
async function getCurrentForecast() {
  const urlToFetch = currentUrl + apiKey + '&q=' + $input.val();
  try {
    let response = await fetch(urlToFetch);
    if (response.ok) {
      let jsonResponse = await response.json();
      let location = jsonResponse;
      return location;
    }
  }
  catch(error) {
    console.log('current weather error:' + error);
  }
}

// Get 7 Day Forecast
async function getForecast() {
  const urlToFetch = forecastUrl + apiKey + '&q=' + $input.val() + '&days=7';
  try {
    let response = await fetch(urlToFetch);
    if (response.ok) {
      let jsonResponse = await response.json();
      let days = jsonResponse.forecast.forecastday;
      return days;
    }
	}
  catch(error) {
    console.log('forecast error:' + error);
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


function renderOutfit(location) {
  let accessory, top, bottom, shoe;

  // Quick references to current conditions
  let isRaining = location.current.precip_in > 0;
  let highTemp = location.forecast.forecastday["0"].day.maxtemp_f;
  let lowTemp = location.forecast.forecastday["0"].day.mintemp_f;
  let currentTemp = location.current.temp_f;

  // Select which items of clothing for each category
  function selectAccessory() {
    if (highTemp > 80) {
      accessory = 'Sun Hat';
    } else if (isRaining < 45 && lowTemp > 32) {
      accessory = 'Umbrella';
    } else if (lowTemp <= 32) {
      accessory = 'Beanie';
    }
  }

  function selectTop() {
    if (isRaining && lowTemp > 32) {
      top = 'Rain Jacket';
    } else if (highTemp > 80) {
      top = 'Tanktop';
    } else if (highTemp > 65) {
      top = 'T-Shirt';
    } else if (highTemp > 50) {
      top = 'Sweater';
    } else if (lowTemp < 32) {
      top = 'Winter Coat';
    }
  }

  function selectBottom() {
    if (highTemp > 80) {
      bottom = 'Shorts';
    } else if (currentTemp <= 35 && lowTemp < 32) {
      bottom = 'Snow Pants';
    } else {
      bottom = 'Casual Pants';
    }
  }

  function selectShoe() {
    if (isRaining) {
      shoe = 'Rain Boots';
    } else if (!isRaining && lowTemp < 32) {
      shoe = 'Winter Boots';
    } else if (highTemp > 85) {
      shoe = 'Sandals';
    } else {
      shoe = 'Sandals';
    }
  }

  // set clothing variables
  selectTop();
  selectBottom();
  selectAccessory();
  selectShoe();

  let outfitContent =
  `<div class="outfit">
    <div class="">${accessory}</div>
    <div class="">${top}</div>
    <div class="">${bottom}</div>
    <div class="">${shoe}</div>
  </div>
  `;
  $outfit.append(outfitContent);
}


// Render a datalist each time the user starts to search
function renderSearchSuggestions(searchSuggestions) {
  let searchSuggestionsContent;
  searchSuggestions.forEach(suggestion => {
    searchSuggestionsContent += `<option value="${suggestion.name.split(',')[0]}, ${suggestion.region}" class="search-list-item">`;
  });
  $searchSuggestions.append(searchSuggestionsContent);
}



// **************************************
// Event Handlers and Rendering
// **************************************

// Calls Search Functions
function executeSearch() {
  $weatherDivs.forEach(day => day.empty());
  $destination.empty();
  $currentWeather.empty();
  $outfit.empty();
  $container.css("visibility", "visible");
  getForecast().then(days => {
    renderForecast(days);
  });
  getCurrentForecast().then(location => {
    renderLocation(location);
    renderCurrent(location);
    renderOutfit(location);
  });
  return false;
}

// Trigger Search Suggestions
$input.on('input', function() {
  getSearchSuggestions().then(searchSuggestions => {
    $searchSuggestions.empty();
    renderSearchSuggestions(searchSuggestions);
  });
});

// Trigger Location
$findMyLocation.on('click', function() {
  console.log('attempting to find location');
  findCurrentCity();
});

// Trigger Search
$submit.click(executeSearch);
