# Nova - AI Persona Platform Frontend

A modern, mobile-first React frontend for the AI Persona Platform MVP. Built with TypeScript, Tailwind CSS, and React Query.

## Features

### ✨ Core Features
- **Authentication**: Login/Register with form validation
- **AI Personas**: Browse and interact with unique AI personalities
- **Real-time Chat**: WebSocket-powered messaging with typing indicators
- **Gamification**: Charm points system and progressive content unlocking
- **Media Gallery**: Locked/unlocked content with preview system
- **Responsive Design**: Mobile-first, works on all devices

### 🎨 UI/UX Features
- **Dark Theme**: Immersive dark interface inspired by social platforms
- **Social Media Feel**: Instagram/OnlyFans inspired design language
- **Smooth Animations**: Subtle transitions and micro-interactions
- **Accessibility**: WCAG compliant with keyboard navigation
- **Progressive Enhancement**: Works with JavaScript disabled

### 🔧 Technical Features
- **TypeScript**: Full type safety across the codebase
- **State Management**: Zustand for auth, React Query for server state
- **Routing**: React Router with protected routes
- **Form Handling**: React Hook Form with validation
- **Real-time Communication**: WebSocket-based chat

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: 
  - Zustand for client state
  - TanStack Query for server state
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   ├── auth/           # Authentication components
│   ├── personas/       # Persona-related components
│   ├── chat/           # Chat system components
│   ├── media/          # Media gallery components
│   └── layout/         # Navigation and layout
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API and WebSocket services
├── types/              # TypeScript type definitions
└── config/             # Configuration files
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000

### Demo Credentials

For testing purposes, use these demo credentials:
- **Email**: demo@example.com  
- **Password**: demo123

## Key Components

### Authentication
- Persistent login with localStorage
- Form validation with React Hook Form
- Protected routes with authentication guards

### AI Personas
**8 Unique Female Personas** with distinct personalities:

**Easy Difficulty:**
- **Emma**: Friendly art student who loves creativity and music
- **Luna**: Zen yoga instructor focused on mindfulness and nature
- **Mia**: Bubbly gaming streamer who loves anime and cosplay

**Medium Difficulty:**  
- **Sophia**: Mysterious intellectual who enjoys deep conversations
- **Zara**: Edgy DJ and music producer with urban flair
- **Scarlett**: Gothic romance novelist with a dark poetic soul

**Hard Difficulty:**
- **Isabella**: Confident businesswoman with a secret wild side
- **Victoria**: Elegant fashion model with high standards

Each persona features:
- Unique personality, speaking style, and interests
- Progressive content unlocking system
- Difficulty-based charm point requirements
- Themed media galleries with exclusive content

### Chat System
- Real-time messaging over WebSocket
- Typing indicators and message states
- Charm points earned per interaction

### Media Gallery
- Locked/unlocked content system
- Full-screen media viewer
- Filter by unlock status
- Progressive image loading

## Design System

The UI follows a comprehensive design system with:

### Colors
- **Brand**: Indigo-based color palette
- **Accent**: Pink/red for highlights and CTAs  
- **Neutrals**: Dark theme with proper contrast ratios
- **Semantics**: Success, warning, error states

### Typography
- **Font**: Inter/SF Pro system font stack
- **Scale**: From 12px to 36px with consistent line heights
- **Weights**: Regular (400), Medium (500), Semibold (600)

### Components
- **Buttons**: Primary, secondary, tertiary variants
- **Inputs**: With validation states and helper text
- **Cards**: Persona cards with hover effects
- **Badges**: Difficulty levels and status indicators
- **Modals**: Responsive with backdrop blur

### Responsive Design
- **Mobile-first**: Optimized for mobile experience
- **Breakpoints**: xs(360), sm(480), md(768), lg(1024), xl(1280)
- **Navigation**: Bottom tabs on mobile, header on desktop

 

## Development

### Scripts
```bash
# Development server
npm run dev

# Build for production  
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Variables
Create a `.env` file for configuration:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080
```

 

## Architecture Decisions

### State Management
- **Zustand** for authentication state (persistent)
- **React Query** for server state with caching
- **Local state** for UI interactions

### Routing Strategy
- Protected routes for authenticated users
- Dynamic imports for code splitting (future enhancement)
- Proper navigation guards and redirects

### Component Architecture  
- **Atomic design** with ui/ folder for base components
- **Feature-based** organization for complex components
- **Custom hooks** for business logic separation

### Performance
- **Image optimization** with responsive sources
- **Lazy loading** for media content
- **Query optimization** with React Query
- **Bundle splitting** ready for production

## Browser Support

- Chrome 90+
- Firefox 88+  
- Safari 14+
- Edge 90+

## Contributing

1. Follow the existing code style and conventions
2. Use TypeScript strictly - no `any` types
3. Write semantic HTML with proper ARIA labels
4. Test on both mobile and desktop viewports
5. Update types when adding new features

## License

This project is part of the Nova AI Persona Platform MVP.
