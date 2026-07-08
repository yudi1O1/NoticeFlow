import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createNotice,
  deleteNotice,
  fetchNotices,
  updateNotice,
} from "@/services/notices";
import type { Notice, NoticeInput } from "@/types/notice";
import { getErrorMessage } from "@/utils/errors";

export function useNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const loadNotices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setNotices(await fetchNotices());
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadNotices();
    });
  }, [loadNotices]);

  const create = useCallback(async (input: NoticeInput) => {
    setIsMutating(true);
    try {
      const notice = await createNotice(input);
      await loadNotices();
      return notice;
    } finally {
      setIsMutating(false);
    }
  }, [loadNotices]);

  const update = useCallback(async (id: string, input: NoticeInput) => {
    setIsMutating(true);
    try {
      const notice = await updateNotice(id, input);
      await loadNotices();
      return notice;
    } finally {
      setIsMutating(false);
    }
  }, [loadNotices]);

  const remove = useCallback(async (id: string) => {
    setIsMutating(true);
    const previous = notices;
    setNotices((current) => current.filter((notice) => notice.id !== id));

    try {
      await deleteNotice(id);
    } catch (deleteError) {
      setNotices(previous);
      throw deleteError;
    } finally {
      setIsMutating(false);
    }
  }, [notices]);

  return useMemo(
    () => ({
      notices,
      isLoading,
      error,
      isMutating,
      reload: loadNotices,
      create,
      update,
      remove,
    }),
    [create, error, isLoading, isMutating, loadNotices, notices, remove, update],
  );
}
