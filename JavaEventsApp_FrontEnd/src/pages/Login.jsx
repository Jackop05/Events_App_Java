import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    name: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Logging in:', loginData);
    // Prepare data to be sent in the request body
    const requestData = {
      name: loginData.name, // Assuming server expects 'username'
      password: loginData.password
    };

    try {
      const response = await fetch('http://localhost:9090/api/login', {
        method: 'POST', // Use POST method
        headers: {
          'Content-Type': 'application/json' // Set content type to JSON
        },
        body: JSON.stringify(requestData), // Convert the request data to a JSON string
        credentials: 'include' // Allow cookies to be sent and received
      });

      // Handle the response
      if (response.ok) {
        const result = await response.json();
        navigate('/');
        console.log('Login successful:', result);
      } else {
        console.log('Login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className='flex flex-col justify-center h-screen'>
        <div className="w-[380px] bg-white shadow-xl rounded-lg p-8 mx-auto">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                    Username
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={loginData.name}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                </div>

                <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                </div>

                <div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Login
                </button>
                </div>
            </form>

            <div className="text-center mt-4">
                <span className="text-gray-600">Don't have an account?</span>
                <Link to="/register" className="text-blue-500 font-semibold ml-2 hover:underline">
                Register
                </Link>
            </div>
            </div>
    </div>
  );
};

export default Login;
