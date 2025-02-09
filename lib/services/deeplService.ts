import { APIConfig } from '@/context/APIConfigContext';

export async function translateWithDeepl(
  text: string,
  targetLang: string,
  sourceLang: string | 'auto-detect',
): Promise<string> {
  const deeplxApi = process.env.NEXT_PUBLIC_DEEPLX_API || 'http://127.0.0.1:1188/translate';

  const data = {
    text,
    source_lang: sourceLang === 'auto-detect' ? 'AUTO' : sourceLang.toUpperCase(),
    target_lang: targetLang.toUpperCase()
  };

  try {
    const response = await fetch(deeplxApi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('DeepL translation error:', error);
    throw new Error('Translation failed');
  }
}

export async function translateWithDeeplStream(
  text: string,
  targetLang: string,
  sourceLang: string | 'auto-detect',
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<void> {
  // Since DeepL doesn't support streaming, we'll simulate it by sending the full response
  try {
    const translation = await translateWithDeepl(text, targetLang, sourceLang);
    // Split the translation into words to simulate streaming
    const words = translation.split(' ');
    for (const word of words) {
      if (signal?.aborted) {
        break;
      }
      onChunk(word + ' ');
      await new Promise(resolve => setTimeout(resolve, 50)); // Add small delay between words
    }
  } catch (error) {
    throw error;
  }
} 