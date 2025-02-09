export interface DropdownOption {
  value: string;
  label: string;
}

export const TRANSLATION_SERVICES: DropdownOption[] = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'groq', label: 'Groq' },
  { value: 'deepl', label: 'DeepL' }
];

export const SERVICE_MODELS: Record<string, DropdownOption[]> = {
  openai: [
    { value: 'gpt-4o', label: 'GPT-4O' },
    { value: 'chatgpt-4o-latest', label: 'ChatGPT-4O Latest' },
    { value: 'gpt-4o-mini', label: 'GPT-4O Mini' },
    { value: 'o1', label: 'O1' },
    { value: 'o1-mini', label: 'O1 Mini' },
    { value: 'o3-mini', label: 'O3 Mini' },
    { value: 'o1-preview', label: 'O1 Preview' },
    { value: 'gpt-4o-2024-08-06', label: 'GPT-4O (Aug 6, 2024)' },
    { value: 'gpt-4o-2024-11-20', label: 'GPT-4O (Nov 20, 2024)' },
    { value: 'gpt-4o-2024-05-13', label: 'GPT-4O (May 13, 2024)' },
    { value: 'gpt-4o-mini-2024-07-18', label: 'GPT-4O Mini (Jul 18, 2024)' },
    { value: 'o1-2024-12-17', label: 'O1 (Dec 17, 2024)' },
    { value: 'o1-mini-2024-09-12', label: 'O1 Mini (Sep 12, 2024)' },
    { value: 'o1-preview-2024-09-12', label: 'O1 Preview (Sep 12, 2024)' },
    { value: 'o3-mini-2025-01-31', label: 'O3 Mini (Jan 31, 2025)' },
    { value: 'gpt-4-turbo-2024-04-09', label: 'GPT-4 Turbo (Apr 9, 2024)' },
    { value: 'gpt-4-0125-preview', label: 'GPT-4 (Jan 25 Preview)' },
    { value: 'gpt-4-1106-preview', label: 'GPT-4 (Nov 6 Preview)' },
    { value: 'gpt-4-0613', label: 'GPT-4 (Jun 13)' },
    { value: 'gpt-4-0314', label: 'GPT-4 (Mar 14)' },
    { value: 'gpt-3.5-turbo-0125', label: 'GPT-3.5 Turbo (Jan 25)' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'gpt-3.5-turbo-1106', label: 'GPT-3.5 Turbo (Nov 6)' },
    { value: 'gpt-3.5-turbo-instruct', label: 'GPT-3.5 Turbo Instruct' }
  ],
  groq: [
    { value: 'gemma2-9b-it', label: 'Gemma 2 9B IT' },
    { value: 'llama-3.3-70b-versatile', label: 'LLaMA 3.3 70B Versatile' },
    { value: 'llama-3.1-8b-instant', label: 'LLaMA 3.1 8B Instant' },
    { value: 'llama-guard-3-8b', label: 'LLaMA Guard 3 8B' },
    { value: 'llama3-70b-8192', label: 'LLaMA 3 70B (8K)' },
    { value: 'llama3-8b-8192', label: 'LLaMA 3 8B (8K)' },
    { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B (32K)' },
    { value: 'deepseek-r1-distill-llama-70b-specdec', label: 'DeepSeek R1 Distill LLaMA 70B SpecDec' },
    { value: 'deepseek-r1-distill-llama-70b', label: 'DeepSeek R1 Distill LLaMA 70B' },
    { value: 'llama-3.3-70b-specdec', label: 'LLaMA 3.3 70B SpecDec' },
    { value: 'llama-3.2-1b-preview', label: 'LLaMA 3.2 1B Preview' },
    { value: 'llama-3.2-3b-preview', label: 'LLaMA 3.2 3B Preview' },
    { value: 'llama-3.2-11b-vision-preview', label: 'LLaMA 3.2 11B Vision Preview' },
    { value: 'llama-3.2-90b-vision-preview', label: 'LLaMA 3.2 90B Vision Preview' },
  ]
};

export type ServiceType = typeof TRANSLATION_SERVICES[number]['value'];
export type ModelType = typeof SERVICE_MODELS[ServiceType][number]['value']; 