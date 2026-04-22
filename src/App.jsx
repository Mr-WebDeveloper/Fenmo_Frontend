import { useState, useEffect, useCallback } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import SummaryBar from './components/SummaryBar';
import { getCategories, getExpenses } from './api/apiHooks.js';

const SORT_OPTIONS = [
  { value: 'date_desc', label: '📅 Newest First' },
  { value: 'date_asc',  label: '📅 Oldest First' },
];

export default function App() {
  const [expenses, setExpenses]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [category, setCategory]     = useState('');
  const [sort, setSort]             = useState('date_desc');

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    setError(null); 
    try {
      // Backend returns { status, data, message } — unwrap .data
      const res = await getExpenses({ category: category || undefined, sort });
      setExpenses(res.data ?? []);
    } catch {
      setError('Could not load expenses. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [category, sort]);

  useEffect(() => { loadExpenses(); }, [loadExpenses]);

  const handleAdded = (newExpense) => {
    // createExpense returns the raw document (.toJSON()) — _id is the identifier
    const newId = newExpense?._id || newExpense?.id;
    setExpenses((prev) => {
      const deduped = prev.filter((e) => (e._id || e.id) !== newId);
      const merged  = [newExpense, ...deduped];
      if (sort === 'date_asc') {
        merged.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else {
        merged.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
      return merged;
    });
    loadExpenses();
    getCategories().then((res) => setCategories(res.data ?? [])).catch(() => {});
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-logo">
          <div className="app-logo-icon">💰</div>
          <div>
            <div className="app-logo-text">Fenmo</div>
            <div className="app-subtitle">Personal Expense Tracker</div>
          </div>
        </div>
      </header>

      <main className="main-grid">
        {/* Left: Add Expense Form */}
        <aside>
          <ExpenseForm onAdded={handleAdded} />
        </aside>

        <section>
          <div className="card">
            <h2 className="card-title">
              <span className="icon">📋</span> Expenses
            </h2>

            {/* Toolbar */}
            <div className="toolbar">
              {/* Filter by category */}
              <div className="toolbar-group">
                <span className="toolbar-label">Filter:</span>
                <select
                  id="filter-category"
                  className="form-select"
                  style={{ width: 'auto' }}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  aria-label="Filter by category"
                >
                  <option value="">All categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="toolbar-group">
                <span className="toolbar-label">Sort:</span>
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    id={`sort-${opt.value}`}
                    className={`btn btn-ghost${sort === opt.value ? ' active' : ''}`}
                    onClick={() => setSort(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Refresh */}
              <button
                id="refresh-expenses"
                className="btn btn-ghost"
                onClick={loadExpenses}
                disabled={loading}
                title="Refresh"
              >
                🔄
              </button>
            </div>

            {/* Summary */}
            {!loading && !error && expenses.length > 0 && (
              <SummaryBar expenses={expenses} />
            )}

            {/* Table */}
            <ExpenseTable expenses={expenses} loading={loading} error={error} />
          </div>
        </section>
      </main>
    </div>
  );
}
