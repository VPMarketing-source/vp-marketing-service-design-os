import { Badge } from "@/components/ui/badge";
import { CardDescription, CardTitle } from "@/components/ui/card";

export function SectionBlock({
  id,
  title,
  description,
  progress,
  children
}: {
  id: string;
  title: string;
  description: string;
  progress: number;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3" id={`section-${id}`}>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge tone="brand">{progress}%</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

