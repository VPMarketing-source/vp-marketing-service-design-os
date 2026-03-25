import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  hint
}: {
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <Card className="bg-[rgba(255,255,255,0.64)]">
      <CardDescription className="uppercase tracking-[0.18em]">{label}</CardDescription>
      <CardTitle className="mt-3 text-3xl">{value}</CardTitle>
      <p className="mt-2 text-sm text-[var(--muted)]">{hint}</p>
    </Card>
  );
}

