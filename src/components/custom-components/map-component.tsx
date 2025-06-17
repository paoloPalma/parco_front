"use client"


import { MapContainer, Marker, Popup, ImageOverlay, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Risolve il problema delle icone di Leaflet in Next.js
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

// Componente per mantenere la mappa entro i limiti
function BoundsController() {
  const map = useMapEvents({
    dragend: () => {
      const bounds = map.getBounds()
      const maxBounds = map.getBounds()
      
      if (!maxBounds.contains(bounds)) {
        map.panTo([50, 50], { animate: true })
      }
    }
  })
  return null
}




interface MapPoint {
  id: number
  name: string
  description: string
  category: "attraction" | "restaurant" | "service" | "show" | "shop"
  subcategory: string
  position: [number, number]
  waitTime?: number
  image?: string
  details?: string[]
  color?: string
  rating?: number
  popular?: boolean
}

interface MapComponentProps {
  points: MapPoint[]
  onPointClick: (point: MapPoint) => void
  selectedPoint: MapPoint | null
}

// Componente principale della mappa
export default function MapComponent({ points, onPointClick }: MapComponentProps) {
  // Definisci i bounds dell'immagine della mappa
  const bounds: L.LatLngBoundsExpression = [
    [0, 0],     // Angolo sud-ovest
    [100, 100]  // Angolo nord-est
  ]

  return (
    <MapContainer 
      center={[50, 50]} 
      zoom={3.5} 
      style={{ height: "100%", width: "100%" }} 
      zoomControl={true}
      crs={L.CRS.Simple}
      minZoom={3}
      maxZoom={10}
      maxBounds={bounds}
      maxBoundsViscosity={1.0}
    >
      <ImageOverlay
        url="/relativeMap.jpeg"
        bounds={bounds}
        className="object-contain"
      />

      {points.map((point) => (
        <Marker
          key={point.name}
          position={point.position}
          eventHandlers={{
            click: () => onPointClick(point),
          }}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-bold">{point.name}</h3>
              <p className="text-xs">{point.category}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      <BoundsController />
    </MapContainer>
  )
}
