import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-pattern">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="placeholder-animate text-center">
          <div className="modern-card rounded-2xl p-12 max-w-2xl">
           
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full w-3/4"></div>
            </div>
            
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
