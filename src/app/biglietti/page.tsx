"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import {
  CalendarIcon,
  Check,
  CreditCard,
  Info,
  Ticket,
  Star,
  Clock,
  Users,
  Sparkles,
  Car,
  Utensils,
  ArrowRight,
  Plus,
  Minus,
  ShieldCheck,
  Gift,
  PartyPopper,
  CheckCircle2,
  MapPin,
  QrCode,
  Download,
  Share2,
  Smartphone,
  AlertCircle,
  User,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import TopBar from "@/components/custom-components/topBar"
import { useData } from "@/providers/DataProvider"
import { useTickets } from "@/providers/TicketProvider"
import TicketHolderForm from "@/components/custom-components/TicketHolderForm"
import QRCodeGenerator from "@/components/custom-components/QRCodeGenerator"

// Funzioni di utilità per gestire colori e icone dei biglietti
const getTicketColor = (id: string): string => {
  switch (id) {
    case "standard":
      return "from-emerald-500 to-teal-600"
    case "premium":
      return "from-amber-500 to-orange-600"
    case "family":
      return "from-blue-500 to-cyan-600"
    case "season":
      return "from-purple-500 to-violet-600"
    default:
      return "from-gray-500 to-gray-600"
  }
}

const getTicketIcon = (id: string) => {
  switch (id) {
    case "standard":
      return <Ticket className="h-5 w-5" />
    case "premium":
      return <Star className="h-5 w-5" />
    case "family":
      return <Users className="h-5 w-5" />
    case "season":
      return <Sparkles className="h-5 w-5" />
    default:
      return <Ticket className="h-5 w-5" />
  }
}

// Funzione di utilità per gestire le icone degli extra
const getExtraIcon = (id: string) => {
  switch (id) {
    case "fastpass":
      return <Clock className="h-5 w-5" />
    case "parking":
      return <Car className="h-5 w-5" />
    case "meal":
      return <Utensils className="h-5 w-5" />
    case "insurance":
      return <ShieldCheck className="h-5 w-5" />
    case "souvenir":
      return <Gift className="h-5 w-5" />
    case "photo":
      return <PartyPopper className="h-5 w-5" />
    default:
      return <Info className="h-5 w-5" />
  }
}

const handleQuantityChange = (action: 'increase' | 'decrease', setter: (value: number) => void, current: number) => {
  if (action === "increase") {
    setter(Math.min(current + 1, 10))
  } else {
    setter(Math.max(current - 1, 1))
  }
}

