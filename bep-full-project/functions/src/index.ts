// bep-full-project/functions/src/index.ts

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

const db = admin.firestore();

/* -------------------------------------------------------------------------- */
/*                               Health Check                                 */
/* -------------------------------------------------------------------------- */

export const healthCheck = functions.https.onRequest(
  async (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'BEP Firebase Functions Running',
      timestamp: new Date().toISOString(),
    });
  },
);

/* -------------------------------------------------------------------------- */
/*                          Create User Profile                               */
/* -------------------------------------------------------------------------- */

export const createUserProfile = functions.auth
  .user()
  .onCreate(async (user) => {
    try {
      const profileRef = db.collection('profiles').doc(user.uid);

      await profileRef.set({
        uid: user.uid,

        fullName: user.displayName || '',
        email: user.email || '',

        avatarUrl: user.photoURL || '',

        role: 'student',

        premium: false,
        verified: false,

        xp: 0,
        level: 1,
        streakDays: 0,

        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Profile created for ${user.uid}`);
    } catch (error) {
      console.error('❌ createUserProfile error:', error);
    }
  });

/* -------------------------------------------------------------------------- */
/*                         Delete User Related Data                           */
/* -------------------------------------------------------------------------- */

export const deleteUserData = functions.auth
  .user()
  .onDelete(async (user) => {
    try {
      const batch = db.batch();

      const profileRef = db.collection('profiles').doc(user.uid);
      batch.delete(profileRef);

      await batch.commit();

      console.log(`🗑️ Deleted user data for ${user.uid}`);
    } catch (error) {
      console.error('❌ deleteUserData error:', error);
    }
  });

/* -------------------------------------------------------------------------- */
/*                            Add XP Function                                 */
/* -------------------------------------------------------------------------- */

export const addUserXP = functions.https.onCall(
  async (data, context) => {
    try {
      if (!context.auth) {
        throw new functions.https.HttpsError(
          'unauthenticated',
          'User not authenticated',
        );
      }

      const uid = context.auth.uid;

      const xp = Number(data?.xp || 0);

      if (xp <= 0) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'XP must be greater than 0',
        );
      }

      const profileRef = db.collection('profiles').doc(uid);

      const profileSnap = await profileRef.get();

      if (!profileSnap.exists) {
        throw new functions.https.HttpsError(
          'not-found',
          'Profile not found',
        );
      }

      const currentXP = Number(profileSnap.data()?.xp || 0);

      const nextXP = currentXP + xp;

      const nextLevel = Math.max(
        1,
        Math.floor(nextXP / 1000) + 1,
      );

      await profileRef.update({
        xp: nextXP,
        level: nextLevel,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        success: true,
        xp: nextXP,
        level: nextLevel,
      };
    } catch (error) {
      console.error('❌ addUserXP error:', error);

      throw new functions.https.HttpsError(
        'internal',
        'Failed to add XP',
      );
    }
  },
);

/* -------------------------------------------------------------------------- */
/*                           Submit Exam Result                               */
/* -------------------------------------------------------------------------- */

export const submitExamResult = functions.https.onCall(
  async (data, context) => {
    try {
      if (!context.auth) {
        throw new functions.https.HttpsError(
          'unauthenticated',
          'Authentication required',
        );
      }

      const uid = context.auth.uid;

      const {
        examId,
        score,
        percentage,
        totalCorrect,
        totalWrong,
        totalSkipped,
      } = data;

      if (!examId) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'examId is required',
        );
      }

      const resultRef = db.collection('exam_results').doc();

      await resultRef.set({
        examId,
        userId: uid,

        score: Number(score || 0),
        percentage: Number(percentage || 0),

        totalCorrect: Number(totalCorrect || 0),
        totalWrong: Number(totalWrong || 0),
        totalSkipped: Number(totalSkipped || 0),

        submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        success: true,
        resultId: resultRef.id,
      };
    } catch (error) {
      console.error('❌ submitExamResult error:', error);

      throw new functions.https.HttpsError(
        'internal',
        'Failed to submit result',
      );
    }
  },
);

/* -------------------------------------------------------------------------- */
/*                          Community Post Counter                            */
/* -------------------------------------------------------------------------- */

export const onCommunityPostCreate = functions.firestore
  .document('community_posts/{postId}')
  .onCreate(async (snapshot) => {
    try {
      const data = snapshot.data();

      if (!data?.authorId) return;

      const profileRef = db
        .collection('profiles')
        .doc(data.authorId);

      await profileRef.update({
        communityPostsCount:
          admin.firestore.FieldValue.increment(1),

        updatedAt:
          admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log('✅ Community post count updated');
    } catch (error) {
      console.error(
        '❌ onCommunityPostCreate error:',
        error,
      );
    }
  });

/* -------------------------------------------------------------------------- */
/*                        Generate Leaderboard                                */
/* -------------------------------------------------------------------------- */

export const generateLeaderboard = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async () => {
    try {
      const profilesSnap = await db
        .collection('profiles')
        .orderBy('xp', 'desc')
        .limit(100)
        .get();

      const batch = db.batch();

      profilesSnap.docs.forEach((doc, index) => {
        const leaderboardRef = db
          .collection('leaderboard')
          .doc(doc.id);

        batch.set(leaderboardRef, {
          userId: doc.id,

          fullName: doc.data().fullName || '',
          avatarUrl: doc.data().avatarUrl || '',

          xp: doc.data().xp || 0,

          rank: index + 1,

          updatedAt:
            admin.firestore.FieldValue.serverTimestamp(),
        });
      });

      await batch.commit();

      console.log('🏆 Leaderboard updated');

      return null;
    } catch (error) {
      console.error(
        '❌ generateLeaderboard error:',
        error,
      );

      return null;
    }
  });

/* -------------------------------------------------------------------------- */
/*                           AI Chat Logger                                   */
/* -------------------------------------------------------------------------- */

export const logAIMessage = functions.https.onCall(
  async (data, context) => {
    try {
      if (!context.auth) {
        throw new functions.https.HttpsError(
          'unauthenticated',
          'Authentication required',
        );
      }

      const uid = context.auth.uid;

      const {
        chatId,
        message,
        role,
      } = data;

      if (!chatId || !message) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'chatId and message required',
        );
      }

      const messageRef = db
        .collection('ai_chats')
        .doc(chatId)
        .collection('messages')
        .doc();

      await messageRef.set({
        userId: uid,

        role: role || 'user',

        message,

        createdAt:
          admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        success: true,
        messageId: messageRef.id,
      };
    } catch (error) {
      console.error('❌ logAIMessage error:', error);

      throw new functions.https.HttpsError(
        'internal',
        'Failed to save AI message',
      );
    }
  },
);

/* -------------------------------------------------------------------------- */
/*                        Send Notification Function                          */
/* -------------------------------------------------------------------------- */

export const sendNotification = functions.https.onCall(
  async (data, context) => {
    try {
      if (!context.auth) {
        throw new functions.https.HttpsError(
          'unauthenticated',
          'Authentication required',
        );
      }

      const {
        userId,
        title,
        message,
        type,
      } = data;

      if (!userId || !title) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'userId and title required',
        );
      }

      const notificationRef = db
        .collection('notifications')
        .doc();

      await notificationRef.set({
        userId,

        title,
        message: message || '',

        type: type || 'info',

        read: false,

        createdAt:
          admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        success: true,
        notificationId: notificationRef.id,
      };
    } catch (error) {
      console.error(
        '❌ sendNotification error:',
        error,
      );

      throw new functions.https.HttpsError(
        'internal',
        'Failed to send notification',
      );
    }
  },
);

/* -------------------------------------------------------------------------- */
/*                             Cleanup Drafts                                 */
/* -------------------------------------------------------------------------- */

export const cleanupDraftPosts = functions.pubsub
  .schedule('every 48 hours')
  .onRun(async () => {
    try {
      const draftSnap = await db
        .collection('community_posts')
        .where('status', '==', 'draft')
        .get();

      const batch = db.batch();

      draftSnap.docs.forEach((doc) => {
        const createdAt = doc.data()?.createdAt?.toDate?.();

        if (!createdAt) return;

        const age =
          Date.now() - createdAt.getTime();

        const days = age / (1000 * 60 * 60 * 24);

        if (days > 30) {
          batch.delete(doc.ref);
        }
      });

      await batch.commit();

      console.log('🧹 Draft cleanup completed');

      return null;
    } catch (error) {
      console.error(
        '❌ cleanupDraftPosts error:',
        error,
      );

      return null;
    }
  });
