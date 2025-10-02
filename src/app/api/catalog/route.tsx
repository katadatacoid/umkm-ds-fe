import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Define types for the pagination response
interface CatalogResponse {
  catalogs: Array<any>;
  totalCatalogs: number;
  totalPages: number;
  currentPage: number;
  searchTerm: string | null; // Add searchTerm to the response
}

export async function GET(req: Request): Promise<NextResponse> {
  try {
    // Extract the page, pageSize, and search query params
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10); // Default to page 1 if not provided
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10); // Default to pageSize 10 if not provided
    const searchTerm = url.searchParams.get('search') || ''; // Get the search term from query params

    // Calculate skip and take based on the page and pageSize
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Build the search filter condition if a search term is provided
    const searchFilter = searchTerm ? {
      OR: [
        { name: { contains: searchTerm } },  // Case-insensitive search by name

      ],
    } : {};

    // Fetch the catalogs with pagination and search filter
    const catalogs = await prisma.catalogs.findMany({
      where: searchFilter,  // Apply the search filter if search term exists
      skip,  // Skip the records based on the page
      take,  // Take the pageSize records
      include: {
        catalogPhotos: true, // Include CatalogPhoto relation if needed
      },
    });

    // Get the total count of catalogs for pagination info, applying the search filter for count as well
    const totalCatalogs = await prisma.catalogs.count({
      where: searchFilter,  // Apply the same search filter for count
    });

    // Return the response with catalog data, pagination info, current page, and search term
    const response: CatalogResponse = {
      catalogs,
      totalCatalogs,
      totalPages: Math.ceil(totalCatalogs / pageSize), // Calculate total number of pages
      currentPage: page, // Current page number
      searchTerm: searchTerm || null,  // Return the search term in the response
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    // Handle any errors gracefully and return a meaningful message
    console.error('Error fetching catalogs:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
