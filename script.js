$(document).ready(function () {
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

  // function makeRow(text) {
  //   var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
  //   $(".history").append(li);
  // }

  function searchWeather(searchValue) {
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=2aefe10b8806f4469247d8807ad2c892&units=imperial",
      dataType: "json",
      success: function (data) {
        // create history link for this search
        // if (history.indexOf(searchValue) === -1) {
        //   history.push(searchValue);
        //   window.localStorage.setItem("history", JSON.stringify(history));

        //   makeRow(searchValue);
        // }
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
        getForecast(searchValue);
      }
    });
  }



//5 day forecast
 function forecast() {
  $.ajax({
      url: "http://api.openweathermap.org/data/2.5/forecast/daily?q="+searchValue"&cnt=5&appid=2aefe10b8806f4469247d8807ad2c892&units=imperial",
      method: "GET",
      dataType: "JSON",
  }).then(function(response) {
      var i = 0;

      for (trail in response.trails) {
          i++;
          createforecast(response, i);
      }
  });
};

function createforecast(response, i) {
  // create html content for current weather
  var card = $("<div class='card'>");
  var cardBody = $("<div class='card-body'>");
  var title = $("<h3 class='card-title'>").text(response.trails[i].name);
  // var summary = $("<p class='card-text'>").text(response.trails[i].summary);
  var stars = $("<p class='card-text'>").text("Stars: " + response.trails[i].stars);
  var trailLength = $("<p class='card-text'>").text("Trail Length: " + response.trails[i].length + " miles");
  var condition = $("<p class='card-text'>").text("Trail condition: " + response.trails[i].conditionStatus);
  var src = response.trails[i].imgMedium;
  var img = $("<div class='card-img'>").css("background-image", "url('" + src + "')");

  // merge and add to page
  cardBody.append(title, trailLength, stars, condition);
  card.append(img, cardBody);
  $("#forecast").append(card);
}


});
