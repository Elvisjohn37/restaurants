import { TRawListProps } from "@/types/restaurant"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")
    const API_KEY = process.env.NEXT_PUBLIC_YELP_API_KEY
    const miles = 8046 // 5 miles

    if (!city || !API_KEY) {
        return NextResponse.json(
            { error: "Missing city or API Key" },
            { status: 400 },
        )
    }

    try {
        const url = `https://serpapi.com/search.json?engine=yelp&find_desc=restaurants&find_loc=${encodeURIComponent(city)}&radius=${miles}&num=20&api_key=${API_KEY}`

        const response = await fetch(url)
        const data = await response.json()

        const rawList = data.organic_results || data.businesses || []

        if (rawList.length === 0) return NextResponse.json([])

        const restaurants = rawList.map((props: TRawListProps) => ({
            id: props.ids || props.title || Math.random().toString(),
            name: props.name || props.title,
            rating: props.rating || 0,
            address:
                props.address ||
                props.location?.display_address?.join(", ") ||
                "No address",
            coordinates: {
                lat: props.gps_coordinates?.latitude || 0,
                lng: props.gps_coordinates?.longitude || 0,
            },
        }))

        return NextResponse.json(restaurants)
    } catch (error) {
        console.error("Fetch error:", error)
        return NextResponse.json(
            { error: "Failed to fetch data" },
            { status: 500 },
        )
    }
}
