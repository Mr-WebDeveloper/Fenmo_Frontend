import { formatINR } from '../utils/helpers';

export default function SummaryBar({ expenses }) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const catMap = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const cats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);

  return (
    <>
      <div className="summary-bar" id="summary-bar">
        <div className="summary-stat">
          <span className="summary-label">Total</span>
          <span className="summary-value" id="summary-total">{formatINR(total)}</span>
        </div>
        <span className="summary-count" id="summary-count">
          {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
        </span>
      </div>

      {cats.length > 1 && (
        <div className="cat-summary" id="category-summary">
          {cats.map(([cat, amt]) => (
            <div className="cat-chip" key={cat}>
              <span className="cat-chip-label">{cat}</span>
              <span className="cat-chip-value">{formatINR(amt)}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
