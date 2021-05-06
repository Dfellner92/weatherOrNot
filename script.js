let userInput;
let latestSearch = localStorage.getItem("latest search");
let li = document.createElement("li");
let count = 0;
let d1 = 0;
let apiCall = "";
let apiKey = "4e5dbe7db2b5e9c8b47fa40b691443d5";
let currentConditions =
  "https://api.openweathermap.org/data/2.5/weather?appid=";
let apiCall2 = "";
let currentConditions2 = "https://api.openweathermap.org/data/2.5/uvi?appid=";
let apiCall3 = "";
let currentConditions3 = "https://api.openweathermap.org/data/2.5/forecast?q=";
let date;
let city;
let feelslike;
let humidity;
let wind;
let lat;
let lon;
let temp2;

let uvI;
let uvIcolor;

var svg = "";

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

const getWeather = (userInput) => {
  apiCall = currentConditions + apiKey + "&q=" + userInput;

  $.ajax({
    url: apiCall,
    method: "GET",
  }).then(async function (response) {
    city = response.name;
    lat = response.coord.lat;
    lon = response.coord.lon;
    document.querySelector(".overview__headline").innerHTML = city;
    date = moment().format("MM / DD / YYYY");
    document.querySelector(".overview__date").innerHTML = date;
    feelslike = response.main.temp;
    feelslike = (feelslike - 273.15) * 1.8 + 32;
    feelslike = Math.floor(feelslike);
    document.querySelector(
      ".overview__temperature"
    ).innerHTML = `${feelslike}°F`;
    humidity = response.main.humidity;
    document.querySelector(".overview__humidity").innerHTML = `${humidity}%`;
    wind = response.wind.speed;
    document.querySelector(".overview__wind").innerHTML = `${wind} mph`;
    document.querySelector(".overview__description").innerHTML =
      response.weather[0].description;
    picturesSelection(response.weather[0].description);
    getUVI();
    getFiveDay(userInput);
  });
};

const getUVI = () => {
  apiCall2 = currentConditions2 + apiKey + `&lat=${lat}&lon=${lon}`;

  $.ajax({
    url: apiCall2,
    method: "GET",
  }).then(function (res) {
    uvI = res.value;

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

    document.querySelector(".overview__UV--index").innerHTML = uvI;
    document.querySelector(".overview__UV--text").innerHTML = "UVI";
    document.querySelector(".overview__UV").style.backgroundColor = uvIcolor;
  });
};

const getFiveDay = (userInput) => {
  apiCall3 = currentConditions3 + `${userInput}&appid=${apiKey}`;

  $.ajax({
    url: apiCall3,
    method: "GET",
  }).then(function (response) {
    count = 1;

    for (i = 3; i < response.list.length; i += 8) {
      temp2 = response.list[i].main.temp;
      temp2 = (temp2 - 273.15) * 1.8 + 32;
      temp2 = Math.floor(temp2);
      var humidity = response.list[i].main.humidity;
      description = response.list[i].weather[0].description;
      d1 = moment().add(count, "days").startOf("day").format("MM / DD / YYYY");

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
        ${d1}, ${temp2} °F, ${description}`;
      count++;
    }
  });
};

const setNotesLocalStorage = () => {
  var today = document.querySelector(".today").value;
  localStorage.setItem("today", today);
  var day1 = document.querySelector(".day--1").value;
  localStorage.setItem("day-1", day1);
  var day2 = document.querySelector(".day--2").value;
  localStorage.setItem("day-2", day2);
  var day3 = document.querySelector(".day--3").value;
  localStorage.setItem("day-3", day3);
  var day4 = document.querySelector(".day--4").value;
  localStorage.setItem("day-4", day4);
  var day5 = document.querySelector(".day--5").value;
  localStorage.setItem("day-5", day5);
};

const picturesSelection = (resDes) => {
  if (resDes == "overcast clouds") {
    document
      .querySelector(".gallery__photo__1")
      .setAttribute("src", "./img/overcast-clouds-1.jpeg");
    document
      .querySelector(".gallery__photo__2")
      .setAttribute("src", "./img/overcast-clouds-2.jpeg");
    document
      .querySelector(".gallery__photo__3")
      .setAttribute("src", "./img/overcast-clouds-3.jpeg");
  } else if (resDes == "light rain") {
    document
      .querySelector(".gallery__photo__1")
      .setAttribute("src", "./img/light-rain-1.jpeg");
    document
      .querySelector(".gallery__photo__2")
      .setAttribute("src", "./img/light-rain-2.jpeg");
    document
      .querySelector(".gallery__photo__3")
      .setAttribute("src", "./img/light-rain-3.jpeg");
  } else if (resDes == "clear sky") {
    document
      .querySelector(".gallery__photo__1")
      .setAttribute("src", "./img/clear-sky-1.jpeg");
    document
      .querySelector(".gallery__photo__2")
      .setAttribute("src", "./img/clear-sky-2.jpeg");
    document
      .querySelector(".gallery__photo__3")
      .setAttribute("src", "./img/clear-sky-3.jpeg");
  } else if (resDes == "broken clouds" || resDes == "scattered clouds") {
    document
      .querySelector(".gallery__photo__1")
      .setAttribute("src", "./img/scattered-clouds-1.jpeg");
    document
      .querySelector(".gallery__photo__2")
      .setAttribute("src", "./img/scattered-clouds-2.jpeg");
    document
      .querySelector(".gallery__photo__3")
      .setAttribute("src", "./img/scattered-clouds-3.jpeg");
  } else if (resDes == "few clouds") {
    document
      .querySelector(".gallery__photo__1")
      .setAttribute("src", "./img/few-clouds-1.jpeg");
    document
      .querySelector(".gallery__photo__2")
      .setAttribute("src", "./img/few-clouds-2.jpeg");
    document
      .querySelector(".gallery__photo__3")
      .setAttribute("src", "./img/few-clouds-3.jpeg");
  }
};
