import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log(registerData)
    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Prepare data to be sent in the request body
    const requestData = {
      name: registerData.username, // Assuming server expects 'username'
      password: registerData.password
    };

    try {
      const response = await fetch('http://localhost:9090/api/register', {
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
        navigate('/login');
        console.log('Registration successful:', result);
      } else {
        console.log('Registration failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="w-[380px] bg-white shadow-xl rounded-lg p-8 mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={registerData.username}
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
              value={registerData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={registerData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Register
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <span className="text-gray-600">Already have an account?</span>
          <Link to="/login" className="text-blue-500 font-semibold ml-2 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
