import { AlertCircle, CheckCircle2, Inbox, Loader2, Plus, RefreshCw, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { DeleteModal } from "../components/DeleteModal";
import { Layout } from "../components/Layout";
import { NoticeCard } from "../components/NoticeCard";
import { NoticeForm } from "../components/NoticeForm";

export default function HomePage() {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    void loadNotices();
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  async function loadNotices() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/notices");
      const data = await readJson(response);
      setNotices(data.notices);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }

  async function saveNotice(values) {
    setIsSaving(true);

    try {
      const url = editingNotice ? `/api/notices/${editingNotice.id}` : "/api/notices";
      const method = editingNotice ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      await readJson(response);
      await loadNotices();
      setToast({
        tone: "success",
        message: editingNotice
          ? "Notice updated successfully."
          : "Notice created successfully.",
      });
      closeForm();
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteNotice() {
    if (!deleteTarget) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/notices/${deleteTarget.id}`, {
        method: "DELETE",
      });
      await readJson(response);
      setNotices((current) =>
        current.filter((notice) => notice.id !== deleteTarget.id),
      );
      setDeleteTarget(null);
      setToast({ tone: "success", message: "Notice deleted successfully." });
    } catch (deleteError) {
      setToast({ tone: "error", message: getErrorMessage(deleteError) });
    } finally {
      setIsSaving(false);
    }
  }

  function openCreateForm() {
    setEditingNotice(null);
    setIsFormOpen(true);
  }

  function openEditForm(notice) {
    setEditingNotice(notice);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingNotice(null);
  }

  const urgentCount = notices.filter((notice) => notice.priority === "URGENT").length;

  return (
    <Layout>
      <header className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft backdrop-blur sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
              Reno Platforms Engineering
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              NoticeFlow
            </h1>
            
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="btn-secondary" onClick={() => void loadNotices()} type="button">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button className="btn-primary" onClick={openCreateForm} type="button">
              <Plus className="h-4 w-4" />
              Add notice
            </button>
          </div>
        </div>

        <dl className="mt-8 grid gap-3 sm:grid-cols-3">
          <Metric label="Total notices" value={notices.length.toString()} />
          <Metric label="Urgent" value={urgentCount.toString()} />
          <Metric
            label="Normal"
            value={(notices.length - urgentCount).toString()}
          />
        </dl>
      </header>

      <div className="mt-6">
        {isLoading ? (
          <StatusMessage
            message="Fetching the latest notices from the database."
            title="Loading notices"
            tone="loading"
          />
        ) : error ? (
          <StatusMessage
            actionLabel="Try again"
            message={error}
            onAction={() => void loadNotices()}
            title="Unable to load notices"
            tone="error"
          />
        ) : notices.length === 0 ? (
          <StatusMessage
            actionLabel="Create the first notice"
            message="There are no notices yet. Add an exam, event, or general announcement to get started."
            onAction={openCreateForm}
            title="No notices published"
          />
        ) : (
          <section
            aria-label="Notices"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {notices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onDelete={setDeleteTarget}
                onEdit={openEditForm}
              />
            ))}
          </section>
        )}
      </div>

      {isFormOpen ? (
        <NoticeForm
          key={editingNotice?.id || "new-notice"}
          isSaving={isSaving}
          notice={editingNotice}
          onClose={closeForm}
          onSubmit={saveNotice}
        />
      ) : null}

      <DeleteModal
        isDeleting={isSaving}
        notice={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void deleteNotice()}
      />

      <ToastMessage toast={toast} />
    </Layout>
  );
}

async function readJson(response) {
  if (response.status === 204) {
    return {};
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || "Request failed.");
    if (data.details) {
      error.details = data.details;
    }
    throw error;
  }

  return data;
}

function getErrorMessage(error) {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white px-4 py-4">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="mt-1 text-2xl font-bold text-slate-950">{value}</dd>
    </div>
  );
}

function StatusMessage({
  title,
  message,
  actionLabel,
  onAction,
  tone = "empty",
}) {
  const Icon =
    tone === "error" ? AlertCircle : tone === "loading" ? Loader2 : Inbox;

  return (
    <section className="rounded-xl border border-dashed border-slate-300 bg-white/80 px-6 py-12 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Icon className={tone === "loading" ? "h-6 w-6 animate-spin" : "h-6 w-6"} />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        {message}
      </p>
      {actionLabel && onAction ? (
        <button className="btn-primary mt-5" onClick={onAction} type="button">
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}

function ToastMessage({ toast }) {
  if (!toast) {
    return null;
  }

  const Icon = toast.tone === "success" ? CheckCircle2 : XCircle;

  return (
    <div
      className={
        toast.tone === "success"
          ? "toast border-emerald-200 bg-emerald-50 text-emerald-900"
          : "toast border-red-200 bg-red-50 text-red-900"
      }
      role="status"
    >
      <Icon className="h-5 w-5 shrink-0" />
      {toast.message}
    </div>
  );
}
