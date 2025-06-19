"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import {
  Clock,
  MapPin,
  Plus,
  Trash2,
  CalendarIcon,
  Search,
  Filter,
  Zap,
  Droplets,
  Heart,
  PartyPopper,
  Download,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Ticket,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useData } from "@/providers/DataProvider"
import TopBar from "@/components/custom-components/topBar"
import jsPDF from "jspdf"

interface PlannerItem {
  id: number
  name: string
  description: string
  location: string
  duration: string | number
  waitTime?: number
  type: "attraction" | "show"
  category: string
  plannerId: string
  time?: string | null
}

// Funzione per ottenere l'icona della categoria
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "adrenalina":
      return <Zap className="h-5 w-5" />
    case "acqua":
      return <Droplets className="h-5 w-5" />
    case "famiglia":
      return <Heart className="h-5 w-5" />
    default:
      return <Info className="h-5 w-5" />
  }
}

// Funzione per ottenere il colore della categoria
const getCategoryColor = (category: string): string => {
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

// Funzione per ottenere il colore del gradiente della categoria
const getCategoryGradient = (category: string): string => {
  switch (category) {
    case "adrenalina":
      return "from-red-500 to-orange-600"
    case "acqua":
      return "from-blue-500 to-cyan-600"
    case "famiglia":
      return "from-amber-500 to-orange-600"
    default:
      return "from-gray-500 to-gray-600"
  }
}

// Funzione per formattare il tempo in ore e minuti
const formatTime = (minutes: number): string => {
  if (!minutes || isNaN(minutes)) return "0 min"
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}min` : `${mins} min`
}

export default function PlannerPage() {
  const [selectedItems, setSelectedItems] = useState<PlannerItem[]>([])
  const [activeTab, setActiveTab] = useState("attrazioni")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("tutte")
  const [visitDate, setVisitDate] = useState<Date | undefined>(new Date())
  const [plannerName, setPlannerName] = useState("Il mio itinerario")
  const [showConfirmation] = useState(false)
  const { attractions, shows} = useData()
  const plannerRef = useRef<HTMLDivElement>(null)

  const addToPlanner = (item: Omit<PlannerItem, 'type' | 'plannerId' | 'time'>, type: "attraction" | "show", time: string | null = null) => {
    const newItem: PlannerItem = {
      ...item,
      type,
      plannerId: `${type}-${item.id}-${Date.now()}`,
      time: time || undefined,
    }
    setSelectedItems([...selectedItems, newItem])
  }

  const removeFromPlanner = (plannerId: string) => {
    setSelectedItems(selectedItems.filter((item) => item.plannerId !== plannerId))
  }

  // Calcola il tempo totale stimato
  const totalTime = selectedItems.reduce((total, item) => {
    const itemDuration = Number(item.duration) || 0
    const waitTime = item.type === "attraction" ? (Number(item.waitTime) || 0) : 0
    return total + itemDuration + waitTime
  }, 0)

  // Filtra le attrazioni in base alla ricerca e alla categoria
  const filteredAttractions = attractions.filter((attraction) => {
    const matchesSearch =
      searchQuery === "" ||
      attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attraction.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attraction.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "tutte" || attraction.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Filtra gli spettacoli in base alla ricerca
  const filteredShows = shows.filter((show) => {
    return (
      searchQuery === "" ||
      show.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      show.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      show.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const downloadPDF = () => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Impostiamo il font
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(24)
      
      // Titolo
      pdf.text(plannerName || 'Il mio itinerario', 20, 20)
      
      // Data
      if (visitDate) {
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'normal')
        pdf.text(`Data visita: ${format(visitDate, 'dd/MM/yyyy', { locale: it })}`, 20, 30)
      }

      // Intestazione attività
      pdf.setFontSize(18)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Attività pianificate:', 20, 45)

      // Lista attività
      let yPosition = 55
      selectedItems.forEach((item, index) => {
        // Controllo se serve una nuova pagina
        if (yPosition > 270) {
          pdf.addPage()
          yPosition = 20
        }

        // Numero e nome attività
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text(`${index + 1}. ${item.name}`, 20, yPosition)
        yPosition += 8

        // Dettagli attività
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        pdf.text(`${item.location}`, 25, yPosition)
        yPosition += 7
        pdf.text(`Durata: ${item.duration} min`, 25, yPosition)
        yPosition += 7

        if (item.type === 'attraction') {
          pdf.text(`Tempo di attesa stimato: ${item.waitTime} min`, 25, yPosition)
          yPosition += 7
        }

        if (item.type === 'show' && item.time) {
          pdf.text(`Orario: ${item.time}`, 25, yPosition)
          yPosition += 7
        }

        // Spazio tra le attività
        yPosition += 10
      })

      // Riepilogo
      if (yPosition > 250) {
        pdf.addPage()
        yPosition = 20
      }

      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Riepilogo:', 20, yPosition)
      yPosition += 10

      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Tempo totale stimato: ${formatTime(totalTime)}`, 25, yPosition)
      yPosition += 7
      pdf.text(`Numero di attività: ${selectedItems.length}`, 25, yPosition)

      // Piè di pagina
      const pageCount = pdf.internal.pages.length
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i)
        pdf.setFontSize(10)
        pdf.text(
          `EnjoyPark - Pagina ${i} di ${pageCount}`,
          pdf.internal.pageSize.width / 2,
          pdf.internal.pageSize.height - 10,
          { align: 'center' }
        )
      }

      pdf.save(`${plannerName || 'itinerario'}.pdf`)
    } catch (error) {
      console.error('Errore durante la generazione del PDF:', error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
  

      <TopBar 
      title1="Pianifica la tua "
      badgeText="PIANIFICAZIONE"
      title2="visita"
      buttonLink="Visualizza la mappa"
      buttonText="Inizia a Pianificare"
      description="Crea il tuo itinerario personalizzato per vivere al meglio la tua giornata a EnjoyPark!"
      />

      {/* Sezione Principale Planner */}
      <section id="planner-section" className="py-12 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonna sinistra con attrazioni e spettacoli */}
            <div className="lg:col-span-2">
              <Card className="border-none shadow-xl overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 mb-8">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl flex items-center">
                      <Sparkles className="h-6 w-6 mr-2 text-purple-500" />
                      Attrazioni e Spettacoli
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Cerca..."
                          className="pl-9 rounded-full w-[200px]"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="icon" className="rounded-full">
                            <Filter className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-4" align="end">
                          <div className="space-y-2">
                            <h4 className="font-medium">Filtra per categoria</h4>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleziona categoria" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="tutte">Tutte le categorie</SelectItem>
                                <SelectItem value="adrenalina">Adrenalina</SelectItem>
                                <SelectItem value="acqua">Acqua</SelectItem>
                                <SelectItem value="famiglia">Famiglia</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <CardDescription>
                    Seleziona le attrazioni e gli spettacoli che vuoi includere nel tuo itinerario
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger
                        value="attrazioni"
                        className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                      >
                        Attrazioni
                      </TabsTrigger>
                      <TabsTrigger
                        value="spettacoli"
                        className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                      >
                        Spettacoli
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="attrazioni" className="mt-0">
                      {filteredAttractions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredAttractions.map((attraction) => (
                            <motion.div
                              key={attraction.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              whileHover={{ y: -5 }}
                            >
                              <Card className="overflow-hidden pt-0 border-none shadow-md hover:shadow-lg transition-all duration-300 h-full">
                                <div className="relative overflow-hidden h-40">
                                  <Image
                                    src={attraction.image || "/placeholder.svg"}
                                    alt={attraction.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                                  <div className="absolute top-3 left-3">
                                    <Badge className={`${getCategoryColor(attraction.category)} text-white`}>
                                      {attraction.category.charAt(0).toUpperCase() + attraction.category.slice(1)}
                                    </Badge>
                                  </div>
                                  {attraction.popularity > 4 && (
                                    <div className="absolute top-3 right-3">
                                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                                        Popolare
                                      </Badge>
                                    </div>
                                  )}
                                  <div className="absolute bottom-3 left-3 right-3">
                                    <h3 className="text-xl font-bold text-white">{attraction.name}</h3>
                                    <div className="flex items-center gap-1 text-white/80 text-sm">
                                      <MapPin className="h-3 w-3" />
                                      <span>{attraction.location}</span>
                                    </div>
                                  </div>
                                </div>
                                <CardContent className="p-4">
                                  <div className="flex flex-wrap gap-3 mb-4">
                                    <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                      <Clock className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                      <span>Durata: {attraction.duration} min</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                      <Clock className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                      <span>Attesa: {attraction.waitTime} min</span>
                                    </div>
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                                    {attraction.description}
                                  </p>
                                  <Button
                                    className={`w-full bg-gradient-to-r ${getCategoryGradient(attraction.category)} text-white rounded-xl`}
                                    onClick={() => addToPlanner(attraction, "attraction")}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Aggiungi al planner
                                  </Button>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <AlertCircle className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">Nessuna attrazione trovata</h3>
                          <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Prova a modificare i filtri o la ricerca
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSearchQuery("")
                              setCategoryFilter("tutte")
                            }}
                          >
                            Reimposta filtri
                          </Button>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="spettacoli" className="mt-0">
                      {filteredShows.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredShows.map((show) => (
                            <motion.div
                              key={show.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              whileHover={{ y: -5 }}
                            >
                              <Card className="overflow-hidden pt-0  border-none shadow-md hover:shadow-lg transition-all duration-300 h-full">
                                <div className="relative overflow-hidden h-40">
                                  <Image
                                    src={show.image || "/placeholder.svg"}
                                    alt={show.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                                  <div className="absolute top-3 left-3">
                                    <Badge className="bg-pink-500 text-white">Spettacolo</Badge>
                                  </div>
                                  {show.popular && (
                                    <div className="absolute top-3 right-3">
                                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                                        Popolare
                                      </Badge>
                                    </div>
                                  )}
                                  <div className="absolute bottom-3 left-3 right-3">
                                    <h3 className="text-xl font-bold text-white">{show.name}</h3>
                                    <div className="flex items-center gap-1 text-white/80 text-sm">
                                      <MapPin className="h-3 w-3" />
                                      <span>{show.location}</span>
                                    </div>
                                  </div>
                                </div>
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-1 text-sm mb-3">
                                    <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    <span>Durata: {show.duration} min</span>
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                                    {show.description}
                                  </p>
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Orari disponibili:</h4>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                      {show.times.map((time, index) => (
                                        <Button
                                          key={index}
                                          variant="outline"
                                          size="sm"
                                          className="rounded-full"
                                          onClick={() => addToPlanner(show, "show", time)}
                                        >
                                          <Clock className="h-3 w-3 mr-1" />
                                          {time}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <AlertCircle className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">Nessuno spettacolo trovato</h3>
                          <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Prova a modificare i filtri o la ricerca
                          </p>
                          <Button variant="outline" onClick={() => setSearchQuery("")}>
                            Reimposta ricerca
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Colonna destra con il planner */}
            <div>
              <div className="sticky top-4">
                <Card className="border-none shadow-xl overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-2 text-purple-500" />
                        Il tuo Itinerario
                      </CardTitle>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="rounded-full">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {visitDate ? format(visitDate, "dd/MM/yyyy", { locale: it }) : "Seleziona data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <Calendar
                            mode="single"
                            selected={visitDate}
                            onSelect={setVisitDate}
                            locale={it}
                            className="rounded-xl border-none"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-center">
                      <Input
                        value={plannerName}
                        onChange={(e) => setPlannerName(e.target.value)}
                        className="border-none bg-transparent p-0 text-base font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Nome itinerario"
                      />
                    </div>
                    <CardDescription>Trascina gli elementi per riordinare</CardDescription>
                  </CardHeader>
                  <CardContent ref={plannerRef}>
                    {selectedItems.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <p>Aggiungi attrazioni e spettacoli al tuo planner</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Seleziona le attrazioni e gli spettacoli che desideri visitare
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedItems.map((item) => (
                          <Card key={item.plannerId} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge
                                      className={`${
                                        item.type === "attraction"
                                          ? getCategoryColor(item.category)
                                          : "bg-pink-500"
                                      } text-white`}
                                    >
                                      {item.type === "attraction" ? (
                                        getCategoryIcon(item.category)
                                      ) : (
                                        <PartyPopper className="h-4 w-4" />
                                      )}
                                      {item.type === "attraction" ? item.category : "Spettacolo"}
                                    </Badge>
                                    {item.time && (
                                      <Badge variant="outline">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {item.time}
                                      </Badge>
                                    )}
                                  </div>
                                  <h3 className="font-medium mb-1">{item.name}</h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {item.location}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFromPlanner(item.plannerId)}
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    <Separator className="my-4" />

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Tempo totale stimato:</span>
                        <span className="font-medium">{formatTime(totalTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Numero di attività:</span>
                        <span className="font-medium">{selectedItems.length}</span>
                      </div>
                    </div>

                    {/* Conferma salvataggio */}
                    <AnimatePresence>
                      {showConfirmation && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-xl flex items-center gap-2"
                        >
                          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                          <span>Itinerario salvato con successo!</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3 pt-2">
                    <div className="flex gap-2 w-full">
                      <Button
                        variant="outline"
                        className="flex-1 rounded-xl"
                        disabled={selectedItems.length === 0}
                        asChild
                      >
                        <Link href="/mappa" className="flex items-center justify-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>Mappa</span>
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 rounded-xl" 
                        disabled={selectedItems.length === 0}
                        onClick={downloadPDF}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        <span>Scarica PDF</span>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>

                {/* Suggerimenti */}
                <Card className="border-none shadow-xl overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 mt-6">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-base">
                      <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                      Suggerimenti
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <Info className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5" />
                      <p>Pianifica le attrazioni più popolari nelle prime ore del mattino per evitare lunghe code.</p>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Info className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5" />
                      <p>Controlla gli orari degli spettacoli e organizza il tuo itinerario di conseguenza.</p>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Info className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5" />
                      <p>Considera i tempi di spostamento tra le diverse zone del parco.</p>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Info className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5" />
                      <p>
                        Alterna attrazioni ad alta adrenalina con momenti di relax per goderti al meglio la giornata.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-700 text-white relative overflow-hidden">
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
            <Badge className="bg-white/20 text-white mb-6 px-3 py-1 text-sm rounded-full">ACQUISTA ORA</Badge>
            <h2 className="text-4xl font-bold mb-6">Pronto per l&apos; avventura?</h2>
            <p className="text-xl mb-10 text-white/80">
              Acquista ora i tuoi biglietti e preparati a vivere un&apos; esperienza indimenticabile a EnjoyPark!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-purple-600 hover:bg-white/90 rounded-full px-8 py-6 text-lg group overflow-hidden relative"
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
                  <span className="absolute inset-0 w-full h-full bg-purple-600/10 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-300"></span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-white border-white/30 hover:bg-white/10 rounded-full px-8 py-6 text-lg"
              >
                <Link href="/attrazioni" className="flex items-center gap-2">
                  <span className="text-black">Esplora Attrazioni</span>
                  <ArrowRight className="h-5 w-5 text-black" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
