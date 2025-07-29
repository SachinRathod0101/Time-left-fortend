import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { CreateEventData } from '../services/eventService';

interface ExtendedCreateEventData extends CreateEventData {
  image?: File ;
}

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { createEvent, error, clearError } = useEvents();
  const { user } = useAuth();

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Redirect admins to /admin
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  // Cleanup image preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (formErrors[name as keyof ExtendedCreateEventData]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) clearError();

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'maxParticipants' ? parseInt(value) || '' : value,
    }));
  };

  // Handle image file change
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

  // Validate form
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

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      console.log('Form validation failed', formErrors);
      return;
    }

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
        console.log('Event created successfully, navigating to:', `/events/${createdEvent._id}`);
        navigate(`/events/${createdEvent._id}`);
      } else {
        console.warn('Event created but no ID returned, navigating to events list');
        navigate('/events');
      }
    } catch (err: any) {
      console.error('Failed to create event:', err.message || err);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user && user.role === 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">Admins are not authorized to create events.</p>
        </div>
        <div className="mt-4">
          <Link to="/admin" className="text-indigo-600 hover:text-indigo-800">
            ← Go to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/events" className="text-indigo-600 hover:text-indigo-800">
          ← Back to Events
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Event</h1>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

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
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                )}
              </div>

              <div className="col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                ></textarea>
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                )}
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
                {formErrors.eventDate && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.eventDate}</p>
                )}
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
                <p className="mt-1 text-xs text-gray-500">
                  When participants will be revealed to each other
                </p>
                {formErrors.revealDate && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.revealDate}</p>
                )}
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
                {formErrors.location && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="maxParticipants"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                {formErrors.maxParticipants && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.maxParticipants}</p>
                )}
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
                {formErrors.image && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.image}</p>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Link
                to="/events"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md mr-2"
              >
                Cancel
              </Link>
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
      </div>
    </div>
  );
};

export default CreateEventPage;