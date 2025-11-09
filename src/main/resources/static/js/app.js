const apiBase = '/api/weather';

function el(tag, cls, text){
  const e = document.createElement(tag);
  if(cls) e.className = cls;
  if(text) e.textContent = text;
  return e;
}

async function fetchWeather(city){
  try{
    const res = await fetch(`${apiBase}?city=${encodeURIComponent(city)}`);
    if(!res.ok){
      const body = await res.json().catch(()=>({error:res.statusText}));
      throw new Error(body.error || body.message || res.statusText);
    }
    return await res.json();
  }catch(err){
    console.warn('fetchWeather error', err);
    throw err;
  }
}

function renderPrimary(weather, city){
  const primary = document.getElementById('primary');
  primary.innerHTML = '';
  if(!weather) return;

  const icon = weather.weather && weather.weather[0] && weather.weather[0].icon ? `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png` : '';

  const img = el('img','icon');
  if(icon) img.src = icon;

  const info = el('div','info');
  const title = el('h2',null, city);
  const temp = el('div','temp', `${Math.round(weather.main.temp)}°C`);
  const desc = el('div','desc', weather.weather && weather.weather[0] ? weather.weather[0].description : '');
  const details = el('div','small', `Feels: ${Math.round(weather.main.feels_like)}°C • Humidity: ${weather.main.humidity}%`);

  info.appendChild(title);
  info.appendChild(temp);
  info.appendChild(desc);
  info.appendChild(details);

  primary.appendChild(img);
  primary.appendChild(info);
}

function renderDefaultCard(container, weather, city){
  const card = el('div','card');
  const icon = weather.weather && weather.weather[0] && weather.weather[0].icon ? `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png` : '';
  const img = el('img','icon'); if(icon) img.src = icon;
  const meta = el('div','meta');
  const title = el('h3',null, city);
  const temp = el('div','small', `${Math.round(weather.main.temp)}°C`);
  const desc = el('div','small', weather.weather && weather.weather[0] ? weather.weather[0].description : '');
  meta.appendChild(title); meta.appendChild(temp); meta.appendChild(desc);
  card.appendChild(img); card.appendChild(meta);
  container.appendChild(card);
}

async function loadDefaults(){
  const container = document.getElementById('defaults-grid');
  container.innerHTML = '';
  for(const city of window.DEFAULT_CITIES){
    try{
      const w = await fetchWeather(city);
      renderDefaultCard(container, w, city);
    }catch(e){
      // show placeholder card
      const card = el('div','card');
      card.appendChild(el('div',null, city));
      card.appendChild(el('div','small','Unavailable'));
      container.appendChild(card);
    }
  }
}

async function init(){
  const input = document.getElementById('city-input');
  const btn = document.getElementById('search-btn');
  btn.addEventListener('click', async ()=>{
    const city = input.value.trim();
    if(!city) return;
    btn.disabled = true; btn.textContent = 'Loading...';
    try{
      const w = await fetchWeather(city);
      renderPrimary(w, city);
    }catch(e){
      renderPrimary(null,'');
      alert('Could not fetch weather: ' + (e.message||e));
    }finally{ btn.disabled = false; btn.textContent = 'Search'; }
  });

  // Also support Enter key
  input.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){
      e.preventDefault();
      btn.click();
    }
  });

  // Load defaults
  await loadDefaults();

  // Render first default into primary
  try{
    const first = window.DEFAULT_CITIES[0];
    const w = await fetchWeather(first);
    renderPrimary(w, first);
  }catch(e){/* ignore */}
}

window.addEventListener('DOMContentLoaded', init);
