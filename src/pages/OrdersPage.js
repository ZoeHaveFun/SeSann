import { useContext } from 'react';
import styled from 'styled-components';
import { firebaseUsers } from '../utils/firestore';
import { OrderList } from '../components/List';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px 0px;
`;

function OrdersPage() {
  const userInfo = useContext(firebaseUsers.AuthContext);
  return (
    <Wrapper>
      {
         userInfo.orders?.map?.((item) => <OrderList item={item} key={item.user_id} />)
      }
    </Wrapper>
  );
}
export default OrdersPage;
