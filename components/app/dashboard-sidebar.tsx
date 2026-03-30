import { cn } from "@/lib/utils";

export type DashboardSidebarItem = {
  id: string;
  label: string;
  tone: "orange" | "blue";
};

export type DashboardSidebarGroup = {
  id: string;
  label: string;
  items: DashboardSidebarItem[];
};

function itemClasses(tone: DashboardSidebarItem["tone"], active: boolean) {
  return cn(
    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] transition",
    active ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/6 hover:text-white",
    tone === "orange" ? "[&_.menu-dot]:bg-orange-400" : "[&_.menu-dot]:bg-blue-400"
  );
}

export function DashboardSidebar({
  title,
  subtitle,
  groups,
  activeItemId,
  onSelect
}: {
  title: string;
  subtitle: string;
  groups: DashboardSidebarGroup[];
  activeItemId: string;
  onSelect: (itemId: string) => void;
}) {
  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col bg-slate-950 text-white">
      <div className="border-b border-white/10 px-6 py-4">
        <h2 className="font-heading text-xl font-bold text-white">{title}</h2>
        <p className="mt-2 text-[13px] text-slate-400">{subtitle}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-4">
          {groups.map((group) => (
            <div className="space-y-3" key={group.id}>
              <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    className={itemClasses(item.tone, item.id === activeItemId)}
                    key={item.id}
                    onClick={() => onSelect(item.id)}
                    type="button"
                  >
                    <span className="menu-dot h-2.5 w-2.5 rounded-full" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
