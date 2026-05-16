// bep-full-project/src/firebase/storage.ts

import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  listAll,
  ref,
  uploadBytes,
  uploadBytesResumable,
  updateMetadata,
  type FirebaseStorage,
  type UploadMetadata,
  type UploadTask,
  type UploadTaskSnapshot,
  type StorageReference,
} from 'firebase/storage';

import { connectStorageEmulator, getStorage } from 'firebase/storage';

import { app } from './config';

export const storage: FirebaseStorage = getStorage(app);

const useEmulator =
  import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true';

if (useEmulator) {
  try {
    connectStorageEmulator(storage, '127.0.0.1', 9199);
    console.info('[Firebase Storage] Emulator connected');
  } catch (error) {
    console.warn('[Storage Emulator Error]', error);
  }
}

export interface StorageUploadResult<T = Record<string, unknown>> {
  fullPath: string;
  name: string;
  bucket: string;
  contentType?: string;
  size: number;
  downloadURL: string;
  metadata: T;
}

export interface StorageFileItem {
  name: string;
  fullPath: string;
  size: number;
  contentType?: string;
  timeCreated?: string;
  updated?: string;
  downloadURL?: string;
}

export interface UploadFileOptions {
  path: string;
  file: Blob | Uint8Array | ArrayBuffer;
  metadata?: UploadMetadata;
  customName?: string;
}

export interface UploadFileWithProgressOptions extends UploadFileOptions {
  onProgress?: (progress: number, snapshot: UploadTaskSnapshot) => void;
  onStateChanged?: (snapshot: UploadTaskSnapshot) => void;
  onError?: (error: Error) => void;
  onComplete?: (result: StorageUploadResult) => void;
}

function normalizePath(path: string): string {
  return path
    .trim()
    .replace(/^\/+/, '')
    .replace(/\/+/g, '/')
    .replace(/\/+$/, '');
}

function buildFileName(
  originalName: string,
  customName?: string,
): string {
  if (customName?.trim()) {
    return customName.trim();
  }

  const safeOriginal = originalName.trim();
  if (!safeOriginal) {
    return `file-${Date.now()}`;
  }

  const parts = safeOriginal.split('.');
  if (parts.length <= 1) {
    return `${safeOriginal}-${Date.now()}`;
  }

  const extension = parts.pop();
  const baseName = parts.join('.');

  return `${baseName}-${Date.now()}.${extension}`;
}

function toStorageUploadResult<T = Record<string, unknown>>(
  snapshot: UploadTaskSnapshot,
  downloadURL: string,
  extraMetadata: T,
): StorageUploadResult<T> {
  return {
    fullPath: snapshot.ref.fullPath,
    name: snapshot.ref.name,
    bucket: snapshot.ref.bucket,
    contentType: snapshot.metadata.contentType || undefined,
    size: snapshot.totalBytes,
    downloadURL,
    metadata: extraMetadata,
  };
}

export function getStorageRef(path: string): StorageReference {
  return ref(storage, normalizePath(path));
}

export function getFileRef(
  folderPath: string,
  fileName: string,
): StorageReference {
  return ref(
    storage,
    `${normalizePath(folderPath)}/${fileName}`,
  );
}

export async function uploadFile(
  options: UploadFileOptions,
): Promise<StorageUploadResult> {
  const folderPath = normalizePath(options.path);

  const fileName =
    options.file instanceof Blob
      ? buildFileName(
          'name' in options.file && typeof options.file.name === 'string'
            ? options.file.name
            : `file-${Date.now()}`,
          options.customName,
        )
      : buildFileName(`file-${Date.now()}`, options.customName);

  const fileRef = ref(storage, `${folderPath}/${fileName}`);

  const snapshot = await uploadBytes(
    fileRef,
    options.file,
    options.metadata,
  );

  const downloadURL = await getDownloadURL(snapshot.ref);

  return toStorageUploadResult(snapshot, downloadURL, options.metadata || {});
}

export function uploadFileWithProgress(
  options: UploadFileWithProgressOptions,
): UploadTask {
  const folderPath = normalizePath(options.path);

  const fileName =
    options.file instanceof Blob
      ? buildFileName(
          'name' in options.file && typeof options.file.name === 'string'
            ? options.file.name
            : `file-${Date.now()}`,
          options.customName,
        )
      : buildFileName(`file-${Date.now()}`, options.customName);

  const fileRef = ref(storage, `${folderPath}/${fileName}`);

  const task = uploadBytesResumable(
    fileRef,
    options.file,
    options.metadata,
  );

  task.on(
    'state_changed',
    (snapshot) => {
      const progress =
        snapshot.totalBytes > 0
          ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          : 0;

      options.onProgress?.(progress, snapshot);
      options.onStateChanged?.(snapshot);
    },
    (error) => {
      options.onError?.(error);
    },
    async () => {
      try {
        const downloadURL = await getDownloadURL(task.snapshot.ref);
        const result = toStorageUploadResult(
          task.snapshot,
          downloadURL,
          options.metadata || {},
        );

        options.onComplete?.(result);
      } catch (error) {
        options.onError?.(
          error instanceof Error ? error : new Error('Failed to resolve download URL'),
        );
      }
    },
  );

  return task;
}

export async function uploadImage(
  path: string,
  file: Blob | Uint8Array | ArrayBuffer,
  metadata?: UploadMetadata,
): Promise<StorageUploadResult> {
  return uploadFile({
    path,
    file,
    metadata: {
      contentType: metadata?.contentType || 'image/jpeg',
      ...metadata,
    },
  });
}

export async function uploadPdf(
  path: string,
  file: Blob | Uint8Array | ArrayBuffer,
  metadata?: UploadMetadata,
): Promise<StorageUploadResult> {
  return uploadFile({
    path,
    file,
    metadata: {
      contentType: metadata?.contentType || 'application/pdf',
      ...metadata,
    },
  });
}

