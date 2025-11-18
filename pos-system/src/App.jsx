import { useState, useEffect } from 'react';
import { ShoppingCart, Package, History } from 'lucide-react';
import { initializeSampleData } from './services/db';
import { t } from './utils/translations';

// Import components
import SalesScreen from './components/SalesScreen';
import ProductManagement from './components/ProductManagement';
import SalesHistory from './components/SalesHistory';

/**
 * Main App Component
 * Handles navigation between different screens
 */
function App() {
  // Current active screen
  const [activeScreen, setActiveScreen] = useState('sales');

  /**
   * Initialize database with sample data on first load
   */
  useEffect(() => {
    initializeSampleData();
  }, []);

  /**
   * Navigation tabs configuration
   */
  const navTabs = [
    { id: 'sales', label: t('nav.sales'), icon: ShoppingCart },
    { id: 'products', label: t('nav.products'), icon: Package },
    { id: 'history', label: t('nav.history'), icon: History },
  ];

  /**
   * Render active screen component
   */
  const renderScreen = () => {
    switch (activeScreen) {
      case 'sales':
        return <SalesScreen />;
      case 'products':
        return <ProductManagement />;
      case 'history':
        return <SalesHistory />;
      default:
        return <SalesScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center p-4">
            {/* Logo/Title */}
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <ShoppingCart size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">سیستەمی فرۆشتن</h1>
                <p className="text-xs text-gray-600">POS System</p>
              </div>
            </div>

            {/* Navigation Tabs - Desktop */}
            <div className="hidden md:flex gap-2">
              {navTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeScreen === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveScreen(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Tabs - Mobile (Bottom) */}
          <div className="md:hidden grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-lg">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeScreen === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveScreen(tab.id)}
                  className={`flex flex-col items-center gap-1 py-3 rounded-lg font-bold transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700'
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-xs">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pb-4">
        {renderScreen()}
      </main>
    </div>
  );
}

export default App;
