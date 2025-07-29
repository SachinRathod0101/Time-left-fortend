import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { Event, Icebreaker } from '../services/eventService';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events, loading, error: contextError, fetchEvents, joinEvent, leaveEvent, deleteEvent, approveEvent, rejectEvent } = useEvents();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      if (!id) {
        setPageError('Invalid event ID');
        return;
      }
      console.log('Debug - Current events:', JSON.stringify(events), 'Length:', events.length);
      try {
        if (events.length === 0) {
          console.log('Debug - Triggering fetchEvents due to empty events array...');
          await fetchEvents();
          console.log('Debug - Events after fetch:', JSON.stringify(events));
        }
        const foundEvent = events.find(e => e._id === id);
        if (!foundEvent) {
          setPageError(`Event with id ${id} not found`);
          console.warn('Debug - Available events:', JSON.stringify(events));
          return;
        }
        setEvent(foundEvent);
      } catch (err) {
        setPageError('Failed to load event data');
        console.error('Debug - Error fetching event:', err);
      }
    };
    loadEvent();
  }, [events, id, fetchEvents]);

  if (!id || pageError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <p className="text-yellow-700">{pageError || 'Invalid event ID'}</p>
        </div>
        <div className="mt-4">
          <Link to="/events" className="text-indigo-600 hover:text-indigo-800">
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (contextError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{contextError}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <p className="text-yellow-700">Event not found</p>
        </div>
        <div className="mt-4">
          <Link to="/events" className="text-indigo-600 hover:text-indigo-800">
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isCreator = user && (typeof event.createdBy === 'string' ? event.createdBy === user._id : event.createdBy?._id === user._id);
  const isParticipant = user && Array.isArray(event.participants) && event.participants.some(p => typeof p === 'string' ? p === user._id : p?._id === user._id);
  const isFull = Array.isArray(event.participants) && event.participants.length >= (event.maxParticipants || 0);
  const isAdmin = user && user.role === 'admin';

  const handleJoinEvent = async () => {
   navigate(`/payment/${event._id}`);
  };

  const handleLeaveEvent = async () => {
    if (id) {
      try {
        await leaveEvent(id);
        setEvent(prev => prev ? { ...prev, participants: (events.find(e => e._id === id)?.participants || []) } : null);
      } catch (err) {
        setPageError('Failed to leave event');
      }
    }
  };

  const handleDeleteEvent = async () => {
    if (id) {
      try {
        await deleteEvent(id);
        navigate('/events');
      } catch (err) {
        setPageError('Failed to delete event');
      }
    }
  };

  const handleApproveEvent = async () => {
    if (id) {
      try {
        await approveEvent(id);
        setEvent(prev => prev ? { ...prev, status: 'approved' } : null);
      } catch (err) {
        setPageError('Failed to approve event');
      }
    }
  };

  const handleRejectEvent = async () => {
    if (id && rejectReason) {
      try {
        await rejectEvent(id, rejectReason);
        setEvent(prev => prev ? { ...prev, status: 'rejected' } : null);
        setShowRejectModal(false);
      } catch (err) {
        setPageError('Failed to reject event');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/events" className="text-indigo-600 hover:text-indigo-800">
          ← Back to Events
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{event.title}</h1>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              event.status === 'approved' ? 'bg-green-100 text-green-800' 
              : event.status === 'rejected' ? 'bg-red-100 text-red-800' 
              : 'bg-yellow-100 text-yellow-800'
            }`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="col-span-2">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Description</h2>
              <p className="text-gray-600 whitespace-pre-line">{event.description || 'No description available'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Event Details</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>Event Date: {formatDate(event.eventDate)}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Reveal Date: {formatDate(event.revealDate)}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>Location: {event.location || 'Not specified'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <span>Participants: {Array.isArray(event.participants) ? event.participants.length : 0} / {event.maxParticipants || 0}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                {isCreator && (
                  <div className="flex flex-col space-y-2">
                    <Link 
                      to={`/events/${event._id}/edit`} 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md text-center"
                    >
                      Edit Event
                    </Link>
                    {!confirmDelete ? (
                      <button 
                        onClick={() => setConfirmDelete(true)} 
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
                      >
                        Delete Event
                      </button>
                    ) : (
                      <div className="bg-red-50 p-3 rounded-md border border-red-200">
                        <p className="text-red-700 text-sm mb-2">Are you sure you want to delete this event?</p>
                        <div className="flex space-x-2">
                          <button 
                            onClick={handleDeleteEvent} 
                            className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-md text-sm"
                          >
                            Yes, Delete
                          </button>
                          <button 
                            onClick={() => setConfirmDelete(false)} 
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-3 rounded-md text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!isCreator && (
                  <div>
                    {isParticipant ? (
                      <button 
                        onClick={handleLeaveEvent} 
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
                      >
                        Leave Event
                      </button>
                    ) : (
                      <button 
                        onClick={handleJoinEvent} 
                        disabled={isFull || event.status !== 'approved'}
                        className={`w-full font-medium py-2 px-4 rounded-md ${isFull || event.status !== 'approved' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                      >
                        {isFull ? 'Event Full' : event.status !== 'approved' ? 'Event Not Approved' : 'Join Event'}
                      </button>
                    )}
                  </div>
                )}

                {isAdmin && event.status === 'pending' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Admin Actions</h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={handleApproveEvent} 
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
                      >
                        Approve Event
                      </button>
                      <button 
                        onClick={() => setShowRejectModal(true)} 
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
                      >
                        Reject Event
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Participants</h2>
            {Array.isArray(event.participants) && event.participants.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {event.participants.map((participant, index) => {
                  const participantName = typeof participant === 'string' 
                    ? `Participant ${index + 1}` 
                    : participant?.name || `Participant ${index + 1}`;
                  return (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-indigo-700 font-medium">
                          {participantName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-700 font-medium truncate">{participantName}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No participants yet</p>
            )}
          </div>

          {event.icebreakers && Array.isArray(event.icebreakers) && event.icebreakers.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Icebreakers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.icebreakers.map((icebreaker, index) => {
                  const question = typeof icebreaker === 'string' 
                    ? icebreaker 
                    : (icebreaker as Icebreaker)?.question || 'No question';
                  return (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{question}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Reject Event</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejecting this event:</p>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Rejection reason..."
            />
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setShowRejectModal(false)} 
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={handleRejectEvent} 
                disabled={!rejectReason.trim()}
                className={`font-medium py-2 px-4 rounded-md ${!rejectReason.trim() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
              >
                Reject Event
              </button>
            </div>
          </div>
        </div>
      )}
      {pageError && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">{pageError}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;