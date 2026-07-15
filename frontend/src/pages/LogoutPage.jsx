import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/auth.jsx';

const LogoutPage = () => {

  const { logoutUser } = useAuth();

  useEffect(() => {

    logoutUser();
    localStorage.removeItem("token");
  }, [logoutUser]);

  return <Navigate to="/login" />;
}

export default LogoutPage
