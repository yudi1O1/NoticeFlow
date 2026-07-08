import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  CATEGORY_LABELS,
  NOTICE_CATEGORIES,
  NOTICE_PRIORITIES,
  PRIORITY_LABELS,
} from "@/constants/notices";
import { ApiError } from "@/services/notices";
import type { Notice, NoticeFormValues, NoticeInput } from "@/types/notice";
import { toDateInputValue } from "@/utils/date";
import { flattenFieldErrors } from "@/utils/errors";

type NoticeFormProps = {
  notice: Notice | null;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (values: NoticeInput) => Promise<void>;
};

const defaultValues: NoticeFormValues = {
  title: "",
  body: "",
  category: "GENERAL",
  priority: "NORMAL",
  publishDate: toDateInputValue(new Date()),
  imageUrl: "",
};

export function NoticeForm({
  notice,
  isOpen,
  isSaving,
  onClose,
  onSubmit,
}: NoticeFormProps) {
  const initialValues = useMemo<NoticeFormValues>(() => {
    if (!notice) {
      return defaultValues;
    }

    return {
      title: notice.title,
      body: notice.body,
      category: notice.category,
      priority: notice.priority,
      publishDate: toDateInputValue(notice.publishDate),
      imageUrl: notice.imageUrl ?? "",
    };
  }, [notice]);

  const [values, setValues] = useState<NoticeFormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    try {
      await onSubmit({
        ...values,
        imageUrl: values.imageUrl.trim() || null,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        setFieldErrors(flattenFieldErrors(error.details));
        setFormError(error.message);
        return;
      }

      setFormError("Unable to save the notice. Please try again.");
    }
  }

  function updateValue<K extends keyof NoticeFormValues>(
    key: K,
    value: NoticeFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
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
          <Button
            aria-label="Close form"
            className="h-10 w-10 px-0"
            disabled={isSaving}
            onClick={onClose}
            variant="ghost"
          >
            <X className="h-5 w-5" />
          </Button>
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
              onChange={(event) => updateValue("title", event.target.value)}
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
              onChange={(event) => updateValue("body", event.target.value)}
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
                  updateValue("category", event.target.value as NoticeFormValues["category"])
                }
                value={values.category}
              >
                {NOTICE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {CATEGORY_LABELS[category]}
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
                  updateValue("priority", event.target.value as NoticeFormValues["priority"])
                }
                value={values.priority}
              >
                {NOTICE_PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {PRIORITY_LABELS[priority]}
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
                  updateValue("publishDate", event.target.value)
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
                onChange={(event) => updateValue("imageUrl", event.target.value)}
                placeholder="https://example.com/banner.jpg"
                type="url"
                value={values.imageUrl}
              />
            </Field>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <Button disabled={isSaving} onClick={onClose} variant="secondary">
              Cancel
            </Button>
            <Button disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : notice ? "Save changes" : "Create notice"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

type FieldProps = {
  children: ReactNode;
  error?: string;
  hint?: string;
  htmlFor: string;
  label: string;
};

function Field({ children, error, hint, htmlFor, label }: FieldProps) {
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
