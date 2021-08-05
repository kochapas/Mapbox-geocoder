// TODO: Write your JS code in here
import mapboxgl from 'mapbox-gl';

const token = "pk.eyJ1Ijoia29jaGFwYXMiLCJhIjoiY2tycHk1dWRxNnVveTJwcGR4aXQ0ZTl6MiJ9.KdOddjWMfHQaU766M8z7LQ";
mapboxgl.accessToken = token;

// 1. Select the element
const form = document.querySelector("form");
const textBox = form.querySelector("input:first-child");
const carouselInner = document.querySelector(".carousel-inner");
const carouselIndicators = document.querySelector(".carousel-indicators");
const carouselControlPrev = document.querySelector(".carousel-control-prev");
const carouselControlNext = document.querySelector(".carousel-control-next");
let mapList = {};

// 2. Add the event listener

carouselControlPrev.addEventListener("click", (event) => {
  const carouselItem = document.querySelector(".carousel-item.active div:first-child");
  mapList[carouselItem.id].resize();
});

carouselControlNext.addEventListener("click", (event) => {
  const carouselItem = document.querySelector(".carousel-item.active div:first-child");
  mapList[carouselItem.id].resize();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(event);
  const text = textBox.value;
  carouselInner.innerHTML = "";
  carouselIndicators.innerHTML = "";
  mapList = {};
  // 2.5 Send request
  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(text)}.json?access_token=${token}`)
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      if (data && data.features.length > 0) {
        // 3. Change the DOM
        let index = 0;
        data.features.forEach((feature) => {
          console.log(feature);
          const longitude = feature.center[0];
          const latitude = feature.center[1];

          carouselIndicators.insertAdjacentHTML("beforeend", `
            <li data-target="#carouselCaptions" data-slide-to="${index}"></li>
          `);
          carouselInner.insertAdjacentHTML("beforeend", `
          <div class="carousel-item w-100">  
            <div id="mapbox${index}" class="d-block w-100" style="height: 500px; width: 9999px;"></div>
            <div class="carousel-caption d-none d-md-block text-dark">
              <h5 class="bg-light">${longitude}, ${latitude}</h5>
              <p class="bg-light">${feature.place_name}</p>
            </div>
          </div>
          `);
          const map = new mapboxgl.Map({
            container: `mapbox${index}`,
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [longitude, latitude],
            zoom: 12
          });

          new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map);

          console.log(map);
          mapList[`mapbox${index}`] = map;
          index += 1;
        });
        carouselInner.querySelector(".carousel-item:first-child").classList.add("active");
        carouselIndicators.querySelector("li:first-child").classList.add("active");
      }
    });
});
