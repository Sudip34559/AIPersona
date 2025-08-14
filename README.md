# Persona AI Chat Application

A full-stack AI-powered chat application that allows users to have conversations with different AI personas based on real tech educators. Built with React, Node.js, and OpenAI's Groq API.

## 🌟 Features

- **Multi-Persona AI Chat**: Chat with different AI personalities (Hitesh Choudhary & Piyush Garg)
- **Real-time Conversations**: Interactive chat interface with typing animations
- **Conversation Management**: Create, view, and delete chat conversations
- **User Authentication**: Secure login/register system with JWT tokens
- **Persistent Chat History**: All conversations and messages are stored in MongoDB
- **Responsive Design**: Modern UI built with Tailwind CSS and Radix UI components
- **Mobile-Friendly**: Responsive sidebar and mobile-optimized interface

## 🚀 Tech Stack

### Frontend

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **OpenAI Groq API** - AI language model integration

## 📁 Project Structure

```
AI/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── layout/        # Layout components
│   │   ├── API/           # API configuration
│   │   ├── hooks/         # Custom React hooks
│   │   ├── helper/        # Utility functions
│   │   └── routeProtector/ # Route protection logic
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Express middlewares
│   │   ├── db/            # Database connection & system prompts
│   │   └── service/       # External service integrations
│   └── package.json
└── README.md
```

## 🎯 AI Personas

### Hitesh Choudhary

- **Teaching Style**: Energetic, motivational, practical
- **Language**: Roman Hindi (English letters, Hindi pronunciation)
- **Expertise**: Full Stack Development, Web Development, Android Development, AI/ML, Git/GitHub
- **Greeting**: "Hanji" (starts every conversation)
- **Focus**: Practical learning, project building, career growth

### Piyush Garg

- **Teaching Style**: Fast-paced, strategic, action-oriented
- **Language**: Roman Hindi (English letters, Hindi pronunciation)
- **Expertise**: Full Stack Development, Web Development, AI/ML, Cybersecurity
- **Greeting**: "Alright" (starts every conversation)
- **Focus**: Real-world examples, practical frameworks, quick solutions

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- OpenAI Groq API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd AI
   ```

2. **Install frontend dependencies**

   ```bash
   cd client
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd ../server
   npm install
   ```

4. **Environment Setup**

   Create `.env` file in the server directory:

   ```env
   PORT=8800
   MONGODB_URI=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_jwt_secret
   ACCESS_TOKEN_EXPIRY=7d
   GROQ_API_KEY=your_groq_api_key
   ```

5. **Start the backend server**

   ```bash
   cd server
   npm run dev
   ```

6. **Start the frontend development server**

   ```bash
   cd client
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 API Endpoints

### Authentication

- `POST /api/v1/user/register` - User registration
- `POST /api/v1/user/login` - User login

### AI Conversations

- `POST /api/v1/ai/conversation` - Create new conversation
- `POST /api/v1/ai/conversation/:id/query` - Send message to AI
- `GET /api/v1/ai/conversation/:id` - Get conversation by ID
- `GET /api/v1/ai/conversations` - Get all conversations
- `DELETE /api/v1/ai/conversation/:id` - Delete conversation

## 💡 Key Features Explained

### Conversation Management

- Users can create conversations with either "Hitesh" or "Piyush" persona
- Each conversation maintains its own chat history
- Conversations are automatically saved and can be resumed later

### AI Integration

- Uses Groq's Llama3-70b model for AI responses
- System prompts define the personality and behavior of each AI persona
- Maintains conversation context for coherent responses

### Security Features

- JWT-based authentication with HTTP-only cookies
- Password hashing with bcrypt
- Protected routes requiring valid authentication
- Automatic token refresh and logout on expiration

### User Experience

- Real-time typing indicators
- Auto-scrolling chat interface
- Responsive sidebar with conversation list
- Mobile-optimized interface
- Smooth animations and transitions

## 🎨 UI Components

The application uses a modern component library built with:

- **Radix UI**: Accessible, unstyled components
- **Tailwind CSS**: Utility-first styling
- **Custom Components**: Sidebar, chat interface, forms
- **Responsive Design**: Mobile-first approach

## 🔒 Security Considerations

- JWT tokens stored in HTTP-only cookies
- Password hashing with bcrypt
- CORS configuration for frontend-backend communication
- Input validation and sanitization
- Protected API endpoints

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
cd client
npm run build
# Deploy the dist folder
```

### Backend (Railway/Heroku)

```bash
cd server
# Set environment variables
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Hitesh Choudhary** - For the inspiring teaching persona
- **Piyush Garg** - For the strategic tech education approach
- **OpenAI/Groq** - For providing the AI language model
- **Open Source Community** - For the amazing tools and libraries

## 📞 Support

If you have any questions or need help with the application, please open an issue in the repository.

---

**Happy Coding! 🚀**
