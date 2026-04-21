const API_KEY = 4ab087f9bac0452bb58b22e2bd98b618 ;
const API_URL = 'https://api.spoonacular.com/recipes/complexSearch';

const PHASES = {
  menstrual: {
    query: 'iron rich',
    ingredients: 'spinach,lentils,kidney beans,beef,broccoli,pumpkin seeds',
    insight: 'Your body needs iron and Vitamin C right now. Focus on iron-dense whole foods and bright vegetables to restore energy.',
    badge: 'High in Iron & Vitamin C',
    label: 'Menstrual Phase',
  },
  follicular: {
    query: 'light fresh',
    ingredients: 'avocado,yogurt,kimchi,eggs,salmon,seeds',
    insight: 'Rising estrogen calls for gut-friendly probiotics and healthy fats to fuel your growing energy and lift your mood.',
    badge: 'Probiotics & Healthy Fats',
    label: 'Follicular Phase',
  },
  ovulatory: {
    query: 'anti inflammatory',
    ingredients: 'berries,quinoa,broccoli,blueberries,kale,turmeric',
    insight: 'Support ovulation with fibre-rich and anti-inflammatory foods that reduce bloating and keep inflammation low.',
    badge: 'Fibre & Anti-Inflammatory',
    label: 'Ovulatory Phase',
  },
  luteal: {
    query: 'complex carbs',
    ingredients: 'sweet potato,dark chocolate,pumpkin seeds,oats,bananas,chickpeas',
    insight: 'Magnesium-rich foods ease PMS symptoms while complex carbohydrates stabilise mood and sustain your energy levels.',
    badge: 'Magnesium & Complex Carbs',
    label: 'Luteal Phase',
  },
};

// State
const state = { phase: null, diet: '', loading: false };

// DOM
const phaseCards  = document.querySelectorAll('.phase-card');
const filterBar   = document.getElementById('filter-bar');
const insight     = document.getElementById('phase-insight');
const dietSelect  = document.getElementById('diet-select');
const btnSearch   = document.getElementById('btn-search');
const panel       = document.getElementById('recipes-panel');
const loadingEl   = document.getElementById('loading-state');
const emptyEl     = document.getElementById('empty-state');
const errorEl     = document.getElementById('error-state');
const errorMsg    = document.getElementById('error-message');
const grid        = document.getElementById('recipe-grid');
const btnRetry    = document.getElementById('btn-retry');

// Select a phase
function selectPhase(phase) {
  state.phase = phase;

  phaseCards.forEach(c => {
    const active = c.dataset.phase === phase;
    c.classList.toggle('active', active);
    c.setAttribute('aria-selected', active);
  });

  document.body.dataset.phase = phase;

  const p = PHASES[phase];
  insight.innerHTML = `
    <p class="insight-label">${p.label}</p>
    <p class="insight-text">${p.insight}</p>
  `;

  filterBar.hidden = false;
  panel.hidden = true;
  grid.innerHTML = '';
}

// Fetch and render recipes
async function fetchRecipes() {
  if (state.loading) return;
  state.loading = true;

  panel.hidden = false;
  show('loading');
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  btnSearch.disabled = true;

  const p = PHASES[state.phase];
  const params = new URLSearchParams({
    apiKey: API_KEY,
    query: p.query,
    includeIngredients: p.ingredients,
    number: 12,
    addRecipeInformation: false,
  });
  if (state.diet) params.set('diet', state.diet);

  try {
    const res  = await fetch(`${API_URL}?${params}`);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const data = await res.json();

    if (!data.results?.length) { show('empty'); return; }

    grid.innerHTML = '';
    data.results.forEach(r => grid.appendChild(makeCard(r, p.badge)));
    show('grid');

  } catch (err) {
    errorMsg.textContent = err.message || 'Something went wrong. Please try again.';
    show('error');
  } finally {
    state.loading = false;
    btnSearch.disabled = false;
  }
}

// Show one result state at a time
function show(view) {
  loadingEl.hidden = view !== 'loading';
  emptyEl.hidden   = view !== 'empty';
  errorEl.hidden   = view !== 'error';
  grid.style.display = view === 'grid' ? '' : 'none';
}

// Build a recipe card element
function makeCard(recipe, badge) {
  const url   = `https://spoonacular.com/recipes/${slugify(recipe.title)}-${recipe.id}`;
  const image = recipe.image || '';

  const card = document.createElement('article');
  card.className = 'recipe-card';
  card.innerHTML = `
    <div class="card-img-wrap">
      <img class="card-img" src="${esc(image)}" alt="${esc(recipe.title)}" loading="lazy"
           onerror="this.style.display='none'">
      <span class="card-badge">${esc(badge)}</span>
    </div>
    <div class="card-body">
      <h3 class="card-title">${esc(recipe.title)}</h3>
      <a href="${esc(url)}" class="card-link" target="_blank" rel="noopener">View Recipe</a>
    </div>
  `;
  return card;
}

// Helpers
function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Event listeners
phaseCards.forEach(c => c.addEventListener('click', () => selectPhase(c.dataset.phase)));
dietSelect.addEventListener('change', () => { state.diet = dietSelect.value; });
btnSearch.addEventListener('click', fetchRecipes);
btnRetry.addEventListener('click', fetchRecipes);
