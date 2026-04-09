import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Configuration
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY || "";
const USE_GOOGLE_API = GOOGLE_BOOKS_API_KEY.length > 0;
const USE_MOCK_DATA_FALLBACK = process.env.USE_MOCK_DATA_FALLBACK !== "false";
const MAX_RESULTS_PER_QUERY = 40;
const MAX_QUERIES = 2;
const MAX_TOTAL_BOOKS = 50;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Simple in-memory cache
interface CacheEntry {
  timestamp: number;
  data: any[];
}
const queryCache = new Map<string, CacheEntry>();

// Mock book data - fallback when Google Books API fails
const mockBooks = [
  {
    id: "1",
    title: "Project Hail Mary",
    author: "Andy Weir",
    description: "A lone astronaut must save humanity from an extinction-level event using only his wits and science.",
    genre: "Science Fiction",
    rating: 4.6,
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    pages: 476,
    year: 2021,
  },
  {
    id: "2",
    title: "The Midnight Library",
    author: "Matt Haig",
    description: "Between life and death there is a library where every book provides a chance to try another life.",
    genre: "Fantasy",
    rating: 4.3,
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    pages: 304,
    year: 2020,
  },
  {
    id: "3",
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    description: "An AI friend observes human behavior and searches for meaning in a changing world.",
    genre: "Literary Fiction",
    rating: 4.2,
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    pages: 320,
    year: 2021,
  },
  {
    id: "4",
    title: "Dune",
    author: "Frank Herbert",
    description: "Epic tale of politics, religion, and power on the desert planet of Arrakis.",
    genre: "Science Fiction",
    rating: 4.7,
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
    pages: 412,
    year: 1965,
  },
  {
    id: "5",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    description: "A psychological thriller about a woman who shoots her husband and then stops speaking.",
    genre: "Thriller",
    rating: 4.5,
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    pages: 336,
    year: 2019,
  },
  {
    id: "6",
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    description: "A coming-of-age murder mystery set in the marshes of North Carolina.",
    genre: "Mystery",
    rating: 4.8,
    cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop",
    pages: 384,
    year: 2018,
  },
  {
    id: "7",
    title: "Atomic Habits",
    author: "James Clear",
    description: "A guide to building good habits and breaking bad ones with tiny changes.",
    genre: "Self-Help",
    rating: 4.8,
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    pages: 320,
    year: 2018,
  },
  {
    id: "8",
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    description: "A legendary film star reveals the truth behind her glamorous life and seven marriages.",
    genre: "Historical Fiction",
    rating: 4.6,
    cover: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop",
    pages: 389,
    year: 2017,
  },
  {
    id: "9",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "Bilbo Baggins embarks on an unexpected adventure with a group of dwarves to reclaim their mountain home.",
    genre: "Fantasy",
    rating: 4.9,
    cover: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop",
    pages: 310,
    year: 1937,
  },
  {
    id: "10",
    title: "1984",
    author: "George Orwell",
    description: "A dystopian novel about totalitarianism, mass surveillance, and repressive regimentation.",
    genre: "Dystopian",
    rating: 4.7,
    cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop",
    pages: 328,
    year: 1949,
  },
  {
    id: "11",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "A romantic novel of manners that depicts the emotional development of protagonist Elizabeth Bennet.",
    genre: "Classic",
    rating: 4.5,
    cover: "https://images.unsplash.com/photo-1544716278-e41617661cd1?w=400&h=600&fit=crop",
    pages: 432,
    year: 1813,
  },
  {
    id: "12",
    title: "The Alchemist",
    author: "Paulo Coelho",
    description: "A philosophical book that follows a young Andalusian shepherd on his journey to the pyramids of Egypt.",
    genre: "Philosophical Fiction",
    rating: 4.6,
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    pages: 208,
    year: 1988,
  },
  {
    id: "13",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
    genre: "Classic",
    rating: 4.5,
    cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop",
    pages: 180,
    year: 1925,
  },
  {
    id: "14",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A novel about racial injustice and the loss of innocence in the American South.",
    genre: "Classic",
    rating: 4.8,
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    pages: 281,
    year: 1960,
  },
  {
    id: "15",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    description: "A story about Holden Caulfield's experiences in New York City after being expelled from prep school.",
    genre: "Literary Fiction",
    rating: 4.3,
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    pages: 234,
    year: 1951,
  },
  {
    id: "16",
    title: "Brave New World",
    author: "Aldous Huxley",
    description: "A dystopian novel set in a futuristic World State, inhabited by genetically modified citizens.",
    genre: "Dystopian",
    rating: 4.4,
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
    pages: 268,
    year: 1932,
  },
  {
    id: "17",
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    description: "An epic high-fantasy novel about the quest to destroy the One Ring.",
    genre: "Fantasy",
    rating: 4.9,
    cover: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop",
    pages: 1178,
    year: 1954,
  },
  {
    id: "18",
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    description: "The first novel in the Harry Potter series, following Harry's discovery of his magical heritage.",
    genre: "Fantasy",
    rating: 4.8,
    cover: "https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?w=400&h=600&fit=crop",
    pages: 309,
    year: 1997,
  },
  {
    id: "19",
    title: "The Da Vinci Code",
    author: "Dan Brown",
    description: "A mystery thriller novel that follows symbologist Robert Langdon as he investigates a murder in Paris.",
    genre: "Thriller",
    rating: 4.2,
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    pages: 489,
    year: 2003,
  },
  {
    id: "20",
    title: "The Hunger Games",
    author: "Suzanne Collins",
    description: "A dystopian novel set in Panem, where teenagers are forced to participate in a televised death match.",
    genre: "Dystopian",
    rating: 4.7,
    cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop",
    pages: 374,
    year: 2008,
  },
];

