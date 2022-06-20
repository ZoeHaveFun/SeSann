import { useEffect, useState } from 'react';
import { firebaseProcessing } from '../firestore';
import { ProcessinfList } from '../components/List';

function ProcessingPage() {
  const [process, setProcess] = useState([]);
  const userId = 'mVJla3AyVysvFzWzUSG5';
  useEffect(() => {
    firebaseProcessing.getQuery(userId, 'user_id')
      .then((res) => res.map((item) => item.data()))
      .then((data) => setProcess(data));
  }, []);
  return (
    <div>
      {
         process.map((item) => <ProcessinfList item={item} key={item.process_id} />)
      }
    </div>
  );
}
export default ProcessingPage;
