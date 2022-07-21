/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { firebaseReserve, firebaseUsers, firebaseMachines } from '../utils/firestore';
import { ReserveList } from '../components/List';
import { initialData } from '../utils/reuseFunc';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px 0px;
`;
const Message = styled.h3`
  width: 100%;
  box-shadow: 0px 0px 8px #e7ecef;
  border-radius: 0.8rem;
  padding: 20px 0px;
  text-align: center;
  color: #bec5c9;
  font-size: 18px;
`;

function ReservePage() {
  const [reserves, setReserves] = useState([]);
  const userInfo = useContext(firebaseUsers.AuthContext);
  const userId = userInfo.user_id;
  const navegate = useNavigate();

  const CancelReserve = async (machineId, reserveId) => {
    Swal.fire({
      title: '確定要取消預約嗎?',
      icon: 'warning',
      showCancelButton: true,
      customClass: {
        popup: 'secondReserve',
      },
      cancelButtonText: '我再想想',
      confirmButtonText: '是的,我要取消',
      confirmButtonColor: '#b64a41',
    }).then(async (result) => {
      if (result.isConfirmed === false) return;
      const reserveMachineData = await firebaseMachines.getOne(machineId);
      const newReserveIds = reserveMachineData.reserveIds.filter((id) => id !== reserveId);
      const newRemids = reserves.filter((item) => item.reserve_id !== reserveId);

      firebaseMachines.updateReserveIds(machineId, newReserveIds);
      firebaseReserve.delet(reserveId);
      setReserves(newRemids);
      Swal.fire(
        '您已取消預約囉',
        '可以到預約中查看預約狀態',
        'success',
      );
    });
  };
  const getReserve = () => {
    const handleReserveUpdate = (newData) => {
      setReserves(newData);
      initialData('reserve', newData);
    };
    return firebaseReserve.onReserveShot(userId, 'user_id', handleReserveUpdate);
  };
  useEffect(() => {
    if (userId) {
      getReserve();
    } else {
      navegate('/', { replace: true });
    }
  }, [userId]);
  return (
    <Wrapper>
      {
        reserves.length === 0 ? <Message>“我剛洗好床單,要不要一起滚”</Message>
          : reserves?.map((item) => (
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
