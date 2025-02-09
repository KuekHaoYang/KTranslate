import { APIConfig } from '@/context/APIConfigContext';
import { translateWithDeepl, translateWithDeeplStream } from './deeplService';

export async function translateText(
  text: string,
  to: string,
  from: string | 'auto-detect',
  config: APIConfig
): Promise<string> {
  if (config.service === 'deepl') {
    return translateWithDeepl(text, to, from);
  }

  const systemPrompt = 'You are a professional, authentic machine translation engine.';
  const userPrompt = from === 'auto-detect'
    ? `;; Treat next line as plain text input and translate it into ${to}, output translation ONLY. If translation is unnecessary (e.g. proper nouns, codes, etc.), return the original text. NO explanations. NO notes. Input:\n${text}`
    : `;; Treat next line as plain text input and translate it from ${from} into ${to}, output translation ONLY. If translation is unnecessary (e.g. proper nouns, codes, etc.), return the original text. NO explanations. NO notes. Input:\n${text}`;

  const response = await fetch(config.apiHost + '/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: Math.max(100, text.length * 2),
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Translation failed');
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

export async function translateTextStream(
  text: string,
  to: string,
  from: string | 'auto-detect',
  config: APIConfig,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<void> {
  if (config.service === 'deepl') {
    return translateWithDeeplStream(text, to, from, onChunk, signal);
  }

  const systemPrompt = 'You are a professional, authentic machine translation engine.';
  const userPrompt = from === 'auto-detect'
    ? `;; Treat next line as plain text input and translate it into ${to}, output translation ONLY. If translation is unnecessary (e.g. proper nouns, codes, etc.), return the original text. NO explanations. NO notes. Input:\n${text}`
    : `;; Treat next line as plain text input and translate it from ${from} into ${to}, output translation ONLY. If translation is unnecessary (e.g. proper nouns, codes, etc.), return the original text. NO explanations. NO notes. Input:\n${text}`;

  const response = await fetch(config.apiHost + '/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: Math.max(100, text.length * 2),
      stream: true
    }),
    signal
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Translation failed');
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('Stream not available');
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            console.error('Error parsing streaming response:', e);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
} 