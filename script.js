let userInput;
let latestSearch = localStorage.getItem("latest search");
let pastSearchDiv = `<li class="past-searches__item">
<a href="#" onClick="getWeather(this.innerHTML)" class="past-searches__link" >
  ${userInput}
</a>
</li>`;

document.addEventListener("DOMContentLoaded", function () {
  getWeather(latestSearch);
  document.querySelector(".today").value = localStorage.getItem("today");
  document.querySelector(".day--1").value = localStorage.getItem("day-1");
  document.querySelector(".day--2").value = localStorage.getItem("day-2");
  document.querySelector(".day--3").value = localStorage.getItem("day-3");
  document.querySelector(".day--4").value = localStorage.getItem("day-4");
  document.querySelector(".day--5").value = localStorage.getItem("day-5");
  document.querySelector(".past-searches__link").innerHTML = latestSearch;

  document
    .querySelector(".search__button")
    .addEventListener("click", function (e) {
      e.preventDefault();
      userInput = document.querySelector(".search__input").value;
      localStorage.setItem("latest search", userInput);
      var li = document.createElement("li");
      li.innerHTML = `<li class="past-searches__item">
      <a href="#" onClick="getWeather(this.innerHTML)" class="past-searches__link" >
        ${userInput}
      </a>
      </li>`;
      document.querySelector(".past-searches").appendChild(li);
      getWeather(userInput);
    });
  setNotesLocalStorage();
});

var apiCall = "";
var apiKey = "4e5dbe7db2b5e9c8b47fa40b691443d5";
var currentConditions =
  "https://api.openweathermap.org/data/2.5/weather?appid=";
var city;
var feelslike;
var humidity;
var wind;
var lat;
var lon;

function getWeather(userInput) {
  apiCall = currentConditions + apiKey + "&q=" + userInput;

  $.ajax({
    url: apiCall,
    method: "GET",
  }).then(async function (response) {
    console.log(response);
    city = response.name;
    lat = response.coord.lat;
    lon = response.coord.lon;
    $(".overview__headline").html(`${city}`);
    feelslike = response.main.temp;
    feelslike = (feelslike - 273.15) * 1.8 + 32;
    feelslike = Math.floor(feelslike);
    $(".overview__temperature").html(`${feelslike} °F`);
    humidity = response.main.humidity;
    $(".overview__humidity").html(`${humidity} humidity`);
    wind = response.wind.speed;
    $(".overview__wind").html(`${wind} mph`);
    $(".overview__description").html(response.weather[0].description);

    if (response.weather[0].description == "overcast clouds") {
      $(".gallery__photo__1").attr("src", "./img/overcast-clouds-1.jpeg");
      $(".gallery__photo__2").attr("src", "./img/overcast-clouds-2.jpeg");
      $(".gallery__photo__3").attr("src", "./img/overcast-clouds-3.jpeg");
    } else if (response.weather[0].description == "light rain") {
      $(".gallery__photo__1").attr("src", "./img/light-rain-1.jpeg");
      $(".gallery__photo__2").attr("src", "./img/light-rain-2.jpeg");
      $(".gallery__photo__3").attr("src", "./img/light-rain-3.jpeg");
    } else if (response.weather[0].description == "clear sky") {
      $(".gallery__photo__1").attr("src", "./img/clear-sky-1.jpeg");
      $(".gallery__photo__2").attr("src", "./img/clear-sky-2.jpeg");
      $(".gallery__photo__3").attr("src", "./img/clear-sky-3.jpeg");
    } else if (
      response.weather[0].description == "broken clouds" ||
      response.weather[0].description == "scattered clouds"
    ) {
      $(".gallery__photo__1").attr("src", "./img/scattered-clouds-1.jpeg");
      $(".gallery__photo__2").attr("src", "./img/scattered-clouds-2.jpeg");
      $(".gallery__photo__3").attr("src", "./img/scattered-clouds-3.jpeg");
    } else if (response.weather[0].description == "few clouds") {
      $(".gallery__photo__1").attr("src", "./img/few-clouds-1.jpeg");
      $(".gallery__photo__2").attr("src", "./img/few-clouds-2.jpeg");
      $(".gallery__photo__3").attr("src", "./img/few-clouds-3.jpeg");
    }

    getUVI();
    getFiveDay(userInput);
  });
}

