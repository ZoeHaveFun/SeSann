import {
  useRef, useContext,
} from 'react';
import { firebaseStores, firebaseUsers } from '../../utils/firestore';

function StoreJoinForm() {
  const userInfo = useContext(firebaseUsers.AuthContext);
  const storeNameRef = useRef(null);
  const storeAddressRef = useRef(null);
  const storePhoneRef = useRef(null);

  const handlePostStore = () => {
    if (!userInfo.user_id) {
      window.location.href = './login';
    }

    const postData = {};
    postData.address = storeAddressRef.current.value;
    postData.store_name = storeNameRef.current.value;
    postData.phone = storePhoneRef.current.value;
    postData.user_id = userInfo.user_id;

    const storeId = firebaseStores.post(postData);
    const newStoreIds = [...userInfo.storeIds, storeId];
    firebaseUsers.updateStoreIds(userInfo.user_id, newStoreIds);

    storeAddressRef.current.value = '';
    storeNameRef.current.value = '';
    storePhoneRef.current.value = '';
  };
  return (
    <div style={{ backgroundColor: '#cbf3f0', height: '100vh' }}>
      <h2>店家入駐</h2>
      <label htmlFor="storeName">
        店家名稱
        <input type="text" name="storeName" placeholder="妳的店名..." ref={storeNameRef} />
      </label>
      <label htmlFor="storeAddress">
        店家地址
        <input type="text" name="storeAddress" placeholder="店在哪裡..." ref={storeAddressRef} />
      </label>
      <label htmlFor="storePhone">
        電話
        <input type="text" name="storePhone" placeholder="連絡電話..." ref={storePhoneRef} />
      </label>
      <button type="submit" onClick={handlePostStore}>入駐店家</button>
    </div>

  );
}

export default StoreJoinForm;
