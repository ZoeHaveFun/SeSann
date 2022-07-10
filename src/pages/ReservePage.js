import { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { firebaseReserve, firebaseUsers, firebaseMachines } from '../utils/firestore';
import { ReserveList } from '../components/List';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px 0px;
`;

function ReservePage() {
  const [reserves, setReserves] = useState([]);
  const userInfo = useContext(firebaseUsers.AuthContext);
  const userId = userInfo.user_id;

  const CancelReserve = async (machineId, reserveId) => {
    const reserveMachineData = await firebaseMachines.getOne(machineId);
    const newReserveIds = reserveMachineData.reserveIds.filter((id) => id !== reserveId);
    const newRemids = reserves.filter((item) => item.reserve_id !== reserveId);

    firebaseMachines.updateReserveIds(machineId, newReserveIds);
    firebaseReserve.delet(reserveId);
    setReserves(newRemids);
  };
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
    <Wrapper>
      {
         reserves?.map((item) => (
           <ReserveList
             item={item}
             key={item.reserve_id}
             CancelReserve={CancelReserve}
           />
         ))
      }
    </Wrapper>
  );
}
export default ReservePage;
