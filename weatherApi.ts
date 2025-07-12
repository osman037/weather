// Weather API service for real-time data

// Geocoding service to convert ZIP/postal codes to coordinates
export const geocodeLocation = async (postalCode: string, country: string) => {
  try {
    if (country === 'US') {
      // Use Nominatim for US ZIP codes (free and reliable)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${postalCode}&countrycodes=us&limit=1&addressdetails=1`
      );
      const data = await response.json();
      if (data.length === 0) {
        throw new Error('ZIP code not found');
      }
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        name: `${result.address?.city || result.address?.town || result.address?.village || 'Unknown'}, ${result.address?.state || 'US'}`
      };
    } else {
      // Use Nominatim for Canadian postal codes
      const cleanCode = postalCode.replace(/\s+/g, ' ');
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${cleanCode}&countrycodes=ca&limit=1&addressdetails=1`
      );
      const data = await response.json();
      if (data.length === 0) {
        throw new Error('Postal code not found');
      }
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        name: `${result.address?.city || result.address?.town || result.address?.village || 'Unknown'}, ${result.address?.state || result.address?.province || 'CA'}`
      };
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Unable to find location. Please check your postal code.');
  }
};

// Get weather data from Open-Meteo (free API with no key required)
export const getWeatherData = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,snowfall,weather_code&daily=temperature_2m_min,temperature_2m_max,snowfall_sum,precipitation_sum&timezone=auto&forecast_days=1`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate data structure
    if (!data.current || !data.daily) {
      throw new Error('Invalid weather data received');
    }
    
    return {
      current: {
        temperature: data.current.temperature_2m || 0,
        snowfall: data.current.snowfall || 0,
        precipitation: data.current.precipitation || 0,
        weather_code: data.current.weather_code || 0
      },
      daily: {
        temp_min: data.daily.temperature_2m_min?.[0] || 0,
        temp_max: data.daily.temperature_2m_max?.[0] || 0,
        snowfall: data.daily.snowfall_sum?.[0] || 0,
        precipitation: data.daily.precipitation_sum?.[0] || 0
      }
    };
  } catch (error) {
    console.error('Weather API error:', error);
    throw new Error('Unable to fetch weather data. Please try again.');
  }
};

// Calculate snow day probability based on real weather data
export const calculateSnowDayProbability = (weatherData: any, country: string, schoolType: string = 'public') => {
  const { current, daily } = weatherData;
  const snowfall = daily.snowfall;
  const minTemp = daily.temp_min;
  const currentTemp = current.temperature;
  
  let probability = 0;
  
  if (country === 'US') {
    // US calculations (convert to inches and Fahrenheit)
    const snowfallInches = snowfall * 0.393701; // cm to inches
    const minTempF = (minTemp * 9/5) + 32; // Celsius to Fahrenheit
    const currentTempF = (currentTemp * 9/5) + 32;
    
    // Snow impact (0-50 points)
    if (snowfallInches >= 8) probability += 50;
    else if (snowfallInches >= 6) probability += 45;
    else if (snowfallInches >= 4) probability += 35;
    else if (snowfallInches >= 2) probability += 25;
    else if (snowfallInches >= 1) probability += 15;
    else if (snowfallInches >= 0.5) probability += 8;
    
    // Temperature impact (0-30 points)
    if (minTempF <= 5) probability += 30;
    else if (minTempF <= 15) probability += 25;
    else if (minTempF <= 25) probability += 20;
    else if (minTempF <= 32) probability += 10;
    
    // Current conditions bonus (0-20 points)
    if (snowfallInches >= 6 && currentTempF <= 20) probability += 20;
    else if (snowfallInches >= 4 && currentTempF <= 30) probability += 15;
    else if (snowfallInches >= 2 && currentTempF <= 32) probability += 10;
    
  } else {
    // Canada calculations (cm and Celsius)
    const snowfallCm = snowfall;
    const minTempC = minTemp;
    const currentTempC = currentTemp;
    
    // Snow impact (0-50 points)
    if (snowfallCm >= 20) probability += 50;
    else if (snowfallCm >= 15) probability += 45;
    else if (snowfallCm >= 10) probability += 35;
    else if (snowfallCm >= 5) probability += 25;
    else if (snowfallCm >= 2) probability += 15;
    else if (snowfallCm >= 1) probability += 8;
    
    // Temperature impact (0-30 points)
    if (minTempC <= -30) probability += 30;
    else if (minTempC <= -25) probability += 25;
    else if (minTempC <= -20) probability += 20;
    else if (minTempC <= -15) probability += 15;
    else if (minTempC <= -10) probability += 10;
    else if (minTempC <= -5) probability += 5;
    
    // Current conditions bonus (0-20 points)
    if (snowfallCm >= 15 && currentTempC <= -15) probability += 20;
    else if (snowfallCm >= 10 && currentTempC <= -10) probability += 15;
    else if (snowfallCm >= 5 && currentTempC <= -5) probability += 10;
  }
  
  // School type adjustments
  if (schoolType === 'private') {
    probability *= 0.8; // Private schools less likely to close
  } else if (schoolType === 'college') {
    probability *= 0.6; // Colleges rarely close
  }
  
  return Math.min(Math.max(probability, 0), 100);
};

// Get sample data for testing (fallback)
export const getSampleData = (postalCode: string, country: string) => {
  // This should only be used if APIs fail
  return {
    current: {
      temperature: country === 'US' ? -2 : -8,
      snowfall: 0,
      precipitation: 0,
      weather_code: 71
    },
    daily: {
      temp_min: country === 'US' ? -5 : -12,
      temp_max: country === 'US' ? 2 : -3,
      snowfall: country === 'US' ? 7.6 : 12.4,
      precipitation: country === 'US' ? 8.2 : 15.1
    }
  };
};