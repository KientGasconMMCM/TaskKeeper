/**
 * Calculate assignment priority using Google Gemini API
 * Analyzes: assignment title, due date, subject, and description
 * Returns: 'high', 'medium', or 'low'
 */

export const calculatePriorityWithGemini = async (assignmentData) => {
  try {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('Gemini API key not found, using rule-based priority');
      return calculatePriorityRuleBased(assignmentData);
    }

    const { assignmentTitle, dueDate, subject, description } = assignmentData;
    
    // Calculate days until due
    const now = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    const prompt = `Analyze this assignment and assign a priority level (HIGH, MEDIUM, or LOW).
    
Assignment Title: ${assignmentTitle}
Subject/Topic: ${subject || 'Not specified'}
Days Until Due: ${daysUntilDue}
Description: ${description || 'No description'}

Consider:
- Urgency (due date proximity)
- Assignment type (exams, presentations are typically higher priority)
- Subject importance
- Assignment description details

Respond with ONLY the priority level: HIGH, MEDIUM, or LOW`;

    // Append API key to URL
    const url = new URL('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent');
    url.searchParams.append('key', apiKey);

    const geminiResponse = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const data = await geminiResponse.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Extract priority from response
    if (content.includes('HIGH')) return 'high';
    if (content.includes('LOW')) return 'low';
    return 'medium';

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Fallback to rule-based priority
    return calculatePriorityRuleBased(assignmentData);
  }
};

/**
 * Rule-based priority calculation (fallback if API is unavailable)
 */
export const calculatePriorityRuleBased = (assignmentData) => {
  const { assignmentTitle, dueDate, subject, description } = assignmentData;
  
  let priorityScore = 0;
  
  // Factor 1: Days until due date
  if (dueDate) {
    const now = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue <= 1) priorityScore += 3; // Due tomorrow or today
    else if (daysUntilDue <= 3) priorityScore += 2;
    else if (daysUntilDue <= 7) priorityScore += 1;
  }
  
  // Factor 2: Keywords indicating high priority
  const highPriorityKeywords = ['exam', 'test', 'quiz', 'midterm', 'final', 'presentation', 'project', 'urgent'];
  const allText = `${assignmentTitle} ${subject} ${description}`.toLowerCase();
  
  if (highPriorityKeywords.some(keyword => allText.includes(keyword))) {
    priorityScore += 2;
  }
  
  // Factor 3: Long description usually indicates more involved work
  if (description && description.length > 200) {
    priorityScore += 1;
  }
  
  // Convert score to priority level
  if (priorityScore >= 4) return 'high';
  if (priorityScore >= 2) return 'medium';
  return 'low';
};
