import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Home from "./components/Home";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import Register from "./components/Register";
import Navigation from './components/Navigation';
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