"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card,  CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Utensils,
  Info,
  MapPin,
  Waves,
  Zap,
  PartyPopper,
  Search,
  X,
  Heart,
  ChevronRight,
  Filter,
  Map,
  ShoppingBag,
  Star,
  Plus,
  Minus,
  Share2,
  Download,
  Smartphone,
  Clock,
  Sparkles,
  Ticket,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import type { JSX } from "react"
import TopBar from "@/components/custom-components/topBar"
import { useData } from "@/providers/DataProvider"

// Importa dinamicamente la mappa per evitare errori di SSR
const MapComponent = dynamic(() => import("@/components/custom-components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[70vh] flex items-center justify-center bg-muted">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  ),
})

// Tipizzazione per i punti della mappa
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
  icon?: React.ReactNode
}

// Funzione per ottenere l'icona della categoria
const getCategoryIcon = (category: string): JSX.Element => {
  switch (category) {
    case "adrenalina":
      return <Zap className="h-5 w-5" />
    case "acqua":
      return <Waves className="h-5 w-5" />
    case "famiglia":
      return <Heart className="h-5 w-5" />
    default:
      return <Star className="h-5 w-5" />
  }
}

const getCategoryGradient = (category: string): string => {
  switch (category) {
    case "adrenalina":
      return "from-red-500 to-orange-600"
    case "acqua":
      return "from-blue-500 to-cyan-600"
    case "famiglia":
      return "from-amber-500 to-yellow-600"
    default:
      return "from-emerald-500 to-teal-600"
  }
}

