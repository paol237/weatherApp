const waterIcon = "drop.png";
const apiKey = "ea8d9941c1084e47bdc81138252406";

const info = document.getElementById("info");
const date = document.getElementById("date");
const btn = document.getElementById("btn");
const image = document.getElementById("img");
const prediction = document.getElementById("prediction");
const descirption = document.getElementById("img-description");
const message = document.getElementById("message");
const forecast = document.getElementById("forecast");

// ➕ Réagir au clic sur le bouton
btn.addEventListener("click", function () {
  const input = document.getElementById("input").value.trim();

  if (input === "") {
    alert("Veuillez entrer une ville");
    return;
  }

  fetchCurrentWeather(input);
  fetchData(input);
});

// ✅ Météo actuelle
function fetchCurrentWeather(searchItems) {
  const urlObj = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(
    searchItems
  )}`;

  fetch(urlObj)
    .then((reponse) => {
      if (!reponse.ok) {
        throw new Error("Impossible de récupérer les données météo");
      }
      return reponse.json();
    })
    .then((data) => {
      info.innerHTML = "";
      prediction.innerHTML = "";
      date.innerHTML = "";
      message.innerHTML = "";
      console.log(data);

      info.innerHTML += `<i class='bx bx-map'></i>${data.location.country}, ${data.location.region}`;
      date.innerHTML += `${data.location.localtime}; ${data.location.tz_id}`;

      prediction.innerHTML = `
        <span>humidité <br><b>${data.current.humidity}%</b></span>
        <span>température <br><b>${data.current.temp_c}°C</b></span>
        <span>ressentie <br><b>${data.current.feelslike_c}°C</b></span>
        <span>rosée <br><b>${data.current.dewpoint_c ?? "N/A"}°C</b></span>
        <span>vent <br><b>${data.current.wind_kph}kph</b></span>
        <span>direction <br><b>${data.current.wind_dir}</b></span>
        <span>degré vent <br><b>${data.current.wind_degree}°</b></span>
        <span>rafale <br><b>${data.current.gust_kph}kph</b></span>
        <span>pression <br><b>${data.current.pressure_mb}</b></span>
        <span>nuages <br><b>${data.current.cloud}%</b></span>`;

      image.src = `https:${data.current.condition.icon}`;
      descirption.innerHTML = data.current.condition.text;

      if (data.current.cloud >= 80 || data.current.humidity >= 70) {
        message.innerHTML = `<p>Prenez un parapluie avant de sortir et couvrez-vous bien 🌧️</p>`;
      } else {
        message.innerHTML = `<p>Ne vous surchargez pas trop d'habits, il fait chaud dehors 🌤️</p>`;
      }
    })
    .catch((error) => {
      console.error("Erreur météo actuelle :", error);
      message.innerHTML = `<p style="color:red">Erreur lors de la récupération des données</p>`;
    });
}

// ✅ Prévisions
async function fetchData(ville) {
  try {
    const urlObj2 = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(
      ville
    )}&days=6`;
    const reponse = await fetch(urlObj2);
    const data = await reponse.json();
    const jour = data.forecast.forecastday;

    forecast.innerHTML = ""; // Vide les anciennes prévisions

    jour.forEach((jrs) => {
      const date = jrs.date;
      const condition = jrs.day.condition.text;
      const icon = jrs.day.condition.icon;
      const tempMax = jrs.day.maxtemp_c;
      const tempMin = jrs.day.mintemp_c;
      const pluie = jrs.day.daily_chance_of_rain;
      console.log(jour);
      console.log(data);

      forecast.innerHTML += `
        <div>
          <span>${date}</span>
          <span>${condition}</span>
          <span><img src="https:${icon}" style="width:30px"></span>
          <span>${tempMax}°C</span>
          <span>${tempMin}°C</span>
          <span><img src="${waterIcon}" style="width:15px">${pluie}%</span>
        </div>
      `;
    });
  } catch (error) {
    console.error("Erreur prévisions :", error);
    forecast.innerHTML = `<p style="color:red">Impossible de charger les prévisions</p>`;
  }
}

// ✅ Chargement automatique de la météo de base (Cameroon)
window.addEventListener("DOMContentLoaded", () => {
  const defaultCity = "Cameroon";
  fetchCurrentWeather(defaultCity);
  fetchData(defaultCity);
});
