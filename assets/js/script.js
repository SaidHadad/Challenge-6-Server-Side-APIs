var generateHistory = function() {
    // get localStorage information
    var cityHistory = JSON.parse(localStorage.getItem("city"));
    // create a div to act as a container for the old searches
    if (!$(".search-history-container")?.length && cityHistory?.length) {
        $(".city-column").append('<div class="search-history-container pt-4 border-top border-dark"></div>');
    }
    // clear any info on the container in case of old searches
    $(".search-history-container").html("");
    for (let cityCounter = 0;cityCounter < cityHistory?.length;cityCounter++) {
        let city = cityHistory[cityCounter];
        $(".search-history-container").append(`<button id="CityBtn${cityCounter}" class="btn btn-secondary btn-block">${city}</button>`);
        $(".search-history-container").on("click",`#CityBtn${cityCounter}`, function () {
            createQuery(city);
            console.log(`you clicked ${cityCounter}`)
            localStorage.setItem("city", JSON.stringify(city));
        });
    }
}

var loadHistory = function() {
    var lastSearched = JSON.parse(localStorage.getItem("inputCity"));
    if (lastSearched?.length > 0) {
    //check to see if city history in in local
    //if in local get last searched city
    var lastCity = lastSearched[lastSearched.length - 1];
    //display last searched city's weather onload
    createQuery(lastCity);
    }
}

var createQuery = function(city) {
    var firstQuery = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=ae091cae15863695a3bd2a2f28f74012";

    $.ajax({
        url: firstQuery,
        method: "GET",
    }).then(function(data) {
        var secondQuery = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&units=imperial&appid=ae091cae15863695a3bd2a2f28f74012";
        $.ajax ({
            url: secondQuery,
            method: "GET",
        }).then(function (uvExtendedData) {
            var weatherIcon = uvExtendedData.current.weather[0].icon;
            var iconUrl = "https://openweathermap.org/img/wn/" + weatherIcon + ".png";

            $(".forecast-column").html("").append('<div class="jumbotron bg-white border border-dark rounded p-3 todays-forecast"></div>');
            $(".todays-forecast").append(`<h2 class="current-city">${data.name} <span class="current-city-date">${moment.unix(uvExtendedData?.current?.dt).format("M/DD/YYYY")}</span> <img id="weather-icon" src="${iconUrl}"/></h2>`);
            $(".todays-forecast").append(`<p class="current-temp">Temperature: ${uvExtendedData.current.temp + " &deg;F"}</p>`);
            $(".todays-forecast").append(`<p class="city-humidity">Humidity: ${uvExtendedData.current.humidity + " %"}</p>`);
            $(".todays-forecast").append(`<p class="city-wind">Wind Speed: ${uvExtendedData.current.wind_speed + " MPH"}</p>`);
            $(".todays-forecast").append(`<p>UV Index: <span class="${uivClassName(uvExtendedData.current.uvi)}">${uvExtendedData.current.uvi}</span></p>`);

            
            // append divs to container
            $(".forecast-column").append('<div class="future-forecast"></div>');
            $(".future-forecast").append("<h2>5-Day Forecast:</h2>");
            $(".future-forecast").append('<div class="forecast-cards"></div>');

            // display current queried cities. date, weather icon, temperature, and humidity
            uvExtendedData?.daily?.map((day, index) => {
                if (index > 0 && index < 6) {
                    $(".forecast-cards").append(`<div class="forecastCard" id="${'card' + index}">
                        <h3>${moment.unix(day.dt).format("M/DD/YYYY")}</h3>
                        <div><img id="weatherIcon" src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png"/></div>
                        <p>Temp: ${day.temp.day + " &deg;F"}</p>
                        <p>Humidity: ${day.humidity + "%"}</p>
                        </div>`);
                }
        });
    });
});
}

var uivClassName = function (uvi) {
    if (uvi < 4) {
        return "uv-favorable";
    } else if (uvi >= 4 && uvi <= 10) {
        return "uv-moderate";
    } else if (uvi > 11) {
        return "uv-extreme";
    } else {
        return "uv-undefined";
    }
}

var haceclick = function() {
    console.log("click");
}

$("#btn-search").on("click", function (event) {
    event.preventDefault();
    var city = $("#city-search").val();
    console.log(city);
    createQuery(city);

    // get list of cities from local storage and if data doesn't exist, then create an empty array
    var cityArray = JSON.parse(localStorage.getItem("city")) || [];

    // add inputCity to list
    cityArray.push(city);

    // re-save list of cities TO local storage
    localStorage.setItem("city", JSON.stringify(cityArray));
    generateHistory(cityArray);
});