import { useState, useRef } from "react";
import { generateUUID } from "../utils/helpers";
import { createExpense } from "../api/apiHooks";

const CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Health",
  "Utilities",
  "Education",
  "Travel",
  "Other",
];

export default function ExpenseForm({ onAdded }) {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', msg }

  // One idempotency key per form session – reset only after a successful submit
  const uniqueID = useRef(generateUUID());

  const validate = () => {
    const errs = {};
    const amount = parseFloat(form.amount);
    if (!form.amount || isNaN(amount) || amount <= 0)
      errs.amount = "Enter a valid positive amount.";
    if (!form.category) errs.category = "Please select a category.";
    if (!form.description.trim())
      errs.description = "Description cannot be empty.";
    if (!form.date) errs.date = "Please select a date.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const data = await createExpense(
        {
          amount: parseFloat(form.amount),
          category: form.category,
          description: form.description.trim(),
          date: form.date,
        },
        uniqueID.current,
      );

      setStatus({ type: "success", msg: "Expense added successfully!" });
      setForm({
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().slice(0, 10),
      });
      // Rotate the idempotency key so next submission gets its own key
      uniqueID.current = generateUUID();
      onAdded(data);
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        "Failed to add expense. Please try again.";
      setStatus({ type: "error", msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <span className="icon">➕</span> Add Expense
      </h2>

      {status && (
        <div
          className={
            status.type === "success" ? "success-banner" : "error-banner"
          }
        >
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate id="expense-form">
        {/* Amount */}
        <div className="form-group">
          <label className="form-label" htmlFor="amount">
            Amount (₹)
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="e.g. 250.00"
            className={`form-input${errors.amount ? " error" : ""}`}
            value={form.amount}
            onChange={handleChange}
          />
          {errors.amount && (
            <span className="field-error">{errors.amount}</span>
          )}
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            className={`form-select${errors.category ? " error" : ""}`}
            value={form.category}
            onChange={handleChange}
          >
            <option value="">Select category…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="field-error">{errors.category}</span>
          )}
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label" htmlFor="description">
            Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            placeholder="What was this expense for?"
            className={`form-input${errors.description ? " error" : ""}`}
            value={form.description}
            onChange={handleChange}
          />
          {errors.description && (
            <span className="field-error">{errors.description}</span>
          )}
        </div>

        {/* Date */}
        <div className="form-group">
          <label className="form-label" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            className={`form-input${errors.date ? " error" : ""}`}
            value={form.date}
            onChange={handleChange}
            max={new Date().toISOString().slice(0, 10)}
          />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </div>

        <button
          id="submit-expense"
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="spinner" /> Saving…
            </>
          ) : (
            "Save Expense"
          )}
        </button>
      </form>
    </div>
  );
}
