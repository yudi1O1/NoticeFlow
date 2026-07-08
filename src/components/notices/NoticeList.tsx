import { NoticeCard } from "@/components/notices/NoticeCard";
import type { Notice } from "@/types/notice";

type NoticeListProps = {
  notices: Notice[];
  onEdit: (notice: Notice) => void;
  onDelete: (notice: Notice) => void;
};

export function NoticeList({ notices, onEdit, onDelete }: NoticeListProps) {
  return (
    <section
      aria-label="Notices"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {notices.map((notice) => (
        <NoticeCard
          key={notice.id}
          notice={notice}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </section>
  );
}
