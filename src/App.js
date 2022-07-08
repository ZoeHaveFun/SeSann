import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import Home from './pages/Home';
import Login from './pages/Login';
import StorePage from './pages/StorePage';
import Backstage from './pages/Backstage';
import UserPage from './pages/UserPage';
import ProcessingPage from './pages/ProcessingPage';
import ReservePage from './pages/ReservePage';
import OrdersPage from './pages/OrdersPage';
import CollectPage from './pages/CollectPage';
import './App.css';
import { firebaseUsers, auth } from './utils/firestore';

function App() {
  const { AuthContext } = firebaseUsers;
  const [userInfo, setUserInfo] = useState({});
  const [isSignIn, setIsSignIn] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsSignIn(true);
      } else {
        setUserInfo(user);
        setIsSignIn(false);
      }
    });
    const handleUserInfo = (data) => {
      setUserInfo(data);
    };
    if (isSignIn) {
      return firebaseUsers.onUserShot(auth.currentUser.uid, handleUserInfo);
    }
    return undefined;
  }, [isSignIn]);
  return (
    <AuthContext.Provider value={userInfo}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/store/backstage" element={<Backstage />} />
          <Route path="/user" element={<UserPage />}>
            <Route path="processing" element={<ProcessingPage />} />
            <Route path="reserve" element={<ReservePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="collect" element={<CollectPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
