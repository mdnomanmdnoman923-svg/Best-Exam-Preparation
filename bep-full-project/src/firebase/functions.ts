// bep-full-project/src/firebase/functions.ts

import {
  connectFunctionsEmulator,
  Functions,
  getFunctions,
  httpsCallable,
  HttpsCallableResult,
} from 'firebase/functions';

import { app } from './config';

export const functions: Functions =
  getFunctions(app);

const useEmulator =
  import.meta.env
    .VITE_USE_FIREBASE_EMULATOR ===
  'true';

if (useEmulator) {
  try {
    connectFunctionsEmulator(
      functions,
      '127.0.0.1',
      5001,
    );

    console.info(
      '[Firebase Functions] Emulator connected',
    );
  } catch (error) {
    console.warn(
      '[Functions Emulator Error]',
      error,
    );
  }
}

export interface CallableResponse<T> {
  success: boolean;

  message?: string;

  data?: T;
}

export interface GenerateAiAnswerPayload {
  prompt: string;

  subject?: string;

  chapter?: string;

  userId?: string;
}

export interface GenerateAiAnswerResult {
  answer: string;

  suggestions?: string[];

  tokensUsed?: number;
}

export interface EvaluatePracticePayload {
  questionId: string;

  selectedOption?: string;

  writtenAnswer?: string;

  timeTaken?: number;

  userId?: string;
}

export interface EvaluatePracticeResult {
  correct: boolean;

  score: number;

  explanation?: string;

  weakTopics?: string[];
}

export interface CreatePaymentIntentPayload {
  amount: number;

  currency?: string;

  packageId?: string;

  userId?: string;
}

export interface CreatePaymentIntentResult {
  clientSecret: string;

  paymentIntentId: string;
}

export interface SendNotificationPayload {
  title: string;

  body: string;

  userId: string;

  type?: string;
}

export interface SendNotificationResult {
  delivered: boolean;
}

export interface GenerateLeaderboardPayload {
  batch?: string;

  className?: string;

  limit?: number;
}

export interface LeaderboardUser {
  userId: string;

  name: string;

  photoURL?: string;

  score: number;

  rank: number;
}

export interface GenerateLeaderboardResult {
  users: LeaderboardUser[];
}

export async function callFunction<
  Payload = unknown,
  Result = unknown,
>(
  name: string,
  payload?: Payload,
): Promise<Result> {
  const callable =
    httpsCallable<
      Payload,
      CallableResponse<Result>
    >(
      functions,
      name,
    );

  const response:
    HttpsCallableResult<
      CallableResponse<Result>
    > = await callable(
    payload as Payload,
  );

  if (
    !response.data.success
  ) {
    throw new Error(
      response.data.message ||
        'Function call failed',
    );
  }

  return response.data
    .data as Result;
}

export async function generateAiAnswer(
  payload: GenerateAiAnswerPayload,
) {
  return callFunction<
    GenerateAiAnswerPayload,
    GenerateAiAnswerResult
  >(
    'generateAiAnswer',
    payload,
  );
}

export async function evaluatePracticeAnswer(
  payload: EvaluatePracticePayload,
) {
  return callFunction<
    EvaluatePracticePayload,
    EvaluatePracticeResult
  >(
    'evaluatePracticeAnswer',
    payload,
  );
}

export async function createPaymentIntent(
  payload: CreatePaymentIntentPayload,
) {
  return callFunction<
    CreatePaymentIntentPayload,
    CreatePaymentIntentResult
  >(
    'createPaymentIntent',
    payload,
  );
}

export async function sendPushNotification(
  payload: SendNotificationPayload,
) {
  return callFunction<
    SendNotificationPayload,
    SendNotificationResult
  >(
    'sendPushNotification',
    payload,
  );
}

export async function generateLeaderboard(
  payload: GenerateLeaderboardPayload,
) {
  return callFunction<
    GenerateLeaderboardPayload,
    GenerateLeaderboardResult
  >(
    'generateLeaderboard',
    payload,
  );
}

export async function invokeCustomFunction<
  Payload = unknown,
  Result = unknown,
>(
  functionName: string,
  payload?: Payload,
) {
  return callFunction<
    Payload,
    Result
  >(
    functionName,
    payload,
  );
}

export default functions;
