# Visora

Visora is a comprehensive accessibility platform designed to enhance web browsing experiences for users with diverse needs. It includes a browser extension with powerful assistive tools, a landing page for information and downloads, and a full-stack application for user management and feedback.

## 🌟 Overview

Visora consists of multiple components:

- **Browser Extension**: Core accessibility features for Chrome browsers
- **Landing Page**: Public website with project information and download links
- **Popup Interface**: Extension popup for quick access to settings
- **Full-Stack App**: User authentication, dashboard, and review system

## 🚀 Features

### Browser Extension
- Text-to-speech and speech-to-text functionality
- Image hiding and high contrast mode
- Dyslexia-friendly font injection
- Cursor control and size adjustment
- Letter spacing and font size controls
- Reading mode and content width adjustments
- AI-powered image captioning and text summarization
- Interactive features like autocomplete and dimmer overlay
- Cloud synchronization of settings

### Landing Page
- Modern React-based website
- Information about accessibility features
- Download links for the extension
- Responsive design with Tailwind CSS

### Full-Stack App
- User authentication with JWT
- Dashboard for managing preferences
- Review system for user feedback
- MongoDB database integration
- Black & white aesthetic design

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (for the full-stack app)
- Chrome browser (for extension testing)

### Browser Extension Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/SairamMekala22/Visora.git
   cd Visora
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `extension/` folder

### Landing Page Setup

1. Navigate to the landing page directory:
   ```bash
   cd Landing-page
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser

### Full-Stack App Setup

#### Backend
1. Navigate to the backend directory:
   ```bash
   cd visora-app/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your MongoDB connection string:
     ```
     MONGO_URI=mongodb+srv://username:password@cluster0.fake.mongodb.net/visora
     JWT_SECRET=your_jwt_secret
     ```

4. Start the server:
   ```bash
   node server.js
   ```

#### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser

## 📁 Project Structure

```
Visora/
├── extension/                 # Browser extension source
│   ├── manifest.json
│   ├── src/
│   │   ├── background.js
│   │   ├── content.js
│   │   └── features/
│   └── assets/
├── Landing-page/              # Public website
│   ├── src/
│   ├── public/
│   └── package.json
├── popup/                     # Extension popup interface
│   ├── src/
│   └── package.json
├── visora-app/                # Full-stack application
│   ├── backend/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── frontend/
│       ├── src/
│       └── package.json
├── package.json               # Root package.json
├── webpack.config.js
└── README.md
```

## 🔧 Development

### Building the Extension
```bash
npm run build
```

### Development Mode (Watch)
```bash
npm run dev
```

## 🤝 Contributing

We welcome contributions to improve Visora's accessibility features! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

Visora was created to make the web more accessible for everyone. Special thanks to the open-source community and accessibility advocates who inspire this work.

## 📞 Contact

For questions or support, please open an issue on GitHub.