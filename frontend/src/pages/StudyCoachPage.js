import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reviewAnswerWithGemini } from '../utils/studyCoach';
import './StudyCoachPage.css';

function StudyCoachPage({ user, onLogout }) {
  const [question, setQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const canReview = useMemo(() => {
    return question.trim() && userAnswer.trim() && correctAnswer.trim();
  }, [question, userAnswer, correctAnswer]);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const normalize = (value) => value.trim().toLowerCase().replace(/\s+/g, ' ');

  const handleReview = async () => {
    if (!canReview) {
      setFeedback({
        summary: 'Missing information.',
        hint: 'Add the question, your answer, and the expected answer first.',
      });
      return;
    }

    const isCorrect = normalize(userAnswer) === normalize(correctAnswer);
    setLoading(true);
    setFeedback(null);

    try {
      const result = await reviewAnswerWithGemini({
        question,
        userAnswer,
        correctAnswer,
        isCorrect,
      });
      setFeedback({
        ...result,
        isCorrect,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setQuestion('What is the derivative of x^2?');
    setUserAnswer('2x');
    setCorrectAnswer('2x');
    setFeedback(null);
  };

  const clearAll = () => {
    setQuestion('');
    setUserAnswer('');
    setCorrectAnswer('');
    setFeedback(null);
  };

  return (
    <div className="coach-page">
      <header className="coach-header">
        <div>
          <p className="coach-eyebrow">AI study coach</p>
          <h1>Check an answer, then get a hint</h1>
          <p className="coach-subtitle">
            The app confirms whether the answer is right or wrong, then Gemini gives a short explanation or a nudge in the right direction.
          </p>
        </div>
        <div className="coach-header-actions">
          <button className="coach-secondary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
          <button className="coach-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="coach-grid">
        <section className="coach-card coach-form-card">
          <div className="coach-card-header">
            <h2>Practice prompt</h2>
            <span>Student: {user?.username || 'Student'}</span>
          </div>

          <div className="coach-field">
            <label htmlFor="question">Question</label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Paste or type the question here"
              rows="5"
            />
          </div>

          <div className="coach-field-row">
            <div className="coach-field">
              <label htmlFor="userAnswer">Your answer</label>
              <textarea
                id="userAnswer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type the answer you want to check"
                rows="4"
              />
            </div>

            <div className="coach-field">
              <label htmlFor="correctAnswer">Expected answer</label>
              <textarea
                id="correctAnswer"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="This is what the app will compare against"
                rows="4"
              />
            </div>
          </div>

          <div className="coach-actions">
            <button className="coach-primary" onClick={handleReview} disabled={loading}>
              {loading ? 'Reviewing...' : 'Review Answer'}
            </button>
            <button className="coach-tertiary" onClick={loadSample} type="button">
              Load sample
            </button>
            <button className="coach-tertiary" onClick={clearAll} type="button">
              Clear
            </button>
          </div>
        </section>

        <aside className="coach-card coach-result-card">
          <div className="coach-card-header">
            <h2>Coach feedback</h2>
            <span>{feedback ? (feedback.isCorrect ? 'Correct' : 'Needs work') : 'Waiting for review'}</span>
          </div>

          {feedback ? (
            <div className="coach-feedback">
              <div className={`coach-status ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
                {feedback.summary}
              </div>
              <p>{feedback.hint}</p>
              <div className="coach-note">
                {feedback.isCorrect
                  ? 'You can ask for a deeper explanation or a harder follow-up question.'
                  : 'Try again after reading the hint. The correct answer stays visible for comparison.'}
              </div>
            </div>
          ) : (
            <div className="coach-empty">
              <h3>What happens here</h3>
              <ul>
                <li>The app checks whether your answer matches the expected one.</li>
                <li>Gemini then gives a short hint or confirmation.</li>
                <li>You can use the same page for practice without turning it into an answer bot.</li>
              </ul>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

export default StudyCoachPage;
