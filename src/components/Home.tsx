import { useSelector, useDispatch } from "react-redux";
import { logout, type AppDispatch, type RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Paper
} from '@mui/material';

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Домашняя страница
        </Typography>
        
        {user !== null && (
          <Box 
            sx={{
              width: '100%',
              maxWidth: 400,
              p: 4,
              borderRadius: 2,
              boxShadow: 3,
              bgcolor: 'background.paper'
            }}>
            <Typography variant="h5" gutterBottom>
              Добро пожаловать, {user.name}!
            </Typography>
            <Typography variant="body1" gutterBottom>
              Email: {user.email}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mt: 3 }}
              onClick={() => {
                dispatch(logout());
                navigate("/login");
              }}
            >
              Выйти
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Home;