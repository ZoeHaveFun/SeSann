import { useEffect, useState } from 'react';
import { firebaseReserve } from '../firestore';
import { ReserveList } from '../components/List';

function ReservePage() {
  const [reserves, setReserves] = useState([]);
  const userId = 'mVJla3AyVysvFzWzUSG5';
  useEffect(() => {
    firebaseReserve.getQuery(userId, 'user_id')
      .then((res) => res.map((item) => item.data()))
      .then((data) => setReserves(data));
  }, []);
  return (
    <div>
      {
         reserves.map((item) => <ReserveList item={item} key={item.reserve_id} />)
      }
    </div>
  );
}
export default ReservePage;
