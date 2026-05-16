import { storage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from '@/firebase/storage'

export const storageService = {
  async uploadAvatar(
    uid: string,
    file: File,
    onProgress?: (pct: number) => void
  ): Promise<string> {
    const path = `avatars/${uid}/${Date.now()}_${file.name}`
    const storageRef = ref(storage, path)
    const task = uploadBytesResumable(storageRef, file)

    return new Promise((resolve, reject) => {
      task.on(
        'state_changed',
        (snap) => {
          const pct = (snap.bytesTransferred / snap.totalBytes) * 100
          onProgress?.(Math.round(pct))
        },
        reject,
        async () => {
          const url = await getDownloadURL(task.snapshot.ref)
          resolve(url)
        }
      )
    })
  },

  async uploadQuestionImage(questionId: string, file: File): Promise<string> {
    const path = `questions/${questionId}/${Date.now()}_${file.name}`
    const storageRef = ref(storage, path)
    const task = uploadBytesResumable(storageRef, file)

    return new Promise((resolve, reject) => {
      task.on('state_changed', undefined, reject, async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        resolve(url)
      })
    })
  },

  async deleteFile(url: string) {
    const storageRef = ref(storage, url)
    await deleteObject(storageRef)
  },
}
