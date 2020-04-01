$(document).ready(function () {
  var searchValue = $("#search-value").val();
  $("#search-button").on("click", function () {
    var searchValue = $("#search-value").val();

    // clear input box
    $("#search-value").val("");

    searchWeather(searchValue);
    forecast(searchValue);
  });

  $(".history").on("click", "li", function () {
    searchWeather($(this).text());
  });

  function makeRow(text) {
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $(".history").append(li);
  }

  function searchWeather(searchValue) {
    $.ajax({
      type: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=2aefe10b8806f4469247d8807ad2c892&units=imperial",
      dataType: "json",
      success: function (data) {
        //create history link for this search
        if (history.indexOf(searchValue) === -1) {
          history.push(searchValue);
          window.localStorage.setItem("history", JSON.stringify(history));

          makeRow(searchValue);
        }
        console.log(data);
        // clear any old content
        $("#today").empty();

        // create html content for current weather
        var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        var card = $("<div>").addClass("card");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
        var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");
        var cardBody = $("<div>").addClass("card-body");
        var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

        // merge and add to page
        title.append(img);
        cardBody.append(title, temp, humid, wind);
        card.append(cardBody);
        $("#today").append(card);

        // call follow-up api endpoints
        
      }
    });
  }



  //5 day forecast
  function forecast(searchValue) {
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=2aefe10b8806f4469247d8807ad2c892&units=imperial",
      dataType: "JSON",
      success: function (response) {
        console.log(response);

        $("#forecast").html("<h4 class = \"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

        //html content for forecast
        for (var i = 0; i < response.list.length; i++) {
          if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            var card = $("<div class='card'>");
            var cardBody = $("<div class='card-body'>");
            var title = $("<h3>").addClass("card-title").text(response.city.name);
            // var date = $("<h3>").addClass("card-title").text(response.list[i].);
            var temp = $("<p class='card-text'>").text("Temperature: " + response.list[i].main.temp_max + "F");
            var humidity = $("<p class='card-text'>").text("Humidity: " + response.list[i].main.humidity+ "%");
            var wind = $("<p>").addClass("card-text").text("Wind Speed: " + response.list[i].wind.speed + " MPH");
            var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png").css('height: 50px', 'width: 50px');

            // merge and add to page
            title.append(img);
            cardBody.append(title, temp, humidity, wind);
            card.append(cardBody);
            $("#forecast").append(card);
          }
        }

      }
    });
  }



  var history = JSON.parse(window.localStorage.getItem("history")) || [];
  if (history.length > 0) {
    searchWeather(history[history.length - 1]);
  }
});
