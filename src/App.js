import { Routes, Route, BrowserRouter } from 'react-router-dom';
import AllStoresPage from './pages/AllStoresPage';
import StorePage from './pages/StorePage';
import UserPage from './pages/UserPage';
import ProcessingPage from './pages/ProcessingPage';
import ReservePage from './pages/ReservePage';
import OrdersPage from './pages/OrdersPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AllStoresPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/user" element={<UserPage />}>
          <Route path="processing" element={<ProcessingPage />} />
          <Route path="reserve" element={<ReservePage />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
