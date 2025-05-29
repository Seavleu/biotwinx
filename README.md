# 🧬 BIOTWINX

<div align="center">

**Empower Your Wellness Journey with AI Insights**

[![Last Commit](https://img.shields.io/github/last-commit/seavleu/biotwinx)]()
![TypeScript](https://img.shields.io/badge/typescript-97.0%25-blue.svg)
![Languages](https://img.shields.io/github/languages/count/seavleu/biotwinx)

</div>

## 🛠️ Tech Stack

<p align="center">
  <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
    <img alt="Next.js" src="https://img.shields.io/badge/-Next.js-000?logo=next.js&style=for-the-badge">
  </a>
  <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer">
    <img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&style=for-the-badge">
  </a>
  <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer">
    <img alt="TailwindCSS" src="https://img.shields.io/badge/-TailwindCSS-06B6D4?logo=tailwindcss&style=for-the-badge">
  </a>
  <a href="https://ui.shadcn.com/" target="_blank" rel="noreferrer">
    <img alt="shadcn/ui" src="https://img.shields.io/badge/-shadcn/ui-000000?logo=radix-ui&style=for-the-badge">
  </a>
  <a href="https://zustand-demo.pmnd.rs/" target="_blank" rel="noreferrer">
    <img alt="Zustand" src="https://img.shields.io/badge/-Zustand-000000?logo=zustand&style=for-the-badge">
  </a>
  <a href="https://huggingface.co/" target="_blank" rel="noreferrer">
    <img alt="HuggingFace" src="https://img.shields.io/badge/-HuggingFace-FCC419?logo=huggingface&style=for-the-badge">
  </a>
  <a href="https://recharts.org/" target="_blank" rel="noreferrer">
    <img alt="Recharts" src="https://img.shields.io/badge/-Recharts-888?logo=recharts&style=for-the-badge">
  </a>
</p>



## 📚 Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)

---

## 🧠 Overview

**BioTwinX** is an innovative AI-powered wellness companion designed to enhance your self-health and emotional well-being.

### Why BioTwinX?

This project empowers users to understand and improve their health through advanced analytics and personalized insights. The core features include:

- 🧠 **AI-Powered Wellness Insights**: Get tailored health recommendations based on your unique data.
- 🎤 **Voice and Selfie Analysis**: Analyze stress levels and biological age through voice recordings and selfies.
- 📓 **Emotional Journaling**: Engage in self-reflection with AI-assisted journaling for mental wellness.
- 🔒 **Privacy-Focused Architecture**: Your data is stored locally, ensuring your privacy is prioritized.
- 💻 **Responsive UI with Tailwind CSS**: Enjoy a modern, responsive design that enhances user experience across devices.
- 🌈 **Customizable Theme Support**: Switch between themes for a personalized and accessible interface.


## 📐 Architecture

BioTwinX is designed to run entirely in the browser, prioritizing privacy and local data storage:

- All user data is stored locally using Zustand's persistence
- No user accounts or server-side storage
- AI processing is performed via API calls to open-source models

## 🧠 AI Models

BioTwinX leverages several AI models for its features:

1. **Face Analysis Model**: For biological age estimation
2. **Voice Analysis Model**: For stress/fatigue detection
3. **NLP Model**: For emotional state analysis from journal entries
4. **Multimodal LLM**: For generating personalized wellness advice

## 🔒 Privacy & Ethics

### Privacy-First Approach

- No data leaves your device without explicit consent
- All processing happens locally when possible
- No user accounts or personal identification required
- Clear data deletion options

### Ethical AI Principles

- **Transparency**: Clear disclosure of how AI is used in the application
- **User Control**: Users maintain ownership and control of their data
- **Accuracy**: Continuous improvement of models for better insights
- **Wellness Focus**: Designed to supplement, not replace, professional health advice

### Disclaimer

BioTwinX is not a medical device and should not be used for diagnosis, treatment, or prevention of any disease or health condition. The estimates and suggestions provided are for informational purposes only. Always consult with healthcare professionals for medical advice.

## 🔍 Model Transparency

- Biological age estimation has a typical margin of error of ±3-5 years
- Voice stress analysis is based on acoustic features, not content analysis
- Emotional analysis from text uses sentiment analysis and emotion classification
- All recommendations are generated using general wellness principles

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open http://localhost:3000 in your browser

## 📁 Project Structure

```
/
├── app/                # Next.js app directory
│   ├── selfie/         # Biological age estimation
│   ├── voice/          # Voice stress/fatigue analysis
│   ├── journal/        # Emotional journaling
│   └── insights/       # Data visualization and trends
├── components/         # Reusable UI components
├── lib/                # Utilities and hooks
│   ├── store.ts        # Zustand state management
│   └── ai-utils.ts     # AI processing utilities
├── models/             # For local AI model inference
├── prompts/            # LLM prompt templates
└── data/               # Local data storage
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.