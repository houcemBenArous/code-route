import { useState } from 'react';
import Nav from './components/Nav';
import PackGrid from './components/quiz/PackGrid';
import QuizScreen from './components/quiz/QuizScreen';
import ResultScreen from './components/quiz/ResultScreen';
import EndModal from './components/quiz/EndModal';
import CourseScreen from './components/course/CourseScreen';
import { useQuiz } from './hooks/useQuiz';

type Tab = 'quiz' | 'course';

function getInitialTab(): Tab {
  const param = new URLSearchParams(window.location.search).get('tab');
  return param === 'course' ? 'course' : 'quiz';
}

export default function App() {
  const [tab, setTab] = useState<Tab>(getInitialTab);
  const quiz = useQuiz();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 font-arabic">
      <Nav activeTab={tab} onTabChange={setTab} />

      {/* Quiz Section */}
      <div className={`${tab === 'quiz' ? 'flex' : 'hidden'} justify-center px-4 py-8 pb-16 min-h-[calc(100vh-56px)]`}>
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xl">
          {quiz.phase === 'packs'  && <PackGrid onSelect={quiz.startPack} />}
          {quiz.phase === 'quiz'   && <QuizScreen quiz={quiz} />}
          {quiz.phase === 'result' && <ResultScreen quiz={quiz} />}
        </div>
      </div>

      {/* Course Section */}
      <div className={`${tab === 'course' ? 'flex' : 'hidden'} justify-center px-4 py-8 pb-16 min-h-[calc(100vh-56px)]`}>
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-3xl">
          <CourseScreen />
        </div>
      </div>

      {/* End Quiz Modal */}
      {quiz.showModal && (
        <EndModal
          answeredSoFar={quiz.answeredSoFar}
          correctCount={quiz.correctCount}
          remaining={quiz.remaining}
          onConfirm={quiz.confirmEnd}
          onCancel={quiz.closeEndModal}
        />
      )}
    </div>
  );
}
