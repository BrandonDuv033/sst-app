
import { useState } from 'react';

import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { SoporteList } from './components/SoporteList';

import './index.css';

function MainApp() {
  const { user } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  if (!user) {
    return (
      <div className="app-wrapper">
        {isRegistering ? (
          <Register
            onSwitchToLogin={() => setIsRegistering(false)}
          />
        ) : (
          <Login
            onSwitchToRegister={() => setIsRegistering(true)}
          />
        )}
      </div>
    );
  }

  return <SoporteList />;
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
