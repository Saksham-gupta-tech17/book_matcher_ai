This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Google Books API Integration

This project integrates with the Google Books API to provide real book recommendations. By default, it uses sample data, but you can enable real API integration by following these steps:

### 1. Get a Google Books API Key
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Google Books API" for your project
4. Go to "Credentials" and create an API key
5. Copy your API key

### 2. Configure the Application
1. Create a `.env.local` file in the project root (if not already present)
2. Add your API key:
   ```
   GOOGLE_BOOKS_API_KEY=your_actual_api_key_here
   USE_MOCK_DATA_FALLBACK=false
   ```
3. Restart the development server

### 3. Features
- **Real Book Data**: When a valid API key is provided, the app fetches real books from Google Books API
- **Smart Filtering**: Books are filtered based on search queries (title, author, genre, description)
- **Fallback System**: If the API fails or no key is provided, the app gracefully falls back to sample data
- **Visual Indicators**: The UI shows whether you're viewing real API data or sample data

### 4. API Endpoint
The recommendation API is available at `POST /api/recommend` with a JSON body:
```json
{
  "query": "science fiction"
}
```

Response includes:
- `books`: Array of book objects with title, author, description, cover image, etc.
- `source`: Indicates data source (`google-books`, `mock-fallback`, `mock-no-key`)
- `summary`: AI-generated summary of the recommendations
- `warning`: Optional warning messages

### 5. Environment Variables
- `GOOGLE_BOOKS_API_KEY`: Your Google Books API key (required for real data)
- `USE_MOCK_DATA_FALLBACK`: Set to `true` to force using sample data even with a valid API key (useful for testing)
