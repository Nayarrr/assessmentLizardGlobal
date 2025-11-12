import React from 'react';
import { CategoryFilterProps } from '../types';
import '../styles/CategoryFilter.css';

/**
 * CategoryFilter Component
 * 
 * Multi-select filter for post categories
 * Allows users to filter posts by selecting multiple categories
 * 
 * @param categories - All available categories
 * @param selectedCategories - Currently selected category IDs
 * @param onCategoryToggle - Callback when a category is toggled
 * @param onClearFilters - Callback to clear all filters
 */
function CategoryFilter({ 
  categories, 
  selectedCategories, 
  onCategoryToggle, 
  onClearFilters 
}: CategoryFilterProps): React.ReactElement {
  return (
    <aside className="category-filter">
      <div className="category-filter__header">
        <h2 className="category-filter__title">Filter by Category</h2>
        {selectedCategories.length > 0 && (
          <button 
            className="category-filter__clear-btn"
            onClick={onClearFilters}
            aria-label="Clear all filters"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category checkbox list */}
      <div className="category-filter__list" role="group" aria-label="Category filters">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          
          return (
            <label 
              key={category.id} 
              className={`category-filter__item ${isSelected ? 'category-filter__item--selected' : ''}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onCategoryToggle(category.id)}
                className="category-filter__checkbox"
                aria-label={`Filter by ${category.name}`}
              />
              <span className="category-filter__label">{category.name}</span>
              <span className="category-filter__count">({category.count})</span>
            </label>
          );
        })}
      </div>
    </aside>
  );
}

export default CategoryFilter;
