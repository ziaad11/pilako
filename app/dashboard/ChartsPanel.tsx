"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TopLocation = {
  location: string;
  leads: number;
  campaigns: number;
};

type TopNiche = {
  niche: string;
  leads: number;
  campaigns: number;
};

type RecentCampaign = {
  id: number;
  name: string;
  niche: string;
  location: string;
  leads_count: number;
  emails_count: number;
  created_at: string;
};

type Stats = {
  totalCampaigns: number;
  totalLeads: number;
  totalEmails: number;
  conversionRate: number;
  topLocations: TopLocation[];
  topNiches: TopNiche[];
  recentCampaigns: RecentCampaign[];
};

const COLORS = ["#67e8f9", "#a78bfa", "#34d399", "#fbbf24", "#fb7185"];

export default function ChartsPanel() {
  const { user } = useUser();

  const [stats, setStats] = useState<Stats>({
    totalCampaigns: 0,
    totalLeads: 0,
    totalEmails: 0,
    conversionRate: 0,
    topLocations: [],
    topNiches: [],
    recentCampaigns: [],
  });

  useEffect(() => {
    async function loadStats() {
      if (!user?.id) return;

      try {
        const response = await fetch(`/api/stats?user_id=${user.id}`);
        const data = await response.json();

        if (response.ok) {
          setStats({
            totalCampaigns: data.totalCampaigns || 0,
            totalLeads: data.totalLeads || 0,
            totalEmails: data.totalEmails || 0,
            conversionRate: data.conversionRate || 0,
            topLocations: data.topLocations || [],
            topNiches: data.topNiches || [],
            recentCampaigns: data.recentCampaigns || [],
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadStats();
  }, [user?.id]);

  const leadsGrowthData = useMemo(() => {
    const reversed = [...stats.recentCampaigns].reverse();

    if (reversed.length === 0) {
      return [
        { name: "Start", leads: 0 },
        { name: "Now", leads: 0 },
      ];
    }

    let runningTotal = 0;

    return reversed.map((campaign, index) => {
      runningTotal += campaign.leads_count || 0;

      return {
        name: `C${index + 1}`,
        leads: runningTotal,
      };
    });
  }, [stats.recentCampaigns]);

  const locationChartData = stats.topLocations.map((item) => ({
    name: item.location,
    leads: item.leads,
  }));

  const nicheChartData = stats.topNiches.map((item) => ({
    name: item.niche,
    value: item.leads,
  }));

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-3">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 lg:col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black">Leads Growth</h2>
            <p className="mt-2 text-sm text-slate-400">
              Cumulative leads from your latest saved campaigns.
            </p>
          </div>

          <span className="rounded-full bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-200">
            Live
          </span>
        </div>

        <div className="mt-8 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={leadsGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "16px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="leads" radius={[12, 12, 0, 0]} fill="#67e8f9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        <h2 className="text-2xl font-black">Top Niches</h2>
        <p className="mt-2 text-sm text-slate-400">
          Lead distribution by niche.
        </p>

        <div className="mt-6 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={nicheChartData}
                cx="50%"
                cy="50%"
                outerRadius={105}
                dataKey="value"
                label
              >
                {nicheChartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "16px",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 lg:col-span-3">
        <h2 className="text-2xl font-black">Leads by Location</h2>
        <p className="mt-2 text-sm text-slate-400">
          Compare performance across your strongest markets.
        </p>

        <div className="mt-8 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={locationChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "16px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="leads" radius={[12, 12, 0, 0]} fill="#a78bfa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}