# KTranslate

KTranslate is a visually stunning and feature-rich translation application powered by the Google Gemini API. It offers a human-centric design with light and dark modes, aiming for an intuitive user experience with a warm "Solarium Vibe" theme.

## Features

*   **AI-Powered Translation:** Leverages the advanced capabilities of Google's Gemini models for accurate and context-aware translations.
*   **Multiple Translation Modes:**
    *   **Highest Quality:** Prioritizes accuracy and nuance.
    *   **Balanced:** Offers a good mix of quality and speed.
    *   **Speedy:** Optimized for fast translations, ideal for quick lookups.
*   **Flexible Translation Styles:**
    *   **Natural & Fluid:** Produces colloquial, idiomatic translations.
    *   **Standard & Literal:** Focuses on direct, precise, word-for-word accuracy.
*   **Extensive Language Support:** Supports a wide range of common languages, plus an "Auto-detect" feature for the source language.
*   **Custom Language Input:** Allows users to specify languages not in the pre-defined list.
*   **Dual Themes:** Seamlessly switch between a bright Light Mode and a comfortable Dark Mode. Theme preference is saved locally.
*   **Solarium Vibe Theme:** A warm, natural, and earthy color palette (terracotta, sage green, sand, cream) for a comfortable and inviting user interface.
*   **Translation History:** Automatically saves your translations for easy access and reuse. Includes options to load, delete individual items, or clear all history.
*   **Clipboard Integration:** Easily copy translated text or paste text from your clipboard into the input field.
*   **Responsive Design:** Adapts to various screen sizes for a consistent experience on desktop and mobile devices.
*   **Accessibility:** Designed with ARIA attributes and keyboard navigation in mind.

## Tech Stack

*   **Frontend:** React, TypeScript
*   **Styling:** Tailwind CSS
*   **AI Model API:** Google Gemini API (`@google/genai`)

## Setup and Running

KTranslate is designed to run directly in a web browser.

1.  **API Key Configuration (Crucial):**
    This application requires a Google Gemini API key to function. The API key **must** be provided as an environment variable named `API_KEY`.
    *   You need to obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   The application is coded to expect `process.env.API_KEY` to be available in its execution environment. The way this environment variable is set depends on how and where you deploy or run the application. For simple local testing by opening `index.html`, this usually means the `API_KEY` needs to be "baked in" or provided through a mechanism supported by your local setup (which can be complex for static files). In a typical web app hosting environment, you would set this environment variable via the hosting platform's configuration dashboard.
    *   **Without a valid `API_KEY`, the translation functionality will not work.** An in-app warning will be displayed if the key is missing.

2.  **Running the Application:**
    *   Ensure all project files (`index.html`, `index.tsx`, `components/`, `services/`, etc.) are in their correct directory structure.
    *   Open the `index.html` file in a modern web browser that supports ES modules.

## File Structure

*   `index.html`: The main HTML file, includes Tailwind CSS configuration and script imports.
*   `index.tsx`: The entry point for the React application.
*   `App.tsx`: The main application component orchestrating all UI and logic.
*   `metadata.json`: Contains metadata about the application for the hosting environment.
*   `constants.ts`: Defines application-wide constants like supported languages, translation modes, and styles.
*   `types.ts`: Contains TypeScript type definitions.
*   `components/`: Contains all React UI components.
    *   `icons/`: SVG icon components.
*   `hooks/`: Custom React hooks (e.g., `useTheme.ts`, `useTranslationHistory.ts`).
*   `services/`: Contains services for external API interactions (e.g., `geminiService.ts`).
*   `README.md`: This file.
*   `LICENSE`: The project's license file.


## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
