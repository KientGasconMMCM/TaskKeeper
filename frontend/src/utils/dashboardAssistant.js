const FALLBACK_REPLY = {
  content:
    'I can help you prioritize assignments, turn a deadline into a study plan, or break a big project into the next three steps. Ask me what to do first, how to handle an overdue item, or how to prepare for a due date.',
};

const buildTranscript = (messages) =>
  messages
    .slice(-10)
    .map((message) => `${message.role === 'user' ? 'Student' : 'Coach'}: ${message.content}`)
    .join('\n');

export const sendDashboardAssistantMessage = async ({ messages = [], userName = 'Student' }) => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  if (!apiKey) {
    return FALLBACK_REPLY;
  }

  const prompt = `You are the AI assistant for Assignment Tracker. Help students organize assignments, prioritize work, and plan study time. Be concise, encouraging, and practical. Avoid long explanations and end with a clear next step when helpful.

Student name: ${userName}

Conversation:
${buildTranscript(messages)}

Reply with 3-6 short sentences.`;

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
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 256,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();

    if (!text) {
      return FALLBACK_REPLY;
    }

    return { content: text };
  } catch (error) {
    console.error('Error calling dashboard assistant Gemini:', error);
    return FALLBACK_REPLY;
  }
};