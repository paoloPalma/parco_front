"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  Clock,
  Ruler,
  Zap,
  Droplets,
  Heart,
  Search,
  ArrowRight,
  Star,
  Plus,
  Minus,
  Share2,
  Download,
  PartyPopper,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import TopBar from "@/components/custom-components/topBar"
import { useData } from "@/providers/DataProvider"
import dynamic from "next/dynamic"
import type { ReactElement } from "react"

interface MapPoint {
  id: number
  name: string
  description: string
  category: "attraction" | "restaurant" | "service" | "show" | "shop"
  subcategory: string
  position: [number, number]
  waitTime?: number
  icon?: ReactElement
  image?: string
  details?: string[]
  color?: string
  rating?: number
  popular?: boolean
}

interface Attraction {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  waitTime: number;
  minHeight: number;
  image: string;
  location: string;
  intensity: string;
  duration: string;
  popularity: number;
  tags: string[];
  features: string[];
  stats: Array<{ label: string; value: string }>;
  position?: [number, number];
}

const MapComponent = dynamic(() => import("@/components/custom-components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[70vh] flex items-center justify-center bg-muted">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  ),
})

// Funzioni di utilità
const getWaitTimeColor = (minutes: number): string => {
  if (minutes <= 15) return "bg-green-500 text-white"
  if (minutes <= 30) return "bg-yellow-500 text-white"
  return "bg-red-500 text-white"
}

const getIntensityColor = (intensity: string): string => {
  if (intensity === "Bassa") return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
  if (intensity === "Media") return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
  return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
}

// Nuove funzioni di utilità per gestire colori e badge in base alla categoria
const getCategoryBadgeColor = (category: string): string => {
  switch (category) {
    case "adrenalina":
      return "bg-red-500"
    case "acqua":
      return "bg-blue-500"
    case "famiglia":
      return "bg-amber-500"
    default:
      return "bg-gray-500"
  }
}

const getCategoryGradient = (category: string): string => {
  switch (category) {
    case "adrenalina":
      return "from-red-500 to-rose-600"
    case "acqua":
      return "from-blue-500 to-cyan-600"
    case "famiglia":
      return "from-amber-500 to-orange-600"
    default:
      return "from-gray-500 to-gray-600"
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "adrenalina":
      return <Zap className="h-4 w-4" />
    case "acqua":
      return <Droplets className="h-4 w-4" />
    case "famiglia":
      return <Heart className="h-4 w-4" />
    default:
      return <Star className="h-4 w-4" />
  }
}

