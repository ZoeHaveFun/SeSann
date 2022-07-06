/* eslint-disable no-console */
import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword, getAuth,
  signInWithEmailAndPassword, setPersistence, browserSessionPersistence, signOut,
} from 'firebase/auth';
import {
  getFirestore, setDoc, collection, getDocs, onSnapshot, doc, query, where, getDoc,
  updateDoc, deleteDoc,
} from 'firebase/firestore';
import { createContext } from 'react';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: 'laundry-27ace.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: 'laundry-27ace.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASURMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const firebaseUsers = {
  tableName: 'Users',
  async register(name, email, password) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, this.tableName, result.user.uid), {
      user_id: result.user.uid,
      user_name: name,
      points: 300,
      orders: [],
      storeIds: [],
    });
  },
  signIn(email, password) {
    return setPersistence(auth, browserSessionPersistence)
      .then(() => signInWithEmailAndPassword(auth, email, password))
      .catch(async (error) => {
        const errorMessage = await error.message;
        return errorMessage;
      });
  },
  signOut() {
    signOut(auth).then(() => {
      console.log('你O U T');
    });
  },
  onUserShot(userId, callback) {
    return onSnapshot(doc(db, this.tableName, userId), (Info) => {
      const newData = Info.data();
      callback(newData);
    });
  },
  async get(userId) {
    const docRef = doc(db, this.tableName, userId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  },
  AuthContext: createContext(),
  async addOrders(UserId, newData) {
    updateDoc(doc(db, this.tableName, UserId), {
      orders: newData,
    });
  },
  updatePointes(UserId, newPoints) {
    updateDoc(doc(db, this.tableName, UserId), {
      points: newPoints,
    });
  },
  updateStoreIds(UserId, newData) {
    updateDoc(doc(db, this.tableName, UserId), {
      storeIds: newData,
    });
  },
};

export const firebaseStores = {
  tableName: 'Stores',
  post(postData) {
    const data = doc(collection(db, this.tableName));
    setDoc(data, { ...postData, store_id: data.id });
    return data.id;
  },
  onStoresShot(callback) {
    return onSnapshot(collection(db, this.tableName), (data) => {
      const newData = [];
      data.forEach((item) => {
        newData.push(item.data());
      });
      callback(newData);
    });
  },
  async getAll() {
    const data = await getDocs(collection(db, this.tableName));
    return data.docs;
  },
  async getOne(storeId) {
    const docRef = doc(db, this.tableName, storeId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  },
  async getQuery(Id, key) {
    const q = query(collection(db, this.tableName), where(key, '==', Id));
    const data = await getDocs(q);
    return data.docs;
  },
  updateData(StoreId, data) {
    updateDoc(doc(db, this.tableName, StoreId), data);
  },
  async updateOrderRecord(StoreId, data) {
    const storeInfo = await firebaseStores.getOne(StoreId);
    const newData = [...storeInfo.order_record];
    console.log(newData);
    newData.push(data);
    console.log(newData);
    updateDoc(doc(db, this.tableName, StoreId), {
      order_record: newData,
    });
  },
};

export const firebaseMachines = {
  tableName: 'Machines',
  post(postData) {
    const data = doc(collection(db, this.tableName));
    setDoc(data, { ...postData, machine_id: data.id });
  },
  onMachinesShot(storeId, key, callback) {
    const q = query(collection(db, this.tableName), where(key, '==', storeId));
    return onSnapshot(q, (data) => {
      const newData = [];
      data.forEach((item) => {
        newData.push(item.data());
      });
      callback(newData);
    });
  },
  async getOne(MachineId) {
    const docRef = doc(db, this.tableName, MachineId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  },
  updateStatus(MachineId, data) {
    updateDoc(doc(db, this.tableName, MachineId), {
      status: data,
    });
  },
  updateReserveIds(MachineId, data) {
    updateDoc(doc(db, this.tableName, MachineId), {
      reserveIds: data,
    });
  },
  updateData(MachineId, data) {
    updateDoc(doc(db, this.tableName, MachineId), data);
  },
  async delet(Id) {
    await deleteDoc(doc(db, this.tableName, Id));
  },
};

export const firebaseReserve = {
  tableName: 'Reserve',
  post(postData) {
    const data = doc(collection(db, this.tableName));
    setDoc(data, { ...postData, reserve_id: data.id });
    return data.id;
  },
  onReserveShot(Id, key, callback) {
    const q = query(collection(db, this.tableName), where(key, '==', Id));
    return onSnapshot(q, (data) => {
      const newData = [];
      data.forEach((item) => {
        newData.push(item.data());
      });
      callback(newData);
    });
  },
  async getQuery(Id, key) {
    const q = query(collection(db, this.tableName), where(key, '==', Id));
    const data = await getDocs(q);
    return data.docs;
  },
  async getOne(ReserveId) {
    const docRef = doc(db, this.tableName, ReserveId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  },
  async delet(Id) {
    await deleteDoc(doc(db, this.tableName, Id));
  },
};

export const firebaseProcessing = {
  tableName: 'Processing',
  post(postData) {
    const data = doc(collection(db, this.tableName));
    setDoc(data, { ...postData, process_id: data.id });
  },
  onProcessingShot(Id, key, callback) {
    const q = query(collection(db, this.tableName), where(key, '==', Id));
    return onSnapshot(q, (data) => {
      const newData = [];
      data.forEach((item) => {
        newData.push(item.data());
      });
      callback(newData);
    });
  },
  async getQuery(Id, key) {
    const q = query(collection(db, this.tableName), where(key, '==', Id));
    const data = await getDocs(q);
    return data.docs;
  },
  async getOne(Id) {
    const docRef = doc(db, this.tableName, Id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  },
  async delet(Id) {
    await deleteDoc(doc(db, this.tableName, Id));
  },
};
