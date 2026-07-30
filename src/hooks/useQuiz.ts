import { useState, useEffect, useCallback, useRef } from 'react';
import type { Question } from '../data/questions';
import type { Pack } from '../data/packs';
import { allQuestions } from '../data/questions';

export interface HistoryEntry {
  question:    Question;
  chosenText:  string | null;
  correct:     boolean;
  timeout:     boolean;
  skipped:     boolean;
}

export type QuizPhase = 'packs' | 'quiz' | 'result';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useQuiz() {
  const [phase,        setPhase]       = useState<QuizPhase>('packs');
  const [currentPack,  setCurrentPack] = useState<Pack | null>(null);
  const [questions,    setQuestions]   = useState<Question[]>([]);
  const [index,        setIndex]       = useState(0);
  const [correctCount, setCorrect]     = useState(0);
  const [wrongCount,   setWrong]       = useState(0);
  const [history,      setHistory]     = useState<HistoryEntry[]>([]);
  const [answered,     setAnswered]    = useState(false);
  const [timeLeft,     setTimeLeft]    = useState(40);
  const [showModal,    setShowModal]   = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  // Start timer when a new question loads
  useEffect(() => {
    if (phase !== 'quiz' || answered) return;
    clearTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearTimer();
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return clearTimer;
  }, [index, phase, answered]);

  const startPack = useCallback((pack: Pack) => {
    let pool = shuffle(allQuestions.filter(pack.filter));
    if (pack.limit && pool.length > pack.limit) pool = pool.slice(0, pack.limit);
    setCurrentPack(pack);
    setQuestions(pool);
    setIndex(0);
    setCorrect(0);
    setWrong(0);
    setHistory([]);
    setAnswered(false);
    setTimeLeft(40);
    setPhase('quiz');
  }, []);

  const selectAnswer = useCallback((chosenText: string, isCorrect: boolean) => {
    if (answered) return;
    clearTimer();
    setAnswered(true);
    const q = questions[index];
    if (isCorrect) {
      setCorrect(c => c + 1);
    } else {
      setWrong(w => w + 1);
    }
    setHistory(h => [...h, { question: q, chosenText, correct: isCorrect, timeout: false, skipped: false }]);
  }, [answered, questions, index, clearTimer]);

  const handleTimeout = useCallback(() => {
    setAnswered(true);
    const q = questions[index];
    setWrong(w => w + 1);
    setHistory(h => [...h, { question: q, chosenText: null, correct: false, timeout: true, skipped: false }]);
  }, [questions, index]);

  const nextQuestion = useCallback(() => {
    const next = index + 1;
    if (next >= questions.length) {
      clearTimer();
      setPhase('result');
    } else {
      setIndex(next);
      setAnswered(false);
      setTimeLeft(40);
    }
  }, [index, questions.length, clearTimer]);

  const openEndModal  = useCallback(() => setShowModal(true),  []);
  const closeEndModal = useCallback(() => setShowModal(false), []);

  const confirmEnd = useCallback(() => {
    clearTimer();
    setShowModal(false);
    const answeredSoFar = index + (answered ? 1 : 0);
    // Record current as skipped if not yet answered
    const remaining = questions.slice(answered ? index + 1 : index);
    const skipped: HistoryEntry[] = remaining.map(q => ({
      question: q, chosenText: null, correct: false, timeout: false, skipped: true,
    }));
    setWrong(w => w + skipped.length + (answered ? 0 : 0));
    setHistory(h => [...h, ...skipped]);
    setIndex(answeredSoFar);
    setPhase('result');
  }, [clearTimer, index, answered, questions]);

  const goBackToPacks = useCallback(() => {
    clearTimer();
    setPhase('packs');
    setShowModal(false);
  }, [clearTimer]);

  const restartPack = useCallback(() => {
    if (currentPack) startPack(currentPack);
  }, [currentPack, startPack]);

  const answeredSoFar = index + (answered ? 1 : 0);
  const remaining     = questions.length - answeredSoFar;

  return {
    phase, currentPack, questions, index, correctCount, wrongCount, history,
    answered, timeLeft, showModal,
    startPack, selectAnswer, nextQuestion,
    openEndModal, closeEndModal, confirmEnd,
    goBackToPacks, restartPack,
    answeredSoFar, remaining,
    currentQuestion: questions[index] ?? null,
    total: questions.length,
    pct: questions.length ? Math.round((correctCount / questions.length) * 100) : 0,
    passed: questions.length ? Math.round((correctCount / questions.length) * 100) >= 80 : false,
  };
}
