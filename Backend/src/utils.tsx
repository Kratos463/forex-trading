import Cookies from 'js-cookie';

export const getConfig = (): { headers: { 'Content-Type': string; 'x-api-key': string; 'Authorization': string, 'access-token': string } } => {
  const token = Cookies.get('token');
  
  return {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_KEY as string,
      'access-token': process.env.ACCESS_TOKEN as string,
      'Authorization': token ? `Bearer ${token}` : ''
    }
  };
};
