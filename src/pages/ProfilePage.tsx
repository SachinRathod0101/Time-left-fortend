import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { UpdateProfileData } from '../services/userService';
import { Event } from '../services/eventService';

const ProfilePage: React.FC = () => {
  const { user, loading: authLoading, error: authError, updateProfile, logout } = useAuth();
  const { userEvents, loading: eventsLoading } = useEvents();
  
  const [isEditing, setIsEditing] = useState(false);
  interface ProfileFormData extends UpdateProfileData {
    confirmPassword: string;
  }

  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (formErrors[name as keyof ProfileFormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ProfileFormData, string>> = {};
    let isValid = true;
    
    // Name validation
    if (!formData.name || !formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }
    
    // Email validation
    if (!formData.email || !formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }
    
    // Password validation (only if provided)
    if (formData.password) {
      if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
        isValid = false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }
    
    setFormErrors(errors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Only include password if it's provided
      const dataToUpdate: UpdateProfileData = {
        name: formData.name,
        email: formData.email
      };
      
      if (formData.password) {
        dataToUpdate.password = formData.password;
      }
      
      await updateProfile(dataToUpdate);
      setIsEditing(false);
      setUpdateSuccess(true);
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err) {
      // Error is handled by the context
      console.error('Failed to update profile:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <p className="text-yellow-700">You need to be logged in to view this page</p>
        </div>
        <div className="mt-4">
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
          
          {authError && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700">{authError}</p>
            </div>
          )}
          
          {updateSuccess && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
              <p className="text-green-700">Profile updated successfully!</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Information */}
            <div className="md:col-span-2">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                      )}
                    </div>
                    
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                      )}
                    </div>
                    
                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password (leave blank to keep current)
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${formErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {formErrors.password && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                      )}
                    </div>
                    
                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {formErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                      )}
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Account Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="text-lg text-gray-800">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-lg text-gray-800">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Role</p>
                        <p className="text-lg text-gray-800 capitalize">{user.role}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Member Since</p>
                        <p className="text-lg text-gray-800">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Account Actions */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Account Actions</h2>
              <div className="space-y-2">
                <Link 
                  to="/events" 
                  className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md text-center"
                >
                  View All Events
                </Link>
                <Link 
                  to="/events/create" 
                  className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md text-center"
                >
                  Create New Event
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md text-center mt-4"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          
          {/* User Events */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">My Events</h2>
            
            {eventsLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : userEvents.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No events yet</h3>
                <p className="text-gray-500 mb-4">You haven't created or joined any events yet</p>
                <Link 
                  to="/events/create" 
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md"
                >
                  Create Your First Event
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userEvents.map((event: Event) => (
                  <Link 
                    key={event._id} 
                    to={`/events/${event._id}`}
                    className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${event.status === 'approved' ? 'bg-green-100 text-green-800' : event.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                      <div className="flex items-center text-gray-500 mb-2">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span>{formatDate(event.eventDate)}</span>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {typeof event.participants === 'object' ? event.participants.length : 0} / {event.maxParticipants} participants
                        </div>
                        <div className="text-indigo-600 font-medium text-sm">
                          View Details →
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;