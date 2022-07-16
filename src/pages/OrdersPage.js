/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { firebaseUsers } from '../utils/firestore';
import { OrderList } from '../components/List';

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
  color: #bec5c9;
  text-align: center;
  font-size: 18px;
`;
function OrdersPage() {
  const userInfo = useContext(firebaseUsers.AuthContext);
  const navegate = useNavigate();

  useEffect(() => {
    if (userInfo === undefined) {
      navegate('/', { replace: true });
    }
  }, [userInfo]);
  return (
    <Wrapper>
      {
        userInfo.orders.length === 0 ? (
          <Message>
            “看到了你以後，空氣都變甜了”
          </Message>
        )
          : userInfo.orders?.map?.((item) => <OrderList item={item} key={item.user_id} />)
      }
    </Wrapper>
  );
}
export default OrdersPage;
