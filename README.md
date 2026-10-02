# College Complaint Portal — Render Single-Service

This version runs the **React frontend and Node/Express backend as one Render Web Service**. Express serves the React production build, so users get one URL. MongoDB is hosted separately on MongoDB Atlas.

## Project structure

- `frontend/` — React app
- `backend/` — Express API, MongoDB models/routes, uploads
- `package.json` — root Render build/start scripts

## Render settings

Create **one Web Service** from this repository:

- Root Directory: leave blank
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Environment: Node

Environment variables:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
NODE_ENV=production
```

`PORT` is supplied automatically by Render; do not hard-code it. `CLIENT_URL` is optional for this single-service setup.

## Local development

Backend:

```bash
cd backend
npm install
npm start
```

Frontend (separate development server):

```bash
cd frontend
npm install
npm start
```

For local frontend development, create `frontend/.env` if needed:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Admin seed

The existing `backend/seed.js` can be run from the project root with:

```bash
npm run seed
```

Run it only after `MONGO_URI` is configured.

## Important: image uploads on Render

The current project stores uploaded complaint images in `backend/uploads`. Render's default filesystem is ephemeral, so uploaded files can disappear after a redeploy/restart. For permanent production storage, replace local uploads with Cloudinary, S3, or another persistent object-storage service.