// Generate multiple search queries based on user input
function generateSearchQueries(userQuery: string): string[] {
  const lowerQuery = userQuery.toLowerCase();
  const queries = new Set<string>();
  
  // Always include the original query
  queries.add(userQuery);
  
  // Generate variations based on common patterns
  if (lowerQuery.includes("harry") && lowerQuery.includes("potter")) {
    queries.add("wizard school fantasy");
    queries.add("magical adventure books");
    queries.add("coming of age fantasy");
    queries.add("dark magic novels");
    queries.add("young wizard stories");
  }
  
  if (lowerQuery.includes("sci") || lowerQuery.includes("science") || lowerQuery.includes("space")) {
    queries.add("science fiction novels");
    queries.add("space exploration books");
    queries.add("futuristic technology fiction");
    queries.add("alien encounter stories");
  }
  
  if (lowerQuery.includes("fantasy") || lowerQuery.includes("magic") || lowerQuery.includes("dragon")) {
    queries.add("epic fantasy series");
    queries.add("magical realism books");
    queries.add("mythology inspired fiction");
  }
  
  if (lowerQuery.includes("mystery") || lowerQuery.includes("thriller") || lowerQuery.includes("crime")) {
    queries.add("psychological thriller novels");
    queries.add("detective mystery books");
    queries.add("crime fiction bestsellers");
  }
  
  if (lowerQuery.includes("romance") || lowerQuery.includes("love") || lowerQuery.includes("relationship")) {
    queries.add("contemporary romance novels");
    queries.add("love story books");
    queries.add("emotional relationship fiction");
  }
  
  if (lowerQuery.includes("self") || lowerQuery.includes("help") || lowerQuery.includes("improvement")) {
    queries.add("personal development books");
    queries.add("motivational self-help");
    queries.add("life improvement guides");
  }
  
  // Generic variations for any query
  queries.add(`best ${userQuery} books`);
  queries.add(`${userQuery} novels`);
  queries.add(`${userQuery} fiction`);
  queries.add(`popular ${userQuery} literature`);
  
  // Limit to MAX_QUERIES
  return Array.from(queries).slice(0, MAX_QUERIES);
}

// Fetch books from Google Books API
async function fetchBooksFromGoogle(query: string, startIndex: number = 0): Promise<any[]> {
  if (!USE_GOOGLE_API) {
    console.log("Google Books API key not configured, using mock data");
    return [];
  }
  
  try {
    const url = `https://www.googleapis.com/books/v1/volumes`;
    const params = {
      q: query,
      key: GOOGLE_BOOKS_API_KEY,
      maxResults: MAX_RESULTS_PER_QUERY,
      startIndex,
      orderBy: "relevance",
      printType: "books",
      langRestrict: "en"
    };
    
    const response = await axios.get(url, { params, timeout: 3000 });
    
    if (!response.data.items) {
      return [];
    }
    
    return response.data.items.map((item: any) => {
      const volumeInfo = item.volumeInfo;
      const id = item.id;
      const title = volumeInfo.title || "Unknown Title";
      const authors = volumeInfo.authors || ["Unknown Author"];
      const description = volumeInfo.description || "No description available.";
      const imageLinks = volumeInfo.imageLinks || {};
      const cover = imageLinks.thumbnail || imageLinks.smallThumbnail || "";
      const publishedDate = volumeInfo.publishedDate || "";
      const year = publishedDate ? parseInt(publishedDate.substring(0, 4)) : 0;
      const pageCount = volumeInfo.pageCount || 0;
      const categories = volumeInfo.categories || [];
      const averageRating = volumeInfo.averageRating || 0;
      const ratingsCount = volumeInfo.ratingsCount || 0;
      
      return {
        id,
        title,
        author: authors.join(", "),
        description: description.substring(0, 300) + (description.length > 300 ? "..." : ""),
        genre: categories.length > 0 ? categories[0] : "General",
        rating: averageRating,
        cover: cover.replace("http://", "https://"),
        pages: pageCount,
        year,
        relevanceScore: 0, // Will be calculated later
        source: "google-books"
      };
    });
  } catch (error) {
    console.error(`Error fetching books for query "${query}":`, error);
    return [];
  }
}

