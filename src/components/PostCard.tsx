import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PostCardProps } from '../types';
import '../styles/PostCard.css';

/**
 * PostCard Component
 * 
 * Displays an individual post with all its information
 * Uses semantic HTML with <article> tag for better accessibility
 * Clickable to navigate to the post detail page
 * 
 * @param post - The post object containing all post data
 */
function PostCard({ post }: PostCardProps): React.ReactElement {
  const navigate = useNavigate();

  // Format the publish date to a readable format
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Navigate to post detail page
  const handleClick = (): void => {
    navigate(`/post/${post.id}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLElement>): void => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  return (
    <article 
      className="post-card" 
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={handleKeyPress}
      aria-label={`Read more about ${post.title}`}
    >
      {/* Post Header with author info */}
      <header className="post-card__header">
        <img 
          src={post.author.avatar} 
          alt={`${post.author.name}'s avatar`}
          className="post-card__avatar"
        />
        <div className="post-card__author-info">
          <h3 className="post-card__author-name">{post.author.name}</h3>
          <time className="post-card__date" dateTime={post.publishDate}>
            {formatDate(post.publishDate)}
          </time>
        </div>
      </header>

      {/* Post Content */}
      <div className="post-card__content">
        <h2 className="post-card__title">{post.title}</h2>
        <p className="post-card__summary">{post.summary}</p>
      </div>

      {/* Post Categories */}
      <footer className="post-card__footer">
        <div className="post-card__categories">
          {post.categories.map((category) => (
            <span key={category.id} className="post-card__category-tag">
              {category.name}
            </span>
          ))}
        </div>
      </footer>
    </article>
  );
}

export default PostCard;
