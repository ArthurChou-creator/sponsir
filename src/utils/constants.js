// API endpoint constants
export const API_BASE_URL = import.meta.env.PROD
  ? 'https://api.eventconnect.com/api/v1'
  : 'http://localhost:3001/api/v1';

// User roles
export const USER_ROLES = {
  SPONSOR: 'sponsor',
  ORGANIZER: 'organizer',
};

// Event status constants
export const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

// Sponsorship plan constants
export const SPONSORSHIP_PLAN_TYPES = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
  CUSTOM: 'custom',
};

// Cart item status
export const CART_ITEM_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
};

// Meeting status
export const MEETING_STATUS = {
  REQUESTED: 'requested',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// File upload constants
export const FILE_UPLOAD_LIMITS = {
  IMAGE_SIZE_MB: 5,
  PDF_SIZE_MB: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
};

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;

// Validation constants
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_EVENT_TITLE_LENGTH: 100,
  MAX_EVENT_DESCRIPTION_LENGTH: 5000,
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  EVENTS: '/events',
  EVENT_DETAIL: '/events/:eventId',
  CART: '/cart',
  MEETINGS: '/meetings',
  CREATE_EVENT: '/create-event',
  MANAGE_EVENTS: '/manage-events',
  SPONSORSHIP_PLANS: '/events/:eventId/sponsorship-plans',
};

// Error messages
export const ERROR_MESSAGES = {
  DEFAULT: 'Something went wrong. Please try again later.',
  UNAUTHORIZED: 'You need to login to access this resource.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  EVENT_CREATED: 'Event created successfully!',
  EVENT_UPDATED: 'Event updated successfully!',
  SPONSORSHIP_ADDED: 'Sponsorship plan added to cart!',
  MEETING_REQUESTED: 'Meeting requested successfully!',
};