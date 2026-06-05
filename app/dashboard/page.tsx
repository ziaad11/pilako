"use client";

import { useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";

type Lead = {
  id: number;
  company: string;
  website: string;
  email: string;
  phone: string;
  location: string;
  score: string;
};

type BulkEmail = {
  leadId: number;
  company: string;
  email: string;
  subject: string;
  message: string;
};

const demoLeads: Lead[] = [
  {
    id: 1,
    company: "Miami Yacht Services",
    website: "miamiyachtservices.com",
    email: "Not found",
    phone: "+1 305 555 0182",
    location: "Miami, USA",
    score: "94%",
  },
  {
    id: 2,
    company: "Atlantic Marine Repair",
    website: "atlanticmarinerepair.com",
    email: "Not found",
    phone: "+1 305 555 0144",
    location: "Miami, USA",
    score: "91%",
  },
  {
    id: 3,
    company: "Biscayne Yacht Care",
    website: "biscayneyachtcare.com",
    email: "Not found",
    phone: "+1 305 555 0199",
    location: "Miami, USA",
    score: "88%",
  },
];

export default function Dashboard() {
  const { user } = useUser();

  const [niche, setNiche] = useState("law firms");
  const [location, setLocation] = useState("Dubai");
  const [leads, setLeads] = useState<Lead[]>(demoLeads);
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 2, 3]);

  const [copied, setCopied] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [loadingOutreach, setLoadingOutreach] = useState(false);
  const [loadingBulk, setLoadingBulk] = useState(false);
  const [savingCampaign, setSavingCampaign] = useState(false);

  const [bulkEmails, setBulkEmails] = useState<BulkEmail[]>([]);

  const [newLead, setNewLead] = useState({
    company: "",
    website: "",
    email: "",
    phone: "",
    location: "",
  });

  const [outreach, setOutreach] = useState({
    cold: "",
    follow1: "",
    follow2: "",
  });

  const selectedLeads = leads.filter((lead) => selectedIds.includes(lead.id));

  const stats = useMemo(() => {
    return {
      total: leads.length,
      emails: leads.filter(
        (lead) =>
          lead.email &&
          lead.email !== "Not found" &&
          lead.email !== "Not provided"
      ).length,
      websites: leads.filter(
        (lead) =>
          lead.website &&
          lead.website !== "Not found" &&
          lead.website !== "Not provided"
      ).length,
      selected: selectedLeads.length,
    };
  }, [leads, selectedLeads.length]);

  const buttonBase =
    "cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0";

  async function handleSearch() {
    try {
      setLoadingSearch(true);

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ niche, location }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch leads");
      }

      const newLeads: Lead[] = data.leads || [];

      setLeads(newLeads);
      setSelectedIds(newLeads.map((lead) => lead.id));
      setOutreach({ cold: "", follow1: "", follow2: "" });
      setBulkEmails([]);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch real leads. Please check SERPAPI_API_KEY.");
    } finally {
      setLoadingSearch(false);
    }
  }

  async function findEmails() {
    try {
      setLoadingEmails(true);

      const response = await fetch("/api/email-finder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leads: selectedLeads }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to find emails");
      }

      const enrichedLeads: Lead[] = data.leads || [];

      setLeads((current) =>
        current.map((lead) => {
          const enriched = enrichedLeads.find((item) => item.id === lead.id);
          return enriched || lead;
        })
      );
    } catch (error) {
      console.error(error);
      alert("Failed to find emails. Some websites may block public scraping.");
    } finally {
      setLoadingEmails(false);
    }
  }

  function addLead() {
    if (!newLead.company.trim()) return;

    const id = Date.now();

    const lead: Lead = {
      id,
      company: newLead.company.trim(),
      website: newLead.website.trim() || "Not provided",
      email: newLead.email.trim() || "Not provided",
      phone: newLead.phone.trim() || "Not provided",
      location: newLead.location.trim() || location || "Not provided",
      score: "New",
    };

    setLeads((current) => [lead, ...current]);
    setSelectedIds((current) => [id, ...current]);

    setNewLead({
      company: "",
      website: "",
      email: "",
      phone: "",
      location: "",
    });
  }

  function toggleLead(id: number) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((leadId) => leadId !== id)
        : [...current, id]
    );
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

  function exportCSV() {
    const headers = ["Company", "Website", "Email", "Phone", "Location", "Score"];

    const rows = selectedLeads.map((lead) => [
      lead.company,
      lead.website,
      lead.email,
      lead.phone,
      lead.location,
      lead.score,
    ]);

    downloadCSV("pilako-leads.csv", makeCSV(headers, rows));
  }

  function exportBulkCSV() {
    const headers = ["Company", "Email", "Subject", "Message"];

    const rows = bulkEmails.map((item) => [
      item.company,
      item.email,
      item.subject,
      item.message,
    ]);

    downloadCSV("pilako-outreach.csv", makeCSV(headers, rows));
  }

  async function saveCampaign() {
    try {
      if (!user?.id) {
        alert("Please sign in first.");
        return;
      }

      setSavingCampaign(true);

      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          name: `${niche} - ${location}`,
          niche,
          location,
          leads_count: leads.length,
          emails_count: stats.emails,
          leads: leads,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save campaign");
      }

      alert("Campaign saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save campaign.");
    } finally {
      setSavingCampaign(false);
    }
  }

  async function generateOutreach() {
    try {
      setLoadingOutreach(true);

      const targetCompany = selectedLeads[0]?.company || "the selected company";

      const response = await fetch("/api/outreach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          niche,
          location,
          company: targetCompany,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate outreach");
      }

      setOutreach({
        cold: data.cold || "",
        follow1: data.follow1 || "",
        follow2: data.follow2 || "",
      });
    } catch (error) {
      console.error(error);

      setOutreach({
        cold: "Error: Pilako could not generate outreach right now. Please check your OpenAI API key or try again.",
        follow1: "",
        follow2: "",
      });
    } finally {
      setLoadingOutreach(false);
    }
  }

  async function generateBulkOutreach() {
    try {
      setLoadingBulk(true);
      setBulkEmails([]);

      const response = await fetch("/api/bulk-outreach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          niche,
          location,
          leads: selectedLeads,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate bulk outreach");
      }

      setBulkEmails(data.emails || []);
    } catch (error) {
      console.error(error);
      alert("Failed to generate bulk outreach. Please try again.");
    } finally {
      setLoadingBulk(false);
    }
  }

  async function copyText(label: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);

    setTimeout(() => {
      setCopied("");
    }, 1600);
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <nav className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Pilako
            </p>
            <h1 className="mt-2 text-3xl font-black">AI Sales Employee</h1>
          </div>

          <div className="flex gap-3">
            <a
              href="/campaigns"
              className={`${buttonBase} rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-300 hover:text-black`}
            >
              My Campaigns
            </a>

            <a
              href="/"
              className={`${buttonBase} rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-bold hover:bg-white hover:text-black`}
            >
              Back Home
            </a>
          </div>
        </nav>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">Find real leads</h2>
          <p className="mt-2 text-slate-400">
            Search businesses, find public emails, export CSV, and generate AI outreach.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none placeholder:text-slate-500 focus:border-cyan-300/60"
              placeholder="Niche e.g. law firms"
            />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none placeholder:text-slate-500 focus:border-cyan-300/60"
              placeholder="Location e.g. Dubai"
            />
            <button
              onClick={handleSearch}
              disabled={loadingSearch}
              className={`${buttonBase} rounded-2xl bg-cyan-300 px-8 py-4 font-black text-black shadow-[0_0_35px_rgba(103,232,249,0.25)] hover:bg-cyan-200 hover:shadow-[0_0_55px_rgba(103,232,249,0.45)] disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {loadingSearch ? "Searching..." : "Search Leads"}
            </button>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">Add your own lead</h2>
          <p className="mt-2 text-slate-400">
            Add leads manually when you already have a company, website, or email.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-5">
            <input
              value={newLead.company}
              onChange={(e) =>
                setNewLead((current) => ({ ...current, company: e.target.value }))
              }
              className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none placeholder:text-slate-500 focus:border-cyan-300/60"
              placeholder="Company name"
            />
            <input
              value={newLead.website}
              onChange={(e) =>
                setNewLead((current) => ({ ...current, website: e.target.value }))
              }
              className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none placeholder:text-slate-500 focus:border-cyan-300/60"
              placeholder="Website"
            />
            <input
              value={newLead.email}
              onChange={(e) =>
                setNewLead((current) => ({ ...current, email: e.target.value }))
              }
              className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none placeholder:text-slate-500 focus:border-cyan-300/60"
              placeholder="Email"
            />
            <input
              value={newLead.phone}
              onChange={(e) =>
                setNewLead((current) => ({ ...current, phone: e.target.value }))
              }
              className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none placeholder:text-slate-500 focus:border-cyan-300/60"
              placeholder="Phone"
            />
            <button
              onClick={addLead}
              className={`${buttonBase} rounded-2xl bg-white px-6 py-4 font-black text-black hover:bg-cyan-200`}
            >
              Add Lead
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-4">
          {[
            [String(stats.total), "Leads found"],
            [String(stats.emails), "Emails found"],
            [String(stats.websites), "Websites found"],
            [String(stats.selected), "Selected leads"],
          ].map(([number, label]) => (
            <div
              key={label}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.07]"
            >
              <p className="text-3xl font-black">{number}</p>
              <p className="mt-2 text-sm text-slate-400">{label}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-black">Lead results</h2>
              <p className="mt-2 text-slate-400">
                Select leads, find emails, export CSV, or generate outreach.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={findEmails}
                disabled={loadingEmails || selectedLeads.length === 0}
                className={`${buttonBase} rounded-full border border-cyan-300/40 bg-cyan-300/10 px-5 py-3 font-bold text-cyan-100 hover:bg-cyan-300 hover:text-black disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {loadingEmails ? "Finding Emails..." : "Find Emails"}
              </button>

              <button
                onClick={exportCSV}
                disabled={selectedLeads.length === 0}
                className={`${buttonBase} rounded-full border border-white/15 px-5 py-3 font-bold hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60`}
              >
                Export Leads CSV
              </button>

              <button
                onClick={generateOutreach}
                disabled={loadingOutreach || selectedLeads.length === 0}
                className={`${buttonBase} rounded-full bg-white px-5 py-3 font-black text-black hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {loadingOutreach ? "Generating..." : "Generate AI Outreach"}
              </button>

              <button
                onClick={generateBulkOutreach}
                disabled={loadingBulk || selectedLeads.length === 0}
                className={`${buttonBase} rounded-full bg-cyan-300 px-5 py-3 font-black text-black hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {loadingBulk ? "Generating Bulk..." : "Generate Bulk Outreach"}
              </button>

              <button
                onClick={saveCampaign}
                disabled={savingCampaign || leads.length === 0}
                className={`${buttonBase} rounded-full border border-green-400/40 bg-green-400/10 px-5 py-3 font-bold text-green-200 hover:bg-green-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {savingCampaign ? "Saving..." : "Save Campaign"}
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead className="bg-white/[0.06] text-sm text-slate-300">
                <tr>
                  <th className="px-5 py-4">Select</th>
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
                    <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                      No leads found. Try another niche or location.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-t border-white/10 transition-colors duration-200 hover:bg-white/[0.04]"
                    >
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(lead.id)}
                          onChange={() => toggleLead(lead.id)}
                          className="h-5 w-5 cursor-pointer accent-cyan-300"
                        />
                      </td>
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

        <section className="mt-8 rounded-[2rem] border border-cyan-300/20 bg-cyan-300/[0.06] p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-black">Bulk outreach</h2>
              <p className="mt-2 text-slate-300">
                Generate personalized emails for selected leads and export them as CSV.
              </p>
            </div>

            <button
              onClick={exportBulkCSV}
              disabled={bulkEmails.length === 0}
              className={`${buttonBase} rounded-full bg-white px-5 py-3 font-black text-black hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60`}
            >
              Export Outreach CSV
            </button>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead className="bg-white/[0.06] text-sm text-slate-300">
                <tr>
                  <th className="px-5 py-4">Company</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Subject</th>
                  <th className="px-5 py-4">Message</th>
                </tr>
              </thead>
              <tbody>
                {bulkEmails.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-slate-400">
                      Click “Generate Bulk Outreach” to create personalized messages.
                    </td>
                  </tr>
                ) : (
                  bulkEmails.map((item) => (
                    <tr
                      key={`${item.leadId}-${item.company}`}
                      className="border-t border-white/10 align-top"
                    >
                      <td className="px-5 py-4 font-bold">{item.company}</td>
                      <td className="px-5 py-4 text-cyan-300">{item.email}</td>
                      <td className="px-5 py-4 text-slate-200">{item.subject}</td>
                      <td className="px-5 py-4 text-sm leading-6 text-slate-300">
                        {item.message}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {[
            ["Cold email", outreach.cold],
            ["Follow-up 1", outreach.follow1],
            ["Follow-up 2", outreach.follow2],
          ].map(([title, text]) => (
            <div
              key={title}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-black">{title}</h2>
                <button
                  onClick={() => copyText(title, text)}
                  disabled={!text}
                  className={`${buttonBase} rounded-full border border-white/15 px-4 py-2 text-sm font-bold hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  {copied === title ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="mt-5 min-h-[280px] whitespace-pre-wrap rounded-2xl bg-black/30 p-5 text-sm leading-7 text-slate-300">
                {text || "Click “Generate AI Outreach” to create this message with OpenAI."}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
