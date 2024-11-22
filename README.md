# Task Management System

A modern, full-stack task management application built with Node.js, Express, MongoDB, and Vanilla JavaScript. Features a clean, responsive interface with dark/light theme support and real-time task statistics.

![Task Management Dashboard](https://i.imgur.com/your-screenshot.png)

## 🌟 Features

- **User Authentication**
  - Secure login and registration
  - JWT-based authentication
  - Protected routes

- **Task Management**
  - Create, read, and delete tasks
  - Priority levels (High, Medium, Low)
  - Deadline tracking
  - Task categorization

- **Modern UI/UX**
  - Responsive design
  - Dark/Light theme toggle
  - Real-time task statistics
  - Smooth animations
  - Priority color coding

- **Security**
  - Encrypted passwords
  - Environment variable configuration
  - Secure token management

## 🚀 Technologies Used

- **Frontend**
  - Vanilla JavaScript
  - HTML5
  - CSS3
  - Font Awesome Icons
  - Google Fonts (Poppins)

- **Backend**
  - Node.js
  - Express.js
  - MongoDB
  - JSON Web Tokens (JWT)
  - bcrypt.js

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Teedex1/Capstone-project.git
   cd task-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Update the `.env` file with your configuration:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

4. **Start the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

5. **Access the application**
   - Open your browser and navigate to `http://localhost:5000`

## 💻 Usage

1. **Registration/Login**
   - Create a new account or login with existing credentials
   - Secure password storage with encryption

2. **Task Management**
   - Add new tasks with title, description, priority, and deadline
   - View all tasks in a clean, organized interface
   - Delete completed tasks
   - Track task statistics

3. **Theme Customization**
   - Toggle between light and dark themes
   - Theme preference is saved locally

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT for secure authentication
- Environment variables for sensitive data
- CORS protection
- Input validation and sanitization

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Flexible grid layout
- Adaptive components

## 🛠️ Development

1. **Prerequisites**
   - Node.js (v14 or higher)
   - MongoDB
   - npm or yarn

2. **Development Setup**
   ```bash
   # Install dependencies
   npm install

   # Run in development mode
   npm run dev
   ```

3. **File Structure**
   ```
   task-management/
   ├── backend/
   │   ├── config/
   │   ├── controllers/
   │   ├── middleware/
   │   ├── models/
   │   └── routes/
   ├── frontend/
   │   ├── css/
   │   ├── js/
   │   └── index.html
   ├── .env
   ├── .gitignore
   └── package.json
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- Font Awesome for icons
- Google Fonts for Poppins font family
- MongoDB Atlas for database hosting
- The open-source community

## 📞 Contact

- GitHub: [@Teedex1](https://github.com/teedex1)
- Email: Tundeogunmodede1@gmail.com

---

Made with ❤️ by Tunde Ogunmodede
