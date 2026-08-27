# AI Tools Directory

A simple AI tools directory built with Next.js and Convex.

## Features

- Search and filter AI tools
- Browse by category and tag
- Paginated results
- Import data from GitHub Awesome lists
- Modern responsive UI

## Local Development

### Requirements

- Node.js 18+
- npm or yarn
- A Convex account

### Setup

1. **Clone the project**

   ```bash
   git clone <your-repo-url>
   cd ai-tools-dir
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Convex**

   ```bash
   npx convex login
   npx convex dev
   ```

   `npx convex dev` creates the local `.env.local` file automatically.

4. **Start the development server**

   Open a second terminal window:

   ```bash
   npm run dev
   ```

5. **Open the app**

   - Home page: http://localhost:3000
   - Admin page: http://localhost:3000/admin

## Deploying To Vercel

See [DEPLOY.md](./DEPLOY.md) for the full deployment guide.

### Quick Deploy

1. **Deploy Convex**

   ```bash
   npx convex deploy
   ```

   Copy the generated Convex URL.

2. **Deploy the app to Vercel**

   - Push the code to GitHub.
   - Import the project in Vercel.
   - Add the `NEXT_PUBLIC_CONVEX_URL` environment variable.
   - Deploy the project.

3. **Import data**

   - Visit `https://your-site.vercel.app/admin`.
   - Click "Import Sample Data" or "Import from GitHub".

## Tech Stack

- **Frontend**: Next.js 15 + React 19
- **Backend**: Convex
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Deployment**: Vercel

## Project Structure

```text
ai-tools-dir/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── SearchBar.tsx       # Search controls
│   └── ToolCard.tsx        # Tool cards
├── convex/                 # Convex backend
│   ├── schema.ts           # Database schema
│   └── tools.ts            # API functions
├── lib/                    # Utilities
│   ├── awesomeParser.ts    # Markdown parser
│   └── sampleData.ts       # Sample data
└── public/                 # Static assets
```

## Usage

### Import Sample Data

Visit `/admin` and click "Import Sample Data".

### Import From GitHub

1. Visit `/admin`.
2. Enter the raw URL for a GitHub Awesome list.
3. The default source is `https://raw.githubusercontent.com/mahseema/awesome-ai-tools/main/README.md`.
4. Click "Import from GitHub".

### Search And Filter

- Enter keywords in the search box.
- Select a category.
- Select a tag.
- Combine filters as needed.

## Troubleshooting

### `importFromGithub` shows an error

**Cause**: The environment variables are missing or Convex is not deployed correctly.

**Fix**:

1. Check that `.env.local` exists.
2. Confirm that `NEXT_PUBLIC_CONVEX_URL` is set correctly.
3. Run `npx convex dev` and verify that Convex is healthy.

### Images do not display

**Cause**: Next.js Image requires remote image domains to be configured.

**Fix**: `next.config.ts` allows HTTPS images.

### Vercel deployment fails

**Cause**: The required environment variable is missing.

**Fix**:

1. Add `NEXT_PUBLIC_CONVEX_URL` in the Vercel project settings.
2. Use the production Convex URL from `npx convex deploy`.

### The home page shows a client-side application error

**Cause**: Production data may contain older tool documents with missing or malformed fields.

**Fix**: The Convex schema accepts legacy records, and the query layer normalizes them before sending data to the UI.

## Data Model

Newly imported tools use this normalized shape:

```typescript
tools: {
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  pricing: "free" | "freemium" | "paid";
  image?: string;
  createdAt: number;
  updatedAt: number;
}
```

The schema is intentionally tolerant so existing production records can still be read and normalized safely.

## API

- `api.tools.list` - Get tools with search, filtering, and pagination.
- `api.tools.categories` - Get all categories.
- `api.tools.tags` - Get all tags.
- `api.tools.upsertMany` - Import tools in bulk.

## License

MIT

## Credits

- [mahseema/awesome-ai-tools](https://github.com/mahseema/awesome-ai-tools) - Data source
- [Convex](https://convex.dev) - Backend service
- [Vercel](https://vercel.com) - Deployment platform
