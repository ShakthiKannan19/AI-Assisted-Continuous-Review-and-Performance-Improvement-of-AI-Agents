import React, { useRef } from 'react';
import Header from './components/Header';
import Chat from './pages/Chat';

export default function App() {
  const resetChatRef = useRef(null);

  const handleRegisterReset = (resetFn) => {
    resetChatRef.current = resetFn;
  };

  const handleNewChat = () => {
    if (resetChatRef.current) {
      resetChatRef.current();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      <Header onNewChat={handleNewChat} />
      <main className="flex-1 flex flex-col">
        <Chat onRegisterReset={handleRegisterReset} />
      </main>
    </div>
  );
}
