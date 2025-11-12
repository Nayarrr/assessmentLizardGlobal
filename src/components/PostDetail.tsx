import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Post, ApiResponse } from '../types';
import '../styles/PostDetail.css';

/**
 * PostDetail Component
 * 
 * Displays the full details of a single post
 * Accessed via routing when clicking on a post card
 * 
 * @route /post/:id
 */
function PostDetail(): React.ReactElement {
  const { id } = useParams<{ id: string }>(); // Get post ID from URL
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Fetch the specific post from the API
   */
  useEffect(() => {
    const fetchPost = async (): Promise<void> => {
      setLoading(true);
      try {
        const response = await fetch('/api/posts');
        const data: ApiResponse = await response.json();
        
        // Find the post with matching ID
        const foundPost = data.posts.find((p: Post) => p.id === id);
        setPost(foundPost || null);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  /**
   * Format the publish date to a readable format
   */
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Loading state
  if (loading) {
    return (
      <div className="post-detail">
        <div className="post-detail__loading">
          <div className="spinner" aria-label="Loading post"></div>
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  // Post not found
  if (!post) {
    return (
      <div className="post-detail">
        <div className="post-detail__error">
          <h2>Post Not Found</h2>
          <p>The post you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="post-detail__back-btn">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')} 
        className="post-detail__back-btn"
        aria-label="Go back to home"
      >
        ← Back to Posts
      </button>

      {/* Post Content */}
      <article className="post-detail__content">
        {/* Header with Author */}
        <header className="post-detail__header">
          <div className="post-detail__author">
            <img 
              src={post.author.avatar} 
              alt={`${post.author.name}'s avatar`}
              className="post-detail__avatar"
            />
            <div className="post-detail__author-info">
              <h3 className="post-detail__author-name">{post.author.name}</h3>
              <time className="post-detail__date" dateTime={post.publishDate}>
                {formatDate(post.publishDate)}
              </time>
            </div>
          </div>
        </header>

        {/* Title */}
        <h1 className="post-detail__title">{post.title}</h1>

        {/* Categories */}
        <div className="post-detail__categories">
          {post.categories.map((category) => (
            <span key={category.id} className="post-detail__category-tag">
              {category.name}
            </span>
          ))}
        </div>

        {/* Summary */}
        <div className="post-detail__summary">
          <h2>Summary</h2>
          <p>{post.summary}</p>
        </div>

        {/* Full Content (simulated - uses summary as placeholder content) */}
        <div className="post-detail__body">
          <h2>Article Content</h2>
          <p>{post.summary}</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
            eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt 
            in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>

        {/* Related Info */}
        <footer className="post-detail__footer">
          <div className="post-detail__meta">
            <div className="post-detail__meta-item">
              <strong>Published:</strong> {formatDate(post.publishDate)}
            </div>
            <div className="post-detail__meta-item">
              <strong>Author:</strong> {post.author.name}
            </div>
            <div className="post-detail__meta-item">
              <strong>Categories:</strong> {post.categories.length}
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}

export default PostDetail;
