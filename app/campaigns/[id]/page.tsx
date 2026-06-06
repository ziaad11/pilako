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
  notes: string;
  follow_up_date: string | null;
  deal_value: number;
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
  const [savingNoteId, setSavingNoteId] = useState<number | null>(null);
  const [savingDealId, setSavingDealId] = useState<number | null>(null);

  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [outreachType, setOutreachType] = useState("Cold Email");
  const [aiText, setAiText] = useState("");
  const [generatingAi, setGeneratingAi] = useState(false);
  const [copied, setCopied] = useState(false);

  async function loadCampaignDetails() {
    try {
      setLoading(true);
      const response = await fetch(`/api/campaigns?campaign_id=${campaignId}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to load campaign");

      setCampaign(data.campaign);
      setLeads(data.leads || []);
      if (data.leads?.[0]?.id) setSelectedLeadId(data.leads[0].id);
    } catch (error) {
      console.error(error);
      alert("Failed to load campaign details.");
    } finally {
      setLoading(false);
    }
  }

  async function updateLeadCRM(
    leadId: number,
    updates: {
      status?: string;
      notes?: string;
      follow_up_date?: string | null;
      deal_value?: number;
    }
  ) {
    try {
      const response = await fetch("/api/campaigns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: leadId, ...updates }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update lead");
    } catch (error) {
      console.error(error);
      alert("Failed to update lead.");
      loadCampaignDetails();
    }
  }

  async function generateAIOutreach() {
    if (!campaign || !selectedLeadId) {
      alert("Select a lead first.");
      return;
    }

    const lead = leads.find((item) => item.id === selectedLeadId);

    if (!lead) {
      alert("Lead not found.");
      return;
    }

    try {
      setGeneratingAi(true);
      setAiText("");

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: lead.company,
          niche: campaign.niche,
          location: campaign.location,
          type: outreachType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate outreach");
      }

      setAiText(data.text || "");
    } catch (error) {
      console.error(error);
      alert("Failed to generate AI outreach.");
    } finally {
      setGeneratingAi(false);
    }
  }

  async function copyAIText() {
    if (!aiText) return;

    await navigator.clipboard.writeText(aiText);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1600);
  }

  async function updateLeadStatus(leadId: number, status: string) {
    setLeads((current) =>
      current.map((lead) => (lead.id === leadId ? { ...lead, status } : lead))
    );
    await updateLeadCRM(leadId, { status });
  }

  function updateLocalNotes(leadId: number, notes: string) {
    setLeads((current) =>
      current.map((lead) => (lead.id === leadId ? { ...lead, notes } : lead))
    );
  }

  async function saveLeadNotes(leadId: number, notes: string) {
    try {
      setSavingNoteId(leadId);
      await updateLeadCRM(leadId, { notes });
    } finally {
      setSavingNoteId(null);
    }
  }

  function updateLocalDeal(leadId: number, dealValue: number) {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === leadId ? { ...lead, deal_value: dealValue } : lead
      )
    );
  }

  async function saveDealValue(leadId: number, dealValue: number) {
    try {
      setSavingDealId(leadId);
      await updateLeadCRM(leadId, { deal_value: dealValue });
    } finally {
      setSavingDealId(null);
    }
  }

  async function updateFollowUpDate(leadId: number, date: string) {
    const value = date || null;

    setLeads((current) =>
      current.map((lead) =>
        lead.id === leadId ? { ...lead, follow_up_date: value } : lead
      )
    );

    await updateLeadCRM(leadId, { follow_up_date: value });
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
      if (!response.ok) throw new Error(data.error || "Delete failed");

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
      `${lead.company} ${lead.website} ${lead.email} ${lead.phone} ${lead.location} ${lead.status} ${lead.notes} ${lead.follow_up_date || ""}`
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

    if (sortBy === "deal-high") {
      result = [...result].sort(
        (a, b) => (b.deal_value || 0) - (a.deal_value || 0)
      );
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

  const pipelineValue = leads.reduce(
    (sum, lead) => sum + Number(lead.deal_value || 0),
    0
  );

  const today = new Date().toISOString().slice(0, 10);

  const followUpsDue = leads.filter(
    (lead) => lead.follow_up_date && lead.follow_up_date <= today
  ).length;

  function makeCSV(headers: string[], rows: string[][]) {
    return [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");
  }

  function downloadCSV(filename: string, csvContent: string) {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
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
      "Follow Up Date",
      "Deal Value",
      "Notes",
    ];

    const rows = filteredLeads.map((lead) => [
      lead.company,
      lead.website,
      lead.email,
      lead.phone,
      lead.location,
      lead.score,
      lead.status || "New",
      lead.follow_up_date || "",
      String(lead.deal_value || 0),
      lead.notes || "",
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
      <div className="mx-auto max-w-[1700px]">
        <nav className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Pilako
            </p>
            <h1 className="mt-2 text-4xl font-black">{campaign.name}</h1>
            <p className="mt-2 text-slate-400">
              Sales CRM workspace with pipeline, follow-ups, deal value, notes, and AI outreach.
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
          <div className="grid gap-5 md:grid-cols-6">
            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6 md:col-span-2">
              <p className="text-sm text-slate-400">Niche</p>
              <h3 className="mt-3 text-3xl font-black">{campaign.niche}</h3>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6 md:col-span-2">
              <p className="text-sm text-slate-400">Location</p>
              <h3 className="mt-3 text-3xl font-black">{campaign.location}</h3>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6">
              <p className="text-sm text-slate-400">Pipeline Value</p>
              <h3 className="mt-3 text-3xl font-black">
                ${pipelineValue.toLocaleString()}
              </h3>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6">
              <p className="text-sm text-slate-400">Follow-ups Due</p>
              <h3 className="mt-3 text-3xl font-black">{followUpsDue}</h3>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-5">
          {pipeline.map((item) => (
            <div
              key={item.status}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-cyan-300/40"
            >
              <p className="text-sm text-slate-400">{item.status}</p>
              <h3 className="mt-2 text-4xl font-black">{item.count}</h3>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-[2.5rem] border border-cyan-300/20 bg-cyan-300/[0.06] p-6">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h2 className="text-3xl font-black">AI Outreach Generator</h2>
              <p className="mt-2 text-slate-300">
                Generate cold emails, follow-ups, and LinkedIn messages for selected leads.
              </p>
            </div>

            <button
              onClick={generateAIOutreach}
              disabled={generatingAi || leads.length === 0}
              className="cursor-pointer rounded-2xl bg-cyan-300 px-6 py-4 font-black text-black transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generatingAi ? "Generating..." : "Generate Outreach"}
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
            <select
              value={selectedLeadId || ""}
              onChange={(e) => setSelectedLeadId(Number(e.target.value))}
              className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none focus:border-cyan-300/60"
            >
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.company}
                </option>
              ))}
            </select>

            <select
              value={outreachType}
              onChange={(e) => setOutreachType(e.target.value)}
              className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none focus:border-cyan-300/60"
            >
              <option value="Cold Email">Cold Email</option>
              <option value="Follow-up Email">Follow-up Email</option>
              <option value="LinkedIn Message">LinkedIn Message</option>
            </select>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-black">Generated Message</h3>

              <button
                onClick={copyAIText}
                disabled={!aiText}
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <div className="mt-5 min-h-[220px] whitespace-pre-wrap rounded-2xl bg-black/30 p-5 text-sm leading-7 text-slate-300">
              {aiText || "Select a lead and click Generate Outreach."}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h2 className="text-3xl font-black">Sales Pipeline Leads</h2>
              <p className="mt-2 text-slate-400">
                Search, sort, update CRM fields, schedule follow-ups, track deal value, and export.
              </p>
            </div>

            <div className="grid w-full gap-3 md:grid-cols-[1fr_auto_auto] lg:w-[980px]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company, email, status, notes, follow-up..."
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
                <option value="deal-high">Deal value</option>
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
            <table className="w-full min-w-[1750px] border-collapse text-left">
              <thead className="bg-white/[0.06] text-sm text-slate-300">
                <tr>
                  <th className="px-5 py-4">Company</th>
                  <th className="px-5 py-4">Website</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Follow-up</th>
                  <th className="px-5 py-4">Deal Value</th>
                  <th className="px-5 py-4">Notes</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-slate-400">
                      No leads found.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-t border-white/10 align-top transition hover:bg-cyan-300/10"
                    >
                      <td className="px-5 py-5 font-black">{lead.company}</td>

                      <td className="px-5 py-5">
                        {lead.website && lead.website !== "Not found" ? (
                          <a
                            href={
                              lead.website.startsWith("http")
                                ? lead.website
                                : `https://${lead.website}`
                            }
                            target="_blank"
                            className="font-bold text-cyan-300 hover:underline"
                          >
                            Website
                          </a>
                        ) : (
                          <span className="text-slate-500">Not found</span>
                        )}
                      </td>

                      <td className="px-5 py-5">
                        {lead.email &&
                        lead.email !== "Not found" &&
                        lead.email !== "Not provided" ? (
                          <a
                            href={`mailto:${lead.email}`}
                            className="font-bold text-cyan-300 hover:underline"
                          >
                            Email
                          </a>
                        ) : (
                          <span className="text-slate-500">{lead.email}</span>
                        )}
                      </td>

                      <td className="px-5 py-5">
                        {lead.phone &&
                        lead.phone !== "Not found" &&
                        lead.phone !== "Not provided" ? (
                          <a
                            href={`tel:${lead.phone}`}
                            className="font-bold text-cyan-300 hover:underline"
                          >
                            {lead.phone}
                          </a>
                        ) : (
                          <span className="text-slate-500">{lead.phone}</span>
                        )}
                      </td>

                      <td className="px-5 py-5 text-slate-300">{lead.location}</td>

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

                      <td className="px-5 py-5">
                        <input
                          type="date"
                          value={lead.follow_up_date || ""}
                          onChange={(e) =>
                            updateFollowUpDate(lead.id, e.target.value)
                          }
                          className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-cyan-300/60"
                        />
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex min-w-[180px] gap-2">
                          <input
                            type="number"
                            value={lead.deal_value || 0}
                            onChange={(e) =>
                              updateLocalDeal(
                                lead.id,
                                Number(e.target.value || 0)
                              )
                            }
                            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-cyan-300/60"
                          />
                          <button
                            onClick={() =>
                              saveDealValue(lead.id, Number(lead.deal_value || 0))
                            }
                            disabled={savingDealId === lead.id}
                            className="rounded-full bg-cyan-300 px-4 text-sm font-black text-black transition hover:bg-cyan-200 disabled:opacity-60"
                          >
                            {savingDealId === lead.id ? "Saving" : "Save"}
                          </button>
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex min-w-[320px] gap-3">
                          <textarea
                            value={lead.notes || ""}
                            onChange={(e) =>
                              updateLocalNotes(lead.id, e.target.value)
                            }
                            placeholder="Add notes..."
                            className="h-20 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300/60"
                          />

                          <button
                            onClick={() =>
                              saveLeadNotes(lead.id, lead.notes || "")
                            }
                            disabled={savingNoteId === lead.id}
                            className="h-11 rounded-full bg-cyan-300 px-4 text-sm font-black text-black transition hover:bg-cyan-200 disabled:opacity-60"
                          >
                            {savingNoteId === lead.id ? "Saving" : "Save"}
                          </button>
                        </div>
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