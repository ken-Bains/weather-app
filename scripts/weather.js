$(document).ready(function () {
    var cityArr = [];
    var todayDate = new Date().toLocaleDateString();

    if (localStorage.getItem("listOfCities") !== null) {
        cityArr = JSON.parse(localStorage.getItem("listOfCities"));
        showCityHistory();
        getData(cityArr[0]);
    }

    $("#citySearchBtn").on("click", function (e) {
        var cityName = $("#cityNameInput").val().trim();
        cityArr.push(cityName);
        localStorage.setItem("listOfCities", JSON.stringify(cityArr));
        showCityHistory();
        getData(cityName);
        $("#cityNameInput").val("");
    });

//-------------------------------------------------------api calls--------------------------------

    function getData(city) {
        var forcastUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&&appid=e3a10069efa8b8e0d1fbc786695520e8"
        var currentWeatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&&appid=e3a10069efa8b8e0d1fbc786695520e8"

        $("#mainContentWrapper").removeClass("hideElement");
        $("#greetingText").addClass("hideElement");

        $.ajax({
            url: forcastUrl,
            method: "GET"
        }).then(function (res) {
            showForcast(res);
        });

        $.ajax({
            url: currentWeatherUrl,
            method: "GET"
        }).then(function (res) {
            showCurrentWeather(res);
            getUVIndex(res.coord);
        });
    };

    function getUVIndex(coord) {
        var uvUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" +coord.lat + "&lon=" + coord.lon + "&&appid=e3a10069efa8b8e0d1fbc786695520e8";

        $.ajax({
            method: "GET",
            url: uvUrl
        }).then(function(res){
            var colorIndex;

            if (res.value <= 2) {
                colorIndex = "green";
            } else if (res.value > 2 && res.value <= 5) {
                colorIndex = "yellow";
            } else if (res.value > 5 && res.value <= 7) {
                colorIndex = "orange";
            } else if (res.value > 8 && res.value <= 10) {
                colorIndex = "red";
            } else if (res.value > 11) {
                colorIndex = "purple";
            }

            $("#uvDiv").html("UV Index: <span class='indexStyle' style='background-color:" + colorIndex + ";'>" + res.value);

        });
    };

//-------------------------------------------------------appending content to body--------------------------------

    function showCityHistory() {
        var listDiv = $("#searchHistoryList");
        listDiv.empty();

        for (var i = 0; i < cityArr.length; i++) {
            listDiv.prepend("<li class='nav-item'><div class='card'><div class='card-body'>" + cityArr[i]);
        }
    };

    function showForcast(res) {
        var forcastDiv = $(".card-deck");
        forcastDiv.html("");

        for (var i = 0; i < res.list.length; i++) {
            var items = res.list[i].dt_txt;
            var forcastDate = new Date(items).toLocaleDateString('en-US');

            if (items.indexOf("15:00:00") > 0 && forcastDate !== todayDate) { 
                forcastDiv.append("<div class='card bg-primary text-white'><div class='card-body'><p>" + forcastDate + "</p><img src=https://openweathermap.org/img/wn/" + res.list[i].weather[0].icon + ".png>" + "<p>Temp: " + Math.ceil(res.list[i].main.temp) + " °F</p><p>Humidity: " + res.list[i].main.humidity + "%");
            }
        }
    };

    function showCurrentWeather(res) {
        $("#cityName").html(res.name + " (" + todayDate + ")<img src=https://openweathermap.org/img/wn/" + res.weather[0].icon + ".png>");
        $("#tempDiv").html("Temperature: " + res.main.temp + " °F");
        $("#humdityDiv").html("Humidity: " + res.main.humidity + "%");
        $("#windDiv").html("Wind speed: " + res.wind.speed + " MPH");
    };

//-------------------------------------------------------cross-origin error--------------------------------

    jQuery.ajaxPrefilter(function (options) {
        if (options.crossDomain && jQuery.support.cors) {
            options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
        }
    });
});