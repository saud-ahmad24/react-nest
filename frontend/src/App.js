import React, { useContext } from 'react';
import { AuthProvider } from './context/AuthContext';
import TodoList from './components/TodoList';
import Login from './components/Login';
import AuthContext from './context/AuthContext';

function App() {
  const { currentUser } = useContext(AuthContext);
  
  return (
    <AuthProvider>
      <div className="App">
        {/* <Login/> */}
        {!currentUser ? <Login /> : <TodoList />}
      </div>
    </AuthProvider>
  );
}

export default App;
