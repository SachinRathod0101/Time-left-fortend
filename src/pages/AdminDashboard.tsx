import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { CreateEventData, Event } from '../services/eventService';

interface ExtendedCreateEventData extends CreateEventData {
  image?: File ;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events, loading, error, fetchEvents, createEvent, approveEvent, rejectEvent, deleteEvent, clearError } = useEvents();

  const [formData, setFormData] = useState<ExtendedCreateEventData>({
    title: '',
    description: '',
    eventDate: '',
    revealDate: '',
    location: '',
    maxParticipants: 10,
    image: undefined, 
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ExtendedCreateEventData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/events', { replace: true });
    } else {
      fetchEvents();
    }
  }, [user, navigate, fetchEvents]);

  // Cleanup image preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'maxParticipants' ? parseInt(value) || '' : value,
    }));
    if (formErrors[name as keyof ExtendedCreateEventData]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) clearError();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!validTypes.includes(file.type)) {
      setFormErrors((prev) => ({ ...prev, image: 'Only JPEG, PNG, or GIF images are allowed' }));
      return;
    }
    if (file.size > maxSize) {
      setFormErrors((prev) => ({ ...prev, image: 'Image size must be less than 5MB' }));
      return;
    }

    setFormErrors((prev) => ({ ...prev, image: '' }));
    setFormData((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ExtendedCreateEventData, string>> = {};
    let isValid = true;

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
      isValid = false;
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    }
    if (!formData.eventDate) {
      errors.eventDate = 'Event date is required';
      isValid = false;
    } else {
      const eventDate = new Date(formData.eventDate);
      const now = new Date();
      if (eventDate < now) {
        errors.eventDate = 'Event date must be in the future';
        isValid = false;
      }
    }
    if (!formData.revealDate) {
      errors.revealDate = 'Reveal date is required';
      isValid = false;
    } else {
      const revealDate = new Date(formData.revealDate);
      const eventDate = new Date(formData.eventDate);
      if (formData.eventDate && revealDate > eventDate) {
        errors.revealDate = 'Reveal date must be before the event date';
        isValid = false;
      }
    }
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
      isValid = false;
    }
    if (!formData.maxParticipants) {
      errors.maxParticipants = 'Maximum participants is required';
      isValid = false;
    } else if (formData.maxParticipants < 2) {
      errors.maxParticipants = 'At least 2 participants are required';
      isValid = false;
    } else if (formData.maxParticipants > 100) {
      errors.maxParticipants = 'Maximum 100 participants allowed';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validateForm()) return;

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('eventDate', new Date(formData.eventDate).toISOString());
    data.append('revealDate', new Date(formData.revealDate).toISOString());
    data.append('location', formData.location);
    data.append('maxParticipants', formData.maxParticipants.toString());
    if (formData.image) {
      data.append('image', formData.image);
    }

    setIsSubmitting(true);
    try {
      const createdEvent = await createEvent(data);
      if (createdEvent && createdEvent._id) {
        navigate(`/events/${createdEvent._id}`);
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      console.error('Failed to create event:', err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveEvent = async (eventId: string) => {
    try {
      await approveEvent(eventId);
    } catch (err) {
      console.error('Failed to approve event:', err);
    }
  };

  const handleRejectEvent = async (eventId: string) => {
    if (rejectReason) {
      try {
        await rejectEvent(eventId, rejectReason);
        setShowRejectModal(null);
        setRejectReason('');
      } catch (err) {
        console.error('Failed to reject event:', err);
      }
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Create Event Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Create New Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formErrors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter event title"
              />
              {formErrors.title && <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>}
            </div>
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formErrors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your event"
              />
              {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
            </div>
            <div>
              <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
                Event Date and Time *
              </label>
              <input
                type="datetime-local"
                id="eventDate"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formErrors.eventDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.eventDate && <p className="mt-1 text-sm text-red-600">{formErrors.eventDate}</p>}
            </div>
            <div>
              <label htmlFor="revealDate" className="block text-sm font-medium text-gray-700 mb-1">
                Reveal Date and Time *
              </label>
              <input
                type="datetime-local"
                id="revealDate"
                name="revealDate"
                value={formData.revealDate}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formErrors.revealDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.revealDate && <p className="mt-1 text-sm text-red-600">{formErrors.revealDate}</p>}
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formErrors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter event location"
              />
              {formErrors.location && <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>}
            </div>
            <div>
              <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Participants *
              </label>
              <input
                type="number"
                id="maxParticipants"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                min="2"
                max="100"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formErrors.maxParticipants ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.maxParticipants && <p className="mt-1 text-sm text-red-600">{formErrors.maxParticipants}</p>}
            </div>
            <div className="col-span-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Event Image (Optional)
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formErrors.image ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Preview" className="w-64 h-64 object-cover rounded-md" />
                </div>
              )}
              {formErrors.image && <p className="mt-1 text-sm text-red-600">{formErrors.image}</p>}
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Manage Events</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : events.length === 0 ? (
          <p className="text-gray-500">No events available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event._id} className="bg-gray-50 rounded-lg p-4">
                {event.imageUrl && (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <Link to={`/events/${event._id}`} className="text-xl font-semibold text-gray-800 hover:text-indigo-600">
                  {event.title}
                </Link>
                <p className="text-gray-600 mt-2">{formatDate(event.eventDate)}</p>
                <p className="text-gray-600">Status: {event.status.charAt(0).toUpperCase() + event.status.slice(1)}</p>
                <p className="text-gray-600">
                  Participants: {Array.isArray(event.participants) ? event.participants.length : 0} / {event.maxParticipants}
                </p>
                <div className="mt-4 flex space-x-2">
                  {event.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApproveEvent(event._id)}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded-md text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setShowRejectModal(event._id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-md text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDeleteEvent(event._id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-md text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
                onClick={() => setShowRejectModal(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRejectEvent(showRejectModal)}
                disabled={!rejectReason.trim()}
                className={`font-medium py-2 px-4 rounded-md ${
                  !rejectReason.trim() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                Reject Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;