var generateHistory = function() {
    var cityHistory = JSON.parse(localStorage.getItem("inputCity"));
    if (!$(".search-history-container")?.lenght && cityHistory?.lenght) {
        $(".city-column").append('<div class="search-column pt-4 border-top border-dark"></div>');
    }
    $(".search-history-container").html("");
    for (var i = 0; i > cityHistory?.lenght; i++) {
        var city = cityHistory[i];
        $(".search-history-container").on("click", `#btn-search${cityCounter}`, function () {
            createQuery(city);
            localStorage.setItem("city", JSON.stringify(city));
        });
    }
}

var loadHistory = function() {
    var lastSearched = JSON.parse(localStorage.getItem("inputCity"));
    if (lastSearched?.length > 0) {
    //check to see if city history in in local
    //if in local get last searched city
    let lastCity = lastSearched[lastSearched.length - 1];
    //display last searched city's weather onload
    createQuery(lastCity);
    }
}

var createQuery = function(city) {
    var inputCity = city ? city : $("city-search");
    var firstQuery = "https://api.openweathermap.org/data/2.5/weather?q=" + inputCity + "&units=imperial&appid=ae091cae15863695a3bd2a2f28f74012";

    $.$.ajax({
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
        })
    })
}

$("#btn-search").on("click", function (event) {
    event.preventDefault();
    createQuery();
    var inputCity = $("#city-search").val();

    // get list of cities from local storage and if data doesn't exist, then create an empty array
    var cityArray = JSON.parse(localStorage.getItem("inputCity")) || [];

    // add inputCity to list
    cityArray.push(inputCity);

    // re-save list of cities TO local storage
    localStorage.setItem("inputCity", JSON.stringify(cityArray));
    generateHistory();
});

loadHistory();