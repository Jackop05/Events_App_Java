import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [newEventActive, setNewEventActive] = useState(false);
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    location: '',
    date: ''
  });
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:9090/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          
          // Fetch all events
          const eventsResponse = await fetch('http://localhost:9090/api/allEvents', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (eventsResponse.ok) {
            const allEvents = await eventsResponse.json();
            setEvents(allEvents);
          } else {
            console.error('Failed to fetch all events');
          }
        } else {
          console.error('Failed to fetch user data');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const createEvent = async () => {
    setLoading(true);
    const eventRequest = {
      name: eventData.name,
      description: eventData.description,
      location: eventData.location,
      date: eventData.date,
    };

    try {
      const response = await fetch('http://localhost:9090/api/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventRequest),
        credentials: 'include',
      });
      setLoading(false);
      if (response.ok) {
        const newEvent = await response.json();
        setEvents((prevEvents) => [...prevEvents, newEvent]); // Add the new event to the list
        navigate('/newEvent');
        navigate('/');
      } else {
        console.error('Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createEvent();
    setNewEventActive(false);
  };

  return (
    <div className='w-screen h-auto scroll-x-hidden bg-slate-50 m-0 p-0 roboto-condensed'>
      <div className='fixed flex justify-between w-full px-8 py-4 font-bold font-sans shadow-xl bg-white z-30'>
        <div className='text-[40px]'>Jakub</div>
        <div className='text-[30px] flex gap-2 text-center self-center cursor-pointer hover:drop-shadow-xl transition-all duration-[100ms]' onClick={() => { setNewEventActive(!newEventActive); }}>New Event <FaPlus className='self-center text-blue-500' /></div>
      </div>

      <div className='relative top-[120px] grid grid-cols-3 gap-16 mx-32 pb-12'>
        {loading ? (
          <div className="col-span-3 text-center">
            <div className="loader"></div> 
          </div>
        ) : events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="w-[380px] mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-blue-100 hover:shadow-2xl transition-shadow duration-300 ease-in-out cursor-pointer p-6 flex flex-col justify-between">
              <div>
                <img className="w-full h-48 object-cover" src="#" alt="Event" />
              </div>
              <div>
                <h2 className="text-4xl font-semibold text-gray-800 mb-2">{event.name}</h2>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="flex justify-between text-gray-500 text-sm mb-4">
                  <span><strong>Date:</strong> {event.date}</span>
                  <span><strong>Location:</strong> {event.location}</span>
                </div>
                <button className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
                  Take part in!
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center col-span-3">No events found.</div>
        )}
      </div>

      {newEventActive && 
        <div className="absolute top-0 left-0 bg-white bg-opacity-[0.3] w-screen h-screen z-40 text-center" onClick={() => { setNewEventActive(!newEventActive); }}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className="absolute top-[100px] right-[50px] w-[380px] bg-white shadow-xl rounded-lg p-8 z-50">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="name">Event Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={eventData.name}
                onChange={handleChange}
                placeholder="Enter event name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={eventData.description}
                onChange={handleChange}
                placeholder="Enter event description"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={eventData.location}
                onChange={handleChange}
                placeholder="Enter event location"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="date">Event Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={eventData.date}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Submit Event
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  );
};

export default Main;
