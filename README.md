# KTranslate 🌐

Fast and accurate translations for everyone, powered by modern AI models.

[![Next.js](https://img.shields.io/badge/Next.js-13.5+-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

KTranslate is a modern web application that provides fast, accurate translations powered by state-of-the-art AI models. With its sleek interface and powerful features, it makes translating text between multiple languages effortless and efficient.

## 📋 Table of Contents
- [✨ Features](#-features)
- [🚀 Getting Started](#-getting-started)
- [🛠️ Technology Stack](#️-technology-stack)
- [🎨 Features in Detail](#-features-in-detail)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)
- [📞 Support](#-support)
- [📱 Screenshots](#-screenshots)
- [🔄 Changelog](#-changelog)

## ✨ Features

- 🤖 Advanced AI-powered translations
- 🔄 Support for 19+ languages
- 🎯 Auto-language detection
- 📝 Translation history with search functionality
- ⭐ Favorite translations for quick access
- 🌓 Light/Dark theme support
- 📱 Responsive design for all devices
- ⚡ Real-time translation updates
- 📋 Easy copy/paste functionality

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, or pnpm

### Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Configure your environment variables in the `.env` file:
```env
NEXT_PUBLIC_DEEPLX_API=your_api_key_here
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/KuekHaoYang/KTranslate.git
cd ktranslate
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) - React framework for production
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Production-ready animations
- **Font**: [Geist](https://vercel.com/font) - Modern sans-serif typeface
- **State Management**: React Context API
- **Development Tools**: ESLint, Prettier

## 🎨 Features in Detail

### Translation
- Real-time translation between multiple languages
- Auto-detection of source language
- Support for copying and pasting text
- Swap languages with a single click

### History Management
- View past translations
- Search through translation history
- Filter favorite translations
- Clear history functionality
- Timestamp for each translation

### User Interface
- Clean and modern design
- Responsive layout for all screen sizes
- Smooth animations and transitions
- Light and dark theme support
- Loading indicators and error handling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
