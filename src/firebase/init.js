import firebase from 'firebase';
import { firestore } from 'firebase';

// Initialize Firebase
const config = {
  // Add here your Firebase config
};
const firebaseApp =  firebase.initializeApp(config);
firebaseApp.firestore().settings({ timestampsInSnapshots: true });

// Export firestore database
export default firebaseApp.firestore();