export default function TicketsPage() {
  const { tickets, extras, loading, error } = useData()
  const {
    selectedDate,
    setSelectedDate,
    adults,
    setAdults,
    children,
    setChildren,
    selectedTicketType,
    setSelectedTicketType,
    ticketHolders,
  } = useTickets()

  const [isLoaded, setIsLoaded] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    nameOnCard: "",
  })
  const [orderComplete, setOrderComplete] = useState(false)
  const [ticketView, setTicketView] = useState("grid")

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Caricamento biglietti...</p>
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

  const selectedTicketData = tickets.find((ticket) => ticket.id === selectedTicketType)

  // Calcola il totale degli extra
  const extrasTotal = selectedExtras.reduce((total, extraId) => {
    const extra = extras.find((option) => option.id === extraId)
    return total + (extra ? extra.price : 0)
  }, 0)

  // Calcola il totale complessivo
  const ticketTotal = selectedTicketData ? selectedTicketData.price * adults : 0
  const totalPrice = ticketTotal + extrasTotal

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleExtraToggle = (extraId: string) => {
    setSelectedExtras((prev) => {
      if (prev.includes(extraId)) {
        return prev.filter((id) => id !== extraId)
      } else {
        return [...prev, extraId]
      }
    })
  }

  const handleCompleteOrder = () => {
    if (isFormValid()) {
      // Qui andrebbe la logica per processare l'ordine
      setOrderComplete(true)
    }
  }

  if(!isLoaded) return null

  const isFormValid = () => {
    return (
      formData.email &&
      formData.phone &&
      formData.cardNumber &&
      formData.expiry &&
      formData.cvc &&
      formData.nameOnCard
    )
  }

  // Gestisci il cambio di quantità per bambini
  const handleChildrenQuantityChange = (action: 'increase' | 'decrease') => {
    handleQuantityChange(action, setChildren, children)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <TopBar
      badgeText='ACQUISTA ORA'
        title1="Biglietti "
        title2="EnjoyPark"
        description="Acquista i tuoi biglietti online e preparati a vivere un'esperienza indimenticabile nel nostro parco divertimenti!"
                  buttonText="Acquista ora"
                  buttonLink="Informazioni"
      />

      {/* Sezione Principale Biglietti */}
      <section id="tickets-section" className="py-12 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Contenuto principale */}
            <div className="flex-1">
              {/* Indicatore di progresso */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${step >= 1 ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"}`}
                    >
                      {step > 1 ? <Check className="h-5 w-5" /> : <span>1</span>}
                    </div>
                    <div className={`ml-2 ${step >= 1 ? "text-emerald-500 font-medium" : "text-gray-500"}`}>
                      Biglietti
                    </div>
                  </div>
                  <div className={`h-px w-12 ${step >= 2 ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"}`}></div>
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${step >= 2 ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"}`}
                    >
                      {step > 2 ? <Check className="h-5 w-5" /> : <span>2</span>}
                    </div>
                    <div className={`ml-2 ${step >= 2 ? "text-emerald-500 font-medium" : "text-gray-500"}`}>Extra</div>
                  </div>
                  <div className={`h-px w-12 ${step >= 3 ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"}`}></div>
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${step >= 3 ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"}`}
                    >
                      {step > 3 ? <Check className="h-5 w-5" /> : <span>3</span>}
                    </div>
                    <div className={`ml-2 ${step >= 3 ? "text-emerald-500 font-medium" : "text-gray-500"}`}>
                      Pagamento
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 1: Selezione biglietti */}
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <Card className="border-none shadow-xl overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="flex items-center text-2xl">
                            <Ticket className="h-6 w-6 mr-2 text-emerald-500" />
                            Seleziona il tipo di biglietto
                          </CardTitle>
                          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                            <Button
                              variant={ticketView === "grid" ? "default" : "ghost"}
                              size="sm"
                              className={ticketView === "grid" ? "bg-emerald-500" : ""}
                              onClick={() => setTicketView("grid")}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-layout-grid"
                              >
                                <rect width="7" height="7" x="3" y="3" rx="1" />
                                <rect width="7" height="7" x="14" y="3" rx="1" />
                                <rect width="7" height="7" x="14" y="14" rx="1" />
                                <rect width="7" height="7" x="3" y="14" rx="1" />
                              </svg>
                            </Button>
                            <Button
                              variant={ticketView === "list" ? "default" : "ghost"}
                              size="sm"
                              className={ticketView === "list" ? "bg-emerald-500" : ""}
                              onClick={() => setTicketView("list")}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-list"
                              >
                                <line x1="8" x2="21" y1="6" y2="6" />
                                <line x1="8" x2="21" y1="12" y2="12" />
                                <line x1="8" x2="21" y1="18" y2="18" />
                                <line x1="3" x2="3.01" y1="6" y2="6" />
                                <line x1="3" x2="3.01" y1="12" y2="12" />
                                <line x1="3" x2="3.01" y1="18" y2="18" />
                              </svg>
                            </Button>
                          </div>
                        </div>
                        <CardDescription className="text-base">
                          Scegli il biglietto più adatto alle tue esigenze
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup value={selectedTicketType} onValueChange={setSelectedTicketType} className="space-y-6">
                          {ticketView === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {tickets.map((ticket) => (
                                <div key={ticket.id} className="relative ">
                                  <RadioGroupItem value={ticket.id} id={ticket.id} className="peer sr-only" />
                                  <Label
                                    htmlFor={ticket.id}
                                    className="flex flex-col items-start h-full p-6 border rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-50 dark:peer-data-[state=checked]:bg-emerald-950/20 dark:hover:bg-gray-800"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex items-center gap-2">
                                        <div
                                          className={`w-10 h-10 rounded-full bg-gradient-to-r ${getTicketColor(ticket.id)} flex items-center justify-center text-white`}
                                        >
                                          {getTicketIcon(ticket.id)}
                                        </div>
                                        <span className="font-bold text-lg">{ticket.name}</span>
                                      </div>
                                      {ticket.badge && (
                                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                                          {ticket.badge}
                                        </Badge>
                                      )}
                                    </div>

                                    {/* <div className="mt-4 relative w-full h-32 rounded-lg overflow-hidden">
                                      <Image
                                        src={ticket.image || "/placeholder.svg"}
                                        alt={ticket.name}
                                        fill
                                        className="object-cover transition-transform duration-300 hover:scale-105"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    </div> */}
                                      
                                        <div className="mt-4 text-2xl font-bold text-black">{ticket.price}€</div>
                                        <div className="text-sm text-black">a persona</div>
                                      

                                    <p className="text-gray-600 dark:text-gray-300 mt-4">{ticket.description}</p>

                                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                                      <ul className="space-y-2">
                                        {ticket.features.map((feature, index) => (
                                          <li key={index} className="text-sm flex items-center">
                                            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-2">
                                              <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            {feature}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div className="absolute top-4 right-4 w-4 h-4 rounded-full border-2 border-gray-300 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-500"></div>
                                  </Label>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {tickets.map((ticket) => (
                                <div key={ticket.id} className="relative ">
                                  <RadioGroupItem value={ticket.id} id={`list-${ticket.id}`} className="peer sr-only" />
                                  <Label
                                    htmlFor={`list-${ticket.id}`}
                                    className="flex  items-start p-4 border rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-50 dark:peer-data-[state=checked]:bg-emerald-950/20 dark:hover:bg-gray-800"
                                  >
                                    <div className="flex-shrink-0 mr-4">
                                      <div
                                        className={`w-12 h-12 rounded-full bg-gradient-to-r ${getTicketColor(ticket.id)} flex items-center justify-center text-white`}
                                      >
                                        {getTicketIcon(ticket.id)}
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h3 className="font-bold text-lg">{ticket.name}</h3>
                                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                                            {ticket.description}
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                            {ticket.price}€
                                          </div>
                                          <div className="text-sm text-gray-500">a persona</div>
                                        </div>
                                      </div>
                                      <div className="mt-3 flex flex-wrap gap-2">
                                        {ticket.features.map((feature, index) => (
                                          <Badge
                                            key={index}
                                            variant="outline"
                                            className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800"
                                          >
                                            <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                            {feature}
                                          </Badge>
                                        ))}
                                      </div>
                                      {ticket.badge && (
                                        <div className="absolute top-22 right-3">
                                          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                                            {ticket.badge}
                                          </Badge>
                                        </div>
                                      )}
                                    </div>
                                    <div className="ml-4 mt-1">
                                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-500 flex items-center justify-center">
                                        {selectedTicketType === ticket.id && <Check className="h-3 w-3 text-white" />}
                                      </div>
                                    </div>
                                  </Label>
                                </div>
                              ))}
                            </div>
                          )}
                        </RadioGroup>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                      <CardHeader>
                        <CardTitle className="flex items-center text-2xl">
                          <CalendarIcon className="h-6 w-6 mr-2 text-emerald-500" />
                          Seleziona la data e la quantità
                        </CardTitle>
                        <CardDescription className="text-base">
                          Scegli quando visitare il parco e quanti biglietti acquistare
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <Label htmlFor="date" className="block mb-3 text-base">
                              Data della visita
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  id="date"
                                  variant={"outline"}
                                  className="w-full justify-start text-left font-normal rounded-xl h-12"
                                >
                                  {selectedDate ? (
                                    format(selectedDate, "PPP", { locale: it })
                                  ) : (
                                    <span className="text-gray-500">Seleziona una data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={setSelectedDate}
                                  locale={it}
                                  disabled={(date) => date < new Date()}
                                  className="rounded-xl border-none"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div>
                            <Label className="block mb-3 text-base">Numero di adulti</Label>
                            <div className="flex items-center h-12 rounded-xl border border-input bg-background">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-full rounded-l-xl"
                                onClick={() => handleQuantityChange('decrease', setAdults, adults)}
                                disabled={adults <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <div className="flex-1 text-center font-medium">{adults}</div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-full rounded-r-xl"
                                onClick={() => handleQuantityChange('increase', setAdults, adults)}
                                disabled={adults >= 10}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Sezione selezione quantità bambini */}
                        <Label htmlFor="date" className="block mb-3 text-base">
                          Numero di bambini
                        </Label>
                        <div className="flex items-center bg-white/50 dark:bg-purple-900/50 backdrop-blur-sm rounded-2xl h-14 border-2 border-purple-200 dark:border-purple-700">
                          <button
                            className="p-4 hover:bg-purple-100/50 dark:hover:bg-purple-800/50 rounded-l-2xl text-purple-600 dark:text-purple-400 disabled:opacity-50"
                            onClick={() => handleChildrenQuantityChange('decrease')}
                            disabled={children <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <div className="flex-1 text-center py-2 font-medium text-purple-900 dark:text-purple-100">
                            {children}
                          </div>
                          <button
                            className="p-4 hover:bg-purple-100/50 dark:hover:bg-purple-800/50 rounded-r-2xl text-purple-600 dark:text-purple-400 disabled:opacity-50"
                            onClick={() => handleChildrenQuantityChange('increase')}
                            disabled={children >= 10}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl h-12 text-base group overflow-hidden relative"
                          disabled={!selectedDate}
                          onClick={() => setStep(2)}
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            Continua
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </span>
                          <span className="absolute inset-0 w-full h-full bg-white/20 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-300"></span>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )}

                {/* Step 2: Selezione extra */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-none shadow-xl overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                      <CardHeader>
                        <CardTitle className="flex items-center text-2xl">
                          <Sparkles className="h-6 w-6 mr-2 text-emerald-500" />
                          Aggiungi servizi extra
                        </CardTitle>
                        <CardDescription className="text-base">
                          Personalizza la tua esperienza con servizi aggiuntivi
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {extras.map((extra) => (
                            <div
                              key={extra.id}
                              className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
                                selectedExtras.includes(extra.id)
                                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                                  : "hover:border-gray-300 dark:hover:bg-gray-800"
                              }`}
                              onClick={() => handleExtraToggle(extra.id)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                  {getExtraIcon(extra.id)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center">
                                    <h3 className="font-medium">{extra.name}</h3>
                                    <div className="font-bold text-emerald-600 dark:text-emerald-400">
                                      {extra.price}€
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{extra.description}</p>
                                </div>
                                <div
                                  className={`w-5 h-5 rounded-full border flex-shrink-0 ${
                                    selectedExtras.includes(extra.id)
                                      ? "border-emerald-500 bg-emerald-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {selectedExtras.includes(extra.id) && <Check className="h-4 w-4 text-white" />}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6">
                        <Button variant="outline" onClick={() => setStep(1)} className="w-full sm:w-auto rounded-xl">
                          Indietro
                        </Button>
                        <Button
                          className="w-full sm:flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl group overflow-hidden relative"
                          onClick={() => setStep(3)}
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            Continua
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </span>
                          <span className="absolute inset-0 w-full h-full bg-white/20 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-300"></span>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )}

                {/* Step 3: Pagamento */}
                {step === 3 && !orderComplete && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-none shadow-xl overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                      <CardHeader>
                        <CardTitle className="flex items-center text-2xl">
                          <User className="h-6 w-6 mr-2 text-emerald-500" />
                          Dati dei partecipanti
                        </CardTitle>
                        <CardDescription className="text-base">
                          Inserisci i dati di ogni partecipante per completare l&apos;acquisto
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <TicketHolderForm onComplete={() => setStep(4)} />
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {step === 4 && !orderComplete && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-none shadow-xl overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                      <CardHeader>
                        <CardTitle className="flex items-center text-2xl">
                          <CreditCard className="h-6 w-6 mr-2 text-emerald-500" />
                          Dati di pagamento
                        </CardTitle>
                        <CardDescription className="text-base">
                          Inserisci i tuoi dati per completare l&apos;acquisto
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="card" className="w-full">
                          <TabsList className="grid w-full grid-cols-3 mb-6">
                            <TabsTrigger
                              value="card"
                              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                            >
                              Carta di credito
                            </TabsTrigger>
                            <TabsTrigger
                              value="paypal"
                              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                            >
                              PayPal
                            </TabsTrigger>
                            <TabsTrigger
                              value="bank"
                              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                            >
                              Bonifico
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="card" className="space-y-6">
                            <div className="space-y-5">
                              <div>
                                <Label htmlFor="email" className="text-base mb-1.5 block">
                                  Email
                                </Label>
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="Inserisci la tua email"
                                  className="rounded-xl h-12"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div>
                                <Label htmlFor="phone" className="text-base mb-1.5 block">
                                  Telefono
                                </Label>
                                <Input
                                  id="phone"
                                  type="tel"
                                  placeholder="Inserisci il tuo numero di telefono"
                                  className="rounded-xl h-12"
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>

                            <div className="space-y-5 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <h3 className="text-lg font-medium">Metodo di pagamento</h3>
                              <div>
                                <Label htmlFor="cardNumber" className="text-base mb-1.5 block">
                                  Numero carta
                                </Label>
                                <Input
                                  id="cardNumber"
                                  placeholder="1234 5678 9012 3456"
                                  className="rounded-xl h-12"
                                  value={formData.cardNumber}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="expiry" className="text-base mb-1.5 block">
                                    Data di scadenza
                                  </Label>
                                  <Input
                                    id="expiry"
                                    placeholder="MM/AA"
                                    className="rounded-xl h-12"
                                    value={formData.expiry}
                                    onChange={handleInputChange}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="cvc" className="text-base mb-1.5 block">
                                    CVC
                                  </Label>
                                  <Input
                                    id="cvc"
                                    placeholder="123"
                                    className="rounded-xl h-12"
                                    value={formData.cvc}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="nameOnCard" className="text-base mb-1.5 block">
                                  Nome sulla carta
                                </Label>
                                <Input
                                  id="nameOnCard"
                                  placeholder="Inserisci il nome sulla carta"
                                  className="rounded-xl h-12"
                                  value={formData.nameOnCard}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="paypal">
                            <div className="py-8 text-center">
                              <Image
                                src="/placeholder.svg?height=60&width=200&text=PayPal"
                                alt="PayPal"
                                width={200}
                                height={60}
                                className="mx-auto mb-6"
                              />
                              <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Verrai reindirizzato al sito di PayPal per completare il pagamento in modo sicuro.
                              </p>
                              <Button className="bg-[#0070ba] hover:bg-[#005ea6] text-white rounded-xl">
                                Procedi con PayPal
                              </Button>
                            </div>
                          </TabsContent>

                          <TabsContent value="bank">
                            <div className="py-6 space-y-4">
                              <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-xl">
                                <h4 className="font-medium mb-2">Dati per il bonifico</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Intestatario:</span>
                                    <span className="font-medium">EnjoyPark S.p.A.</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">IBAN:</span>
                                    <span className="font-medium">IT12A0123456789000000123456</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Banca:</span>
                                    <span className="font-medium">Banca Esempio</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Causale:</span>
                                    <span className="font-medium">
                                      Biglietti EnjoyPark - {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: it }) : ""}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Dopo aver effettuato il bonifico, riceverai i biglietti via email entro 24 ore dalla
                                conferma del pagamento.
                              </p>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                      <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6">
                        <Button variant="outline" onClick={() => setStep(3)} className="w-full sm:w-auto rounded-xl">
                          Indietro
                        </Button>
                        <Button
                          className="w-full sm:flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl group overflow-hidden relative"
                          onClick={handleCompleteOrder}
                          disabled={!isFormValid()}
                        >
                          <span className="relative z-10">Completa acquisto</span>
                          <span className="absolute inset-0 w-full h-full bg-white/20 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-300"></span>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )}

                {/* Ordine completato */}
                {orderComplete && (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="border-none shadow-xl overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 text-center">
                      <CardContent className="pt-12 pb-8 px-6">
                        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
                          <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Ordine completato con successo!</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                          Grazie per il tuo acquisto! I biglietti sono stati inviati alla tua email e saranno
                          disponibili anche nella tua area personale.
                        </p>

                        {/* Biglietti con nominativi */}
                        <div className="space-y-6 mb-8">
                          {ticketHolders.map((holder, index) => (
                            <motion.div
                              key={index}
                              className="relative bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl overflow-hidden shadow-xl max-w-md mx-auto"
                              initial={{ rotateY: 180 }}
                              animate={{ rotateY: 0 }}
                              transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
                            >
                              <div className="p-6 text-white">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="text-xl font-bold">
                                      {holder.ticketType === "adult" ? "Biglietto Adulto" : "Biglietto Bambino"}
                                    </h3>
                                    <p className="text-white/80 text-sm">
                                      {selectedDate ? format(selectedDate, "PPP", { locale: it }) : ""}
                                    </p>
                                  </div>
                                  <div className="bg-white/20 p-2 rounded-lg">
                                    <QRCodeGenerator
                                      data={JSON.stringify({
                                        ticketId: `EP${Math.floor(Math.random() * 10000)}`,
                                        type: holder.ticketType,
                                        name: `${holder.firstName} ${holder.lastName}`,
                                        date: selectedDate,
                                      })}
                                      size={100}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>{holder.firstName} {holder.lastName}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span>Data di nascita: {format(new Date(holder.dateOfBirth), "dd/MM/yyyy")}</span>
                                  </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/20 flex justify-between">
                                  <div>
                                    <div className="text-sm text-white/70">Numero biglietto</div>
                                    <div className="font-medium">#{index + 1}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-white/70">Prezzo</div>
                                    <div className="font-bold">
                                      {holder.ticketType === "adult" ? "29,90€" : "19,90€"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button variant="outline" className="rounded-xl" asChild>
                            <Link href="/">Torna alla home</Link>
                          </Button>
                          <Button
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl flex items-center gap-2"
                            asChild
                          >
                            <Link href="/planner">
                              <span>Pianifica la tua visita</span>
                              <CalendarIcon className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>

                        <div className="flex justify-center gap-3 mt-6">
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <Download className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <Share2 className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <Smartphone className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar con riepilogo ordine */}
            <div className="md:w-80 flex-shrink-0">
              <div className="sticky top-4">
                <Card className="border-none shadow-xl overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center">
                      <Ticket className="h-5 w-5 mr-2 text-emerald-500" />
                      Riepilogo ordine
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedTicketData && (
                      <>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-full bg-gradient-to-r ${getTicketColor(selectedTicketType)} flex items-center justify-center text-white`}
                            >
                              {getTicketIcon(selectedTicketType)}
                            </div>
                            <span className="font-medium">{selectedTicketData.name}</span>
                          </div>
                          <span>{selectedTicketData.price}€</span>
                        </div>

                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>Quantità</span>
                          <span>{adults}</span>
                        </div>

                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>Subtotale biglietti</span>
                          <span>{ticketTotal}€</span>
                        </div>

                        {selectedDate && (
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Data</span>
                            <span>{format(selectedDate, "PPP", { locale: it })}</span>
                          </div>
                        )}

                        {selectedExtras.length > 0 && (
                          <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                            <div className="font-medium">Extra selezionati</div>
                            {selectedExtras.map((extraId) => {
                              const extra = extras.find((option) => option.id === extraId)
                              return extra ? (
                                <div key={extra.id} className="flex justify-between text-sm">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                      {getExtraIcon(extra.id)}
                                    </div>
                                    <span>{extra.name}</span>
                                  </div>
                                  <span>{extra.price}€</span>
                                </div>
                              ) : null
                            })}
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 pt-1">
                              <span>Subtotale extra</span>
                              <span>{extrasTotal}€</span>
                            </div>
                          </div>
                        )}

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between font-bold text-lg">
                            <span>Totale</span>
                            <span className="text-emerald-600 dark:text-emerald-400">{totalPrice}€</span>
                          </div>
                        </div>

                        <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-xl text-sm flex items-start gap-2 mt-2">
                          <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                          <p className="text-gray-700 dark:text-gray-300">
                            I biglietti saranno inviati via email dopo il completamento dell'acquisto. Potrai accedere
                            al parco mostrando il QR code ricevuto.
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Card informazioni aggiuntive */}
                <Card className="border-none shadow-xl overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 mt-6">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-base">
                      <ShieldCheck className="h-5 w-5 mr-2 text-emerald-500" />
                      Acquisto sicuro
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                      <p>Pagamento sicuro e crittografato</p>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                      <p>Biglietti digitali inviati via email</p>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                      <p>Assistenza clienti 7 giorni su 7</p>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                      <p>Cambio data gratuito fino a 48h prima</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sezione FAQ */}
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
            <Badge className="bg-emerald-100 text-emerald-800 mb-4 px-3 py-1 text-sm rounded-full">FAQ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Domande frequenti</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Trova le risposte alle domande più comuni sui biglietti e le prenotazioni
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-none shadow-xl overflow-hidden rounded-2xl h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mr-2">
                      <Info className="h-4 w-4" />
                    </div>
                    I biglietti hanno una data fissa?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Sì, i biglietti standard e premium sono validi solo per la data selezionata durante l'acquisto. Gli
                    abbonamenti stagionali invece consentono l'accesso illimitato per tutta la stagione di apertura del
                    parco.
                  </p>
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
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mr-2">
                      <Info className="h-4 w-4" />
                    </div>
                    Posso modificare la data dopo l'acquisto?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    È possibile modificare la data dei biglietti fino a 48 ore prima della visita senza costi
                    aggiuntivi. Per farlo, accedi alla tua area personale o contatta il nostro servizio clienti.
                  </p>
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
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mr-2">
                      <Info className="h-4 w-4" />
                    </div>
                    Come funziona il Fast Pass?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Il Fast Pass ti permette di saltare la fila alle attrazioni principali del parco. Una volta
                    acquistato, riceverai un QR code specifico che potrai utilizzare agli ingressi prioritari delle
                    attrazioni aderenti.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="border-none shadow-xl overflow-hidden rounded-2xl h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mr-2">
                      <Info className="h-4 w-4" />
                    </div>
                    I bambini pagano?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    I bambini sotto i 3 anni entrano gratuitamente. Per i bambini dai 3 ai 12 anni sono disponibili
                    tariffe ridotte. Il pacchetto famiglia include 2 biglietti adulti e 2 biglietti bambini a un prezzo
                    scontato.
                  </p>
                </CardContent>
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
            <Badge className="bg-white/20 text-white mb-6 px-3 py-1 text-sm rounded-full">SCOPRI DI PIÙ</Badge>
            <h2 className="text-4xl font-bold mb-6">Esplora tutte le attrazioni</h2>
            <p className="text-xl mb-10 text-white/80">
              Scopri tutte le attrazioni e gli spettacoli che ti aspettano a EnjoyPark per una giornata indimenticabile!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-emerald-600 hover:bg-white/90 rounded-full px-8 py-6 text-lg group overflow-hidden relative"
              >
                <Link href="/attrazioni">
                  <span className="relative z-10 flex items-center gap-2">
                    Esplora Attrazioni
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                    >
                      <Sparkles className="h-5 w-5" />
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
                <Link href="/mappa" className="flex items-center gap-2">
                  <span className="text-black">Mappa del Parco</span>
                  <motion.div
                    animate={{ rotate: [0, 15, 0, -15, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 1 }}
                  >
                    <MapPin className="h-5 w-5 text-black" />
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
