# NoticeFlow

## Project Overview

NoticeFlow is a simple notice board. It supports full create, read, update, and delete flows with Prisma persistence, server-side validation, and database-level urgent-first ordering.

## Features

- Responsive notice cards
- Add and edit notices with one form
- Delete notices after confirmation
- Categories: `Exam`, `Event`, `General`
- Priorities: `Normal`, `Urgent`
- Urgent notices appear first using Prisma `orderBy`
- Optional HTTPS image URL

## Tech Stack

- Next.js Pages Router
- React
- JavaScript
- Prisma ORM
- MySQL-compatible hosted database, AWS Aurora RDS
- Tailwind CSS
- Zod validation
- Vercel deployment

## Folder Structure

```txt
src/
  components/
    DeleteModal.jsx
    Layout.jsx
    NoticeCard.jsx
    NoticeForm.jsx
  lib/
    prisma.js
  pages/
    _app.jsx
    _document.jsx
    index.jsx
    api/
      notices/
        index.js
        [id].js
  styles/
    globals.css

prisma/
  schema.prisma
  migrations/
```

## Database Schema

The `Notice` model contains:

- `title`: required short text
- `body`: required long text
- `category`: `EXAM`, `EVENT`, or `GENERAL`
- `priority`: `NORMAL` or `URGENT`
- `publishDate`: notice date
- `imageUrl`: optional HTTPS URL
- `createdAt` and `updatedAt`

## API Endpoints

- `GET /api/notices`: list notices, ordered urgent first
- `POST /api/notices`: create a notice
- `PUT /api/notices/:id`: update a notice
- `DELETE /api/notices/:id`: delete a notice

Validation is written directly inside the two API route files.

## Environment Variables

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE?sslaccept=strict"
```

## Local Setup

```bash
npm install
npm run prisma:deploy
npm run dev
```

Open `http://localhost:3000`.

## Deployment Steps

1. Create a hosted MySQL-compatible database, such as TiDB Cloud or Amazon Aurora RDS.
2. Add `DATABASE_URL` to Vercel environment variables.
3. Run `npm run prisma:deploy`.
4. Deploy with `npx vercel --prod`.

## AI Usage

AI was used to analyze the assignment, design the UI layout and styling, implement and refactor the app, run checks, and update documentation. The final implementation was reviewed against the assignment requirements.

## One Improvement With More Time

- Add urgency filter buttons, such as `All`, `Urgent`, and `Normal`.
- Add category filters for `Exam`, `Event`, and `General`.
- Add search by notice title or body.
- Add date-range filtering for publish dates.
- Add active filter chips so users can clearly see applied filters.
- Add pagination once the notice list grows large.