export default function AttractionsPage() {
  const { attractions, loading, error, shows } = useData()
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null)
  const [activeCategory, setActiveCategory] = useState("tutte")
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showDetailPanel, setShowDetailPanel] = useState(false)
  const [filters] = useState({
    attractions: true,
    restaurants: true,
    services: true,
    shows: true,
    shops: true,
  })
  const [showPopular] = useState(false)
  const filteredAttractions = attractions.filter((attraction: Attraction) => {
    if (activeCategory !== "tutte" && attraction.category !== activeCategory) {
      return false
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        attraction.name.toLowerCase().includes(query) ||
        attraction.description.toLowerCase().includes(query) ||
        attraction.location.toLowerCase().includes(query) ||
        attraction.tags.some((tag: string) => tag.toLowerCase().includes(query))
      )
    }

    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Caricamento attrazioni...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 text-red-500 mx-auto mb-4">
            <AlertCircle className="w-full h-full" />
          </div>
          <p className="text-lg text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600 text-white">
            Riprova
          </Button>
        </div>
      </div>
    )
  }

  const openAttractionDetails = (attraction: Attraction) => {
    setSelectedAttraction(attraction)
    // In un'app reale, potremmo navigare a una pagina di dettaglio
    // o aprire un modal con i dettagli completi
  }
  

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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      
      <TopBar
        badgeText="DIVERTIMENTO GARANTITO"
        title1="Scopri le nostre "
        title2="Attrazioni"
        description="Dalle montagne russe mozzafiato alle attrazioni acquatiche, c&apos;è divertimento per tutti a EnjoyPark!"
        buttonText="Esplora Attrazioni"
        buttonLink="Acquista Biglietti"
      />

      {/* Filtri e Ricerca */}
      <section className="px-4 py-6 bg-white dark:bg-gray-900 shadow-md relative z-10">
        <div className="container mx-auto">
          <div className="flex  flex-col md:flex-row md:items-center justify-between">
            <Tabs
              defaultValue="tutte"
              value={activeCategory}
              onValueChange={setActiveCategory}
              className="w-full md:w-auto  pb-6 md:pb-0 "
            >
              <TabsList className="grid grid-cols-4 items-center  h-full w-full md:w-auto bg-gray-100 dark:bg-gray-800  rounded-full">
                <TabsTrigger
                  value="tutte"
                  className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-full py-2 px-4"
                >
                  Tutte
                </TabsTrigger>
                <TabsTrigger
                  value="adrenalina"
                  className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-full py-2 px-4 flex items-center justify-center gap-1"
                >
                  <Zap className="h-4 w-4 hidden sm:inline" />
                  <span>Adrenalina</span>
                </TabsTrigger>
                <TabsTrigger
                  value="acqua"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-full py-2 px-4 flex items-center justify-center gap-1"
                >
                  <Droplets className="h-4 w-4 hidden sm:inline" />
                  <span>Acquatiche</span>
                </TabsTrigger>
                <TabsTrigger
                  value="famiglia"
                  className="data-[state=active]:bg-amber-500 data-[state=active]:text-white rounded-full py-2 px-4 flex items-center justify-center gap-1"
                >
                  <Heart className="h-4 w-4 hidden sm:inline" />
                  <span>Famiglia</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Cerca attrazione..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Sezione Attrazioni */}
      <section id="attractions-section" className="py-16 px-4">
        <div className="container mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[400px]"
            >
              {filteredAttractions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredAttractions.map((attraction, index) => (
                    <AttractionCard
                      key={index}
                      attraction={attraction}
                      index={index}
                      onSelect={() => openAttractionDetails(attraction)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800"
                  >
                    <Search className="h-8 w-8 text-gray-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">Nessuna attrazione trovata</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Prova a modificare i filtri o la ricerca per trovare ciò che stai cercando.
                  </p>
                  <Button
                    onClick={() => {
                      setActiveCategory("tutte")
                      setSearchQuery("")
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 rounded-full"
                  >
                    Mostra tutte le attrazioni
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Sezione Mappa del Parco */}
      <section className="py-16 px-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-emerald-300 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-teal-300 opacity-10 rounded-full blur-3xl"></div>

        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-emerald-100 text-emerald-800 mb-4 px-3 py-1 text-sm rounded-full">
                MAPPA DEL PARCO
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Esplora il parco con la nostra mappa interattiva</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Pianifica la tua giornata perfetta a EnjoyPark! Trova facilmente tutte le attrazioni, i ristoranti e i
                servizi disponibili nel parco.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mt-0.5">
                    <Zap className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Zona Adrenalina</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Montagne russe e attrazioni ad alta intensità
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-0.5">
                    <Droplets className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Zona Acquatica</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Attrazioni acquatiche e piscine</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mt-0.5">
                    <Heart className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Zona Famiglia</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Attrazioni per bambini e tutta la famiglia
                    </p>
                  </div>
                </div>
              </div>
              <Button
                asChild
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 rounded-full px-6"
              >
                <Link href="/mappa" className="flex items-center gap-2">
                  Visualizza Mappa Completa
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/placeholder.svg?height=800&width=800&text=Mappa+del+Parco"
                  alt="Mappa del Parco"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                <div className="absolute top-1/4 left-1/3 group">
                  <div className="relative">
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white z-10 relative">
                      <Zap className="h-3 w-3" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
                    <div className="absolute -inset-1 rounded-full bg-red-500 animate-pulse opacity-50"></div>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs rounded-lg py-1 px-2 whitespace-nowrap transition-opacity duration-200 shadow-lg">
                      Zona Adrenalina
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 right-1/4 group">
                  <div className="relative">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white z-10 relative">
                      <Droplets className="h-3 w-3" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75"></div>
                    <div className="absolute -inset-1 rounded-full bg-blue-500 animate-pulse opacity-50"></div>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs rounded-lg py-1 px-2 whitespace-nowrap transition-opacity duration-200 shadow-lg">
                      Zona Acquatica
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-1/4 left-1/4 group">
                  <div className="relative">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white z-10 relative">
                      <Heart className="h-3 w-3" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-amber-500 animate-ping opacity-75"></div>
                    <div className="absolute -inset-1 rounded-full bg-amber-500 animate-pulse opacity-50"></div>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs rounded-lg py-1 px-2 whitespace-nowrap transition-opacity duration-200 shadow-lg">
                      Zona Famiglia
                    </div>
                  </div>
                </div>
              </div> */}
              <Card className="border-none shadow-xl py-0 overflow-hidden rounded-2xl h-[50vh] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
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
            <h2 className="text-4xl font-bold mb-6">Pronto a vivere l&apos;avventura?</h2>
            <p className="text-xl mb-10 text-white/80">
              Acquista ora i tuoi biglietti e preparati a vivere un&apos;esperienza indimenticabile a EnjoyPark!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-emerald-600 hover:bg-white/90 rounded-full px-8 py-6 text-lg"
              >
                <Link href="/biglietti">Acquista Biglietti</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-black border-white/30 hover:bg-white/10 rounded-full px-8 py-6 text-lg"
              >
                <Link href="/info">Informazioni Utili</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal per i dettagli dell'attrazione */}
      <AnimatePresence>
        {selectedAttraction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAttraction(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 md:h-80">
                <Image
                  src={selectedAttraction.image || "/placeholder.svg"}
                  alt={selectedAttraction.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <Badge className={`${getCategoryBadgeColor(selectedAttraction.category)} text-white px-3 py-1 flex items-center gap-2`}>
                    {getCategoryIcon(selectedAttraction.category)}
                    {selectedAttraction.category === "adrenalina"
                      ? "ADRENALINA"
                      : selectedAttraction.category === "acqua"
                        ? "ACQUATICA"
                        : "FAMIGLIA"}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-white hover:bg-black/20"
                  onClick={() => setSelectedAttraction(null)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </Button>
                <div className="absolute bottom-4 left-4">
                  <h2 className="text-3xl font-bold text-white">{selectedAttraction.name}</h2>
                  <p className="text-white/80">{selectedAttraction.location}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedAttraction.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6">{selectedAttraction.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Tempo di attesa</div>
                    <div className="font-bold text-lg">{selectedAttraction.waitTime} min</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Altezza minima</div>
                    <div className="font-bold text-lg">
                      {selectedAttraction.minHeight > 0 ? `${selectedAttraction.minHeight} cm` : "Nessun limite"}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Durata</div>
                    <div className="font-bold text-lg">{selectedAttraction.duration}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Intensità</div>
                    <div className="font-bold text-lg">{selectedAttraction.intensity}</div>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3">Caratteristiche</h3>
                <ul className="space-y-2 mb-6">
                  {selectedAttraction.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full bg-gradient-to-r ${getCategoryGradient(selectedAttraction.category)} flex items-center justify-center text-white`}
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
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-3 justify-end">
                  <Link href={'/mappa'}>
                    <Button variant="outline" className="cursor-pointer rounded-xl">
                      Visualizza sulla mappa
                    </Button>
                  </Link>
                  <Link href={'/biglietti'}>
                    <Button className={`cursor-pointer bg-gradient-to-r ${getCategoryGradient(selectedAttraction.category)} text-white rounded-xl`}>
                      Acquista Fast Pass
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface AttractionCardProps {
  attraction: Attraction;
  index: number;
  onSelect: (attraction: Attraction) => void;
}

function AttractionCard({ attraction, index, onSelect }: AttractionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="h-full"
    >
      <Card className="overflow-hidden pt-0 border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full bg-white dark:bg-gray-800 group">
        <div className="relative h-56 overflow-hidden">
          <Image
            src={attraction.image || "/placeholder.svg"}
            alt={attraction.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          <div className="absolute top-3 left-3">
            <Badge className={`${getCategoryBadgeColor(attraction.category)} text-white flex items-center gap-2`}>
              {getCategoryIcon(attraction.category)}
              {attraction.category === "adrenalina"
                ? "ADRENALINA"
                : attraction.category === "acqua"
                  ? "ACQUATICA"
                  : "FAMIGLIA"}
            </Badge>
          </div>

          <div
            className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getWaitTimeColor(attraction.waitTime)}`}
          >
            {attraction.waitTime} min
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-xl font-bold text-white">{attraction.name}</h3>
            <p className="text-white/80 text-sm">{attraction.location}</p>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${star <= Math.floor(attraction.popularity) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
              />
            ))}
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{attraction.popularity.toFixed(1)}</span>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{attraction.shortDescription}</p>

          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              <Clock className="h-3 w-3 text-gray-500 dark:text-gray-400" />
              <span>{attraction.waitTime} min</span>
            </div>

            <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              <Ruler className="h-3 w-3 text-gray-500 dark:text-gray-400" />
              <span>{attraction.minHeight > 0 ? `Min: ${attraction.minHeight} cm` : "Nessun limite"}</span>
            </div>

            <div
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getIntensityColor(attraction.intensity)}`}
            >
              <AlertCircle className="h-3 w-3" />
              <span>{attraction.intensity}</span>
            </div>
          </div>

          <Button
            onClick={() => onSelect(attraction)}
            className={`w-full cursor-pointer bg-gradient-to-r ${getCategoryGradient(attraction.category)} text-white rounded-xl`}
          >
            Scopri di più
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
