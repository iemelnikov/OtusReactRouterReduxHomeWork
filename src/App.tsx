import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Navigation from './components/Navigation';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import './App.css'

function App() {
  return (
      <>
        <Navigation />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Routes>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<NotFound />} /> 
          </Routes>
        </Container>        
      </>
  );
}

export default App