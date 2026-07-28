import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';
import { defineConfig, Plugin } from 'vite';

dotenv.config({ override: true });

function vercelApiDevPlugin(): Plugin {
  return {
    name: 'vercel-api-dev-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        try {
          const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
          const pathname = url.pathname;

          // Parse JSON body for POST/PUT/PATCH requests if not already parsed
          if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
            const buffers: Uint8Array[] = [];
            for await (const chunk of req) {
              buffers.push(chunk);
            }
            const data = Buffer.concat(buffers).toString();
            try {
              (req as any).body = data ? JSON.parse(data) : {};
            } catch {
              (req as any).body = {};
            }
          }

          // Attach helper methods to res if missing
          if (!(res as any).status) {
            (res as any).status = (code: number) => {
              res.statusCode = code;
              return res;
            };
          }
          if (!(res as any).json) {
            (res as any).json = (data: any) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };
          }

          if (pathname === '/api/orders') {
            const handler = (await import('./api/orders')).default;
            return await handler(req as any, res as any);
          } else if (pathname === '/api/telegram/status') {
            const handler = (await import('./api/telegram/status')).default;
            return await handler(req as any, res as any);
          } else if (pathname === '/api/telegram/config') {
            const handler = (await import('./api/telegram/config')).default;
            return await handler(req as any, res as any);
          } else if (pathname === '/api/telegram/test') {
            const handler = (await import('./api/telegram/test')).default;
            return await handler(req as any, res as any);
          } else if (pathname === '/api/health') {
            const handler = (await import('./api/health')).default;
            return await handler(req as any, res as any);
          }

          next();
        } catch (err) {
          console.error('API Dev Middleware Error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), vercelApiDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
