import axios from 'axios';

export const onAuthStateChanged = (callback: (user: any) => void) => {
  let isSubscribed = true;

  axios.get('/api/authenticated')
    .then(response => {
      if (isSubscribed) {
        const user = response.data.user;
        callback(user);
      }
    })
    .catch(() => {
      if (isSubscribed) {
        callback(null);
      }
    });

  return () => {
    isSubscribed = false;
  };
};