export default function MapPage() {
  const { attractions, shows } = useData()
  const [activeTab, setActiveTab] = useState("mappa")
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showDetailPanel, setShowDetailPanel] = useState(false)
  const [filters, setFilters] = useState({
    attractions: true,
    restaurants: true,
    services: true,
    shows: true,
    shops: true,
  })
  const [showPopular, setShowPopular] = useState(false)

  // Converti le attrazioni nel formato MapPoint
  const attractionPoints: MapPoint[] = attractions.map(attraction => ({
    id: attraction.id,
    name: attraction.name,
    description: attraction.description,
    category: "attraction",
    subcategory: attraction.category,
    position: attraction.position || [0, 0],
    waitTime: attraction.waitTime,
    icon: getCategoryIcon(attraction.category),
    image: attraction.image,
    details: [
      `Altezza minima: ${attraction.minHeight}cm`,
      `Durata: ${attraction.duration}`,
      `Intensità: ${attraction.intensity}`
    ],
    color: getCategoryGradient(attraction.category),
    rating: attraction.popularity,
    popular: attraction.popularity > 4.5
  }))

  // Converti gli spettacoli nel formato MapPoint
  const showPoints: MapPoint[] = shows.map(show => ({
    id: show.id,
    name: show.name,
    description: show.description,
    category: "show",
    subcategory: show.category,
    position: show.position || [0, 0],
    icon: <PartyPopper className="h-5 w-5" />,
    image: show.image,
    details: [
      `Durata: ${show.duration} min`,
      `Orari: ${show.times.join(", ")}`,
      `Capacità: ${show.capacity} persone`
    ],
    color: "from-pink-500 to-rose-600",
    rating: show.rating,
    popular: show.popular
  }))

  // Combina tutti i punti
  const mapPoints: MapPoint[] = [
    ...attractionPoints,
    ...showPoints,
    {
      id: 6,
      name: "Caffè del Parco",
      description: "Caffetteria e pasticceria con prodotti freschi",
      category: "restaurant",
      subcategory: "caffetteria",
      position: [40, 35],
      image: "/placeholder.svg?height=300&width=500&text=Caffè",
      details: ["Orario: 9:00 - 20:00", "Specialità: Pasticceria artigianale", "Wi-Fi gratuito"],
      color: "from-amber-500 to-orange-600",
      rating: 4.2,
      popular: false,
    },
    {
      id: 7,
      name: "Infermeria",
      description: "Punto di primo soccorso per emergenze mediche",
      category: "service",
      subcategory: "pronto-soccorso",
      position: [45, 55],
      image: "/placeholder.svg?height=300&width=500&text=Infermeria",
      details: ["Aperto durante tutto l&apos;orario del parco", "Personale medico qualificato", "Defibrillatore disponibile"],
      color: "from-purple-500 to-violet-600",
      rating: 5.0,
      popular: false,
    },
    {
      id: 8,
      name: "Nursery",
      description: "Area dedicata alla cura dei bambini piccoli",
      category: "service",
      subcategory: "bambini",
      position: [55, 65],
      image: "/placeholder.svg?height=300&width=500&text=Nursery",
      details: ["Fasciatoi", "Area allattamento riservata", "Scaldabiberon disponibili"],
      color: "from-purple-500 to-violet-600",
      rating: 4.8,
      popular: false,
    },
  ]

  // Funzione per determinare il colore del badge del tempo di attesa
  const getWaitTimeColor = (minutes: number | undefined): string => {
    if (!minutes) return "bg-gray-500 text-white"
    if (minutes <= 15) return "bg-green-500 text-white"
    if (minutes <= 30) return "bg-yellow-500 text-white"
    return "bg-red-500 text-white"
  }

  // Funzione per determinare l'icona e il colore della categoria
  const getCategoryInfo = (category: string) => {
    switch (category) {
      case "attraction":
        return { icon: <Zap className="h-5 w-5" />, color: "bg-emerald-500", textColor: "text-emerald-500" }
      case "restaurant":
        return { icon: <Utensils className="h-5 w-5" />, color: "bg-amber-500", textColor: "text-amber-500" }
      case "service":
        return { icon: <Info className="h-5 w-5" />, color: "bg-purple-500", textColor: "text-purple-500" }
      case "show":
        return { icon: <PartyPopper className="h-5 w-5" />, color: "bg-pink-500", textColor: "text-pink-500" }
      case "shop":
        return { icon: <ShoppingBag className="h-5 w-5" />, color: "bg-teal-500", textColor: "text-teal-500" }
      default:
        return { icon: <MapPin className="h-5 w-5" />, color: "bg-gray-500", textColor: "text-gray-500" }
    }
  }

  

  // Funzione per ottenere il gradiente della categoria
  

  // Filtra i punti in base alla ricerca e ai filtri
  const filteredPoints = mapPoints.filter((point) => {
    // Filtra per popolarità se l'opzione è attiva
    if (showPopular && !point.popular) {
      return false
    }

    const matchesSearch =
      searchQuery === "" ||
      point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      point.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      point.subcategory.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      (filters.attractions && point.category === "attraction") ||
      (filters.restaurants && point.category === "restaurant") ||
      (filters.services && point.category === "service") ||
      (filters.shows && point.category === "show") ||
      (filters.shops && point.category === "shop")

    return matchesSearch && matchesFilter
  })

  // Gestisce il click su un punto della mappa
  const handlePointClick = (point: MapPoint) => {
    setSelectedPoint(point)
    setShowDetailPanel(true)
  }

  // Chiude il popup del punto selezionato
  const handleClosePoint = () => {
    setSelectedPoint(null)
    setShowDetailPanel(false)
  }

  // Aggiorna i filtri
  const handleFilterChange = (key: keyof typeof filters, value: boolean) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Raggruppa i servizi per categoria
  // const servicesByCategory = {
  //   restaurants: mapPoints.filter((point) => point.category === "restaurant"),
  //   services: mapPoints.filter((point) => point.category === "service"),
  //   shops: mapPoints.filter((point) => point.category === "shop"),
  //   shows: mapPoints.filter((point) => point.category === "show"),
  // }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <TopBar
      badgeText='ESPLORA IL PARCO'
        title1="Mappa "
        title2="Interattiva"
        description="Trova facilmente attrazioni, ristoranti, servizi e tutto ciò di cui hai bisogno per goderti al massimo la tua giornata a EnjoyPark!"
                  buttonText="Esplora la mappa"
                  buttonLink="Acquista Biglietti"
      />

      {/* Sezione Mappa Principale */}
      <section id="map-section" className="py-12 px-4 relative z-10">
        <div className="container mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
                <TabsTrigger
                  value="mappa"
                  className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-full py-2 px-4 flex items-center gap-2"
                >
                  <Map className="h-4 w-4" />
                  <span>Mappa Interattiva</span>
                </TabsTrigger>
                {/* <TabsTrigger
                  value="servizi"
                  className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-full py-2 px-4 flex items-center gap-2"
                >
                  <ListFilter className="h-4 w-4" />
                  <span>Servizi e Punti di Interesse</span>
                </TabsTrigger> */}
              </TabsList>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Cerca nel parco..."
                    className="pl-9 rounded-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 rounded-full border-gray-200 dark:border-gray-700"
                    >
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">Filtri</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4 rounded-xl border-gray-200 dark:border-gray-700 shadow-lg">
                    <h4 className="font-medium text-lg mb-3">Filtra per categoria</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <Checkbox
                          id="attractions"
                          checked={filters.attractions}
                          onCheckedChange={(checked: boolean) => handleFilterChange("attractions", checked)}
                          className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                        <Label htmlFor="attractions" className="flex items-center gap-2 cursor-pointer">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <Zap className="h-3.5 w-3.5 text-emerald-500" />
                          </div>
                          <span>Attrazioni</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <Checkbox
                          id="restaurants"
                          checked={filters.restaurants}
                          onCheckedChange={(checked: boolean) => handleFilterChange("restaurants", checked)}
                          className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                        />
                        <Label htmlFor="restaurants" className="flex items-center gap-2 cursor-pointer">
                          <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Utensils className="h-3.5 w-3.5 text-amber-500" />
                          </div>
                          <span>Ristoranti</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <Checkbox
                          id="services"
                          checked={filters.services}
                          onCheckedChange={(checked: boolean) => handleFilterChange("services", checked)}
                          className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                        />
                        <Label htmlFor="services" className="flex items-center gap-2 cursor-pointer">
                          <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <Info className="h-3.5 w-3.5 text-purple-500" />
                          </div>
                          <span>Servizi</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <Checkbox
                          id="shows"
                          checked={filters.shows}
                          onCheckedChange={(checked: boolean) => handleFilterChange("shows", checked)}
                          className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                        />
                        <Label htmlFor="shows" className="flex items-center gap-2 cursor-pointer">
                          <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                            <PartyPopper className="h-3.5 w-3.5 text-pink-500" />
                          </div>
                          <span>Spettacoli</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <Checkbox
                          id="shops"
                          checked={filters.shops}
                          onCheckedChange={(checked: boolean) => handleFilterChange("shops", checked)}
                          className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                        />
                        <Label htmlFor="shops" className="flex items-center gap-2 cursor-pointer">
                          <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                            <ShoppingBag className="h-3.5 w-3.5 text-teal-500" />
                          </div>
                          <span>Negozi</span>
                        </Label>
                      </div>

                      <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          <Checkbox
                            id="popular"
                            checked={showPopular}
                            onCheckedChange={(checked: boolean) => setShowPopular(!!checked)}
                            className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                          />
                          <Label htmlFor="popular" className="flex items-center gap-2 cursor-pointer">
                            <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                            </div>
                            <span>Solo punti popolari</span>
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setFilters({
                            attractions: true,
                            restaurants: true,
                            services: true,
                            shows: true,
                            shops: true,
                          })
                        }
                      >
                        Seleziona tutti
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setFilters({
                            attractions: false,
                            restaurants: false,
                            services: false,
                            shows: false,
                            shops: false,
                          })
                        }
                      >
                        Deseleziona tutti
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <TabsContent value="mappa" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="border-none shadow-xl py-0 overflow-hidden rounded-2xl h-[70vh] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="relative w-full h-full">
                      {<MapComponent
                        points={filteredPoints}
                        onPointClick={handlePointClick}
                        selectedPoint={selectedPoint}
                      />}

                      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
                        <Button size="icon" className="rounded-full bg-white dark:bg-gray-800 shadow-md h-10 w-10">
                          <Plus className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                        </Button>
                        <Button size="icon" className="rounded-full bg-white dark:bg-gray-800 shadow-md h-10 w-10">
                          <Minus className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                        </Button>
                        <div className="h-px w-full bg-gray-200 dark:bg-gray-700 my-1"></div>
                        <Button size="icon" className="rounded-full bg-white dark:bg-gray-800 shadow-md h-10 w-10">
                          <Share2 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                        </Button>
                        <Button size="icon" className="rounded-full bg-white dark:bg-gray-800 shadow-md h-10 w-10">
                          <Download className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                        </Button>
                      </div>

                      <div className="absolute top-4 left-4 z-[1000]">
                        <Badge className="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                          <span className="font-semibold">{filteredPoints.length}</span> punti trovati
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="lg:col-span-1">
                  <AnimatePresence mode="wait">
                    {showDetailPanel && selectedPoint ? (
                      <motion.div
                        key="detail"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="border-none shadow-xl py-0 overflow-hidden rounded-2xl h-[70vh] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                          <div className="relative h-48">
                            <Image
                              src={selectedPoint.image || "/placeholder.svg"}
                              alt={selectedPoint.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-3 right-3 text-white hover:bg-black/20 z-10"
                              onClick={handleClosePoint}
                            >
                              <X className="h-5 w-5" />
                            </Button>
                            <div className="absolute top-3 left-3">
                              <Badge className={`${getCategoryInfo(selectedPoint.category).color} text-white`}>
                                {selectedPoint.category === "attraction"
                                  ? "ATTRAZIONE"
                                  : selectedPoint.category === "restaurant"
                                    ? "RISTORANTE"
                                    : selectedPoint.category === "service"
                                      ? "SERVIZIO"
                                      : selectedPoint.category === "shop"
                                        ? "NEGOZIO"
                                        : "SPETTACOLO"}
                              </Badge>
                            </div>
                            <div className="absolute bottom-4 left-4">
                              <h3 className="text-2xl font-bold text-white">{selectedPoint.name}</h3>
                              <p className="text-white/80 text-sm">{selectedPoint.subcategory}</p>
                            </div>
                          </div>

                          <ScrollArea className="h-[calc(70vh-12rem)] p-6">
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-lg font-semibold mb-2">Descrizione</h4>
                                <p className="text-gray-600 dark:text-gray-300">{selectedPoint.description}</p>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-5 w-5 ${
                                        star <= Math.floor(selectedPoint.rating || 0)
                                          ? "text-amber-400 fill-amber-400"
                                          : "text-gray-300 dark:text-gray-600"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-gray-600 dark:text-gray-300 font-medium">
                                  {selectedPoint.rating?.toFixed(1) || "N/A"}
                                </span>

                                {selectedPoint.popular && (
                                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 ml-2">
                                    Popolare
                                  </Badge>
                                )}
                              </div>

                              {selectedPoint.waitTime !== undefined && (
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-12 h-12 rounded-full ${getWaitTimeColor(selectedPoint.waitTime)} flex items-center justify-center`}
                                  >
                                    <Clock className="h-6 w-6" />
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Tempo di attesa</div>
                                    <div className="font-bold text-lg">{selectedPoint.waitTime} min</div>
                                  </div>
                                </div>
                              )}

                              <div>
                                <h4 className="text-lg font-semibold mb-3">Dettagli</h4>
                                <ul className="space-y-2">
                                  {selectedPoint.details?.map((detail, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                      <div
                                        className={`w-5 h-5 rounded-full bg-gradient-to-r ${selectedPoint.color || "from-emerald-500 to-teal-600"} flex items-center justify-center text-white`}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="12"
                                          height="12"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="3"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="lucide lucide-check"
                                        >
                                          <path d="M20 6 9 17l-5-5" />
                                        </svg>
                                      </div>
                                      {detail}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="text-lg font-semibold mb-3">Posizione</h4>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                  <MapPin className="h-5 w-5 text-gray-400" />
                                  <span>
                                    Coordinate: {selectedPoint.position[0].toFixed(4)},{" "}
                                    {selectedPoint.position[1].toFixed(4)}
                                  </span>
                                </div>
                              </div>

                              {selectedPoint.category === "attraction" && (
                                <Button
                                  className={`w-full bg-gradient-to-r ${selectedPoint.color || "from-emerald-500 to-teal-600"} text-white rounded-xl group overflow-hidden relative`}
                                  asChild
                                >
                                  <Link href={`/attrazioni#${selectedPoint.id}`}>
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                      Dettagli Attrazione
                                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <span className="absolute inset-0 w-full h-full bg-white/20 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-300"></span>
                                  </Link>
                                </Button>
                              )}

                              {selectedPoint.category === "restaurant" && (
                                <Button
                                  className={`w-full bg-gradient-to-r ${selectedPoint.color || "from-amber-500 to-orange-600"} text-white rounded-xl group overflow-hidden relative`}
                                >
                                  <span className="relative z-10 flex items-center justify-center gap-2">
                                    Prenota un Tavolo
                                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                  </span>
                                  <span className="absolute inset-0 w-full h-full bg-white/20 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-300"></span>
                                </Button>
                              )}

                              {selectedPoint.category === "show" && (
                                <Button
                                  className={`w-full bg-gradient-to-r ${selectedPoint.color || "from-pink-500 to-rose-600"} text-white rounded-xl group overflow-hidden relative`}
                                  asChild
                                >
                                  <Link href="/spettacoli">
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                      Orari Spettacoli
                                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <span className="absolute inset-0 w-full h-full bg-white/20 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-300"></span>
                                  </Link>
                                </Button>
                              )}

                              {/* Pulsante per condividere */}
                              <div className="flex gap-3 mt-4">
                                <Button variant="outline" className="flex-1 rounded-xl">
                                  <Share2 className="h-4 w-4 mr-2" /> Condividi
                                </Button>
                                <Button variant="outline" className="flex-1 rounded-xl">
                                  <Smartphone className="h-4 w-4 mr-2" /> Salva nell&apos; app
                                </Button>
                              </div>
                            </div>
                          </ScrollArea>
                        </Card>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="border-none shadow-xl overflow-hidden rounded-2xl h-[70vh] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                          <CardHeader className="pb-2">
                            <CardTitle>Punti di Interesse</CardTitle>
                            <CardDescription>
                              {filteredPoints.length} risultati trovati. Clicca su un punto per vedere i dettagli.
                            </CardDescription>
                          </CardHeader>
                          <ScrollArea className="h-[calc(70vh-5rem)]">
                            <div className="p-4 space-y-3">
                              {filteredPoints.length > 0 ? (
                                filteredPoints.map((point) => (
                                  <motion.div
                                    key={point.name}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="cursor-pointer"
                                    onClick={() => handlePointClick(point)}
                                  >
                                    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800">
                                      <div className="flex p-3">
                                        <div
                                          className={`w-12 h-12 rounded-full ${getCategoryInfo(point.category).color} flex items-center justify-center text-white mr-3 flex-shrink-0`}
                                        >
                                          {point.icon || getCategoryInfo(point.category).icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center justify-between">
                                            <h4 className="font-medium text-base truncate">{point.name}</h4>
                                            {point.popular && (
                                              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 ml-2">
                                                <Star className="h-3 w-3 fill-amber-500 mr-1" /> Popolare
                                              </Badge>
                                            )}
                                          </div>
                                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                            {point.description}
                                          </p>
                                          <div className="flex flex-wrap gap-2 mt-1">
                                            {point.category === "attraction" && (
                                              <Badge
                                                variant="outline"
                                                className={`${getWaitTimeColor(point.waitTime)} text-xs`}
                                              >
                                                {point.waitTime} min
                                              </Badge>
                                            )}
                                            <Badge
                                              variant="outline"
                                              className={`bg-gray-100 dark:bg-gray-800 text-xs ${getCategoryInfo(point.category).textColor}`}
                                            >
                                              {point.subcategory}
                                            </Badge>
                                          </div>
                                        </div>
                                        <div className="flex items-center ml-2">
                                          <ChevronRight className="h-5 w-5 text-gray-400" />
                                        </div>
                                      </div>
                                    </Card>
                                  </motion.div>
                                ))
                              ) : (
                                <div className="text-center py-12">
                                  <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                  <h3 className="text-lg font-medium mb-2">Nessun risultato trovato</h3>
                                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    Prova a modificare i filtri o la ricerca
                                  </p>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSearchQuery("")
                                      setFilters({
                                        attractions: true,
                                        restaurants: true,
                                        services: true,
                                        shows: true,
                                        shops: true,
                                      })
                                      setShowPopular(false)
                                    }}
                                  >
                                    Reimposta filtri
                                  </Button>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Legenda */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Legenda</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Attrazioni</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {mapPoints.filter((p) => p.category === "attraction").length} punti
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white">
                      <Utensils className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Ristoranti</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {mapPoints.filter((p) => p.category === "restaurant").length} punti
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                      <Info className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Servizi</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {mapPoints.filter((p) => p.category === "service").length} punti
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white">
                      <PartyPopper className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Spettacoli</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {mapPoints.filter((p) => p.category === "show").length} punti
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Negozi</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {mapPoints.filter((p) => p.category === "shop").length} punti
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </TabsContent>

            {/* <TabsContent value="servizi" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-none shadow-xl overflow-hidden rounded-2xl h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="relative h-40">
                      <Image
                        src="/placeholder.svg?height=400&width=800&text=Ristoranti"
                        alt="Ristoranti e Bar"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                          <Utensils className="h-6 w-6" /> Ristoranti e Bar
                        </h3>
                        <p className="text-white/80">Dove mangiare e bere nel parco</p>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <ScrollArea className="h-64">
                        <div className="space-y-4">
                          {servicesByCategory.restaurants.map((restaurant) => (
                            <motion.div
                              key={restaurant.id}
                              whileHover={{ x: 5 }}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                              onClick={() => handlePointClick(restaurant)}
                            >
                              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-500">
                                {restaurant.icon || <Utensils className="h-5 w-5" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <h4 className="font-medium">{restaurant.name}</h4>
                                  {restaurant.popular && (
                                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 ml-2">
                                      <Star className="h-3 w-3 fill-amber-500 mr-1" /> Popolare
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                  {restaurant.description}
                                </p>
                                <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 mr-1" />
                                  <span>{restaurant.rating?.toFixed(1)}</span>
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </motion.div>

                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-none shadow-xl overflow-hidden rounded-2xl h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="relative h-40">
                      <Image
                        src="/placeholder.svg?height=400&width=800&text=Servizi"
                        alt="Servizi"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                          <Info className="h-6 w-6" /> Servizi
                        </h3>
                        <p className="text-white/80">Assistenza e comodità nel parco</p>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <ScrollArea className="h-64">
                        <div className="space-y-4">
                          {servicesByCategory.services.map((service) => (
                            <motion.div
                              key={service.id}
                              whileHover={{ x: 5 }}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                              onClick={() => handlePointClick(service)}
                            >
                              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500">
                                {service.icon || <Info className="h-5 w-5" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <h4 className="font-medium">{service.name}</h4>
                                  {service.popular && (
                                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 ml-2">
                                      <Star className="h-3 w-3 fill-amber-500 mr-1" /> Popolare
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                  {service.description}
                                </p>
                                <Badge variant="outline" className="mt-1">
                                  {service.subcategory}
                                </Badge>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </motion.div>

                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-none shadow-xl overflow-hidden rounded-2xl h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="relative h-40">
                      <Image
                        src="/placeholder.svg?height=400&width=800&text=Negozi"
                        alt="Negozi"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                          <ShoppingBag className="h-6 w-6" /> Negozi
                        </h3>
                        <p className="text-white/80">Shopping e souvenir</p>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <ScrollArea className="h-64">
                        <div className="space-y-4">
                          {servicesByCategory.shops.map((shop) => (
                            <motion.div
                              key={shop.id}
                              whileHover={{ x: 5 }}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                              onClick={() => handlePointClick(shop)}
                            >
                              <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-500">
                                {shop.icon || <ShoppingBag className="h-5 w-5" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <h4 className="font-medium">{shop.name}</h4>
                                  {shop.popular && (
                                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 ml-2">
                                      <Star className="h-3 w-3 fill-amber-500 mr-1" /> Popolare
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                  {shop.description}
                                </p>
                                <Badge variant="outline" className="mt-1">
                                  {shop.subcategory}
                                </Badge>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </motion.div>

                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-none shadow-xl overflow-hidden rounded-2xl h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="relative h-40">
                      <Image
                        src="/placeholder.svg?height=400&width=800&text=Spettacoli"
                        alt="Spettacoli"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                          <PartyPopper className="h-6 w-6" /> Spettacoli
                        </h3>
                        <p className="text-white/80">Intrattenimento dal vivo</p>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <ScrollArea className="h-64">
                        <div className="space-y-4">
                          {servicesByCategory.shows.map((show) => (
                            <motion.div
                              key={show.name}
                              whileHover={{ x: 5 }}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                              onClick={() => handlePointClick(show)}
                            >
                              <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-500">
                                {show.icon || <PartyPopper className="h-5 w-5" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <h4 className="font-medium">{show.name}</h4>
                                  {show.popular && (
                                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 ml-2">
                                      <Star className="h-3 w-3 fill-amber-500 mr-1" /> Popolare
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                  {show.description}
                                </p>
                                <Badge variant="outline" className="mt-1">
                                  {show.subcategory}
                                </Badge>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent> */}
          </Tabs>
        </div>
      </section>

      {/* Sezione Suggerimenti */}
      <section className="py-16 px-4 bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-emerald-300 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-teal-300 opacity-10 rounded-full blur-3xl"></div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-emerald-100 text-emerald-800 mb-4 px-3 py-1 text-sm rounded-full">SUGGERIMENTI</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Consigli per la tua visita</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Ecco alcuni suggerimenti per rendere la tua giornata a EnjoyPark ancora più piacevole!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card className="border-none shadow-xl overflow-hidden rounded-2xl h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <div className="p-6 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 mb-4">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Pianifica la tua giornata</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                    Arriva presto al parco e visita prima le attrazioni più popolari per evitare lunghe code. Consulta
                    gli orari degli spettacoli e pianifica la tua giornata di conseguenza.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-auto w-full rounded-xl border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group"
                  >
                    <span className="flex items-center gap-2">
                      Orari del Parco
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card className="border-none shadow-xl overflow-hidden rounded-2xl h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <div className="p-6 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-500 mb-4">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Fast Pass</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                    Acquista un Fast Pass per saltare le code alle attrazioni più popolari. È un ottimo modo per
                    risparmiare tempo e godersi più attrazioni durante la tua visita.
                  </p>
                  <Button
                    className="mt-auto w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white group overflow-hidden relative"
                    asChild
                  >
                    <Link href="/fast-pass">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Acquista Fast Pass
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <span className="absolute inset-0 w-full h-full bg-white/20 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-300"></span>
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card className="border-none shadow-xl overflow-hidden rounded-2xl h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <div className="p-6 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 mb-4">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">App Mobile</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                    Scarica la nostra app mobile per avere la mappa interattiva sempre a portata di mano, ricevere
                    aggiornamenti in tempo reale sui tempi di attesa e accedere a offerte esclusive.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-auto w-full rounded-xl border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 group"
                  >
                    <span className="flex items-center gap-2">
                      Scarica l&apos; App
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge className="bg-white/20 text-white mb-6 px-3 py-1 text-sm rounded-full">PRENOTA ORA</Badge>
            <h2 className="text-4xl font-bold mb-6">Pronto per l&apos; avventura?</h2>
            <p className="text-xl mb-10 text-white/80">
              Acquista ora i tuoi biglietti e preparati a vivere un&apos; esperienza indimenticabile a EnjoyPark!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-emerald-600 hover:bg-white/90 rounded-full px-8 py-6 text-lg group overflow-hidden relative"
              >
                <Link href="/biglietti">
                  <span className="relative z-10 flex items-center gap-2">
                    Acquista Biglietti
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                    >
                      <Ticket className="h-5 w-5" />
                    </motion.div>
                  </span>
                  <span className="absolute inset-0 w-full h-full bg-emerald-600/10 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-300"></span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-white border-white/30 hover:bg-white/10 rounded-full px-8 py-6 text-lg group"
              >
                <Link href="/info" className="flex items-center gap-2">
                  <span className="text-black">Informazioni Utili</span>
                  <motion.div
                    animate={{ rotate: [0, 15, 0, -15, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 1 }}
                  >
                    <Info className="h-5 w-5 text-black" />
                  </motion.div>
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
