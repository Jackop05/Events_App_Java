import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();

  const [refresher, setRefresher] = useState(false);  
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
          }
        } else {
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
  }, [navigate, refresher]);

  const toggleParticipation = async (eventId) => {
    if (!user.name) return;

    const isParticipating = user.interestedInEvents?.includes(eventId);
    const apiEndpoint = isParticipating ? 'removeEvent' : 'addEvent';

    try {
      const response = await fetch(`http://localhost:9090/api/${apiEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId, name: user.name }),
        credentials: 'include',
      });

      if (response.ok) {
        const updatedUser = { ...user };
        if (isParticipating) {
          updatedUser.interestedInEvents = updatedUser.interestedInEvents.filter(id => id !== eventId);
        } else {
          updatedUser.interestedInEvents.push(eventId);
        }
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error toggling participation:', error);
    }
  };

  const createEvent = async () => {
    setLoading(true);
    const eventRequest = { ...eventData };

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
        setEvents((prevEvents) => [...prevEvents, newEvent]);
        setRefresher(!refresher);
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createEvent();
    setNewEventActive(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };



  return (
    <div className='w-screen scroll-x-hidden p-0'>
      <div className='fixed flex justify-between w-full px-8 py-4 font-bold shadow-xl z-30 bg-gray-100'>
        <div className='text-4xl text-blue-600'>{user?.name}</div>
        <div className='text-2xl flex gap-2 text-center self-center cursor-pointer hover:text-blue-500 transition-colors duration-200' onClick={() => {scrollToTop(); setNewEventActive(!newEventActive)}}>
          New Event <FaPlus className='self-center text-blue-500' />
        </div>
      </div>

      <div className='relative top-[120px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-4 md:mx-32 pb-12'>
        {loading ? (
          <div className="col-span-3 text-center">
            <div className="loader"></div>
          </div>
        ) : events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="w-[400px] mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-blue-200 hover:shadow-2xl transition-shadow duration-300 ease-in-out cursor-pointer p-6 flex flex-col justify-between">
              <div>
                <img className="w-full h-48 object-cover" src={event.photoUrl} alt="Event" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{event.name}</h2>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="flex justify-between text-gray-500 text-sm mb-4">
                  <span><strong>Date:</strong> {event.date}</span>
                  <span><strong>Location:</strong> {event.location}</span>
                </div>
                <button
                  onClick={() => toggleParticipation(event.id)}
                  className={`w-full ${user && user.interestedInEvents?.includes(event.id) ? 'bg-green-600' : 'bg-blue-600'} text-white font-semibold py-2 rounded-md hover:${user && user.interestedInEvents?.includes(event.id) ? 'bg-green-700' : 'bg-blue-700'} transition-colors`}
                >
                  {user && user.interestedInEvents?.includes(event.id) ? 'Drop Event' : 'Participate!'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center col-span-3">No events found.</div>
        )}
      </div>

      {newEventActive && 
        <div className="absolute top-0 left-0 bg-white bg-opacity-30 w-screen h-screen z-40 text-center" onClick={() => setNewEventActive(!newEventActive)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className="absolute top-20 right-4 md:right-20 lg:right-32 w-full md:w-96 bg-white shadow-xl rounded-lg p-8 z-50">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">Create New Event</h2>
            {['name', 'description', 'location', 'date'].map((field, index) => (
              <div key={index} className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                {field !== 'description' ? (
                  <input
                    type={field === 'date' ? 'date' : 'text'}
                    id={field}
                    name={field}
                    value={eventData[field]}
                    onChange={handleChange}
                    placeholder={`Enter event ${field}`}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ) : (
                  <textarea
                    id={field}
                    name={field}
                    value={eventData[field]}
                    onChange={handleChange}
                    placeholder={`Enter event ${field}`}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    required
                  ></textarea>
                )}
              </div>
            ))}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
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
