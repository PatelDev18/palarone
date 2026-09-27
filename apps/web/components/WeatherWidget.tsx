"use client"
import React, { useEffect, useState } from 'react';
import { CloudRain, Wind, Thermometer } from 'lucide-react';

export function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/weather/current')
      .then(res => res.json())
      .then(data => {
        if (data.weather) setWeather(data.weather);
      })
      .catch(console.error);
  }, []);

  if (!weather) return <div className="p-4 text-xs text-gray-500">Loading Open-Meteo data...</div>;

  return (
    <div className="p-4 border-b border-gray-100 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-primary">Live Weather (Open-Meteo)</h3>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Real Data</span>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
          <Thermometer size={16} className="text-red-500 mb-1" />
          <span className="text-xs text-gray-500">Temp</span>
          <span className="font-semibold text-sm">{weather.temperature_c}°C</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
          <Wind size={16} className="text-blue-500 mb-1" />
          <span className="text-xs text-gray-500">Wind</span>
          <span className="font-semibold text-sm">{weather.wind_speed_knots} kt</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
          <CloudRain size={16} className="text-gray-500 mb-1" />
          <span className="text-xs text-gray-500">Forecast</span>
          <span className="font-semibold text-sm">{weather.forecast && weather.forecast.length > 0 ? `${weather.forecast[0].temperature_c}°C` : 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}
