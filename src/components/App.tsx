import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryFilter from './CategoryFilter';
import PostList from './PostList';
import { Post, Category, CategoryWithCount } from '../types';
import '../styles/App.css';

/**
 * Main App Component
 * 
 * This is the main component that orchestrates the entire application.
 * It handles:
 * - Fetching data from the mock API (/api/posts)
 * - Managing state for posts, categories, and filters
 * - Implementing pagination with "Load More" functionality
 * - Filtering posts by selected categories
 * - Persisting filter state in URL query parameters
 * 
 * State Management:
 * - allPosts: All posts fetched from the API
 * - displayedPosts: Posts currently shown (for pagination)
 * - categories: Unique categories extracted from posts with counts
 * - selectedCategories: User-selected category filters (synced with URL)
 * - loading: Loading state for API calls
 * - postsPerPage: Number of posts to show per page (pagination)
 */
function App(): React.ReactElement {
  // URL search params for query string persistence
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State declarations
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const POSTS_PER_PAGE = 6; // Show 6 posts at a time

  /**
   * Effect: Initialize selected categories from URL on mount
   */
  useEffect(() => {
    const categoriesFromUrl = searchParams.get('categories');
    if (categoriesFromUrl) {
      setSelectedCategories(categoriesFromUrl.split(','));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Effect: Fetch posts from API on component mount
   * This runs once when the component first renders
   */
  useEffect(() => {
    fetchPosts();
  }, []);

  /**
   * Effect: Filter and paginate posts when dependencies change
   * This runs whenever the filters or pagination changes
   */
  useEffect(() => {
    filterAndPaginatePosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [allPosts, selectedCategories, currentPage]);

  /**
   * Fetch posts from the mock API
   * The API endpoint is set up by MirageJS at /api/posts
   */
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      
      // Store all posts
      setAllPosts(data.posts);
      
      // Extract unique categories BY NAME (not by ID)
      // This fixes the issue where same category names have different IDs
      const categoryMap = new Map();
      data.posts.forEach((post: Post) => {
        post.categories.forEach((category: Category) => {
          // Use category.name as the key instead of category.id
          if (categoryMap.has(category.name)) {
            categoryMap.get(category.name).count++;
            // Keep track of all IDs for this category name
            if (!categoryMap.get(category.name).ids.includes(category.id)) {
              categoryMap.get(category.name).ids.push(category.id);
            }
          } else {
            categoryMap.set(category.name, {
              id: category.name, // Use name as ID for filtering
              name: category.name,
              ids: [category.id], // Store original IDs
              count: 1
            });
          }
        });
      });
      
      // Convert map to array and sort alphabetically
      const uniqueCategories = Array.from(categoryMap.values())
        .sort((a, b) => a.name.localeCompare(b.name));
      
      setCategories(uniqueCategories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  /**
   * Filter posts based on selected categories and apply pagination
   * If no categories are selected, show all posts
   * If categories are selected, show only posts that have at least one selected category
   */
  const filterAndPaginatePosts = () => {
    let filtered = allPosts;

    // Apply category filter if any categories are selected
    if (selectedCategories.length > 0) {
      filtered = allPosts.filter(post =>
        post.categories.some(category =>
          // Compare by name instead of ID to handle duplicate category names
          selectedCategories.includes(category.name)
        )
      );
    }

    // Apply pagination - show posts up to current page
    const endIndex = currentPage * POSTS_PER_PAGE;
    const paginated = filtered.slice(0, endIndex);
    
    setDisplayedPosts(paginated);
  };

  /**
   * Toggle a category filter on/off
   * Also updates the URL query string for persistence
   * @param {string} categoryId - The ID of the category to toggle
   */
  const handleCategoryToggle = (categoryId: string): void => {
    setSelectedCategories(prev => {
      let newCategories;
      if (prev.includes(categoryId)) {
        // Remove category from filters
        newCategories = prev.filter(id => id !== categoryId);
      } else {
        // Add category to filters
        newCategories = [...prev, categoryId];
      }
      
      // Update URL query string
      if (newCategories.length > 0) {
        setSearchParams({ categories: newCategories.join(',') });
      } else {
        setSearchParams({});
      }
      
      return newCategories;
    });
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  /**
   * Clear all category filters
   * Also clears the URL query string
   */
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setCurrentPage(1);
    setSearchParams({}); // Clear URL params
  };

  /**
   * Load more posts (pagination)
   */
  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  /**
   * Calculate if there are more posts to load
   */
  const getFilteredPostsCount = () => {
    if (selectedCategories.length === 0) {
      return allPosts.length;
    }
    return allPosts.filter(post =>
      post.categories.some(category =>
        selectedCategories.includes(category.id)
      )
    ).length;
  };

  const hasMorePosts = displayedPosts.length < getFilteredPostsCount();

  return (
    <div className="app">
      {/* Header */}
      <header className="app__header">
        <div className="app__header-content">
          <div>
            <h1 className="app__title">Blog Posts</h1>
            <p className="app__subtitle">
              Explore our collection of articles and insights
            </p>
          </div>
          <div className="app__author">
            <span className="app__author-label">Created by</span>
            <span className="app__author-name">Rayan Tournay</span>
          </div>
        </div>
      </header>

      {/* Main content area with sidebar and posts */}
      <div className="app__container">
        {/* Sidebar with category filters */}
        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          onClearFilters={handleClearFilters}
        />

        {/* Post list with pagination */}
        <PostList
          posts={displayedPosts}
          loading={loading}
          hasMore={hasMorePosts}
          onLoadMore={handleLoadMore}
        />
      </div>

      {/* Footer */}
      <footer className="app__footer">
        <p>© 2025 Blog Platform - Built with React</p>
      </footer>
    </div>
  );
}

export default App;
