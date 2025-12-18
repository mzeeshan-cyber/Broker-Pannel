import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// project-imports
import useAuth from 'hooks/useAuth';
import { useSelector } from 'react-redux';

// ==============================|| AUTH GUARD ||============================== //

export default function AuthGuard({ children }) {
  const { isAuthenticated, loginVerificationCode } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated || !loginVerificationCode) {
      navigate('login', {
        state: {
          from: location.pathname
        },
        replace: true
      });
    }
  }, [isAuthenticated, navigate, location]);

  return children;
}

AuthGuard.propTypes = { children: PropTypes.any };
