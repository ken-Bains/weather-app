$(document).ready(function () {
    var cityArr = [];

    if (localStorage.getItem("listOfCities") !== null) {
        cityArr = JSON.parse(localStorage.getItem("listOfCities"));
        showCityHistory();
    }

    $("#citySearchBtn").on("click", function (e) {
        var cityName = $("#cityNameInput").val().trim();
        cityArr.push(cityName);
        localStorage.setItem("listOfCities", JSON.stringify(cityArr));
        showCityHistory();
        getData(cityName);
        $("#cityNameInput").val("");
    });

    function getData(city) {
        jQuery.ajaxPrefilter(function (options) {
            if (options.crossDomain && jQuery.support.cors) {
                options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
            }
        });
        console.log(city);
        var queryUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&&appid=e3a10069efa8b8e0d1fbc786695520e8"

        $.ajax({
            method: "GET",
            url: queryUrl
        }).then(function (res) {
            console.log(res);
            var forcastArr = [1,2,3,4,5];
            showForcast(forcastArr);

        });
    };

    function showCityHistory() {
        var listDiv = $("#searchHistoryList");
        listDiv.empty();

        for(var i = 0; i < cityArr.length; i++){
            listDiv.prepend("<li class='nav-item'><div class='card'><div class='card-body text-center'>" + cityArr[i]);
        }
    };
    
    var forcastArr = [1,2,3,4,5];
    showForcast(forcastArr);
    function showForcast(arr) {
        var forcastDiv = $(".card-deck");

        for(var i = 0; i < arr.length; i++){
            forcastDiv.append("<div class='card'><div class='card-body'>" + arr[i])
        }
    }
});