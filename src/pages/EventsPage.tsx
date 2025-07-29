import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { Event } from '../services/eventService';

const EventsPage: React.FC = () => {
  const { events, loading, error, fetchEvents } = useEvents();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showHotEvents, setShowHotEvents] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        await fetchEvents();
      } catch (err) {
        console.error('Failed to fetch events:', err);
      }
    };
    loadEvents();
  }, [fetchEvents]);

  const isHotEvent = (event: Event) => {
    const participationRate = Array.isArray(event.participants)
      ? event.participants.length / event.maxParticipants
      : 0;
    return participationRate >= 0.7;
  };

  const filteredEvents = events
    .filter((event) => {
      if (
        searchTerm &&
        !event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !event.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      const eventDate = new Date(event.eventDate);
      const today = new Date();
      if (filter === 'upcoming' && eventDate < today) {
        return false;
      }
      if (filter === 'past' && eventDate >= today) {
        return false;
      }

      if (locationFilter && !event.location.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false;
      }

      if (dateFilter) {
        const filterDate = new Date(dateFilter);
        const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        const filterDateOnly = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate());

        if (eventDateOnly.getTime() !== filterDateOnly.getTime()) {
          return false;
        }
      }

      if (showHotEvents && !isHotEvent(event)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Events</h1>
        {user && user.role !== 'admin' && (
          <Link
            to="/events/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Create Event
          </Link>
        )}
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setFilter('all')}
            >
              All Events
            </button>
            <button
              className={`px-4 py-2 rounded-md ${filter === 'upcoming' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`px-4 py-2 rounded-md ${filter === 'past' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setFilter('past')}
            >
              Past
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/4">
            <div className="relative">
              <input
                type="text"
                placeholder="Location (e.g. NY)"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
              {locationFilter && (
                <button
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setLocationFilter('')}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/4">
            <div className="relative">
              <input
                type="date"
                placeholder="Select Date"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
              {dateFilter && (
                <button
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setDateFilter('')}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/4 flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showHotEvents}
                onChange={() => setShowHotEvents(!showHotEvents)}
              />
              <div
                className={`relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 ${
                  showHotEvents ? 'bg-indigo-600' : ''
                } peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
              ></div>
              <span className="ms-3 text-sm font-medium text-gray-900">Hot Events</span>
            </label>
          </div>

          {(searchTerm || locationFilter || dateFilter || showHotEvents) && (
            <div className="w-full md:w-1/4 flex items-center">
              <button
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                onClick={() => {
                  setSearchTerm('');
                  setLocationFilter('');
                  setDateFilter('');
                  setShowHotEvents(false);
                  setFilter('all');
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">No events found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try a different search term' : 'Create your first event to get started'}
          </p>
          {user && user.role !== 'admin' && (
            <Link
              to="/events/create"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Create Event
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Link
              key={event._id}
              to={`/events/${event._id}`}
              className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                {event.imageUrl && (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h2>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      event.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : event.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                <div className="flex items-center text-gray-500 mb-2">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span>{formatDate(event.eventDate)}</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500 flex items-center">
                    {Array.isArray(event.participants) ? event.participants.length : 0} /{' '}
                    {event.maxParticipants} participants
                    {isHotEvent(event) && (
                      <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                        Hot
                      </span>
                    )}
                  </div>
                  <div className="text-indigo-600 font-medium text-sm">View Details →</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;