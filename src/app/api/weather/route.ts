import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const API_KEY = process.env.WEATHER_KEY;

  if (!API_KEY) {
    console.error("API key not configured.");
    return NextResponse.json(
      {
        error:
          "API key not configured. Please add WEATHER_KEY to your environment variables.",
      },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    let response;

    if (action === "forecast") {
      const place = searchParams.get("place");
      if (!place) throw new Error("Missing 'place' parameter for forecast");

      response = await axios.get(
        "https://api.openweathermap.org/data/2.5/forecast",
        {
          params: {
            q: place,
            appid: API_KEY,
            cnt: 56,
            units: "metric",
            lang: "en",
          },
        },
      );
    } else if (action === "find") {
      const q = searchParams.get("q");
      if (!q) throw new Error("Missing 'q' parameter for find");

      response = await axios.get(
        "https://api.openweathermap.org/data/2.5/find",
        {
          params: { q, appid: API_KEY, units: "metric", lang: "en" },
        },
      );
    } else if (action === "current") {
      const lat = searchParams.get("lat");
      const lon = searchParams.get("lon");
      if (!lat || !lon)
        throw new Error("Missing 'lat' or 'lon' parameter for current weather");

      response = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: { lat, lon, appid: API_KEY, units: "metric", lang: "en" },
        },
      );
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Weather API Route Error:", error.message);
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data.message || "Weather API Error" },
        { status: error.response.status },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
