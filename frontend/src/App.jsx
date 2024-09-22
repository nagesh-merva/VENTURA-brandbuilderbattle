import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeamList from './components/TeamsList';
import ProductDetail from './components/ProductDetails';
import Cart from './components/Cart';

function App() {
  return (
    <Router>
      <div className="App">
        {/* You can add a navbar or header here if you want */}

        <Routes>
          {/* Route to display all teams and their products */}
          <Route path="/" element={<TeamList />} />

          {/* Route to display a single product's details */}
          <Route path="/product/:productId" element={<ProductDetail />} />

          {/* Route to display the user's cart */}
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
