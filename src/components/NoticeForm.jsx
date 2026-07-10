import { useState } from "react";
import { X } from "lucide-react";

const categories = [
  { label: "Exam", value: "EXAM" },
  { label: "Event", value: "EVENT" },
  { label: "General", value: "GENERAL" },
];

const priorities = [
  { label: "Normal", value: "NORMAL" },
  { label: "Urgent", value: "URGENT" },
];

export function NoticeForm({ notice, isSaving, onClose, onSubmit }) {
  const [values, setValues] = useState(() => {
    if (!notice) {
      return {
        title: "",
        body: "",
        category: "GENERAL",
        priority: "NORMAL",
        publishDate: toDateInputValue(new Date()),
        imageUrl: "",
      };
    }

    return {
      title: notice.title,
      body: notice.body,
      category: notice.category,
      priority: notice.priority,
      publishDate: toDateInputValue(notice.publishDate),
      imageUrl: notice.imageUrl || "",
    };
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const payload = {
      ...values,
      imageUrl: values.imageUrl.trim() || null,
    };

    try {
      await onSubmit(payload);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to save the notice. Please try again.",
      );

      if (error instanceof Error && error.details) {
        setFieldErrors(
          Object.fromEntries(
            Object.entries(error.details).map(([field, messages]) => [
              field,
              messages[0] || "Invalid value.",
            ]),
          ),
        );
      }
    }
  }

  const title = notice ? "Edit notice" : "Add notice";

  return (
    <div
      aria-labelledby="notice-form-title"
      aria-modal="true"
      className="fixed inset-0 z-30 overflow-y-auto bg-slate-950/45 px-4 py-6 backdrop-blur-sm sm:py-10"
      role="dialog"
    >
      <div className="mx-auto w-full max-w-2xl rounded-xl bg-white shadow-soft">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2
              className="text-xl font-semibold tracking-tight text-slate-950"
              id="notice-form-title"
            >
              {title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Use the same form for new notices and updates.
            </p>
          </div>
          <button
            aria-label="Close form"
            className="btn-ghost h-10 w-10 px-0"
            disabled={isSaving}
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-5 px-5 py-5 sm:px-6" onSubmit={handleSubmit}>
          {formError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {formError}
            </div>
          ) : null}

          <Field label="Title" error={fieldErrors.title} htmlFor="title">
            <input
              className="form-input"
              id="title"
              maxLength={140}
              onChange={(event) =>
                setValues({ ...values, title: event.target.value })
              }
              placeholder="Mid-term exam schedule"
              required
              value={values.title}
            />
          </Field>

          <Field label="Body" error={fieldErrors.body} htmlFor="body">
            <textarea
              className="form-input min-h-36 resize-y"
              id="body"
              maxLength={5000}
              onChange={(event) =>
                setValues({ ...values, body: event.target.value })
              }
              placeholder="Share the full notice details..."
              required
              value={values.body}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Category"
              error={fieldErrors.category}
              htmlFor="category"
            >
              <select
                className="form-input"
                id="category"
                onChange={(event) =>
                  setValues({ ...values, category: event.target.value })
                }
                value={values.category}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Priority"
              error={fieldErrors.priority}
              htmlFor="priority"
            >
              <select
                className="form-input"
                id="priority"
                onChange={(event) =>
                  setValues({ ...values, priority: event.target.value })
                }
                value={values.priority}
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Publish date"
              error={fieldErrors.publishDate}
              htmlFor="publishDate"
            >
              <input
                className="form-input"
                id="publishDate"
                onChange={(event) =>
                  setValues({ ...values, publishDate: event.target.value })
                }
                required
                type="date"
                value={values.publishDate}
              />
            </Field>

            <Field
              label="Image URL"
              hint="Optional"
              error={fieldErrors.imageUrl}
              htmlFor="imageUrl"
            >
              <input
                className="form-input"
                id="imageUrl"
                onChange={(event) =>
                  setValues({ ...values, imageUrl: event.target.value })
                }
                placeholder="https://example.com/banner.jpg"
                type="url"
                value={values.imageUrl}
              />
            </Field>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              className="btn-secondary"
              disabled={isSaving}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button className="btn-primary" disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : notice ? "Save changes" : "Create notice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ children, error, hint, htmlFor, label }) {
  return (
    <label className="block" htmlFor={htmlFor}>
      <span className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-800">
        {label}
        {hint ? <span className="font-normal text-slate-400">{hint}</span> : null}
      </span>
      <span className="mt-2 block">{children}</span>
      {error ? <span className="mt-2 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}

function toDateInputValue(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}
