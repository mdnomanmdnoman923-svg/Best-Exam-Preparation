// bep-full-project/src/firebase/config.ts

import { initializeApp, getApps, getApp } from 'firebase/app';

import {
  connectAuthEmulator,
  getAuth,
} from 'firebase/auth';

import {
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
  getFirestore,
} from 'firebase/firestore';

import {
  connectStorageEmulator,
  getStorage,
} from 'firebase/storage';

import {
  connectFunctionsEmulator,
  getFunctions,
} from 'firebase/functions';

import {
  getAnalytics,
  isSupported,
  Analytics,
} from 'firebase/analytics';

const firebaseConfig = {
  apiKey:
    import.meta.env
      .VITE_FIREBASE_API_KEY,

  authDomain:
    import.meta.env
      .VITE_FIREBASE_AUTH_DOMAIN,

  projectId:
    import.meta.env
      .VITE_FIREBASE_PROJECT_ID,

  storageBucket:
    import.meta.env
      .VITE_FIREBASE_STORAGE_BUCKET,

  messagingSenderId:
    import.meta.env
      .VITE_FIREBASE_MESSAGING_SENDER_ID,

  appId:
    import.meta.env
      .VITE_FIREBASE_APP_ID,

  measurementId:
    import.meta.env
      .VITE_FIREBASE_MEASUREMENT_ID,
};

export const app =
  getApps().length > 0
    ? getApp()
    : initializeApp(
        firebaseConfig,
      );

export const auth =
  getAuth(app);

export const db =
  getFirestore(app);

export const storage =
  getStorage(app);

export const functions =
  getFunctions(app);

export let analytics:
  | Analytics
  | null = null;

isSupported()
  .then((supported) => {
    if (supported) {
      analytics =
        getAnalytics(app);
    }
  })
  .catch(() => {
    analytics = null;
  });

enableIndexedDbPersistence(db).catch(
  (error) => {
    console.warn(
      'Firestore persistence error:',
      error,
    );
  },
);

const useEmulator =
  import.meta.env
    .VITE_USE_FIREBASE_EMULATOR ===
  'true';

if (useEmulator) {
  try {
    connectAuthEmulator(
      auth,
      'http://127.0.0.1:9099',
      {
        disableWarnings: true,
      },
    );

    connectFirestoreEmulator(
      db,
      '127.0.0.1',
      8080,
    );

    connectStorageEmulator(
      storage,
      '127.0.0.1',
      9199,
    );

    connectFunctionsEmulator(
      functions,
      '127.0.0.1',
      5001,
    );

    console.info(
      '[Firebase] Emulator connected',
    );
  } catch (error) {
    console.warn(
      '[Firebase Emulator Error]',
      error,
    );
  }
}

export function validateFirebaseEnv() {
  const requiredKeys = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  const missingKeys =
    requiredKeys.filter(
      (key) =>
        !import.meta.env[key],
    );

  return {
    valid:
      missingKeys.length === 0,
    missingKeys,
  };
}

export const firebaseEnvStatus =
  validateFirebaseEnv();

if (
  !firebaseEnvStatus.valid
) {
  console.error(
    '[Firebase Config Error] Missing env keys:',
    firebaseEnvStatus.missingKeys,
  );
}

export default app;
