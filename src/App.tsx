import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CartouchaExperience from './components/CartouchaExperience';
import cartouchaVideo from './assets/cartoucha-optimized.mp4';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time and wait for video to be ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds loading time

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

      {/* Video Background */}
      <div className="video-background">
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => {
            // Video is ready, but we still wait for the timer
          }}
        >
          <source src={cartouchaVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

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
    </>
  );
}

export default App;
