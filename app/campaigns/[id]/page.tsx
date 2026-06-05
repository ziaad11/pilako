"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Campaign = {
  id: number;
  name: string;
  niche: string;
  location: string;
  leads_count: number;
  emails_count: number;
  created_at: string;
};

type Lead = {
  id: number;
  campaign_id: number;
  company: string;
  website: string;
  email: string;
  phone: string;
  location: string;
  score: string;
};

export default function CampaignDetailsPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadCampaignDetails() {
    try {
      setLoading(true);

      const response = await fetch(`/api/campaigns?campaign_id=${campaignId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load campaign");
      }

      setCampaign(data.campaign);
      setLeads(data.leads || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load campaign details.");
    } finally {
      setLoading(false);
    }
  }

  function makeCSV(headers: string[], rows: string[][]) {
    return [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");
  }

  function downloadCSV(filename: string, csvContent: string) {
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  }

  function exportLeadsCSV() {
    const headers = ["Company", "Website", "Email", "Phone", "Location", "Score"];

    const rows = leads.map((lead) => [
      lead.company,
      lead.website,
      lead.email,
      lead.phone,
      lead.location,
      lead.score,
    ]);

    downloadCSV(`pilako-campaign-${campaignId}-leads.csv`, makeCSV(headers, rows));
  }

  useEffect(() => {
    loadCampaignDetails();
  }, [campaignId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020617] text-white">
        <p className="text-slate-400">Loading campaign...</p>
      </main>
    );
  }

  if (!campaign) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020617] text-white">
        <p className="text-slate-400">Campaign not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Pilako
            </p>
            <h1 className="mt-2 text-3xl font-black">{campaign.name}</h1>
          </div>

          <a
            href="/campaigns"
            className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-bold transition hover:bg-white hover:text-black"
          >
            Back to Campaigns
          </a>
        </nav>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">Niche</p>
            <p className="mt-2 text-2xl font-black">{campaign.niche}</p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">Location</p>
            <p className="mt-2 text-2xl font-black">{campaign.location}</p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">Leads</p>
            <p className="mt-2 text-2xl font-black">{leads.length}</p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">Emails</p>
            <p className="mt-2 text-2xl font-black">{campaign.emails_count}</p>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-black">Saved Leads</h2>
              <p className="mt-2 text-slate-400">
                All leads saved inside this campaign.
              </p>
            </div>

            <button
              onClick={exportLeadsCSV}
              disabled={leads.length === 0}
              className="cursor-pointer rounded-full bg-cyan-300 px-5 py-3 font-black text-black transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Export CSV
            </button>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead className="bg-white/[0.06] text-sm text-slate-300">
                <tr>
                  <th className="px-5 py-4">Company</th>
                  <th className="px-5 py-4">Website</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">Score</th>
                </tr>
              </thead>

              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                      No leads saved for this campaign.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-t border-white/10 transition hover:bg-white/[0.04]"
                    >
                      <td className="px-5 py-4 font-bold">{lead.company}</td>
                      <td className="px-5 py-4 text-cyan-300">{lead.website}</td>
                      <td className="px-5 py-4 text-slate-300">{lead.email}</td>
                      <td className="px-5 py-4 text-slate-300">{lead.phone}</td>
                      <td className="px-5 py-4 text-slate-300">{lead.location}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-sm font-bold text-cyan-200">
                          {lead.score}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}