export async function deleteFile(filePath: string): Promise<void> {
  const fileRef = ref(storage, normalizePath(filePath));
  await deleteObject(fileRef);
}

export async function getFileDownloadURL(
  filePath: string,
): Promise<string> {
  const fileRef = ref(storage, normalizePath(filePath));
  return getDownloadURL(fileRef);
}

export async function getFileInfo(
  filePath: string,
) {
  const fileRef = ref(storage, normalizePath(filePath));
  const metadata = await getMetadata(fileRef);
  const downloadURL = await getDownloadURL(fileRef);

  return {
    name: metadata.name,
    fullPath: metadata.fullPath,
    bucket: metadata.bucket,
    size: metadata.size,
    contentType: metadata.contentType || undefined,
    timeCreated: metadata.timeCreated || undefined,
    updated: metadata.updated || undefined,
    downloadURL,
  };
}

export async function updateFileMetadata(
  filePath: string,
  metadata: Partial<UploadMetadata>,
) {
  const fileRef = ref(storage, normalizePath(filePath));
  return updateMetadata(fileRef, metadata);
}

export async function listFiles(folderPath: string): Promise<StorageFileItem[]> {
  const folderRef = ref(storage, normalizePath(folderPath));
  const result = await listAll(folderRef);

  const items = await Promise.all(
    result.items.map(async (item) => {
      try {
        const metadata = await getMetadata(item);
        const downloadURL = await getDownloadURL(item);

        return {
          name: metadata.name,
          fullPath: metadata.fullPath,
          size: metadata.size,
          contentType: metadata.contentType || undefined,
          timeCreated: metadata.timeCreated || undefined,
          updated: metadata.updated || undefined,
          downloadURL,
        } as StorageFileItem;
      } catch {
        return {
          name: item.name,
          fullPath: item.fullPath,
          size: 0,
        } as StorageFileItem;
      }
    }),
  );

  return items;
}

export async function deleteFolderFiles(
  folderPath: string,
): Promise<void> {
  const files = await listFiles(folderPath);

  await Promise.all(
    files.map((file) => deleteFile(file.fullPath)),
  );
}

export async function uploadUserAvatar(
  userId: string,
  file: Blob | Uint8Array | ArrayBuffer,
): Promise<StorageUploadResult> {
  const extension =
    file instanceof Blob && file.type
      ? file.type.split('/')[1] || 'jpg'
      : 'jpg';

  return uploadFile({
    path: `users/${userId}/avatar`,
    file,
    customName: `avatar-${Date.now()}.${extension}`,
    metadata: {
      contentType: file instanceof Blob ? file.type || 'image/jpeg' : 'image/jpeg',
      customMetadata: {
        category: 'avatar',
        userId,
      },
    },
  });
}

export async function uploadQuestionImage(
  questionId: string,
  file: Blob | Uint8Array | ArrayBuffer,
): Promise<StorageUploadResult> {
  return uploadFile({
    path: `questions/${questionId}/images`,
    file,
    customName: `question-${Date.now()}.jpg`,
    metadata: {
      contentType: file instanceof Blob ? file.type || 'image/jpeg' : 'image/jpeg',
      customMetadata: {
        category: 'question-image',
        questionId,
      },
    },
  });
}

export async function uploadSubjectIcon(
  subjectId: string,
  file: Blob | Uint8Array | ArrayBuffer,
): Promise<StorageUploadResult> {
  return uploadFile({
    path: `subjects/${subjectId}/icons`,
    file,
    customName: `subject-icon-${Date.now()}.png`,
    metadata: {
      contentType: file instanceof Blob ? file.type || 'image/png' : 'image/png',
      customMetadata: {
        category: 'subject-icon',
        subjectId,
      },
    },
  });
}

export async function uploadChapterCover(
  chapterId: string,
  file: Blob | Uint8Array | ArrayBuffer,
): Promise<StorageUploadResult> {
  return uploadFile({
    path: `chapters/${chapterId}/covers`,
    file,
    customName: `chapter-cover-${Date.now()}.jpg`,
    metadata: {
      contentType: file instanceof Blob ? file.type || 'image/jpeg' : 'image/jpeg',
      customMetadata: {
        category: 'chapter-cover',
        chapterId,
      },
    },
  });
}

export async function uploadCommunityAttachment(
  postId: string,
  file: Blob | Uint8Array | ArrayBuffer,
): Promise<StorageUploadResult> {
  return uploadFile({
    path: `community/${postId}/attachments`,
    file,
    metadata: {
      contentType: file instanceof Blob ? file.type || 'application/octet-stream' : 'application/octet-stream',
      customMetadata: {
        category: 'community-attachment',
        postId,
      },
    },
  });
}

export function isStorageUrl(value: string): boolean {
  return /^https?:\/\/firebasestorage\.googleapis\.com\//i.test(value) ||
    /^gs:\/\//i.test(value);
}

export function extractStoragePathFromUrl(url: string): string | null {
  if (!url) return null;

  const gsMatch = url.match(/^gs:\/\/[^/]+\/(.+)$/i);
  if (gsMatch?.[1]) return gsMatch[1];

  const httpsMatch = url.match(
    /\/o\/([^?]+)(?:\?|$)/i,
  );

  if (httpsMatch?.[1]) {
    return decodeURIComponent(httpsMatch[1]);
  }

  return null;
}

export function getFolderRef(path: string): StorageReference {
  return ref(storage, normalizePath(path));
}

export function createPublicDownloadUrl(path: string): Promise<string> {
  return getFileDownloadURL(path);
}

export default storage;
