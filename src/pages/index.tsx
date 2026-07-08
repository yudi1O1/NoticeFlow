import Head from "next/head";
import { Plus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

import { ConfirmDialog } from "@/components/notices/ConfirmDialog";
import { NoticeForm } from "@/components/notices/NoticeForm";
import { NoticeList } from "@/components/notices/NoticeList";
import { Button } from "@/components/ui/Button";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { Toast, type ToastState } from "@/components/ui/Toast";
import { useNotices } from "@/hooks/useNotices";
import type { Notice, NoticeInput } from "@/types/notice";
import { getErrorMessage } from "@/utils/errors";

export default function HomePage() {
  const {
    notices,
    isLoading,
    error,
    isMutating,
    reload,
    create,
    update,
    remove,
  } = useNotices();

  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function openCreateForm() {
    setEditingNotice(null);
    setIsFormOpen(true);
  }

  function openEditForm(notice: Notice) {
    setEditingNotice(notice);
    setIsFormOpen(true);
  }

  async function handleFormSubmit(values: NoticeInput) {
    if (editingNotice) {
      await update(editingNotice.id, values);
      setToast({ tone: "success", message: "Notice updated successfully." });
    } else {
      await create(values);
      setToast({ tone: "success", message: "Notice created successfully." });
    }

    setIsFormOpen(false);
    setEditingNotice(null);
  }

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    try {
      await remove(deleteTarget.id);
      setToast({ tone: "success", message: "Notice deleted successfully." });
      setDeleteTarget(null);
    } catch (deleteError) {
      setToast({ tone: "error", message: getErrorMessage(deleteError) });
    }
  }

  const urgentCount = notices.filter((notice) => notice.priority === "URGENT").length;

  return (
    <>
      <Head>
        <title>NoticeFlow | Notice Board</title>
        <meta
          content="Create, edit, prioritize, and manage institution notices."
          name="description"
        />
      </Head>

      <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft backdrop-blur sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
                  Reno Platforms Engineering
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                  NoticeFlow
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                  A responsive notice board for creating, updating, and
                  publishing institution notices. Urgent notices are ordered by
                  the database and shown with a visible badge.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={() => void reload()} variant="secondary">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button onClick={openCreateForm}>
                  <Plus className="h-4 w-4" />
                  Add notice
                </Button>
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
                onAction={() => void reload()}
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
              <NoticeList
                notices={notices}
                onDelete={setDeleteTarget}
                onEdit={openEditForm}
              />
            )}
          </div>
        </div>
      </div>

      {isFormOpen ? (
        <NoticeForm
          key={editingNotice?.id ?? "new-notice"}
          isOpen={isFormOpen}
          isSaving={isMutating}
          notice={editingNotice}
          onClose={() => {
            setIsFormOpen(false);
            setEditingNotice(null);
          }}
          onSubmit={handleFormSubmit}
        />
      ) : null}
      <ConfirmDialog
        isDeleting={isMutating}
        notice={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
      />
      <Toast toast={toast} />
    </>
  );
}

type MetricProps = {
  label: string;
  value: string;
};

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white px-4 py-4">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="mt-1 text-2xl font-bold text-slate-950">{value}</dd>
    </div>
  );
}
