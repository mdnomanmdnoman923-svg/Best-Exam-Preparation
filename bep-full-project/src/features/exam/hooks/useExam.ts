// bep-full-project/src/features/exam/hooks/useExam.ts

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import { auth, db } from '@/firebase/config';
import { collectionNames } from '@/firebase/collections';

export type ExamQuestionType = 'mcq' | 'cq' | 'sq';

export type ExamQuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface ExamQuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface ExamQuestion {
  id: string;
  type: ExamQuestionType;
  question: string;
  options?: ExamQuestionOption[];
  answer?: string;
  explanation?: string;
  hint?: string;
  subject?: string;
  chapter?: string;
  difficulty?: ExamQuestionDifficulty;
  premium?: boolean;
  locked?: boolean;
  points?: number;
  duration?: number;
  imageUrl?: string;
}

export interface ExamDocument {
  id?: string;
  title: string;
  subtitle?: string;
  subject?: string;
  durationSeconds?: number;
  totalMarks?: number;
  passingMarks?: number;
  questions: ExamQuestion[];
  premium?: boolean;
  timed?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ExamAttemptResult {
  examId?: string;
  userId?: string | null;
  attemptedAt: string;
  submittedAt?: string;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  flaggedCount: number;
  bookmarkCount: number;
  scorePercentage: number;
  obtainedMarks: number;
  totalMarks: number;
  passed: boolean;
  timeSpentSeconds: number;
  timeLimitSeconds: number;
  selectedAnswers: Record<string, string>;
  subjectiveAnswers: Record<string, string>;
}

export interface UseExamOptions {
  examId?: string;
  userId?: string;
  initialExam?: ExamDocument | null;
  initialQuestions?: ExamQuestion[];
  initialCurrentIndex?: number;
  initialRemainingSeconds?: number;
  initialDurationSeconds?: number;
  initialMarksPerQuestion?: number;
  autoStart?: boolean;
  autoSubmitOnExpire?: boolean;
  persistProgress?: boolean;
  persistCollectionName?: string;
  loadFromFirestore?: boolean;
  onResult?: (result: ExamAttemptResult) => void;
  onExpire?: () => void;
  onLoadError?: (error: Error) => void;
}

export interface UseExamReturn {
  exam: ExamDocument | null;
  questions: ExamQuestion[];
  currentQuestion: ExamQuestion | null;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswers: Record<string, string>;
  subjectiveAnswers: Record<string, string>;
  bookmarkedQuestionIds: string[];
  flaggedQuestionIds: string[];
  visitedQuestionIds: string[];
  answeredQuestionIds: string[];
  loading: boolean;
  saving: boolean;
  submitting: boolean;
  submitted: boolean;
  expired: boolean;
  error: string | null;
  examTitle: string;
  examSubtitle: string;
  remainingSeconds: number;
  totalDurationSeconds: number;
  marksPerQuestion: number;
  answeredCount: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  flaggedCount: number;
  bookmarkCount: number;
  scorePercentage: number;
  obtainedMarks: number;
  totalMarks: number;
  passed: boolean;
  timeSpentSeconds: number;
  timeSpentLabel: string;
  remainingLabel: string;
  currentAnswer: string;
  currentSubjectiveAnswer: string;
  canGoNext: boolean;
  canGoPrevious: boolean;
  progressPercent: number;
  attemptResult: ExamAttemptResult | null;
  loadExam: () => Promise<void>;
  setCurrentIndex: (index: number) => void;
  goToQuestion: (index: number) => void;
  goNext: () => void;
  goPrevious: () => void;
  selectAnswer: (questionId: string, answer: string) => void;
  changeSubjectiveAnswer: (questionId: string, value: string) => void;
  toggleBookmark: (questionId: string, nextState?: boolean) => Promise<void>;
  toggleFlag: (questionId: string) => void;
  requestHint: (questionId: string) => void;
  markVisited: (questionId: string) => void;
  startExam: () => void;
  pauseExam: () => void;
  resumeExam: () => void;
  resetExam: () => void;
  setRemainingSeconds: (seconds: number) => void;
  saveProgress: () => Promise<void>;
  submitExam: () => Promise<ExamAttemptResult>;
}

const FALLBACK_EXAM_COLLECTION = 'exams';
const FALLBACK_ATTEMPT_COLLECTION = 'exam_attempts';

function getCollectionName(
  key: 'exams' | 'examAttempts',
  fallback: string,
): string {
  const names = (collectionNames ?? {}) as Record<string, string>;
  const mappedKey =
    key === 'examAttempts' ? 'exam_attempts' : 'exams';

  return (
    names[mappedKey] ||
    names[key] ||
    fallback
  );
}

function createId() {
  return `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function normalizeText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function formatTime(totalSeconds: number) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function inferAnswerIsCorrect(question: ExamQuestion, answer: string) {
  const correct = question.answer?.trim();
  if (!correct) return false;

  if (question.type === 'mcq') {
    return normalizeText(correct) === normalizeText(answer);
  }

  return normalizeText(correct) === normalizeText(answer);
}

function toQuestionMap(
  questions: ExamQuestion[],
): Record<string, ExamQuestion> {
  return questions.reduce<Record<string, ExamQuestion>>((acc, question) => {
    acc[question.id] = question;
    return acc;
  }, {});
}

function getQuestionAnswerValue(
  question: ExamQuestion,
  answer: string | undefined,
) {
  if (!answer) return '';
  return answer;
}

function deriveExamTitle(exam: ExamDocument | null) {
  return exam?.title || 'Exam';
}

function deriveExamSubtitle(exam: ExamDocument | null) {
  return exam?.subtitle || exam?.subject || 'BEP Exam Session';
}

function deriveTotalDurationSeconds(
  exam: ExamDocument | null,
  initialDurationSeconds?: number,
) {
  if (typeof exam?.durationSeconds === 'number') {
    return Math.max(0, Math.floor(exam.durationSeconds));
  }

  if (typeof initialDurationSeconds === 'number') {
    return Math.max(0, Math.floor(initialDurationSeconds));
  }

  return 0;
}

function getInitialRemainingSeconds(
  exam: ExamDocument | null,
  initialRemainingSeconds?: number,
  initialDurationSeconds?: number,
) {
  if (typeof initialRemainingSeconds === 'number') {
    return Math.max(0, Math.floor(initialRemainingSeconds));
  }

  const duration = deriveTotalDurationSeconds(exam, initialDurationSeconds);
  return duration > 0 ? duration : 0;
}

export function useExam(options: UseExamOptions = {}): UseExamReturn {
  const {
    examId,
    userId = auth.currentUser?.uid ?? null,
    initialExam = null,
    initialQuestions,
    initialCurrentIndex = 0,
    initialRemainingSeconds,
    initialDurationSeconds,
    initialMarksPerQuestion = 1,
    autoStart = true,
    autoSubmitOnExpire = false,
    persistProgress = true,
    persistCollectionName,
    loadFromFirestore = Boolean(examId),
    onResult,
    onExpire,
    onLoadError,
  } = options;

  const examAttemptsCollection = persistCollectionName ||
    getCollectionName('examAttempts', FALLBACK_ATTEMPT_COLLECTION);

  const examsCollection = getCollectionName('exams', FALLBACK_EXAM_COLLECTION);

  const [loading, setLoading] = useState(Boolean(loadFromFirestore && examId));
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expired, setExpired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [exam, setExam] = useState<ExamDocument | null>(initialExam);
  const [questions, setQuestions] = useState<ExamQuestion[]>(
    initialQuestions && initialQuestions.length > 0
      ? initialQuestions
      : initialExam?.questions || [],
  );

  const [currentIndex, setCurrentIndexState] = useState(initialCurrentIndex);
  const [remainingSeconds, setRemainingSecondsState] = useState(
    getInitialRemainingSeconds(
      initialExam,
      initialRemainingSeconds,
      initialDurationSeconds,
    ),
  );

  const [running, setRunning] = useState(autoStart);
  const [paused, setPaused] = useState(false);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(
    {},
  );
  const [subjectiveAnswers, setSubjectiveAnswers] = useState<Record<string, string>>(
    {},
  );
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<Set<string>>(
    new Set(),
  );
  const [flaggedQuestionIds, setFlaggedQuestionIds] = useState<Set<string>>(
    new Set(),
  );
  const [visitedQuestionIds, setVisitedQuestionIds] = useState<Set<string>>(
    new Set(),
  );
  const [attemptResult, setAttemptResult] = useState<ExamAttemptResult | null>(
    null,
  );

  const saveTimeoutRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const didFetchOnceRef = useRef(false);
  const questionMap = useMemo(() => toQuestionMap(questions), [questions]);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex] || null;
  const totalDurationSeconds = deriveTotalDurationSeconds(
    exam,
    initialDurationSeconds,
  );

  const examTitle = deriveExamTitle(exam);
  const examSubtitle = deriveExamSubtitle(exam);

  const answeredQuestionIds = useMemo(
    () =>
      questions
        .filter((question) => {
          const answer = selectedAnswers[question.id] ?? subjectiveAnswers[question.id];
          return Boolean(answer?.trim?.() || answer);
        })
        .map((question) => question.id),
    [questions, selectedAnswers, subjectiveAnswers],
  );

  const correctCount = useMemo(() => {
    return questions.reduce((count, question) => {
      const answer = getQuestionAnswerValue(
        question,
        selectedAnswers[question.id] ?? subjectiveAnswers[question.id],
      );

      if (!answer) return count;

      return inferAnswerIsCorrect(question, answer) ? count + 1 : count;
    }, 0);
  }, [questions, selectedAnswers, subjectiveAnswers]);

  const incorrectCount = useMemo(() => {
    return questions.reduce((count, question) => {
      const answer = getQuestionAnswerValue(
        question,
        selectedAnswers[question.id] ?? subjectiveAnswers[question.id],
      );

      if (!answer) return count;
      if (!question.answer) return count;

      return inferAnswerIsCorrect(question, answer) ? count : count + 1;
    }, 0);
  }, [questions, selectedAnswers, subjectiveAnswers]);

  const answeredCount = answeredQuestionIds.length;
  const skippedCount = Math.max(0, totalQuestions - answeredCount);
  const flaggedCount = flaggedQuestionIds.size;
  const bookmarkCount = bookmarkedQuestionIds.size;

  const scorePercentage = totalQuestions > 0
    ? Math.round((correctCount / totalQuestions) * 100)
    : 0;

  const totalMarks = exam?.totalMarks ?? totalQuestions * initialMarksPerQuestion;
  const obtainedMarks = Math.max(
    0,
    Math.round((scorePercentage / 100) * totalMarks),
  );

  const passed =
    typeof exam?.passingMarks === 'number'
      ? obtainedMarks >= exam.passingMarks
      : scorePercentage >= 50;

  const timeSpentSeconds = useMemo(() => {
    if (totalDurationSeconds <= 0) return 0;
    return Math.max(0, totalDurationSeconds - remainingSeconds);
  }, [remainingSeconds, totalDurationSeconds]);

  const progressPercent = useMemo(() => {
    if (totalQuestions === 0) return 0;
    return Math.round((answeredCount / totalQuestions) * 100);
  }, [answeredCount, totalQuestions]);

  const remainingLabel = useMemo(
    () => formatTime(remainingSeconds),
    [remainingSeconds],
  );

  const timeSpentLabel = useMemo(
    () => formatTime(timeSpentSeconds),
    [timeSpentSeconds],
  );

  const currentAnswer = useMemo(() => {
    if (!currentQuestion) return '';
    return selectedAnswers[currentQuestion.id] ?? '';
  }, [currentQuestion, selectedAnswers]);

  const currentSubjectiveAnswer = useMemo(() => {
    if (!currentQuestion) return '';
    return subjectiveAnswers[currentQuestion.id] ?? '';
  }, [currentQuestion, subjectiveAnswers]);

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < totalQuestions - 1;

  const persistSnapshot = useCallback(async () => {
    if (!persistProgress || !examId) return;

    setSaving(true);
    try {
      const attemptRef = doc(
        collection(db, examAttemptsCollection),
      );

      const payload = {
        examId,
        userId,
        currentIndex,
        remainingSeconds,
        selectedAnswers,
        subjectiveAnswers,
        bookmarkedQuestionIds: Array.from(bookmarkedQuestionIds),
        flaggedQuestionIds: Array.from(flaggedQuestionIds),
        visitedQuestionIds: Array.from(visitedQuestionIds),
        submitted,
        expired,
        updatedAt: serverTimestamp(),
      };

      await setDoc(attemptRef, payload, { merge: true });
    } catch (saveError) {
      console.error('useExam saveProgress error:', saveError);
    } finally {
      setSaving(false);
    }
  }, [
    bookmarkCount,
    bookmarkedQuestionIds,
    currentIndex,
    examAttemptsCollection,
    examId,
    expired,
    flaggedQuestionIds,
    persistProgress,
    remainingSeconds,
    selectedAnswers,
    subjectiveAnswers,
    submitted,
    userId,
    visitedQuestionIds,
  ]);

  const loadExam = useCallback(async () => {
    if (!loadFromFirestore || !examId || didFetchOnceRef.current) {
      return;
    }

    didFetchOnceRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const ref = doc(db, examsCollection, examId);
      const snapshot = await getDoc(ref);

      if (!snapshot.exists()) {
        throw new Error('Exam not found');
      }

      const data = snapshot.data() as Partial<ExamDocument>;
      const normalizedQuestions = Array.isArray(data.questions) ? data.questions : [];

      const loadedExam: ExamDocument = {
        id: snapshot.id,
        title: data.title || 'Exam',
        subtitle: data.subtitle,
        subject: data.subject,
        durationSeconds: data.durationSeconds,
        totalMarks: data.totalMarks,
        passingMarks: data.passingMarks,
        questions: normalizedQuestions,
        premium: Boolean(data.premium),
        timed: data.timed ?? true,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };

      setExam(loadedExam);
      setQuestions(normalizedQuestions);
      setCurrentIndexState(initialCurrentIndex);
      setRemainingSecondsState(
        getInitialRemainingSeconds(
          loadedExam,
          initialRemainingSeconds,
          initialDurationSeconds,
        ),
      );
      setSelectedAnswers({});
      setSubjectiveAnswers({});
      setBookmarkedQuestionIds(new Set());
      setFlaggedQuestionIds(new Set());
      setVisitedQuestionIds(new Set());
      setSubmitted(false);
      setExpired(false);
      setAttemptResult(null);
    } catch (loadError) {
      const nextError =
        loadError instanceof Error ? loadError : new Error('Failed to load exam');
      setError(nextError.message);
      onLoadError?.(nextError);
    } finally {
      setLoading(false);
    }
  }, [
    examId,
    examsCollection,
    initialCurrentIndex,
    initialDurationSeconds,
    initialRemainingSeconds,
    loadFromFirestore,
    onLoadError,
  ]);

  useEffect(() => {
    void loadExam();
  }, [loadExam]);

  useEffect(() => {
    if (!persistProgress) return;

    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      void persistSnapshot();
    }, 700);

    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    currentIndex,
    expired,
    persistProgress,
    persistSnapshot,
    remainingSeconds,
    selectedAnswers,
    subjectiveAnswers,
    bookmarkedQuestionIds,
    flaggedQuestionIds,
    visitedQuestionIds,
    submitted,
  ]);

  useEffect(() => {
    if (!running || paused || submitted || expired || remainingSeconds <= 0) {
      return;
    }

    timerRef.current = window.setInterval(() => {
      setRemainingSecondsState((current) => {
        const next = Math.max(0, current - 1);

        if (next === 0) {
          window.clearInterval(timerRef.current || undefined);
          setExpired(true);
          setRunning(false);
          setPaused(false);
          onExpire?.();

          if (autoSubmitOnExpire) {
            void submitExam();
          }
        }

        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    autoSubmitOnExpire,
    expired,
    onExpire,
    paused,
    remainingSeconds,
    running,
    submitted,
  ]);

  const setCurrentIndex = useCallback((index: number) => {
    setCurrentIndexState((current) => {
      const next = Math.max(0, Math.min(index, Math.max(totalQuestions - 1, 0)));
      return next;
    });
  }, [totalQuestions]);

  const goToQuestion = useCallback((index: number) => {
    setCurrentIndex(index);

    const question = questions[index];
    if (question) {
      setVisitedQuestionIds((current) => new Set(current).add(question.id));
    }
  }, [questions, setCurrentIndex]);

  const goNext = useCallback(() => {
    if (!canGoNext) return;
    goToQuestion(currentIndex + 1);
  }, [canGoNext, currentIndex, goToQuestion]);

  const goPrevious = useCallback(() => {
    if (!canGoPrevious) return;
    goToQuestion(currentIndex - 1);
  }, [canGoPrevious, currentIndex, goToQuestion]);

  const selectAnswer = useCallback((questionId: string, answer: string) => {
    setSelectedAnswers((current) => ({
      ...current,
      [questionId]: answer,
    }));
    setVisitedQuestionIds((current) => {
      const next = new Set(current);
      next.add(questionId);
      return next;
    });
  }, []);

  const changeSubjectiveAnswer = useCallback((questionId: string, value: string) => {
    setSubjectiveAnswers((current) => ({
      ...current,
      [questionId]: value,
    }));
    setVisitedQuestionIds((current) => {
      const next = new Set(current);
      next.add(questionId);
      return next;
    });
  }, []);

  const toggleBookmark = useCallback(async (questionId: string, nextState?: boolean) => {
    setBookmarkedQuestionIds((current) => {
      const next = new Set(current);
      const shouldBookmark = typeof nextState === 'boolean' ? nextState : !next.has(questionId);

      if (shouldBookmark) next.add(questionId);
      else next.delete(questionId);

      return next;
    });

    if (persistProgress) {
      await persistSnapshot();
    }
  }, [persistProgress, persistSnapshot]);

  const toggleFlag = useCallback((questionId: string) => {
    setFlaggedQuestionIds((current) => {
      const next = new Set(current);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });

    setVisitedQuestionIds((current) => {
      const next = new Set(current);
      next.add(questionId);
      return next;
    });
  }, []);

  const requestHint = useCallback((questionId: string) => {
    const question = questionMap[questionId];
    if (!question) return;

    if (question.hint) {
      window.alert(question.hint);
      return;
    }

    if (question.explanation) {
      window.alert(question.explanation);
      return;
    }

    window.alert('এই প্রশ্নের জন্য hint এখনো available নয়।');
  }, [questionMap]);

  const markVisited = useCallback((questionId: string) => {
    setVisitedQuestionIds((current) => {
      const next = new Set(current);
      next.add(questionId);
      return next;
    });
  }, []);

  const startExam = useCallback(() => {
    setRunning(true);
    setPaused(false);
    setSubmitted(false);
    setExpired(false);
  }, []);

  const pauseExam = useCallback(() => {
    setPaused(true);
    setRunning(false);
  }, []);

  const resumeExam = useCallback(() => {
    if (expired || submitted || remainingSeconds <= 0) return;
    setPaused(false);
    setRunning(true);
  }, [expired, remainingSeconds, submitted]);

  const resetExam = useCallback(() => {
    setSelectedAnswers({});
    setSubjectiveAnswers({});
    setBookmarkedQuestionIds(new Set());
    setFlaggedQuestionIds(new Set());
    setVisitedQuestionIds(new Set());
    setCurrentIndexState(initialCurrentIndex);
    setRemainingSecondsState(
      getInitialRemainingSeconds(
        exam,
        initialRemainingSeconds,
        initialDurationSeconds,
      ),
    );
    setSubmitted(false);
    setExpired(false);
    setAttemptResult(null);
    setPaused(false);
    setRunning(autoStart);
  }, [
    autoStart,
    exam,
    initialCurrentIndex,
    initialDurationSeconds,
    initialRemainingSeconds,
  ]);

  const buildAttemptResult = useCallback((): ExamAttemptResult => {
    return {
      examId,
      userId,
      attemptedAt: attemptResult?.attemptedAt || new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      totalQuestions,
      answeredCount,
      correctCount,
      incorrectCount,
      skippedCount,
      flaggedCount,
      bookmarkCount,
      scorePercentage,
      obtainedMarks,
      totalMarks,
      passed,
      timeSpentSeconds,
      timeLimitSeconds: totalDurationSeconds,
      selectedAnswers,
      subjectiveAnswers,
    };
  }, [
    attemptResult?.attemptedAt,
    answeredCount,
    bookmarkCount,
    correctCount,
    examId,
    flaggedCount,
    incorrectCount,
    obtainedMarks,
    passed,
    scorePercentage,
    selectedAnswers,
    skippedCount,
    subjectiveAnswers,
    timeSpentSeconds,
    totalDurationSeconds,
    totalMarks,
    totalQuestions,
    userId,
  ]);

  const saveProgress = useCallback(async () => {
    await persistSnapshot();
  }, [persistSnapshot]);

  const submitExam = useCallback(async (): Promise<ExamAttemptResult> => {
    setSubmitting(true);
    setError(null);

    try {
      const result = buildAttemptResult();
      setAttemptResult(result);
      setSubmitted(true);
      setRunning(false);
      setPaused(false);

      if (persistProgress && examId) {
        const resultRef = doc(collection(db, examAttemptsCollection));

        await setDoc(resultRef, {
          ...result,
          id: resultRef.id,
          status: 'submitted',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      onResult?.(result);
      return result;
    } catch (submitError) {
      const nextError =
        submitError instanceof Error
          ? submitError
          : new Error('Failed to submit exam');

      setError(nextError.message);
      throw nextError;
    } finally {
      setSubmitting(false);
    }
  }, [
    buildAttemptResult,
    examAttemptsCollection,
    examId,
    onResult,
    persistProgress,
  ]);

  useEffect(() => {
    if (!currentQuestion) return;

    setVisitedQuestionIds((current) => {
      const next = new Set(current);
      next.add(currentQuestion.id);
      return next;
    });
  }, [currentQuestion?.id]);

  useEffect(() => {
    if (!questions.length) return;

    if (currentIndex > questions.length - 1) {
      setCurrentIndexState(0);
    }
  }, [currentIndex, questions.length]);

  return {
    exam,
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions,
    selectedAnswers,
    subjectiveAnswers,
    bookmarkedQuestionIds: Array.from(bookmarkedQuestionIds),
    flaggedQuestionIds: Array.from(flaggedQuestionIds),
    visitedQuestionIds: Array.from(visitedQuestionIds),
    answeredQuestionIds,
    loading,
    saving,
    submitting,
    submitted,
    expired,
    error,
    examTitle,
    examSubtitle,
    remainingSeconds,
    totalDurationSeconds,
    marksPerQuestion: initialMarksPerQuestion,
    answeredCount,
    correctCount,
    incorrectCount,
    skippedCount,
    flaggedCount,
    bookmarkCount,
    scorePercentage,
    obtainedMarks,
    totalMarks,
    passed,
    timeSpentSeconds,
    timeSpentLabel,
    remainingLabel,
    currentAnswer,
    currentSubjectiveAnswer,
    canGoNext,
    canGoPrevious,
    progressPercent,
    attemptResult,
    loadExam,
    setCurrentIndex,
    goToQuestion,
    goNext,
    goPrevious,
    selectAnswer,
    changeSubjectiveAnswer,
    toggleBookmark,
    toggleFlag,
    requestHint,
    markVisited,
    startExam,
    pauseExam,
    resumeExam,
    resetExam,
    setRemainingSeconds: (seconds: number) => {
      setRemainingSecondsState(Math.max(0, Math.floor(seconds)));
    },
    saveProgress,
    submitExam,
  };
}

export default useExam;
