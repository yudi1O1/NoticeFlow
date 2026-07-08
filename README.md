# NoticeFlow

NoticeFlow is a production-ready notice board built for the Reno Platforms web development assignment. It supports creating, reading, updating, and deleting notices with server-side validation, Prisma persistence, and database-level urgent-first ordering.

## Tech Stack

- Next.js Pages Router with TypeScript
- React
- Prisma ORM
- MySQL-compatible hosted database, such as TiDB Cloud
- Tailwind CSS
- Zod validation
- Vercel hosting

## Architecture

The app uses the required Pages Router structure. The browser talks only to REST API routes under `src/pages/api`; those routes validate payloads with Zod and execute all database access through Prisma.

Urgent-first ordering is handled in `src/pages/api/notices/index.ts` with Prisma `orderBy`, not frontend sorting:

```ts
orderBy: [
  { priority: "desc" },
  { publishDate: "desc" },
  { createdAt: "desc" },
]
```

Normal notice order was unspecified in the assignment, so this implementation orders newer publish dates first, then newer creation dates.

## Folder Structure

```txt
prisma/
  schema.prisma
  migrations/
src/
  components/
    notices/
    ui/
  constants/
  hooks/
  lib/
  pages/
    api/notices/
  services/
  styles/
  types/
  utils/
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env`:

```bash
cp .env.example .env
```

3. Set a hosted MySQL-compatible database URL:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE?sslaccept=strict"
```

4. Deploy migrations:

```bash
npm run prisma:deploy
```

5. Start locally:

```bash
npm run dev
```

## API Routes

- `GET /api/notices` lists notices ordered urgent first.
- `POST /api/notices` creates a notice.
- `GET /api/notices/:id` returns one notice.
- `PUT /api/notices/:id` updates a notice.
- `PATCH /api/notices/:id` partially updates a notice.
- `DELETE /api/notices/:id` deletes a notice.

## Validation Rules

- `title`: required, trimmed, maximum 140 characters.
- `body`: required, trimmed, maximum 5,000 characters.
- `category`: one of `EXAM`, `EVENT`, `GENERAL`.
- `priority`: one of `NORMAL`, `URGENT`.
- `publishDate`: required valid date.
- `imageUrl`: optional valid HTTPS URL.

Validation runs on the server inside API routes. Browser validation is only a usability layer.

## Deployment

1. Create a free hosted database, recommended: TiDB Cloud.
2. Add `DATABASE_URL` in Vercel Project Settings.
3. Run migrations against the hosted DB:

```bash
npm run prisma:deploy
```

4. Deploy:

```bash
npx vercel --prod
```

The Vercel CLI on this machine was not authenticated during implementation, so final live deployment requires completing `npx vercel login` and setting `DATABASE_URL`.

## Quality Checks

These passed locally:

```bash
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
```

Runtime checks performed locally:

- Home page returned HTTP 200 and rendered the NoticeFlow UI shell.
- Invalid create payload returned HTTP 400.
- Database-backed routes returned HTTP 500 until `DATABASE_URL` is configured, which is expected in this workspace because no hosted DB credentials were available.

## Trade-offs

- Authentication is intentionally omitted because it was not required.
- Image upload storage is intentionally omitted; notices support an optional image URL instead.
- Full end-to-end CRUD persistence could not be executed locally without a hosted database URL.

## Future Improvements

- Add authentication and role-based permissions.
- Add image upload through Vercel Blob or another storage provider.
- Add Playwright end-to-end tests in CI after a test database is provisioned.
- Add filtering by category and priority.

## AI Usage

AI was used to analyze the assignment, design the architecture, implement the application, run local quality checks, and generate documentation. The implementation was validated against the assignment requirements and hard rules.
