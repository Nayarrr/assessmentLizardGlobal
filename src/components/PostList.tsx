import React from 'react';
import PostCard from './PostCard';
import { PostListProps } from '../types';
import '../styles/PostList.css';

/**
 * PostList Component
 * 
 * Displays a list of posts in a responsive grid layout
 * Uses semantic HTML with <main> and proper ARIA labels
 * 
 * @param posts - Array of posts to display
 * @param loading - Loading state
 * @param hasMore - Whether there are more posts to load
 * @param onLoadMore - Callback to load more posts
 */
function PostList({ posts, loading, hasMore, onLoadMore }: PostListProps): React.ReactElement {
  return (
    <main className="post-list">
      {/* Show loading state */}
      {loading && posts.length === 0 && (
        <div className="post-list__loading">
          <div className="spinner" aria-label="Loading posts"></div>
          <p>Loading posts...</p>
        </div>
      )}

      {/* Show posts grid */}
      {posts.length > 0 && (
        <>
          <div className="post-list__grid" role="feed" aria-label="Posts feed">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Load More button with loading state */}
          {hasMore && (
            <div className="post-list__load-more">
              <button 
                className="post-list__load-more-btn"
                onClick={onLoadMore}
                disabled={loading}
                aria-label="Load more posts"
              >
                {loading ? (
                  <>
                    <span className="spinner spinner--small"></span>
                    Loading...
                  </>
                ) : (
                  'Load More Posts'
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Show empty state when no posts match filters */}
      {!loading && posts.length === 0 && (
        <div className="post-list__empty">
          <svg className="post-list__empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
            <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2"/>
            <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2"/>
          </svg>
          <h2>No posts found</h2>
          <p>Try adjusting your filters to see more results.</p>
        </div>
      )}
    </main>
  );
}

export default PostList;
