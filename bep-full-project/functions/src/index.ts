import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

admin.initializeApp()
const db = admin.firestore()

/**
 * onUserCreate — bootstrap role + profile stub for new Firebase Auth users
 */
export const onUserCreate = functions
  .region('asia-south1')
  .auth.user()
  .onCreate(async (user) => {
    const batch = db.batch()

    // Assign default 'student' role
    const roleRef = db.collection('userRoles').doc(user.uid)
    batch.set(roleRef, {
      uid: user.uid,
      role: 'student',
      permissions: [],
      grantedAt: admin.firestore.FieldValue.serverTimestamp(),
      grantedBy: 'system',
    })

    await batch.commit()
    console.log(`[onUserCreate] bootstrapped user ${user.uid}`)
  })

/**
 * updateLeaderboard — recalculate top 100 leaderboard (callable)
 */
export const updateLeaderboard = functions
  .region('asia-south1')
  .https.onCall(async (_data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required')

    const attemptsSnap = await db.collection('attempts')
      .where('status', '==', 'completed')
      .get()

    const scoreMap: Record<string, { uid: string; score: number; count: number }> = {}
    attemptsSnap.forEach((doc) => {
      const d = doc.data()
      if (!scoreMap[d.uid]) scoreMap[d.uid] = { uid: d.uid, score: 0, count: 0 }
      scoreMap[d.uid].score += d.score ?? 0
      scoreMap[d.uid].count += 1
    })

    const sorted = Object.values(scoreMap)
      .sort((a, b) => b.score - a.score)
      .slice(0, 100)

    const batch = db.batch()
    sorted.forEach((entry, i) => {
      const ref = db.collection('leaderboard').doc(entry.uid)
      batch.set(ref, { ...entry, rank: i + 1, updatedAt: admin.firestore.FieldValue.serverTimestamp() })
    })
    await batch.commit()

    return { success: true, updated: sorted.length }
  })
