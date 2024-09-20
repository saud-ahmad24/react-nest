import React, { useContext } from 'react';
import { AuthProvider } from './context/AuthContext';
import TodoList from './components/TodoList';
import Login from './components/Login';
import AuthContext from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}

function InnerApp() {
  const { currentUser } = useContext(AuthContext);
  
  return (
    <div className="App">
      {!currentUser ? <Login /> : <TodoList />}
    </div>
  );
}

export default App;
