import serverless from 'serverless-http';
import { app } from '../../server';

const expressHandler = serverless(app);

export const handler = async (event: any, context: any) => {
  // Netlify's redirect target includes the function prefix, while Express
  // routes remain at their existing /api/* paths.
  const functionPrefix = '/.netlify/functions/api';
  const requestPath = event.path || '/';
  const normalizedPath = requestPath.startsWith(functionPrefix)
    ? requestPath.slice(functionPrefix.length) || '/'
    : requestPath;

  event.path = normalizedPath.startsWith('/api')
    ? normalizedPath
    : `/api${normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`}`;

  return expressHandler(event, context);
};
