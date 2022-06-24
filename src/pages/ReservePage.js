import { useEffect, useState, useContext } from 'react';
import { firebaseReserve, firebaseUsers } from '../firestore';
import { ReserveList } from '../components/List';

function ReservePage() {
  const [reserves, setReserves] = useState([]);
  const userInfo = useContext(firebaseUsers.userContext);
  const userId = userInfo.user_id;
  useEffect(() => {
    // const handleReservesUpdate = (newData) => {
    //   setReserves(newData);
    // };
    // return firebaseReserve.onReserveShot(userId, 'user_id', handleReservesUpdate);
    firebaseReserve.getQuery(userId, 'user_id')
      .then((res) => res.map((item) => item.data()))
      .then((data) => setReserves(data));
  }, [userId]);
  return (
    <div>
      {
         reserves.map((item) => <ReserveList item={item} key={item.reserve_id} />)
      }
    </div>
  );
}
export default ReservePage;
