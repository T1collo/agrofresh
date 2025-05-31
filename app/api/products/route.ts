import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Cache duration in seconds (5 minutes)
const CACHE_DURATION = 300;

// In-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const categoryName = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'name';
    const order = searchParams.get('order') || 'asc';
    const limit = searchParams.get('limit');

    // Generate cache key
    const cacheKey = JSON.stringify({ categoryId, categoryName, search, sort, order, limit });

    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION * 1000) {
      return NextResponse.json(cached.data);
    }

    // Create Supabase client with proper cookie handling
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(name)
      `);

    // Apply filters
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    } else if (categoryName) {
      // If category name is provided, first get the category ID
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', categoryName)
        .single();

      if (categoryError) {
        console.error('Error fetching category:', categoryError);
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }

      if (category) {
        query = query.eq('category_id', category.id);
      }
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Apply sorting
    query = query.order(sort, { ascending: order === 'asc' });

    // Apply limit if specified
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Ensure we always return an array
    const productsArray = Array.isArray(products) ? products : [];

    // Cache the result
    cache.set(cacheKey, {
      data: productsArray,
      timestamp: Date.now()
    });

    return NextResponse.json(productsArray);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 