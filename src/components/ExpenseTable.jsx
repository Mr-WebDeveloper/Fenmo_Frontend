import { formatINR, formatDate } from '../utils/helpers';

export default function ExpenseTable({ expenses, loading, error }) {
  if (loading) {
    return (
      <div className="state-box">
        <div className="icon">⏳</div>
        <p>Loading expenses…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-banner" id="expenses-error">
        {error}
      </div>
    );
  }

  if (!expenses.length) {
    return (
      <div className="state-box" id="expenses-empty">
        <div className="icon">🧾</div>
        <p>No expenses found. Add one using the form!</p>
      </div>
    );
  }

  return (
    <div className="table-wrap" id="expenses-table-wrap">
      <table aria-label="Expense list">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th style={{ textAlign: 'right' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp._id || exp.id}>
              <td className="date-cell">{formatDate(exp.date)}</td>
              <td><span className="cat-badge">{exp.category}</span></td>
              <td>{exp.description}</td>
              <td className="amount-cell" style={{ textAlign: 'right' }}>
                {formatINR(exp.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
