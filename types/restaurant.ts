export type TRestaurant = {
    id: string
    name: string
    rating: number
    address: string
    coordinates: {
        lat: number
        lng: number
    }
}

export type TRawListProps = {
    ids: string
    title: string
    name: string
    rating: string
    address: string
    location: { display_address: string[] }
    gps_coordinates: { latitude: string; longitude: string }
}
