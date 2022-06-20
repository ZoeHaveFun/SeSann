import { initializeApp } from 'firebase/app';
import {
  getFirestore, setDoc, collection, getDocs, onSnapshot, doc, query, where, getDoc,
  updateDoc, deleteDoc,
} from 'firebase/firestore';
import { createContext } from 'react';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASURMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const firebaseStores = {
  tableName: 'Stores',
  post(postData) {
    const data = doc(collection(db, this.tableName));
    setDoc(data, { ...postData, store_id: data.id });
  },
  postSnapshot(callback) {
    return onSnapshot(collection(db, this.tableName), callback);
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
};

export const firebaseMachines = {
  tableName: 'Machines',
  post(postData) {
    const data = doc(collection(db, this.tableName));
    setDoc(data, { ...postData, machine_id: data.id });
  },
  async getQuery(storeId, key) {
    const q = query(collection(db, this.tableName), where(key, '==', storeId));
    const data = await getDocs(q);
    return data.docs;
  },
  async getOne(MachineId) {
    const docRef = doc(db, this.tableName, MachineId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  },
  set(MachineId, data) {
    updateDoc(doc(db, 'Machines', MachineId), {
      processing: data,
    });
  },

};

export const firebaseUsers = {
  tableName: 'Users',
  async get(userId) {
    const docRef = doc(db, this.tableName, userId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  },
  CreateContext: createContext(),
  async addOrders(Id, data) {
    const docSnap = await getDoc(doc(db, this.tableName, Id));
    const orderData = docSnap.data().orders;
    orderData.push(data);
    updateDoc(doc(db, this.tableName, Id), {
      orders: orderData,
    });
  },
};

export const firebaseReserve = {
  tableName: 'Reserve',
  post(postData) {
    const data = doc(collection(db, this.tableName));
    setDoc(data, { ...postData, reserve_id: data.id });
  },
  async getQuery(userId, key) {
    const q = query(collection(db, this.tableName), where(key, '==', userId));
    const data = await getDocs(q);
    return data.docs;
  },
};

export const firebaseProcessing = {
  tableName: 'Processing',
  post(postData) {
    const data = doc(collection(db, this.tableName));
    setDoc(data, { ...postData, process_id: data.id });
  },
  async getQuery(userId, key) {
    const q = query(collection(db, this.tableName), where(key, '==', userId));
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
