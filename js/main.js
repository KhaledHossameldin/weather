// * HTML elements
let searchInput = document.getElementById('city');
let searchButton = document.getElementById('search-button');
let cards = [
    document.getElementById('today'),
    document.getElementById('tomorrow'),
    document.getElementById('next-day'),
];

// * variables
const apiKey = '37bf5085603d4b03859105240233107';

// * functions
(async function () { getCurrenctLocation(); })()

async function getCurrenctLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function (position) {
            searchAndSet(`${position.coords.latitude},${position.coords.longitude}`);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
        searchAndSet('cairo');
    }
}

async function searchAndSet(searchValue) {
    let data = await getWeatherData(searchValue);
    setToday(data.today);
    setDay(data.tomorrow, 1);
    setDay(data.nextDay, 2);
}

function setToday(today) {
    let header = cards[0].querySelectorAll('.card-header p');
    header[0].innerHTML = today.date.day;
    header[1].innerHTML = today.date.month;
    cards[0].querySelector('.card-body > p').innerHTML = today.city;
    let iconImage = cards[0].querySelector('.card-body img');
    iconImage.setAttribute('src', today.condition.icon);
    iconImage.classList.remove('d-none');
    cards[0].querySelector('.card-body h2').innerHTML = `${today.temprature}<sup>o</sup>C`;
    cards[0].querySelector('.card-body p.text-light').innerHTML = today.condition.text;
    let conditions = cards[0].querySelectorAll('.card-body div p');
    conditions[0].innerHTML = `<i class="fa-solid fa-umbrella"></i> ${today.humidity}%`;
    conditions[1].innerHTML = `<i class="fa-solid fa-wind"></i> ${today.wind.speed}km/h`;
    conditions[2].innerHTML = `<i class="fa-solid fa-compass"></i> ${today.wind.direction}`;
}

function setDay(day, index) {
    cards[index].querySelector('.card-header p').innerHTML = day.date.day;
    let iconImage = cards[index].querySelector('.card-body img');
    iconImage.setAttribute('src', day.condition.icon);
    iconImage.classList.remove('d-none');
    cards[index].querySelector('.card-body h2').innerHTML = `${day.temprature.max}<sup>o</sup>C`;
    cards[index].querySelector('.card-body div p').innerHTML = `${day.temprature.min}<sup>o</sup>C`;
    cards[index].querySelector('.card-body > p').innerHTML = day.condition.text;

}

async function getWeatherData(search) {
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${search}&days=3`);
    let body = await response.json();
    if (response.status == 200) {
        return {
            today: {
                date: getStringsFromDate(body.forecast.forecastday[0].date),
                city: body.location.name,
                temprature: body.current.temp_c,
                humidity: body.current.humidity,
                condition: {
                    text: body.current.condition.text,
                    icon: `https:${body.current.condition.icon}`,
                },
                wind: {
                    speed: body.current.wind_kph,
                    direction: getWindDirection(body.current.wind_dir),
                }
            },
            tomorrow: {
                date: getStringsFromDate(body.forecast.forecastday[1].date),
                condition: {
                    text: body.forecast.forecastday[1].day.condition.text,
                    icon: `https:${body.forecast.forecastday[1].day.condition.icon}`,
                },
                temprature: {
                    max: body.forecast.forecastday[1].day.maxtemp_c,
                    min: body.forecast.forecastday[1].day.mintemp_c,
                },
            },
            nextDay: {
                date: getStringsFromDate(body.forecast.forecastday[2].date),
                condition: {
                    text: body.forecast.forecastday[2].day.condition.text,
                    icon: `https:${body.forecast.forecastday[2].day.condition.icon}`,
                },
                temprature: {
                    max: body.forecast.forecastday[2].day.maxtemp_c,
                    min: body.forecast.forecastday[2].day.mintemp_c,
                },
            },
        };

    }
}

function getStringsFromDate(date) {
    let day = new Date(date);
    let dayText = day.toLocaleDateString('en', { weekday: 'short' });
    let month = `${day.getDay()} ${day.toLocaleDateString('en', { month: 'short' })}`;
    return { day: dayText, month: month };
}

function getWindDirection(direction) {
    switch (direction) {
        case 'N':
            return 'North';

        case 'E':
            return 'East';

        case 'W':
            return 'West';

        default:
            return 'South';
    }
}

// * events
searchInput.addEventListener('keyup', async function () {
    if (searchInput.value.length >= 3) {
        searchAndSet(searchInput.value);
    }
});

searchButton.addEventListener('click', async function () {
    if (searchInput.value.length >= 3) {
        searchAndSet(searchInput.value);
    }
});
