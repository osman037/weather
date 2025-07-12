import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const HowItWorks: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">How Our Snow Day Calculator Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                🌍 Real-Time Location Detection
              </h3>
              <p className="text-sm text-gray-600">
                We use advanced geocoding APIs to convert your ZIP code or postal code into precise coordinates:
              </p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• <strong>US ZIP Codes:</strong> OpenStreetMap Nominatim API</li>
                <li>• <strong>Canadian Postal Codes:</strong> Nominatim Geocoding</li>
                <li>• <strong>Accuracy:</strong> Pinpoint location within your area</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                🌤️ Live Weather Data
              </h3>
              <p className="text-sm text-gray-600">
                We fetch current and forecasted weather from Open-Meteo API:
              </p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• <strong>Current Temperature:</strong> Real-time readings</li>
                <li>• <strong>Snowfall Forecast:</strong> 24-hour predictions</li>
                <li>• <strong>Min/Max Temps:</strong> Daily temperature range</li>
                <li>• <strong>Updates:</strong> Refreshed every calculation</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              🧮 Probability Algorithm
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  🇺🇸 United States Formula
                </h4>
                <div className="bg-blue-50 p-3 rounded text-sm">
                  <p className="font-mono mb-2">Probability = Snow Impact + Temperature Impact + Bonus</p>
                  <div className="space-y-1">
                    <p><strong>Snow Impact (0-50 points):</strong></p>
                    <p>• {'>'}= 6 inches: +50 points</p>
                    <p>• {'>'}= 3 inches: +30 points</p>
                    <p>• {'>'}= 1 inch: +15 points</p>
                  </div>
                  <div className="space-y-1 mt-2">
                    <p><strong>Temperature Impact (0-30 points):</strong></p>
                    <p>• {'<'}= 10°F: +30 points</p>
                    <p>• {'<'}= 20°F: +20 points</p>
                    <p>• {'<'}= 32°F: +10 points</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  🇨🇦 Canada Formula
                </h4>
                <div className="bg-red-50 p-3 rounded text-sm">
                  <p className="font-mono mb-2">Probability = Snow Impact + Temperature Impact + Bonus</p>
                  <div className="space-y-1">
                    <p><strong>Snow Impact (0-50 points):</strong></p>
                    <p>• {'>'}= 10 cm: +50 points</p>
                    <p>• {'>'}= 5 cm: +30 points</p>
                    <p>• {'>'}= 2 cm: +15 points</p>
                  </div>
                  <div className="space-y-1 mt-2">
                    <p><strong>Temperature Impact (0-30 points):</strong></p>
                    <p>• {'<'}= -25°C: +30 points</p>
                    <p>• {'<'}= -15°C: +20 points</p>
                    <p>• {'<'}= -5°C: +10 points</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              🎯 Risk Levels
            </h3>
            <div className="flex flex-wrap gap-4">
              <Badge className="bg-green-500 text-white px-4 py-2">
                Low Risk (0-39%): Unlikely closure
              </Badge>
              <Badge className="bg-yellow-500 text-white px-4 py-2">
                Medium Risk (40-69%): Possible delays
              </Badge>
              <Badge className="bg-red-500 text-white px-4 py-2">
                High Risk (70-100%): Likely closure
              </Badge>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📊 Data Sources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <p className="font-medium">Geocoding</p>
                <p className="text-gray-600">OpenStreetMap Nominatim</p>
                <p className="text-green-600">✅ Free & Reliable</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="font-medium">Weather Data</p>
                <p className="text-gray-600">Open-Meteo API</p>
                <p className="text-green-600">✅ Real-time Updates</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="font-medium">Calculations</p>
                <p className="text-gray-600">Custom Algorithm</p>
                <p className="text-green-600">✅ Location-Specific</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HowItWorks;