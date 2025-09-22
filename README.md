# S3 Dashboard - Your Smart Path to Career Success 🚀

A comprehensive career development platform that helps students accelerate their career journey with AI-powered tools, personalized job recommendations, and expert mentorship guidance.

## Features

- **🎯 Resume Analysis**: AI-based resume feedback and optimization
- **💼 Job Recommendations**: Personalized job listings based on your profile
- **📊 Progress Tracking**: Track your learning journey with detailed insights
- **🤝 Mentor Connect**: Find experienced mentors and senior students
- **🤖 AI Assistant**: Get instant help and guidance
- **⚙️ Settings & Profile**: Manage your account and preferences

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT with bcrypt
- **UI/UX**: Framer Motion, Lucide React Icons
- **Styling**: Tailwind CSS with custom components

## Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd s3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Connection String
   MONGODB_URI=mongodb://localhost:27017/s3-dashboard
   
   # JWT Secret Key (change this in production)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Next.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key
   ```

4. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `s3-dashboard`
   - The application will automatically create the necessary collections

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
s3/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   └── protected/
│   │       └── profile/
│   ├── components/
│   │   ├── modules/
│   │   ├── AuthModal.js
│   │   ├── Dashboard.js
│   │   ├── LandingPage.js
│   │   ├── Navbar.js
│   │   ├── Sidebar.js
│   │   └── TopNavbar.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── middleware.js
├── package.json
└── README.md
```

## Authentication Flow

1. **Landing Page**: Users see the beautiful landing page with feature previews
2. **Sign Up**: New users can create accounts with email, password, name, and phone
3. **Login**: Existing users can sign in with email and password
4. **JWT Token**: Upon successful authentication, a JWT token is generated and stored
5. **Protected Routes**: API routes under `/api/protected/` require valid JWT tokens
6. **Dashboard Access**: Authenticated users can access the full dashboard

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Protected Routes (require JWT token)
- `GET /api/protected/profile` - Get user profile
- `PUT /api/protected/profile` - Update user profile

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  phone: String,
  role: String (default: 'Student'),
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  profile: {
    avatar: String,
    bio: String,
    skills: Array,
    experience: Array,
    education: Array
  }
}
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
- Set up MongoDB Atlas for database
- Configure environment variables
- Build and deploy using your preferred platform

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `NEXTAUTH_URL` | Your application URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for students pursuing their career dreams**
