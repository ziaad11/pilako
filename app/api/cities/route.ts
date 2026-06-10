import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const input = searchParams.get("q");

    if (!input || input.length < 2) {
      return NextResponse.json({ cities: [] });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    const response = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey || "",
          "X-Goog-FieldMask":
            "suggestions.placePrediction.text.text",
        },
        body: JSON.stringify({
          input,
          includedPrimaryTypes: ["(cities)"],
        }),
      }
    );

    const data = await response.json();

    const cities =
      data?.suggestions?.map(
        (item: any) =>
          item?.placePrediction?.text?.text
      ) || [];

    return NextResponse.json({ cities });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { cities: [] },
      { status: 500 }
    );
  }
}