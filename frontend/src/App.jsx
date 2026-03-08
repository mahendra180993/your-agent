// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatWidget from './components/ChatWidget/ChatWidget.jsx';
import AdminPanel from './components/AdminPanel/Dashboard.jsx';
import Login from './components/AdminPanel/Login.jsx';
import { useTheme } from './hooks/useTheme.js';

function App() {
  const [theme] = useTheme();
  
  // Get website from URL or default
  const getWebsite = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('website') || window.location.hostname || 'example.com';
  };

  return (
    <Router>
      <div className={theme}>
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminPanel />} />
          <Route
            path="/*"
            element={
              <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    AI Chatbot Demo
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Click the chat button in the bottom-right corner to start chatting.
                  </p>
                </div>
                <ChatWidget website={getWebsite()} />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
