import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import {
  verifyPassportDocument,
  predictProcessingTime,
  checkVisaEligibility,
  generateAutomatedStatusDispatch,
} from './src/server/aiRouter.ts';

function aiApiPlugin(): Plugin {
  return {
    name: 'ai-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/ai/')) {
          return next();
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = body ? JSON.parse(body) : {};
            let result: any = null;

            if (req.url === '/api/ai/verify-document') {
              result = await verifyPassportDocument(data);
            } else if (req.url === '/api/ai/predict-time') {
              result = await predictProcessingTime(data);
            } else if (req.url === '/api/ai/check-eligibility') {
              result = await checkVisaEligibility(data);
            } else if (req.url === '/api/ai/generate-status-update') {
              result = await generateAutomatedStatusDispatch(data);
            } else {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: 'Endpoint not found' }));
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
          } catch (error: any) {
            console.error('Server error processing AI request:', error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: error.message || 'Internal server error' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), aiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
