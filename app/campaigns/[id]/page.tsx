"use client";

import { useEffect, useMemo, useState } from "react";
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
  status: string;
};

const statuses = ["New", "Contacted", "Interested", "Meeting Booked", "Closed"];

export default function CampaignDetailsPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("company");

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

  async function updateLeadStatus(leadId: number, status: string) {
    try {
      setLeads((current) =>
        current.map((lead) =>
          lead.id === leadId ? { ...lead, status } : lead
        )
      );

      const response = await fetch("/api/campaigns", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lead_id: leadId,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update lead status.");
      loadCampaignDetails();
    }
  }

  async function deleteCampaign() {
    const confirmed = confirm("Are you sure you want to delete this campaign?");
    if (!confirmed) return;

    try {
      setDeleting(true);

      const response = await fetch(`/api/campaigns?campaign_id=${campaignId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Delete failed");
      }

      window.location.href = "/campaigns";
    } catch (error) {
      console.error(error);
      alert("Failed to delete campaign.");
    } finally {
      setDeleting(false);
    }
  }

  const filteredLeads = useMemo(() => {
    const query = search.toLowerCase().trim();

    let result = leads.filter((lead) =>
      `${lead.company} ${lead.website} ${lead.email} ${lead.phone} ${lead.location} ${lead.status}`
        .toLowerCase()
        .includes(query)
    );

    if (sortBy === "company") {
      result = [...result].sort((a, b) => a.company.localeCompare(b.company));
    }

    if (sortBy === "email") {
      result = [...result].sort((a, b) => a.email.localeCompare(b.email));
    }

    if (sortBy === "location") {
      result = [...result].sort((a, b) => a.location.localeCompare(b.location));
    }

    if (sortBy === "status") {
      result = [...result].sort((a, b) => a.status.localeCompare(b.status));
    }

    return result;
  }, [leads, search, sortBy]);

  const emailCount = leads.filter(
    (lead) =>
      lead.email &&
      lead.email !== "Not found" &&
      lead.email !== "Not provided"
  ).length;

  const pipeline = statuses.map((status) => ({
    status,
    count: leads.filter((lead) => (lead.status || "New") === status).length,
  }));

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
    const headers = [
      "Company",
      "Website",
      "Email",
      "Phone",
      "Location",
      "Score",
      "Status",
    ];

    const rows = filteredLeads.map((lead) => [
      lead.company,
      lead.website,
      lead.email,
      lead.phone,
      lead.location,
      lead.score,
      lead.status || "New",
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
      <div className="mx-auto max-w-[1500px]">
        <nav className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Pilako
            </p>
            <h1 className="mt-2 text-4xl font-black">{campaign.name}</h1>
            <p className="mt-2 text-slate-400">
              Campaign intelligence, saved leads, pipeline status, and export-ready contacts.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={deleteCampaign}
              disabled={deleting}
              className="cursor-pointer rounded-full bg-red-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete Campaign"}
            </button>

            <a
              href="/campaigns"
              className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold transition hover:bg-white hover:text-black"
            >
              Back to Campaigns
            </a>
          </div>
        </nav>

        <section className="mt-10 rounded-[2.5rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-white/[0.04] to-fuchsia-500/10 p-6 shadow-[0_0_80px_rgba(34,211,238,0.10)]">
          <div className="grid gap-5 md:grid-cols-4">
            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6">
              <p className="text-sm text-slate-400">Niche</p>
              <h3 className="mt-3 text-3xl font-black">{campaign.niche}</h3>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6">
              <p className="text-sm text-slate-400">Location</p>
              <h3 className="mt-3 text-3xl font-black">{campaign.location}</h3>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6">
              <p className="text-sm text-slate-400">Saved Leads</p>
              <h3 className="mt-3 text-3xl font-black">{leads.length}</h3>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6">
              <p className="text-sm text-slate-400">Emails Found</p>
              <h3 className="mt-3 text-3xl font-black">{emailCount}</h3>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-5">
          {pipeline.map((item) => (
            <div
              key={item.status}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="text-sm text-slate-400">{item.status}</p>
              <h3 className="mt-2 text-4xl font-black">{item.count}</h3>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h2 className="text-3xl font-black">Saved Leads</h2>
              <p className="mt-2 text-slate-400">
                Search, sort, update status, and export all contacts inside this campaign.
              </p>
            </div>

            <div className="grid w-full gap-3 md:grid-cols-[1fr_auto_auto] lg:w-[860px]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company, website, email, phone, location, status..."
                className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none placeholder:text-slate-500 focus:border-cyan-300/60"
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none focus:border-cyan-300/60"
              >
                <option value="company">Company</option>
                <option value="email">Email</option>
                <option value="location">Location</option>
                <option value="status">Status</option>
              </select>

              <button
                onClick={exportLeadsCSV}
                disabled={filteredLeads.length === 0}
                className="cursor-pointer rounded-2xl bg-cyan-300 px-6 py-4 font-black text-black transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Export CSV
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[1180px] border-collapse text-left">
              <thead className="bg-white/[0.06] text-sm text-slate-300">
                <tr>
                  <th className="px-5 py-4">Company</th>
                  <th className="px-5 py-4">Website</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">Score</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                      No leads found.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-t border-white/10 transition hover:bg-cyan-300/10"
                    >
                      <td className="px-5 py-5 font-black">{lead.company}</td>
                      <td className="px-5 py-5 text-cyan-300">{lead.website}</td>
                      <td className="px-5 py-5 text-slate-300">{lead.email}</td>
                      <td className="px-5 py-5 text-slate-300">{lead.phone}</td>
                      <td className="px-5 py-5 text-slate-300">{lead.location}</td>
                      <td className="px-5 py-5">
                        <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-sm font-bold text-cyan-200">
                          {lead.score}
                        </span>
                      </td>
                      <td className="px-5 py-5">
                        <select
                          value={lead.status || "New"}
                          onChange={(e) =>
                            updateLeadStatus(lead.id, e.target.value)
                          }
                          className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-bold outline-none focus:border-cyan-300/60"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
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