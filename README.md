# BioTwinX: AI-Powered Wellness Companion

BioTwinX is a multimodal, AI-powered self-health and emotional wellness companion. It helps you understand your biological age, track stress/fatigue levels, and receive personalized wellness suggestions.

## 🚀 Features

- **Biological Age Estimation**: Upload a selfie to estimate your biological age and track changes over time
- **Voice Analysis**: Record your voice to analyze stress and fatigue levels based on tone and speech patterns
- **Emotional Journal**: Express your thoughts and feelings to receive personalized wellness reflections
- **Wellness Insights**: View trends, patterns, and personalized recommendations

## 🔧 Tech Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS, shadcn/ui
- **State Management**: Zustand (with persistence for local storage)
- **AI Processing**: HuggingFace Transformers (via API)
- **Data Visualization**: Recharts

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