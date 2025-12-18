import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// project-imports
import { APP_DEFAULT_PATH } from 'config';
import useAuth from 'hooks/useAuth';
import { useSelector } from 'react-redux';

// ==============================|| GUEST GUARD ||============================== //

export default function GuestGuard({ children }) {
  const { isAuthenticated, loginVerificationCode } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {

    const allowedPaths = ['/register', '/forgot-password', '/verify-reset-code', '/reset-password'];
    if(!isAuthenticated){
      if (allowedPaths.includes(location.pathname)) return;
    }
  
    navigate(
      isAuthenticated
        ? loginVerificationCode
          ? '/dashboard'
          : '/code-verification'
        : '/login',
      { replace: true }
    );
  }, [isAuthenticated, loginVerificationCode, navigate, location.pathname]);

  return children;
}

GuestGuard.propTypes = { children: PropTypes.any };
