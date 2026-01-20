/*
 * Search Block
 * Implement site-wide search functionality
 */

async function performSearch(query) {
  // This is a placeholder implementation
  // In a real implementation, this would query an index or API
  const response = await fetch(`/search.json?q=${encodeURIComponent(query)}`);
  if (response.ok) {
    return response.json();
  }
  return [];
}

function renderResults(results, container) {
  if (results.length === 0) {
    container.innerHTML = '<p class="search-no-results">No results found.</p>';
    return;
  }

  const ul = document.createElement('ul');
  ul.className = 'search-results-list';

  results.forEach((result) => {
    const li = document.createElement('li');
    li.className = 'search-result-item';

    const link = document.createElement('a');
    link.href = result.path || '#';
    link.innerHTML = `
      <h3>${result.title || 'Untitled'}</h3>
      <p>${result.description || ''}</p>
    `;

    li.appendChild(link);
    ul.appendChild(li);
  });

  container.innerHTML = '';
  container.appendChild(ul);
}

export default function decorate(block) {
  const searchForm = document.createElement('form');
  searchForm.className = 'search-form';
  searchForm.setAttribute('role', 'search');

  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.name = 'q';
  searchInput.placeholder = 'Search...';
  searchInput.setAttribute('aria-label', 'Search');

  const searchButton = document.createElement('button');
  searchButton.type = 'submit';
  searchButton.className = 'button primary';
  searchButton.textContent = 'Search';

  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'search-results';

  searchForm.appendChild(searchInput);
  searchForm.appendChild(searchButton);

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();

    if (query.length < 2) {
      resultsContainer.innerHTML = '<p class="search-message">Please enter at least 2 characters.</p>';
      return;
    }

    resultsContainer.innerHTML = '<p class="search-loading">Searching...</p>';
    searchButton.disabled = true;

    try {
      const results = await performSearch(query);
      renderResults(results, resultsContainer);
    } catch (error) {
      resultsContainer.innerHTML = '<p class="search-error">An error occurred while searching.</p>';
    } finally {
      searchButton.disabled = false;
    }
  });

  block.textContent = '';
  block.appendChild(searchForm);
  block.appendChild(resultsContainer);
}
