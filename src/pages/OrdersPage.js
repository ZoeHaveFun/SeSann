import { useContext } from 'react';
import { firebaseUsers } from '../firestore';
import { OrderList } from '../components/List';

function OrdersPage() {
  const userInfo = useContext(firebaseUsers.CreateContext);
  return (
    <div>
      {
         userInfo.orders?.map?.((item) => <OrderList item={item} key={item.user_id} />)
      }
    </div>
  );
}
export default OrdersPage;
