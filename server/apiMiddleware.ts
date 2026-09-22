import type { IncomingMessage, ServerResponse } from 'http';
import { processChatInterview, processGenerateCompleteCV } from './geminiService';

export async function handleApiRequest(req: IncomingMessage, res: ServerResponse, next?: () => void) {
  const url = req.url?.split('?')[0];

  if (!url?.startsWith('/api/')) {
    if (next) return next();
    res.statusCode = 404;
    return res.end('Not Found');
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }

  // Parse JSON body
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', async () => {
    try {
      const data = body ? JSON.parse(body) : {};

      if (url === '/api/chat') {
        const { messages, currentMemory, targetJob } = data;
        const result = await processChatInterview(messages || [], currentMemory || {}, targetJob);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(result));
      }

      if (url === '/api/generate-cv') {
        const { currentMemory, targetJob, customPrompt } = data;
        const result = await processGenerateCompleteCV(currentMemory || {}, targetJob, customPrompt);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(result));
      }

      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Unknown API endpoint' }));
    } catch (err: any) {
      console.error('API Middleware error:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
  });
}