function getUVI() {
  var queryURL2 = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
  $.ajax({
    url: queryURL2,
    method: "GET",
  }).then(function (res) {
    var uvI = res.value;
    var uvIcolor;

    if (uvI >= 0 && uvI < 3) {
      uvIcolor = "green";
    } else if (uvI >= 3 && uvI < 6) {
      uvIcolor = "yellow";
    } else if (uvI >= 6 && uvI < 8) {
      uvIcolor = "orange";
    } else if (uvI >= 8 && uvI < 10) {
      uvIcolor = "red";
    } else {
      uvIcolor = "violet";
    }
    $(".overview__UV--index").html(`${uvI}`);
    $(".overview__UV--text").html("UVI");
    $(".overview__UV").css("background-color", `${uvIcolor}`);
  });
}

function getFiveDay(userInput) {
  var queryURL3 = `https://api.openweathermap.org/data/2.5/forecast?q=${userInput}&appid=${apiKey}`;

  $.ajax({
    url: queryURL3,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    for (i = 3; i < response.list.length; i += 8) {
      console.log(response.list[i].main.temp);
      var temp = response.list[i].main.temp;
      temp = (temp - 273.15) * 1.8 + 32;
      temp = Math.floor(temp);
      console.log(temp);
      var humidity = response.list[i].main.humidity;
      var description = response.list[i].weather[0].description;
      var svg = "";
      if (description === "clear sky") {
        svg = "light-up";
      } else if (
        description === "overcast clouds" ||
        description === "scattered clouds" ||
        description === "broken clouds" ||
        description === "few clouds"
      ) {
        svg = "icloud";
      } else if (
        description == "moderate rain" ||
        description == "light rain"
      ) {
        svg = "raindrops";
      }

      document.querySelector(
        `.five-day__${i}`
      ).innerHTML = `<svg class="five-day__days--icon"><use xlink:href="img/sprite.svg#icon-${svg}"></use></svg>
      ${temp} °F, ${description}`;
    }

    var averageTemp = 0;
    var previousdate = "";
    var count = 0;
    var results = 0;
    previousdate = moment().format("MM/DD/YYYY");
    // for (i = 0; i < response.list.length; i++) {
    //   var currentDate = moment(response.list[i].dt, "X").format("MM/DD/YYYY");
    var temp = response.list[i].main.temp;
    temp = (temp - 273.15) * 1.8 + 32;
    temp = Math.floor(temp);
    //   let humidity = response.list[i].main.humidity;
    //   console.log(currentDate);
    //   console.log(temp);

    // if (previousdate === currentDate) {
    //   averageTemp = averageTemp + temp;
    //   count++;
    //   previousdate = currentDate;
    // } else {
    //   results = averageTemp / count;
    //   results = Math.floor(results);
    //   console.log("results:", results);
    //   var card = $("<div class = 'card m-1 p-1 col-sm-2'>");

    //   var div1 = $("<div class= 'card-header'>");
    //   div1.append(currentDate);
    //   card.append(div1);

    //   var div2 = $("<div class= 'card-body'>");
    //   div2.append("Temp: " + results);
    //   div2.append("Hmdty: " + humidity);
    //   card.append(div2);

    //   $("#five-day").append(card);

    //   count = 0;
    //   averageTemp = 0;
    //   previousdate = currentDate;
    // }
    // }
  });
}

function setNotesLocalStorage() {
  var today = document.querySelector(".today").value;
  localStorage.setItem("today", today);
  console.log(today);
  var day1 = document.querySelector(".day--1").value;
  localStorage.setItem("day-1", day1);
  console.log(day1);
  var day2 = document.querySelector(".day--2").value;
  localStorage.setItem("day-2", day2);
  console.log(day2);
  var day3 = document.querySelector(".day--3").value;
  localStorage.setItem("day-3", day3);
  console.log(day3);
  var day4 = document.querySelector(".day--4").value;
  localStorage.setItem("day-4", day4);
  console.log(day4);
  var day5 = document.querySelector(".day--5").value;
  localStorage.setItem("day-5", day5);
  console.log(day5);
}
