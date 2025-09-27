import React, { useEffect, useState } from 'react';

const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // यहाँ अपनी OpenWeatherMap API key डालें

function DubaiTemperature() {
  const [temp, setTemp] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=Dubai,AE&appid=${API_KEY}&units=metric`)
      .then(res => res.json())
      .then(data => {
        if (data.main && data.main.temp) {
          setTemp(data.main.temp);
        } else {
          setError('No data');
        }
      })
      .catch(() => setError('Error fetching temperature'));
  }, []);

  if (error) return <span role="img" aria-label="thermometer">🌡️ <b>Dubai Temp:</b> N/A</span>;
  if (temp === null) return <span role="img" aria-label="thermometer">🌡️ <b>Dubai Temp:</b> ...</span>;
  return <span role="img" aria-label="thermometer">🌡️ <b>Dubai Temp:</b> {temp}°C</span>;
}

export default DubaiTemperature; 