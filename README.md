# Heidi NP - Quiz Master Edition

A modern web-based study application designed for Psychiatric Mental Health Nursing Practitioners (PMHNP) to prepare for exams and master clinical concepts.

## Features

### Built-in Study Modes

- **Flashcard Mode**: Interactive flashcards with flip animations, progress tracking, and localStorage persistence
- **Quiz Mode**: Multiple-choice quizzes with immediate feedback, explanations, and performance tracking
- **Timed Mode**: Time-constrained questions (30 seconds per question) to build speed and accuracy
- **Review Mode**: Performance analytics across psychiatric topics with study recommendations

### AI Tutor Features (NEW)

- **Content Library**: Upload your own study materials (TXT, Markdown, PDF)
- **AI Study Assistant**: Ask questions about your uploaded content and get instant, accurate answers powered by Hugging Face LLMs
- **Dynamic Content Generation**: Automatically generate quiz questions and flashcards from your uploaded materials
- **Intelligent Q&A**: The AI tutor understands context and provides detailed explanations based on your specific materials

### Pre-loaded Content

- **100+ Study Questions**: Comprehensive coverage of PMHNP exam topics
- **8 Core Topics**: Depression & Anxiety, Psychotic Disorders, Bipolar Disorder, Substance Use, Personality Disorders, Cognitive Disorders, Therapeutic Techniques, Pharmacology
- **AI-Generated Questions**: Clinically relevant, evidence-based exam prep material
- **Detailed Explanations**: Every answer includes comprehensive explanations for deeper learning

## Tech Stack

- **Frontend**: Next.js 14 with React 18
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3 with custom animations
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library
- **State Management**: React Hooks + localStorage
- **AI/LLM**: Hugging Face Inference API (Mistral 7B)
- **File Processing**: PDF parsing, text extraction
- **Backend**: Next.js API Routes

## Project Structure

```
heidi-time/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── api/
│   │   ├── content/              # Content management endpoints
│   │   │   ├── upload/route.ts   # File upload
│   │   │   ├── list/route.ts     # List content
│   │   │   └── [id]/route.ts     # Get/delete content
│   │   ├── generate/             # Content generation endpoints
│   │   │   ├── questions/route.ts # Generate quiz questions
│   │   │   └── flashcards/route.ts # Generate flashcards
│   │   └── chat/route.ts         # Q&A endpoint
│   └── study/
│       ├── flashcard/page.tsx    # Flashcard mode
│       ├── quiz/page.tsx         # Quiz mode
│       ├── timed/page.tsx        # Timed mode
│       ├── review/page.tsx       # Review mode
│       ├── library/page.tsx      # Content library (NEW)
│       ├── ai-tutor/page.tsx     # AI study assistant (NEW)
│       └── generate/page.tsx     # Content generation (NEW)
├── components/                   # Reusable components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Header.tsx
│   ├── ModeCard.tsx
│   ├── ProgressBar.tsx
│   ├── StatsCard.tsx
│   ├── ContentUploader.tsx       # File upload widget (NEW)
│   ├── ContentLibrary.tsx        # Content browser (NEW)
│   ├── ChatBox.tsx               # Q&A interface (NEW)
│   ├── GenerationPanel.tsx       # Content generation panel (NEW)
│   └── __tests__/                # Component tests
├── lib/
│   ├── huggingface.ts            # HF API integration (NEW)
│   ├── contentStorage.ts         # Content management (NEW)
│   └── fileParser.ts             # File parsing utilities (NEW)
├── data/                         # Study question data
│   ├── flashcardData.ts
│   ├── quizData.ts
│   ├── timedData.ts
│   └── __tests__/                # Data tests
├── .env.local                    # Environment variables (NEW)
└── jest.config.js                # Jest configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Generate package-lock.json (already done)
npm install
```

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Testing

### Run Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm test:watch

