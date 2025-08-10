# AI Super Word List

[中文](README.md) | **English**

An immersive English word typing practice application based on Next.js, featuring AI-generated personalized learning content to make vocabulary learning more interesting and efficient.

## 📺 Application Preview

### Local Dictionary Practice Mode
![Local Dictionary Practice](.assets/local-practice.gif)

### AI Scenario Practice Mode
🎬 **Demo Video**: [Click to view AI Scenario Practice Mode demonstration](https://github.com/1nFrastr/julebu-nextjs-clone-core/blob/main/.assets/ai-scenairo-practice.mp4)

## ✨ Core Features

### 🎯 Immersive Typing Practice for Vocabulary Learning
- **Focused Typing Experience**: Clean interface design focused on typing practice
- **Smart Input Detection**: Real-time input accuracy detection with instant feedback
- **Audio Enhancement**: Typing sound effects, correct/incorrect notification sounds to enhance learning experience
- **Auto Pronunciation**: Automatic pronunciation playback for each word to strengthen auditory memory

### 📚 Local Dictionary Practice
- **Curated Common Vocabulary**: Built-in 23 basic common English words
- **Quick Start**: No configuration needed, ready to use immediately
- **Randomized Order**: Automatically shuffles word order for each practice session to avoid memory patterns

### 🤖 AI Custom Scenario Practice
- **Intelligent Scenario Generation**: Powered by Doubao AI, generates relevant vocabulary based on user-input scenarios
- **Scenario Recommendations**: AI-powered recommendations for popular learning scenarios (restaurant ordering, airport check-in, hotel check-in, etc.)
- **Flexible Quantity**: Support generating 5-50 words to meet different learning needs
- **Real-time Preview**: Preview generated vocabulary content before confirming and starting practice

### ⌨️ Smart Interaction Design
- **Keyboard Shortcuts**:
  - `Alt + P`: Pause/Resume game
  - `Alt + K`: Show/Hide answer hints
  - `Alt + L`: Skip to next word
- **Smart Hints**: Automatically shows answer hints after 3 consecutive errors
- **Progress Tracking**: Real-time display of practice progress and completion status

## 🛠 Tech Stack

### Frontend Framework
- **Next.js 15.3.3** - Full-stack React framework with App Router
- **React 19.1.0** - User interface library
- **TypeScript 5** - Type-safe JavaScript

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icon set

### AI & Audio
- **OpenAI SDK** - Integration with Doubao AI API for vocabulary generation
- **use-sound** - React audio playback hook

### Development Tools
- **ESLint** - Code quality checking
- **PostCSS** - CSS processing tool

## 🚀 Quick Start

### Requirements
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation & Running

1. **Clone the project**
```bash
git clone [repository-url]
cd julebu-nextjs-clone-core
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Start development server**
```bash
pnpm dev
```

4. **Access the application**
Open your browser and visit [http://localhost:3000](http://localhost:3000)

### Build & Deploy

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Code linting
pnpm lint
```

## 📖 Usage Guide

### Start Practicing
1. Choose practice mode:
   - **Local Dictionary**: Use built-in vocabulary for quick start
   - **Custom Scenario**: Input scenario description for AI-generated relevant vocabulary

2. Begin typing practice:
   - See Chinese translation, type the corresponding English word
   - System automatically plays word pronunciation
   - Automatically proceeds to next word after correct input

3. Use shortcuts for efficiency:
   - Press `Alt + K` to show answer when you forget a word
   - Press `Alt + P` when you need to pause
   - Press `Alt + L` to skip current word

### AI Scenario Customization
1. On the custom scenario page, input topics such as:
   - "Restaurant ordering"
   - "Job interview"
   - "Travel English"
   - "Shopping communication"

2. Select vocabulary quantity (5-50 words)

3. Click "Generate Dictionary", AI will create relevant vocabulary

4. Preview generated vocabulary, start practicing when satisfied

## 🎯 Project Highlights

- **🎮 Gamified Learning**: Makes vocabulary learning fun through typing games
- **🎵 Multi-sensory Experience**: Visual, auditory, and tactile stimulation to strengthen memory
- **🧠 AI-Powered**: Intelligently generates personalized learning content
- **⚡ High Performance**: Modern architecture based on Next.js with fast response
- **📱 Responsive Design**: Perfect adaptation for desktop and mobile devices
- **🎨 Clean & Beautiful**: Interface design focused on learning experience

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── Game.tsx          # Main game component
│   ├── DictionarySelector.tsx  # Dictionary selector
│   ├── Input.tsx         # Input component
│   └── ...               # Other UI components
├── data/                 # Data files
│   └── words.ts          # Local dictionary
├── services/             # Service layer
│   └── openai.ts         # AI service
├── types/                # TypeScript type definitions
└── hooks/                # React Hooks
```

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

This project is licensed under the MIT License.
