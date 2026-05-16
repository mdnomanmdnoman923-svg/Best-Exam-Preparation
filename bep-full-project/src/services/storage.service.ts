
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';
import { storage } from '@/firebase/config';

export class StorageService {
  static async upload(
    path: string,
    file: File,
  ): Promise<string> {
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file);

    return await getDownloadURL(storageRef);
  }

  static uploadWithProgress(
    path: string,
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);

      const task = uploadBytesResumable(storageRef, file);

      task.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred /
              snapshot.totalBytes) *
            100;

          onProgress?.(Math.round(progress));
        },
        reject,
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        },
      );
    });
  }

  static async remove(path: string) {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  }
}
