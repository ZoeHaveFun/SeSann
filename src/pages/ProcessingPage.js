import { useEffect, useState, useContext } from 'react';
import { firebaseProcessing, firebaseUsers } from '../firestore';
import { ProcessinfList } from '../components/List';

function ProcessingPage() {
  const [process, setProcess] = useState([]);
  const userInfo = useContext(firebaseUsers.CreateContext);
  const userId = userInfo.user_id;
  useEffect(() => {
    firebaseProcessing.getQuery(userId, 'user_id')
      .then((res) => res.map((item) => item.data()))
      .then((data) => setProcess(data));
  }, [userId]);
  return (
    <div>
      {
         process.map((item) => <ProcessinfList item={item} key={item.process_id} />)
      }
    </div>
  );
}
export default ProcessingPage;
