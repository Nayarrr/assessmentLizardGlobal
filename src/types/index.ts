/**
 * Type definitions for the Blog Posts application
 */

export interface Author {
  name: string;
  avatar: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  publishDate: string;
  author: Author;
  summary: string;
  categories: Category[];
}

export interface CategoryWithCount extends Category {
  count: number;
  ids?: string[];
}

export interface ApiResponse {
  posts: Post[];
}

export interface PostListProps {
  posts: Post[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export interface PostCardProps {
  post: Post;
}

export interface CategoryFilterProps {
  categories: CategoryWithCount[];
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
  onClearFilters: () => void;
}