// Calculate relevance score for a book based on query
function calculateRelevanceScore(book: any, originalQuery: string): number {
  let score = 0;
  const lowerQuery = originalQuery.toLowerCase();
  const lowerTitle = book.title.toLowerCase();
  const lowerAuthor = book.author.toLowerCase();
  const lowerDescription = book.description.toLowerCase();
  
  // Title contains query (highest weight)
  if (lowerTitle.includes(lowerQuery)) {
    score += 50;
  }
  
  // Author contains query
  if (lowerAuthor.includes(lowerQuery)) {
    score += 30;
  }
  
  // Description contains query
  if (lowerDescription.includes(lowerQuery)) {
    score += 20;
  }
  
  // Rating bonus
  if (book.rating > 4) {
    score += book.rating * 5;
  }
  
  // Recent books bonus
  if (book.year >= 2018) {
    score += 10;
  }
  
  // Has cover image bonus
  if (book.cover && book.cover.length > 0) {
    score += 15;
  }
  
  return score;
}

// Filter and deduplicate books
function processBooks(books: any[], originalQuery: string): any[] {
  const seenIds = new Set<string>();
  const filteredBooks: any[] = [];
  
  for (const book of books) {
    // Skip if no title or author
    if (!book.title || !book.author || book.author === "Unknown Author") {
      continue;
    }
    
    // Skip if no cover image (optional, but better UX)
    if (!book.cover || book.cover.length === 0) {
      continue;
    }
    
    // Skip duplicates
    const id = book.id || `${book.title}-${book.author}`;
    if (seenIds.has(id)) {
      continue;
    }
    seenIds.add(id);
    
    // Calculate relevance score
    const relevanceScore = calculateRelevanceScore(book, originalQuery);
    book.relevanceScore = relevanceScore;
    
    filteredBooks.push(book);
  }
  
  return filteredBooks;
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get cached results if available and not expired
function getCachedResults(query: string): any[] | null {
  const cacheEntry = queryCache.get(query);
  if (!cacheEntry) return null;
  
  const now = Date.now();
  if (now - cacheEntry.timestamp > CACHE_TTL) {
    queryCache.delete(query); // Remove expired cache
    return null;
  }
  
  return cacheEntry.data;
}

// Store results in cache
function cacheResults(query: string, data: any[]): void {
  queryCache.set(query, {
    timestamp: Date.now(),
    data: [...data] // Create a copy
  });
  
  // Limit cache size
  if (queryCache.size > 100) {
    const firstKey = queryCache.keys().next().value;
    if (firstKey) queryCache.delete(firstKey);
  }
}

// Get random start index for pagination
function getRandomStartIndex(): number {
  return Math.floor(Math.random() * 100); // Random start between 0-99
}

// Main recommendation function
async function getBookRecommendations(query: string): Promise<{
  books: any[];
  source: string;
  reasoning: string;
  totalQueries: number;
}> {
  // Check cache first
  const cached = getCachedResults(query);
  if (cached && cached.length > 0) {
    console.log(`Using cached results for query: "${query}"`);
    return {
      books: shuffleArray(cached).slice(0, MAX_TOTAL_BOOKS),
      source: "cache",
      reasoning: `Returning ${Math.min(cached.length, MAX_TOTAL_BOOKS)} cached recommendations for "${query}"`,
      totalQueries: 0
    };
  }
  
  // Generate multiple search queries
  const searchQueries = generateSearchQueries(query);
  console.log(`Generated ${searchQueries.length} search queries for "${query}":`, searchQueries);
  
  const allBooks: any[] = [];
  const promises: Promise<any[]>[] = [];
  
  // Create API calls for each query with random start index
  for (const searchQuery of searchQueries) {
    const startIndex = getRandomStartIndex();
    promises.push(fetchBooksFromGoogle(searchQuery, startIndex));
    
    // Also fetch a second page for some queries to increase variety
    if (Math.random() > 0.5) { // 50% chance
      const secondStartIndex = startIndex + MAX_RESULTS_PER_QUERY;
      promises.push(fetchBooksFromGoogle(searchQuery, secondStartIndex));
    }
  }
  
  try {
    // Execute all API calls in parallel
    const results = await Promise.allSettled(promises);
    
    // Combine successful results
    for (const result of results) {
      if (result.status === "fulfilled" && result.value) {
        allBooks.push(...result.value);
      }
    }
    
    console.log(`Fetched ${allBooks.length} total books from Google Books API`);
    
    let source = "google-books";
    let reasoning = "";
    
    // If Google Books API failed or returned no results, use mock data
    if (allBooks.length === 0) {
      console.log("No results from Google Books API, using mock data");
      source = "mock-data";
      reasoning = `Google Books API returned no results for "${query}". Showing popular books instead.`;
      
      // Use mock books with relevance scoring
      const mockWithScores = mockBooks.map(book => ({
        ...book,
        relevanceScore: calculateRelevanceScore(book, query),
        source: "mock"
      }));
      
      // Process and filter mock books
      const processedBooks = processBooks(mockWithScores, query);
      
      // Cache the results
      cacheResults(query, processedBooks);
      
      return {
        books: shuffleArray(processedBooks).slice(0, MAX_TOTAL_BOOKS),
        source,
        reasoning,
        totalQueries: searchQueries.length
      };
    }
    
    // Process and filter the fetched books
    const processedBooks = processBooks(allBooks, query);
    
    // Sort by relevance score (highest first)
    processedBooks.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    // Take top books
    const topBooks = processedBooks.slice(0, MAX_TOTAL_BOOKS * 2); // Get more than needed for shuffling
    
    // Cache the results
    cacheResults(query, topBooks);
    
    // Shuffle for variety
    const shuffledBooks = shuffleArray(topBooks).slice(0, MAX_TOTAL_BOOKS);
    
    reasoning = `Found ${allBooks.length} books across ${searchQueries.length} search variations. `;
    reasoning += `Selected ${shuffledBooks.length} high-quality recommendations based on relevance to "${query}". `;
    reasoning += `Results are shuffled for variety and include books from different categories.`;
    
    return {
      books: shuffledBooks,
      source,
      reasoning,
      totalQueries: searchQueries.length
    };
    
  } catch (error) {
    console.error("Error in recommendation pipeline:", error);
    
    // Fallback to mock data
    const mockWithScores = mockBooks.map(book => ({
      ...book,
      relevanceScore: calculateRelevanceScore(book, query),
      source: "mock-fallback"
    }));
    
    const processedBooks = processBooks(mockWithScores, query);
    
    return {
      books: shuffleArray(processedBooks).slice(0, MAX_TOTAL_BOOKS),
      source: "mock-fallback",
      reasoning: `Error fetching from Google Books API. Showing ${processedBooks.length} popular books as fallback.`,
      totalQueries: searchQueries.length
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    console.log(`Processing recommendation request for: "${query}"`);
    
    // Get recommendations
    const { books, source, reasoning, totalQueries } = await getBookRecommendations(query);
    
    // Add metadata to each book
    const booksWithMetadata = books.map(book => ({
      ...book,
      queryMatch: query.toLowerCase(),
      fetchedAt: new Date().toISOString()
    }));

    return NextResponse.json({
      success: true,
      query,
      summary: reasoning,
      count: books.length,
      books: booksWithMetadata,
      source,
      totalQueries,
      cacheInfo: source === "cache" ? "served from cache" : "fresh results",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Recommendation API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST with a JSON body containing 'query'",
    example: { query: "sci-fi books with strong female leads" },
    available_features: [
      "AI-powered query variation (generates 5-10 different search queries)",
      "Multiple Google Books API calls in parallel",
      "Dynamic pagination with random start indices",
      "Intelligent caching (5-minute TTL)",
      "Relevance scoring and ranking",
      "Deduplication and quality filtering",
      "Randomized results for variety",
      "Fallback to mock data when API fails"
    ],
    configuration: {
      max_queries: MAX_QUERIES,
      max_results_per_query: MAX_RESULTS_PER_QUERY,
      max_total_books: MAX_TOTAL_BOOKS,
      cache_ttl_minutes: CACHE_TTL / 60000,
      google_api_configured: USE_GOOGLE_API
    }
  });
}
