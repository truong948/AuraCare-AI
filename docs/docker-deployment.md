# Docker and Deployment Guide

## Local Docker Run

1. Copy environment variables into `.env.local` or export them in the shell.
2. Build and run the application:

```bash
docker compose up --build
```

3. Open `http://localhost:3000`.

## Required Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GOOGLE_API_KEY=
```

The app can run in demo mode without real keys, but AI readiness will remain `attention` until real Supabase and Gemini credentials are configured.

## VPS Deployment Checklist

1. Install Docker and Docker Compose plugin on the VPS.
2. Clone the GitHub repository.
3. Create `.env` with Supabase and Gemini keys.
4. Run `docker compose up -d --build`.
5. Put Nginx or Caddy in front of port `3000`.
6. Point the domain DNS A record to the VPS IP.
7. Enable HTTPS using Let's Encrypt or Cloudflare SSL.
8. Verify:
   - `https://your-domain.com`
   - `https://your-domain.com/products`
   - `https://your-domain.com/dashboard/ai-ops`

## Production Compose With Automatic SSL

The repository also includes:
- `docker-compose.prod.yml`
- `deploy/Caddyfile`
- `deploy/env.production.example`

On the VPS:

```bash
cp deploy/env.production.example .env
nano .env
docker compose -f docker-compose.prod.yml up -d --build
```

Caddy will request and renew HTTPS certificates automatically when:
- `APP_DOMAIN` points to the VPS public IP.
- ports `80` and `443` are open.
- Supabase and Gemini environment variables are real values.

## Example Nginx Reverse Proxy

```nginx
server {
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

After configuring Nginx, run:

```bash
sudo certbot --nginx -d your-domain.com
```
