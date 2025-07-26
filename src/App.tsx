import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CartouchaExperience from './components/CartouchaExperience';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for papyrus background
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Loading Screen */}
      {isLoading && (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading Cartoucha...</div>
        </div>
      )}

      {/* Papyrus Background */}
      <div className="papyrus-background">

        {/* Main Content */}
        <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          <Header />

          {/* Cartoucha Experience - Integrated translator and 3D model */}
          {!isLoading && (
            <main className="flex-1">
              <CartouchaExperience />
            </main>
          )}

          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
