import { NavLink } from "react-router-dom";
import './Navigation.css';

const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <NavLink 
        to="/"
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        Home
      </NavLink>
      <NavLink 
        to="/login"
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        Login
      </NavLink>
      <NavLink 
        to="/register"
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        Register
      </NavLink>
    </nav>
  );
};

export default Navigation;