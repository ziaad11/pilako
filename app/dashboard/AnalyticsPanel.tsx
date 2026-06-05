"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

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

export default function AnalyticsPanel() {
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

  const maxLocationLeads = Math.max(
    ...stats.topLocations.map((item) => item.leads),
    1
  );

  const maxNicheLeads = Math.max(
    ...stats.topNiches.map((item) => item.leads),
    1
  );

  return (
    <section className="mt-8 space-y-8">
      <div className="rounded-[2.5rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-white/[0.04] to-fuchsia-500/10 p-6 shadow-[0_0_80px_rgba(34,211,238,0.12)]">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
              Analytics
            </p>
            <h2 className="mt-3 text-4xl font-black">
              Sales intelligence overview
            </h2>
            <p className="mt-3 max-w-2xl text-slate-400">
              Track saved campaigns, leads, emails, locations, niches, and recent activity.
            </p>
          </div>

          <a
            href="/campaigns"
            className="rounded-full bg-cyan-300 px-6 py-3 font-black text-black transition hover:bg-cyan-200"
          >
            View Campaigns
          </a>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {[
            ["Total Campaigns", stats.totalCampaigns, "Saved campaigns"],
            ["Total Leads", stats.totalLeads, "Database leads"],
            ["Emails Found", stats.totalEmails, "Available contacts"],
            ["Conversion Rate", `${stats.conversionRate}%`, "Emails / leads"],
          ].map(([label, value, sub]) => (
            <div
              key={label}
              className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 p-6 transition hover:-translate-y-1 hover:border-cyan-300/40"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-300/20 blur-3xl" />
              <p className="text-sm text-slate-400">{label}</p>
              <h3 className="mt-4 text-5xl font-black">{value}</h3>
              <p className="mt-3 text-xs uppercase tracking-[0.22em] text-cyan-300">
                {sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">Top Locations</h2>
          <p className="mt-2 text-sm text-slate-400">
            Best markets by saved leads.
          </p>

          <div className="mt-6 space-y-5">
            {stats.topLocations.length === 0 ? (
              <p className="text-slate-500">No location data yet.</p>
            ) : (
              stats.topLocations.map((item) => (
                <div key={item.location}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-bold">{item.location}</span>
                    <span className="text-cyan-300">{item.leads} leads</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10">
                    <div
                      className="h-3 rounded-full bg-cyan-300"
                      style={{
                        width: `${Math.max(
                          8,
                          (item.leads / maxLocationLeads) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">Top Niches</h2>
          <p className="mt-2 text-sm text-slate-400">
            Most active lead categories.
          </p>

          <div className="mt-6 space-y-5">
            {stats.topNiches.length === 0 ? (
              <p className="text-slate-500">No niche data yet.</p>
            ) : (
              stats.topNiches.map((item) => (
                <div key={item.niche}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-bold">{item.niche}</span>
                    <span className="text-cyan-300">{item.leads} leads</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10">
                    <div
                      className="h-3 rounded-full bg-cyan-300"
                      style={{
                        width: `${Math.max(
                          8,
                          (item.leads / maxNicheLeads) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">Recent Activity</h2>
          <p className="mt-2 text-sm text-slate-400">
            Latest saved campaigns.
          </p>

          <div className="mt-6 space-y-4">
            {stats.recentCampaigns.length === 0 ? (
              <p className="text-slate-500">No recent campaigns yet.</p>
            ) : (
              stats.recentCampaigns.map((campaign) => (
                <a
                  key={campaign.id}
                  href={`/campaigns/${campaign.id}`}
                  className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
                >
                  <p className="font-black">{campaign.name}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {campaign.leads_count} leads • {campaign.location}
                  </p>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}