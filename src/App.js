import './App.css';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import db from './firestore';

function App() {
  async function getData() {
    const docRef = doc(db, 'Market', 'Ub5pVDOCDn0qs9ZfYjff');
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
  }
  useEffect(() => { getData(); }, []);

  return (
    <div className="App">很棒</div>
  );
}

export default App;
