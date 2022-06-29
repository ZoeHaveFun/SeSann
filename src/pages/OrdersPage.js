import { useContext } from 'react';
import { firebaseUsers } from '../utils/firestore';
import { OrderList } from '../components/List';

function OrdersPage() {
  const userInfo = useContext(firebaseUsers.AuthContext);
  return (
    <div>
      {
         userInfo.orders?.map?.((item) => <OrderList item={item} key={item.user_id} />)
      }
    </div>
  );
}
export default OrdersPage;
