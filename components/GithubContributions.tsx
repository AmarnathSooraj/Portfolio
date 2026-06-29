"use client";

import { useState, useEffect } from "react";

type Day = {
  count: number;
  date: string;
};

type Week = Day[];

const GITHUB_USER = "AmarnathSooraj";

const CONTRIBUTIONS_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

const LEVEL_COLORS = [
  "bg-[#161b22]",
  "bg-[#0e4429]",
  "bg-[#006d32]",
  "bg-[#26a641]",
  "bg-[#39d353]",
];

const LEVEL_BORDER = [
  "border-[#161b22]",
  "border-[#0e4429]",
  "border-[#006d32]",
  "border-[#26a641]",
  "border-[#39d353]",
];

function ContributionBlock({ level }: { level: number }) {
  return (
    <div
      className={`w-3 h-3 rounded-sm ${LEVEL_COLORS[level]} border ${LEVEL_BORDER[level]}`}
      style={{ minWidth: "10px", minHeight: "10px" }}
    />
  );
}

function monthLabel(weeks: Week[]): string[] {
  const labels: string[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    if (week.length === 0) return;
    const firstDay = week[0];
    if (!firstDay) return;
    const date = new Date(firstDay.date);
    const month = date.getMonth();
    if (month !== lastMonth) {
      labels[i] = date.toLocaleString("default", { month: "short" });
      lastMonth = month;
    }
  });
  return labels;
}

export default function GithubContributions() {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContributions() {
      const now = new Date();
      const from = new Date(now);
      from.setFullYear(from.getFullYear() - 1);
      const toStr = now.toISOString();
      const fromStr = from.toISOString();

      try {
        const res = await fetch("/api/github/contributions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: CONTRIBUTIONS_QUERY,
            variables: {
              username: GITHUB_USER,
              from: fromStr,
              to: toStr,
            },
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          let msg = `GitHub API error (${res.status})`;
          try {
            const errJson = JSON.parse(errText);
            if (errJson?.message) msg = errJson.message;
          } catch {}
          throw new Error(msg);
        }

        const json = await res.json();

        if (json.errors) {
          throw new Error(json.errors[0]?.message || "GraphQL error");
        }

        const calendar =
          json.data?.user?.contributionsCollection?.contributionCalendar;
        if (!calendar) throw new Error("No contribution data found");

        setTotal(calendar.totalContributions);
        setWeeks(
          calendar.weeks.map(
            (w: { contributionDays: { contributionCount: number; date: string }[] }) =>
              w.contributionDays.map((d) => ({
                count: d.contributionCount,
                date: d.date,
              }))
          )
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchContributions();
  }, []);

  const dayNames = ["", "Mon", "", "Wed", "", "Fri", ""];

  if (loading) {
    return (
      <div className="text-[#66b3ff] py-2" style={{ fontSize: "clamp(0.8125rem,2.5vw,1.125rem)" }}>
        Fetching contribution data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-[#ff3355] py-2" style={{ fontSize: "clamp(0.8125rem,2.5vw,1.125rem)" }}>
        Error: {error}
      </div>
    );
  }

  const labels = monthLabel(weeks);

  return (
    <div className="py-3">
      <div className="text-[#ff69b4] mb-2" style={{ fontSize: "clamp(0.8125rem,2.5vw,1.125rem)" }}>
        <span className="text-[#66ff99]">github.com/{GITHUB_USER}</span>
        {" — "}
        <span className="text-white">{total.toLocaleString()}</span> contributions in the last year
      </div>

      <div className="flex gap-1">
        <div className="flex flex-col gap-0.5 pt-5 pr-1">
          {dayNames.map((day, i) => (
            <div
              key={i}
              className="text-[#555] text-[10px] leading-3 h-3"
              style={{ minWidth: "24px", textAlign: "right" as const }}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <div className="flex gap-0.5">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {labels[wi] && (
                  <div className="text-[#555] text-[10px] leading-3 h-3">
                    {labels[wi]}
                  </div>
                )}
                {week.length === 0
                  ? Array.from({ length: 7 }).map((_, di) => (
                      <ContributionBlock key={di} level={0} />
                    ))
                  : week.map((day, di) => (
                      <div key={di} title={`${day.count} contributions on ${day.date}`}>
                        <ContributionBlock level={getLevel(day.count)} />
                      </div>
                    ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-2 text-[10px] text-[#555]">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <ContributionBlock key={level} level={level} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
