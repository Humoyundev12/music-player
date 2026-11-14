import React from 'react';
import Musiqa from './musiqalar/Musiqa.jsx';
import { AuthProvider } from './context/AuthContext';
import { TranslateProvider } from './context/TranslateContext';

const App = () => {
  return (
    <TranslateProvider>
      <AuthProvider>
        <Musiqa />
      </AuthProvider>
    </TranslateProvider>
  );
};

export default App;
