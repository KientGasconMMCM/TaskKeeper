const buildFallbackFeedback = (isCorrect, question, userAnswer, correctAnswer) => {
  if (isCorrect) {
    return {
      summary: 'Correct answer.',
      hint: 'Your answer matches the expected solution. Try explaining why it works in one sentence.',
    };
  }

  return {
    summary: 'Not quite yet.',
    hint: `Look at the core idea in the question and compare it with your answer. The expected answer is: ${correctAnswer}.`,
  };
};

export const reviewAnswerWithGemini = async ({ question, userAnswer, correctAnswer, isCorrect }) => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  if (!apiKey) {
    return buildFallbackFeedback(isCorrect, question, userAnswer, correctAnswer);
  }

  const prompt = isCorrect
    ? `You are a helpful study coach. The student answered correctly.\n\nQuestion: ${question}\nStudent answer: ${userAnswer}\nCorrect answer: ${correctAnswer}\n\nGive a short congratulatory confirmation and one brief follow-up insight that helps the student deepen understanding. Do not be verbose.`
    : `You are a helpful study coach. The student answered incorrectly.\n\nQuestion: ${question}\nStudent answer: ${userAnswer}\nCorrect answer: ${correctAnswer}\n\nGive a short, encouraging hint that nudges the student toward the correct answer without directly repeating it. Do not reveal the full answer. Keep it to 2-4 sentences.`;

  try {
    const url = new URL('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent');
    url.searchParams.append('key', apiKey);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      return buildFallbackFeedback(isCorrect, question, userAnswer, correctAnswer);
    }

    return {
      summary: isCorrect ? 'Correct answer.' : 'Not quite yet.',
      hint: text,
    };
  } catch (error) {
    console.error('Error calling Gemini study coach:', error);
    return buildFallbackFeedback(isCorrect, question, userAnswer, correctAnswer);
  }
};
