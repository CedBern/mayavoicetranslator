import axios from 'axios';

const userData = {
  username: 'demouser',
  email: 'demouser@tecprize.com',
  password: 'TecPrize2025!',
  roles: ['validator']
};

axios.post('http://localhost:5000/api/auth/register', userData)
  .then(response => {
    console.log('User created successfully:');
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error creating user:');
    if (error.response) {
      console.error('Data:', error.response.data);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error', error.message);
    }
  });
