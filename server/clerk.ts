import { clerkMiddleware } from '@clerk/nuxt/server';

export default clerkMiddleware((event) => {
  const { userId } = event.context.auth;

  // Redirect to /signup if the user is not authenticated
  if (!userId && !['/signup', '/signin'].includes(event.path)) {
    return event.res.writeHead(302, { Location: '/signup' }).end();
  }

  // If the user is authenticated, let them access the app
});
