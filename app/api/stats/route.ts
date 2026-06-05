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
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const totalCampaigns = campaigns?.length || 0;

    const totalLeads =
      campaigns?.reduce((sum, campaign) => sum + (campaign.leads_count || 0), 0) || 0;

    const totalEmails =
      campaigns?.reduce((sum, campaign) => sum + (campaign.emails_count || 0), 0) || 0;

    const conversionRate =
      totalLeads > 0 ? Math.round((totalEmails / totalLeads) * 100) : 0;

    const topLocations = Object.values(
      (campaigns || []).reduce((acc: Record<string, any>, campaign) => {
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
      (campaigns || []).reduce((acc: Record<string, any>, campaign) => {
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

    const recentCampaigns = (campaigns || []).slice(0, 5);

    return NextResponse.json({
      totalCampaigns,
      totalLeads,
      totalEmails,
      conversionRate,
      topLocations,
      topNiches,
      recentCampaigns,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown server error" },
      { status: 500 }
    );
  }
}