import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

/**
 * This file sets up the React application with routing and TypeScript
 */

// Include mock API.
import './mock/index';

// Include styles.
import './styles/index.css';

// Include application components.
import App from './components/App';
import PostDetail from './components/PostDetail';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
