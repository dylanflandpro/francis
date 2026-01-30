import { createFileRoute } from '@tanstack/react-router';

/**
 * Generic upload route for file uploads
 * This route can be used by any feature (profile, habits, etc.)
 */
export const Route = createFileRoute('/api/upload/$')({
  loader: () => {
    // Generic upload endpoint placeholder
    // Implement actual upload logic based on feature requirements
    return null;
  },
});

// Export route type for use in components
export type UploadRoutes = '/api/upload/$';
