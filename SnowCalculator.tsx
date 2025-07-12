import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { geocodeLocation, getWeatherData, calculateSnowDayProbability } from '@/services/weatherApi';

interface WeatherData {
  location: string;
  snowfall: string;
  temperature: string;
  probability: number;
  alert: string;
  tempMin: string;
  tempMax: string;
  coordinates: string;
}

const SnowCalculator: React.FC = () => {
  const [country, setCountry] = useState('US');
  const [postalCode, setPostalCode] = useState('');
  const [schoolType, setSchoolType] = useState('public');
  const [result, setResult] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState('Ready');

  const validateInput = (code: string, countryCode: string): boolean => {
    const cleanCode = code.replace(/\s+/g, '').toUpperCase();
    if (countryCode === 'US') {
      return /^\d{5}(-\d{4})?$/.test(cleanCode);
    } else {
      return /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(cleanCode.replace(/\s/g, ''));
    }
  };

  const calculateProbability = async () => {
    if (!postalCode.trim()) {
      setError('Please enter a postal code');
      return;
    }

    const cleanedCode = postalCode.replace(/\s+/g, '').toUpperCase();
    if (!validateInput(cleanedCode, country)) {
      setError(`Invalid ${country === 'US' ? 'ZIP code (e.g., 90210)' : 'postal code (e.g., M5V3L9)'} format`);
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setApiStatus('Connecting...');

    try {
      // Step 1: Geocode the postal code
      setApiStatus('🌍 Getting location...');
      const location = await geocodeLocation(cleanedCode, country);
      
      // Step 2: Get weather data
      setApiStatus('🌤️ Fetching weather data...');
      const weatherData = await getWeatherData(location.lat, location.lon);
      
      // Step 3: Calculate probability
      setApiStatus('🧮 Calculating probability...');
      const probability = calculateSnowDayProbability(weatherData, country, schoolType);
      
      // Format the results based on country
      const snowfall = country === 'US' 
        ? `${(weatherData.daily.snowfall * 0.393701).toFixed(1)} inches`
        : `${weatherData.daily.snowfall.toFixed(1)} cm`;
      
      const currentTemp = country === 'US'
        ? `${((weatherData.current.temperature * 9/5) + 32).toFixed(1)}°F`
        : `${weatherData.current.temperature.toFixed(1)}°C`;
      
      const tempMin = country === 'US'
        ? `${((weatherData.daily.temp_min * 9/5) + 32).toFixed(1)}°F`
        : `${weatherData.daily.temp_min.toFixed(1)}°C`;
      
      const tempMax = country === 'US'
        ? `${((weatherData.daily.temp_max * 9/5) + 32).toFixed(1)}°F`
        : `${weatherData.daily.temp_max.toFixed(1)}°C`;
      
      // Generate alert based on probability and conditions
      let alert = '';
      const snowAmount = country === 'US' ? weatherData.daily.snowfall * 0.393701 : weatherData.daily.snowfall;
      const minTemp = country === 'US' ? (weatherData.daily.temp_min * 9/5) + 32 : weatherData.daily.temp_min;
      
      if (probability >= 80) {
        alert = '🚨 Very High: Schools will likely close!';
      } else if (probability >= 60) {
        alert = '❄️ High: Strong chance of closure or delays.';
      } else if (probability >= 40) {
        alert = '⚠️ Moderate: Possible delays, monitor conditions.';
      } else if (probability >= 20) {
        alert = '🌨️ Low: Unlikely closure, but watch weather.';
      } else {
        alert = '☀️ Very Low: Normal school day expected.';
      }
      
      const resultData: WeatherData = {
        location: location.name,
        snowfall: snowfall,
        temperature: currentTemp,
        tempMin: tempMin,
        tempMax: tempMax,
        probability: Math.round(probability),
        alert: alert,
        coordinates: `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`
      };
      
      setResult(resultData);
      setApiStatus('✅ Connected - Real-time data');
      
    } catch (error: any) {
      console.error('Calculation error:', error);
      setError(error.message || 'Unable to get weather data. Please check your postal code and try again.');
      setApiStatus('❌ Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (probability: number) => {
    if (probability >= 70) return { level: 'High', color: 'bg-red-500' };
    if (probability >= 40) return { level: 'Medium', color: 'bg-yellow-500' };
    return { level: 'Low', color: 'bg-green-500' };
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase();
    
    // Auto-format Canadian postal codes
    if (country === 'CA' && value.length === 6 && !value.includes(' ')) {
      value = value.slice(0, 3) + ' ' + value.slice(3);
    }
    
    setPostalCode(value);
    setError(''); // Clear error when user types
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            ❄️ Snow Day Calculator
            <span className="text-2xl">{country === 'US' ? '🇺🇸' : '🇨🇦'}</span>
          </CardTitle>
          <div className="text-center text-sm text-gray-600">
            API Status: {apiStatus}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <Select value={country} onValueChange={(value) => { setCountry(value); setPostalCode(''); setError(''); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">🇺🇸 United States</SelectItem>
                  <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {country === 'US' ? 'ZIP Code' : 'Postal Code'}
              </label>
              <Input
                value={postalCode}
                onChange={handlePostalCodeChange}
                placeholder={country === 'US' ? '90210' : 'M5V 3L9'}
                maxLength={country === 'US' ? 10 : 7}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">School Type</label>
            <Select value={schoolType} onValueChange={setSchoolType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public School</SelectItem>
                <SelectItem value="private">Private School</SelectItem>
                <SelectItem value="college">College/University</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-red-500 text-sm p-3 bg-red-50 rounded border border-red-200">
              ⚠️ {error}
            </div>
          )}

          <Button 
            onClick={calculateProbability} 
            disabled={loading || !postalCode.trim()}
            className="w-full"
          >
            {loading ? 'Calculating...' : 'Calculate Snow Day Probability'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-blue-600">
                {result.probability}%
              </div>
              <Badge className={`${getRiskLevel(result.probability).color} text-white text-lg px-4 py-2`}>
                {getRiskLevel(result.probability).level} Risk
              </Badge>
              <div className="space-y-3">
                <p className="font-semibold text-lg">{result.location}</p>
                <p className="text-xs text-gray-500">Coordinates: {result.coordinates}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded">
                  <div className="text-center">
                    <p className="font-medium text-gray-600">Expected Snowfall</p>
                    <p className="text-xl font-bold text-blue-600">{result.snowfall}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-600">Current Temp</p>
                    <p className="text-xl font-bold text-blue-600">{result.temperature}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-600">Low</p>
                    <p className="text-lg font-semibold">{result.tempMin}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-600">High</p>
                    <p className="text-lg font-semibold">{result.tempMax}</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded border border-blue-200">
                  <p className="text-lg font-medium text-blue-800">{result.alert}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SnowCalculator;