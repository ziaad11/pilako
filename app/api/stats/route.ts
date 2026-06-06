import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export async function GET(req: Request) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    const { data: campaigns, error } = await supabase
      .from("campaigns")
      .select("*, leads(*)")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const allCampaigns = campaigns || [];
    const allLeads = allCampaigns.flatMap((campaign: any) => campaign.leads || []);

    const totalCampaigns = allCampaigns.length;
    const totalLeads = allLeads.length;

    const totalEmails = allLeads.filter(
      (lead: any) =>
        lead.email &&
        lead.email !== "Not found" &&
        lead.email !== "Not provided"
    ).length;

    const conversionRate =
      totalLeads > 0 ? Math.round((totalEmails / totalLeads) * 100) : 0;

    const pipelineValue = allLeads.reduce(
      (sum: number, lead: any) => sum + Number(lead.deal_value || 0),
      0
    );

    const today = new Date().toISOString().slice(0, 10);

    const followUpsDue = allLeads.filter(
      (lead: any) => lead.follow_up_date && lead.follow_up_date <= today
    ).length;

    const closedDeals = allLeads.filter(
      (lead: any) => lead.status === "Closed"
    ).length;

    const topLocations = Object.values(
      allCampaigns.reduce((acc: Record<string, any>, campaign: any) => {
        const key = campaign.location || "Unknown";

        if (!acc[key]) {
          acc[key] = { location: key, leads: 0, campaigns: 0 };
        }

        acc[key].leads += campaign.leads_count || 0;
        acc[key].campaigns += 1;

        return acc;
      }, {})
    )
      .sort((a: any, b: any) => b.leads - a.leads)
      .slice(0, 5);

    const topNiches = Object.values(
      allCampaigns.reduce((acc: Record<string, any>, campaign: any) => {
        const key = campaign.niche || "Unknown";

        if (!acc[key]) {
          acc[key] = { niche: key, leads: 0, campaigns: 0 };
        }

        acc[key].leads += campaign.leads_count || 0;
        acc[key].campaigns += 1;

        return acc;
      }, {})
    )
      .sort((a: any, b: any) => b.leads - a.leads)
      .slice(0, 5);

    const recentCampaigns = allCampaigns.slice(0, 5);

    const topCampaigns = [...allCampaigns]
      .sort((a: any, b: any) => (b.leads_count || 0) - (a.leads_count || 0))
      .slice(0, 5)
      .map((campaign: any) => ({
        id: campaign.id,
        name: campaign.name,
        location: campaign.location,
        niche: campaign.niche,
        leads_count: campaign.leads_count || 0,
        emails_count: campaign.emails_count || 0,
      }));

    const recentActivity = allCampaigns.slice(0, 8).map((campaign: any) => ({
      id: campaign.id,
      title: campaign.name,
      description: `${campaign.leads_count || 0} leads saved in ${campaign.location}`,
      created_at: campaign.created_at,
    }));

    return NextResponse.json({
      totalCampaigns,
      totalLeads,
      totalEmails,
      conversionRate,
      pipelineValue,
      followUpsDue,
      closedDeals,
      topLocations,
      topNiches,
      recentCampaigns,
      topCampaigns,
      recentActivity,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown server error" },
      { status: 500 }
    );
  }
}