# User Task List app

### Running mysqldb and backend services in Docker

`docker-compose up -d mysqldb backend`

### Running frontend separately

Use node version 18+

```bash
cd apps/frontend
npm i
```

Create a file an `.env` file in `apps/frontend/` and copy the contents of `apps/frontend/.env.example` file.

Run NextJS Application

```bash
npm run dev
```

Then open [http://localhost:5000](http://localhost:5000). Use credentials `username:password` to test.
