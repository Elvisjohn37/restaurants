"use client"
import { useState, FormEvent } from "react"
import { TRestaurant } from "@/types/restaurant"

export default function Home() {
    const [city, setCity] = useState<string>("")
    const [results, setResults] = useState<TRestaurant[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault()
        if (!city) return

        setLoading(true)
        try {
            const res = await fetch(
                `/api/restaurants?city=${encodeURIComponent(city)}`,
            )
            const data: TRestaurant[] = await res.json()
            setResults(data)
        } catch (error) {
            console.error("Search failed", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="max-w-4xl mx-auto my-12 px-5 font-sans">
            <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
                Local Restaurant Finder
            </h1>

            <form
                onSubmit={handleSearch}
                className="flex flex-col sm:flex-row gap-3 mb-10"
            >
                <input
                    type="text"
                    placeholder="Enter city (e.g., Manila, New York)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-[#d32323] hover:bg-[#b21f1f] disabled:bg-gray-400 text-white font-bold rounded-lg transition-colors shadow-md"
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </form>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((item) => (
                    <div
                        key={item.id}
                        className="border border-gray-100 p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                                {item.name}
                            </h3>
                            <p className="text-yellow-500 font-bold mb-3">
                                ⭐ {item.rating} / 5
                            </p>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                📍 {item.address}
                            </p>
                        </div>
                        <div className="pt-4 border-t border-gray-50 text-[10px] text-gray-400 font-mono">
                            LAT: {item.coordinates.lat.toFixed(4)} <br />
                            LNG: {item.coordinates.lng.toFixed(4)}
                        </div>
                    </div>
                ))}
            </div>

            {!loading && results.length === 0 && (
                <p className="text-center mt-20 text-gray-400 italic">
                    No results found. Try searching for a city!
                </p>
            )}
        </main>
    )
}