# Generate coverage report
npm test:coverage
```

### Test Coverage

- **Component Tests**: Button, Card, ProgressBar, Header, ModeCard, StatsCard
- **Data Validation Tests**: All question datasets validated for structure and uniqueness
- **Total Coverage**: 32 passing tests covering components, utilities, and data integrity

## Features Implementation

### Reusable Components

Built a component library to reduce code duplication:

- `Button`: Styled button with icon support and disabled states
- `Card`: Glassmorphic card with optional animations
- `Header`: Consistent page headers with back navigation
- `ProgressBar`: Visual progress tracking
- `ModeCard`: Study mode selection cards
- `StatsCard`: Statistics display cards

### Data Layer

Extracted all hardcoded questions into a modular data layer:

- `flashcardData.ts`: 20 flashcards with topics
- `quizData.ts`: 25 quiz questions with explanations
- `timedData.ts`: 25 timed challenge questions

### State Persistence

Implemented localStorage integration for each mode:

- **Flashcard Mode**: Saves current card index
- **Quiz Mode**: Saves current question, score, and progress
- **Timed Mode**: Real-time score tracking (cleared on completion)

### Accessibility Improvements

- ARIA labels on interactive elements
- Keyboard navigation support (Enter key for flashcard flip)
- Semantic HTML structure
- High contrast colors for readability
- Focus indicators on buttons

## Code Quality

### TypeScript

- Strict mode enabled
- Full type safety for all data structures
- Interface definitions for components and data

### Testing

- Jest + React Testing Library setup
- Comprehensive test suite with 32 tests
- Data validation tests
- Component behavior tests

### Best Practices

- No console logs in production code
- Clean, consistent formatting
- Minimal dependencies
- Security-first approach

## Future Enhancements

### Planned Features

1. **User Authentication**: Support for user accounts and progress tracking
2. **Spaced Repetition**: Implement SM-2 algorithm for optimal learning
3. **Dark/Light Mode**: Theme toggle functionality
4. **Mobile App**: React Native version for iOS/Android
5. **API Integration**: Backend for storing user progress and analytics
6. **AI Integration**: ChatGPT integration for personalized explanations
7. **Performance Metrics**: Advanced analytics and performance tracking

### Potential Improvements

- Add more question types (drag-and-drop, matching, fill-in-the-blank)
- Implement question randomization and shuffling
- Add image/diagram support for complex concepts
- Create teacher dashboard for analytics
- Implement study groups and peer learning

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- **Bundle Size**: Minimal with only essential dependencies
- **Load Time**: Optimized with Next.js static generation
- **Runtime**: Smooth animations with 60fps target
- **Accessibility**: WCAG 2.1 AA compliance

## Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
npm i -g vercel
vercel
```

### Docker

```bash
# Build Docker image
docker build -t heidi-time .

# Run container
docker run -p 3000:3000 heidi-time
```

### Environment Variables

Create a `.env.local` file for local development (required for AI features):

```bash
NEXT_PUBLIC_APP_NAME=Heidi NP - Quiz Master Edition
HUGGINGFACE_API_KEY=your_hf_api_key_here
```

**Getting a Hugging Face API Key:**
1. Sign up at https://huggingface.co
2. Go to Settings → Access Tokens
3. Create a new token with read access
4. Add it to your `.env.local` file

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Changelog

### Version 0.2.0 (Current)

**New AI Tutor Features:**
- Content library with file upload (TXT, MD, PDF)
- AI-powered Q&A chatbot
- Dynamic content generation (quiz questions, flashcards)
- Hugging Face LLM integration
- File parsing and text extraction
- In-memory content storage (upgrade to database recommended)

### Version 0.1.0

- Initial release
- 4 study modes (Flashcard, Quiz, Timed, Review)
- 100+ AI-generated questions
- Reusable component system
- localStorage persistence
- Comprehensive testing suite
- Accessibility features
- Responsive design

## Acknowledgments

- PMHNP exam preparation content
- Mental health nursing best practices
- Psychiatric nursing research