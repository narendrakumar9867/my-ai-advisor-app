# AI Product Advisor App

A React Native application that uses AI to recommend products based on natural language queries.

---

## Architecture

### Component Structure

```
/my-ai-advisor-app
├── App.js (Root component)
├── /src
│   ├── AdvisorScreen.js (Main screen with search logic)
│   ├── catalog.js (Product database)
│   ├── /components
│   │   └── ProductCard.js (Product display component)
│   └── /api
│       └── geminiAPI.js (AI integration)
```

---

### Data Flow
1. User enters natural language query
2. AdvisorScreen calls Gemini API via geminiAPI.js
3. AI analyzes query against product catalog
4. Results are parsed and displayed using ProductCard components

---

## Key Features

- **Natural Language Processing**: Users can describe needs in plain English
- **AI-Powered Recommendations**: Uses Google Gemini API for intelligent matching
- **Rich Product Display**: Shows match scores, reasoning, and detailed specs
- **Responsive Design**: Works on all mobile screen sizes
- **Fallback System**: Mock recommendations if API fails

---

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Add your Gemini API key in `src/api/geminiAPI.js`
4. Start development server: `npx expo start`
5. Scan QR code with Expo Go app

---

## API Integration

The app integrates with Google Gemini API to:
- Analyze user requirements
- Match against product catalog
- Generate reasoning for recommendations
- Score matches (0.0 to 1.0)

---

## Design Decisions

- **Expo Framework**: For rapid development and easy testing
- **Single Screen Design**: Keeps UX simple and focused
- **Mock Data Fallback**: Ensures app works even without API
- **Card-Based Layout**: Makes product comparison easy
- **Gradient Design**: Modern, appealing visual design

---

## File Organization

- `catalog.js`: Contains all product data with rich metadata
- `AdvisorScreen.js`: Main UI logic and state management
- `ProductCard.js`: Reusable product display component
- `geminiAPI.js`: API calls and response parsing
- `App.js`: Root component and navigation setup

---

## env file

- GEMINI_API_KEY=your-actual-gemini-api-key-here
- EXPO_PUBLIC_GEMINI_API_KEY=your-actual-gemini-api-key-here

---