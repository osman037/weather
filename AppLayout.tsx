import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import SnowCalculator from './SnowCalculator';
import HowItWorks from './HowItWorks';
import ErrorBoundary from './ErrorBoundary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              ❄️ Snow Day Calculator
            </h1>
            <p className="text-gray-600">
              Predict school closures with real-time weather data
            </p>
          </div>
          
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculator">
              <SnowCalculator />
            </TabsContent>
            
            <TabsContent value="how-it-works">
              <HowItWorks />
            </TabsContent>
          </Tabs>
          
          <footer className="text-center mt-12 text-sm text-gray-500">
            <p>WordPress-compatible • Mobile-responsive • Real-time data</p>
            <p className="mt-2">Accurate location detection • Live weather APIs • Country-specific calculations</p>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AppLayout;