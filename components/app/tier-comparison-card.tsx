import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export function TierComparisonCard({
  title,
  accent,
  meaning,
  cadence,
  owner,
  output,
  scope
}: {
  title: string;
  accent: string;
  meaning: string;
  cadence: string;
  owner: string;
  output: string;
  scope: string[];
}) {
  return (
    <Card className="h-full overflow-hidden p-0">
      <div className="border-b border-[var(--line)] px-5 py-4" style={{ backgroundColor: accent }}>
        <div className="flex items-center justify-between gap-4">
          <CardTitle>{title}</CardTitle>
          <Badge tone="accent">Tier</Badge>
        </div>
        <CardDescription className="mt-3 max-w-sm leading-6 text-[var(--foreground)]/78">{meaning}</CardDescription>
      </div>
      <div className="space-y-5 p-5 text-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Cadence</p>
            <p className="mt-2 leading-6">{cadence}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Owner</p>
            <p className="mt-2 leading-6">{owner}</p>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Scope highlights</p>
          <ul className="mt-2 space-y-2 text-[var(--foreground)]/88">
            {scope.slice(0, 4).map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Client output</p>
          <p className="mt-2 leading-6 text-[var(--foreground)]/88">{output}</p>
        </div>
      </div>
    </Card>
  );
}
