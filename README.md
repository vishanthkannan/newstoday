# NewsFlow - Modern News Aggregator

A beautiful, modern news aggregator web application built with React.js and Node.js, featuring a dark theme similar to hianime.com aesthetic.

## ✨ Features

### 🎨 Frontend Features
- **Modern Dark Theme**: Beautiful UI inspired by hianime.com with smooth animations
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Real-time News**: Fetches latest news from GNews API
- **Category Filtering**: Technology, Sports, Entertainment, Business, Health, Science
- **Country Selection**: Get regional news from different countries
- **Search Functionality**: Search for specific topics and keywords
- **User Authentication**: Secure JWT-based login and registration
- **Personal Dashboard**: Customized news feed based on user preferences
- **Bookmark System**: Save articles for later reading
- **Loading Animations**: Beautiful skeleton loaders and smooth transitions

### ⚙️ Backend Features
- **RESTful API**: Built with Node.js and Express
- **MongoDB Database**: Secure user data storage
- **JWT Authentication**: Access and refresh tokens
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: API protection against abuse
- **Admin Panel**: User management and analytics
- **News Proxy**: Secure GNews API integration
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Robust error management

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- GNews API key (included in the setup)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd newsflow
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Setup**
   
   The backend `.env` file is already configured with:
   ```
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   MONGODB_URI=mongodb://localhost:27017/newsflow
   GNEWS_API_KEY=57ab362a0b082092f418a92e64e277d5
   ```

   **Important**: Change the `JWT_SECRET` in production!

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

6. **Run the Application**
   
   Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
   
   Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## 📱 Usage

### For Regular Users
1. **Register/Login**: Create an account or sign in
2. **Browse News**: View latest news on the homepage
3. **Filter Content**: Use category tabs and country selector
4. **Search**: Find specific topics using the search bar
5. **Personalize**: Go to Dashboard → Preferences to set favorite categories
6. **Bookmark**: Save interesting articles for later
7. **Dashboard**: View personalized news feed and manage bookmarks

### For Administrators
1. **Admin Access**: Users with admin role can access admin panel
2. **User Management**: View all registered users and their preferences  
3. **Analytics**: Monitor platform statistics and user engagement
4. **User Roles**: Promote users to admin or manage user accounts

## 🛠️ Tech Stack

### Frontend
- **React.js**: UI framework
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Axios**: HTTP client for API calls
- **React Router**: Client-side routing
- **Lucide React**: Modern icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing
- **Express Rate Limit**: API rate limiting

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### News
- `GET /api/news` - Get news articles (supports category, country, search)
- `GET /api/news/search` - Search news articles

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/preferences` - Update user preferences

### Bookmarks
- `GET /api/bookmarks` - Get user bookmarks
- `POST /api/bookmarks` - Add bookmark
- `DELETE /api/bookmarks/:id` - Remove bookmark

### Admin (Admin Only)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get platform statistics
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user

## 🎨 Design Features

- **Dark Theme**: Modern dark color scheme with gradient backgrounds
- **Responsive Layout**: Mobile-first responsive design
- **Smooth Animations**: Page transitions and hover effects
- **Loading States**: Skeleton loaders for better UX
- **Interactive Cards**: News articles with hover animations
- **Modern Typography**: Clean, readable font hierarchy
- **Intuitive Navigation**: Easy-to-use header with category filtering
- **Visual Feedback**: Button states and form validation

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- Helmet.js security headers
- Protected admin routes
- Secure MongoDB queries

## 📈 Performance

- Lazy loading for images
- Efficient API calls with proper caching
- Optimized bundle size with Vite
- Responsive images with proper sizing
- Minimal re-renders with proper React patterns

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Future Enhancements

- [ ] Push notifications for breaking news
- [ ] Social sharing integration
- [ ] Comment system for articles
- [ ] Advanced search filters
- [ ] News source preferences
- [ ] Offline reading capability
- [ ] Email newsletter subscription
- [ ] Multiple language support

## 🐛 Known Issues

- GNews API has rate limits (100 requests/day for free tier)
- Image loading may be slow for some news sources
- Search functionality depends on GNews API availability

## 💬 Support

For support, email support@newsflow.com or open an issue on GitHub.

---

**Built with ❤️ using modern web technologies**