import axios from 'axios';
import { useEffect, useState } from 'react';
import config from './config';

const useAuthCheck = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`${config.API_BASE_URL}/auth/check-session`, { withCredentials: true })
      .then((res) => {
        setAuthenticated(true);
        setUser(res.data.user);
      })
      .catch(() => {
        setAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  return { loading, authenticated, user };
};

export default useAuthCheck;
