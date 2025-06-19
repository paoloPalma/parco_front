"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import {
  CalendarIcon,
  Plus,
  Minus,
  Star,
  Sparkles,
  Ticket,
  PartyPopper,
  Heart,
  Zap,
  Droplets,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useTickets } from "@/providers/TicketProvider"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const {
    selectedDate,
    setSelectedDate,
    adults,
    setAdults,
    children,
    setChildren,
  } = useTickets()

  const [activeAttraction, setActiveAttraction] = useState(0)
  const [showConfetti] = useState(false)
  const [floatingElements, setFloatingElements] = useState<Array<{
    id: number;
    width: number;
    height: number;
    top: number;
    left: number;
    color: string;
    duration: number;
  }>>([])
  const [confettiElements, setConfettiElements] = useState<Array<{
    id: number;
    left: number;
    color: string;
    delay: number;
  }>>([])
  const [backgroundElements, setBackgroundElements] = useState<Array<{
    id: number;
    width: number;
    height: number;
    top: number;
    left: number;
    duration: number;
  }>>([])

  useEffect(() => {
    // Cambia automaticamente l'attrazione attiva ogni 4 secondi
    const interval = setInterval(() => {
      setActiveAttraction((prev) => (prev + 1) % 4)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  // Inizializza gli elementi fluttuanti solo lato client
  useEffect(() => {
    setFloatingElements(
      Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        width: Math.random() * 50 + 20,
        height: Math.random() * 50 + 20,
        top: Math.random() * 100,
        left: Math.random() * 100,
        color: `hsl(${Math.random() * 360}, 70%, 80%)`,
        duration: Math.random() * 5 + 5
      }))
    )

    setBackgroundElements(
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        width: Math.random() * 100 + 50,
        height: Math.random() * 100 + 50,
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: Math.random() * 5 + 5
      }))
    )
  }, [])

  // Genera elementi confetti quando necessario
  useEffect(() => {
    if (showConfetti) {
      setConfettiElements(
        Array.from({ length: 100 }).map((_, i) => ({
          id: i,
          left: Math.random() * 100,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`,
          delay: Math.random() * 2
        }))
      )
    } else {
      setConfettiElements([])
    }
  }, [showConfetti])

  const attractions = [
    {
      name: "Tornado Extreme",
      color: "#FF5757",
      icon: <Zap className="h-5 w-5" />,
    },
    {
      name: "Splash Mountain",
      color: "#5E9EFF",
      icon: <Droplets className="h-5 w-5" />,
    },
    {
      name: "Jungle River",
      color: "#4CD964",
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      name: "Fantasy Carousel",
      color: "#FFBD3D",
      icon: <Heart className="h-5 w-5" />,
    },
  ]

  // Calcola il prezzo totale
  const totalPrice = adults * 29.9 + children * 19.9

  // Gestisci il cambio di quantità
  const handleQuantityChange = (action: 'increase' | 'decrease', setter: (value: number) => void, current: number) => {
    if (action === "increase") {
      setter(Math.min(current + 1, 10))
    } else {
      setter(Math.max(current - 1, 1))
    }
  }

  // Gestisci il click sul pulsante acquista
  const handleBuyClick = () => {
    if (selectedDate) {
      router.push("/biglietti")
    }
  }

  return (
    <div className="pt-22 flex flex-col bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {confettiElements.map((confetti) => (
            <motion.div
              key={confetti.id}
              className="absolute w-3 h-3 rounded-full"
              initial={{
                top: "-10%",
                left: `${confetti.left}%`,
                backgroundColor: confetti.color,
              }}
              animate={{
                top: "110%",
                rotate: [0, 360],
                scale: [0, 1, 0.5],
              }}
              transition={{
                duration: 4,
                ease: "easeOut",
                delay: confetti.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full opacity-70"
            style={{
              width: `${element.width}px`,
              height: `${element.height}px`,
              backgroundColor: element.color,
              top: `${element.top}%`,
              left: `${element.left}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: element.duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <section className="relative rounded-[40px] overflow-hidden mb-12 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=500')] bg-repeat opacity-10"></div>

          {/* Animated Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-400 rounded-full opacity-20 blur-3xl"></div>

          <div className="relative z-10 py-12 px-6 md:py-16 md:px-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Badge className="bg-yellow-400 text-blue-900 px-4 py-1.5 text-sm rounded-full font-bold mb-4">
                    DIVERTIMENTO 2025
                  </Badge>

                  <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                    <span className="block">Un mondo di</span>
                    <motion.span
                      className="text-yellow-300 inline-block"
                      animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      magia
                    </motion.span>
                    <span> ti aspetta!</span>
                  </h1>

                  <p className="text-xl mb-6 text-white/90 max-w-md">
                    Vivi un&apos; esperienza indimenticabile nel parco divertimenti più emozionante d&apos;Italia!
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Button
                      size="lg"
                      className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold border-0 rounded-full px-8 text-lg"
                    >
                      <Link href="/attrazioni" className="flex items-center gap-2">
                        <span>Esplora</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                        >
                          <Star className="h-5 w-5 fill-blue-900" />
                        </motion.div>
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="text-black border-white hover:bg-white/20 rounded-full px-8 text-lg"
                    >
                      <Link href="/mappa" className="flex items-center gap-2">
                        <span>Mappa</span>
                        <MapPin className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </div>

              {/* Animated Attractions Showcase */}
              <div className="relative h-[300px] md:h-[400px]">
                <AnimatePresence mode="wait">
                  {attractions.map(
                    (attraction, index) =>
                      activeAttraction === index && (
                        <motion.div
                          key={attraction.name}
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="relative w-full h-full max-w-md mx-auto">
                            <div
                              className="absolute inset-0 rounded-[30px] shadow-2xl"
                              style={{ backgroundColor: attraction.color }}
                            ></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                              <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                className="mb-4"
                              >
                                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                                  {attraction.icon}
                                </div>
                              </motion.div>
                              <h3 className="text-2xl font-bold mb-2">{attraction.name}</h3>
                              <p className="text-center text-white/80">
                                Un&apos;esperienza unica che ti lascerà senza fiato!
                              </p>
                              <Button className="mt-4 bg-white text-blue-900 hover:bg-white/90 rounded-full" asChild>
                                <Link href="/attrazioni">Scopri di più</Link>
                              </Button>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-yellow-400"></div>
                            <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-pink-400"></div>
                          </div>
                        </motion.div>
                      ),
                  )}
                </AnimatePresence>

                {/* Indicator dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {attractions.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all ${
                        activeAttraction === index ? "bg-white scale-125" : "bg-white/50"
                      }`}
                      onClick={() => setActiveAttraction(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ticket Purchase Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Elementi decorativi di sfondo */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30"></div>
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-300/20 dark:bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-pink-300/20 dark:bg-pink-600/20 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mb-4">
                  BIGLIETTI
                </Badge>
                <h2 className="text-4xl pb-2 font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-4">
                  Acquista i tuoi biglietti
                </h2>
                <p className="text-lg text-purple-700 dark:text-purple-300">
                  Prenota ora la tua avventura a EnjoyPark e risparmia con le nostre offerte
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Form biglietti */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Image src="/home.jpg" alt="Biglietti" width={1000} height={1000} className="rounded-3xl" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="border-none shadow-2xl overflow-hidden rounded-3xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                  <CardContent className="p-8 space-y-8">
                    {/* Data */}
                    <div className="space-y-3">
                      <label className="block text-base font-medium text-purple-900 dark:text-purple-100">
                        Seleziona la data della visita
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal rounded-2xl h-14 border-2 ${
                              selectedDate
                                ? "border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/50"
                                : "border-gray-200 dark:border-gray-700"
                            }`}
                          >
                            {selectedDate ? (
                              <span className="text-purple-900 dark:text-purple-100">
                                {format(selectedDate, "PPP", { locale: it })}
                              </span>
                            ) : (
                              <span className="text-gray-500 dark:text-gray-400">Seleziona una data</span>
                            )}
                            <CalendarIcon className="ml-auto h-5 w-5 text-purple-500 dark:text-purple-400" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            locale={it}
                            disabled={(date) => date < new Date()}
                            className="rounded-xl border-2 border-purple-200 dark:border-purple-800"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Adulti */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="block text-base font-medium text-purple-900 dark:text-purple-100">
                          Adulti
                        </label>
                        <Badge variant="outline" className="text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-700">
                          €29,90 / persona
                        </Badge>
                      </div>
                      <div className="flex items-center bg-purple-50 dark:bg-purple-900/50 backdrop-blur-sm rounded-2xl h-14 border-2 border-purple-300 dark:border-purple-700">
                        <button
                          className="p-4 hover:bg-purple-100 dark:hover:bg-purple-800/50 rounded-l-2xl text-purple-600 dark:text-purple-400 disabled:opacity-50 transition-colors"
                          onClick={() => handleQuantityChange('decrease', setAdults, adults)}
                          disabled={adults <= 1}
                        >
                          <Minus className="h-5 w-5" />
                        </button>
                        <div className="flex-1 text-center py-2 font-semibold text-2xl text-purple-900 dark:text-purple-100">
                          {adults}
                        </div>
                        <button
                          className="p-4 hover:bg-purple-100 dark:hover:bg-purple-800/50 rounded-r-2xl text-purple-600 dark:text-purple-400 disabled:opacity-50 transition-colors"
                          onClick={() => handleQuantityChange('increase', setAdults, adults)}
                          disabled={adults >= 10}
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Bambini */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="block text-base font-medium text-purple-900 dark:text-purple-100">
                          Bambini (fino a 12 anni)
                        </label>
                        <Badge variant="outline" className="text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-700">
                          €19,90 / persona
                        </Badge>
                      </div>
                      <div className="flex items-center bg-purple-50 dark:bg-purple-900/50 backdrop-blur-sm rounded-2xl h-14 border-2 border-purple-300 dark:border-purple-700">
                        <button
                          className="p-4 hover:bg-purple-100 dark:hover:bg-purple-800/50 rounded-l-2xl text-purple-600 dark:text-purple-400 disabled:opacity-50 transition-colors"
                          onClick={() => handleQuantityChange('decrease', setChildren, children)}
                          disabled={children <= 0}
                        >
                          <Minus className="h-5 w-5" />
                        </button>
                        <div className="flex-1 text-center py-2 font-semibold text-2xl text-purple-900 dark:text-purple-100">
                          {children}
                        </div>
                        <button
                          className="p-4 hover:bg-purple-100 dark:hover:bg-purple-800/50 rounded-r-2xl text-purple-600 dark:text-purple-400 disabled:opacity-50 transition-colors"
                          onClick={() => handleQuantityChange('increase', setChildren, children)}
                          disabled={children >= 10}
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Promozioni */}
                    <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-purple-900 dark:text-purple-100">Promozione Famiglia</h4>
                          <p className="text-sm text-purple-700 dark:text-purple-300">
                            Acquista 2 biglietti adulti e 2 bambini e ricevi uno sconto del 10%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Totale e pulsante acquista */}
                    <div className="pt-6 border-t border-purple-200 dark:border-purple-800">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <span className="text-lg font-medium text-purple-900 dark:text-purple-100">
                            Totale
                          </span>
                          <p className="text-sm text-purple-600 dark:text-purple-400">
                            {adults + children} biglietti
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                            €{totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <Button
                        className="w-full bg-gradient-to-r cursor-pointer from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl h-14 text-lg font-medium group overflow-hidden relative"
                        disabled={!selectedDate}
                        onClick={handleBuyClick}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Acquista ora
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            <Ticket className="h-5 w-5" />
                          </motion.div>
                        </span>
                        <span className="absolute inset-0 w-full h-full bg-white/20 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-300"></span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              
            </div>
          </div>
        </section>

        {/* Ticket Types Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 mb-2 px-4 py-1.5 text-sm rounded-full font-bold">
                SCEGLI IL TUO BIGLIETTO
              </Badge>
              <h2 className="text-3xl md:text-4xl pb-2 font-bold  bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Biglietti per ogni esigenza
              </h2>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Standard",
                price: "29,90€",
                color: "from-blue-400 to-blue-600",
                features: ["Accesso al parco", "Attrazioni standard", "Spettacoli"],
                icon: <Ticket className="h-6 w-6" />,
              },
              {
                name: "Premium",
                price: "49,90€",
                color: "from-purple-400 to-purple-600",
                features: ["Accesso al parco", "Attrazioni standard", "Spettacoli", "Accesso prioritario"],
                icon: <Star className="h-6 w-6" />,
                popular: true,
              },
              {
                name: "VIP",
                price: "89,90€",
                color: "from-pink-400 to-pink-600",
                features: [
                  "Accesso illimitato",
                  "Attrazioni VIP",
                  "Spettacoli VIP",
                  "Guida personale",
                  "Pasti inclusi",
                ],
                icon: <Sparkles className="h-6 w-6" />,
              },
            ].map((ticket, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card
                  className={`border-none py-0 overflow-hidden flex flex-col justify-between rounded-[30px] shadow-lg h-full relative ${
                    ticket.popular ? "ring-4 ring-yellow-400 dark:ring-yellow-500" : ""
                  }`}
                >
                  <div className={`p-6 bg-gradient-to-r ${ticket.color} text-white`}>
                    {ticket.popular && (
                      <div className="absolute top-0 right-0 bg-yellow-400 text-blue-900 font-bold px-4 py-1 rounded-bl-2xl rounded-tr-[30px]">
                        BESTSELLER
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        {ticket.icon}
                      </div>
                      <h3 className="text-xl font-bold">{ticket.name}</h3>
                    </div>
                    <div className="text-3xl font-bold mb-1">{ticket.price}</div>
                    <p className="text-sm text-white/80">a persona</p>
                  </div>

                  <div className="p-6 bg-white dark:bg-gray-800">
                    <ul className="space-y-3">
                      {ticket.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                        >
                          <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
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
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    <Button
                      asChild
                      className={`w-full mt-6 bg-gradient-to-r ${ticket.color} hover:saturate-150 text-white border-0 rounded-full h-12`}
                    >
                      <Link href="/biglietti">Acquista Ora</Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-[40px] overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 p-8 md:p-12 text-white text-center"
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              {backgroundElements.map((element) => (
                <motion.div
                  key={element.id}
                  className="absolute rounded-full bg-white/10"
                  style={{
                    width: `${element.width}px`,
                    height: `${element.height}px`,
                    top: `${element.top}%`,
                    left: `${element.left}%`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: element.duration,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                className="w-16 h-16 mx-auto mb-6 bg-yellow-400 rounded-full flex items-center justify-center text-blue-900"
              >
                <PartyPopper className="h-8 w-8" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto per l&apos;avventura?</h2>
              <p className="text-xl mb-8 text-white/90">
                Acquista ora i tuoi biglietti e preparati a vivere un&apos;esperienza indimenticabile!
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold border-0 rounded-full px-8 py-6 text-lg"
                >
                  <Link href="/biglietti">Acquista Ora</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-black border-white hover:bg-white/20 rounded-full px-8 py-6 text-lg"
                >
                  <Link href="/planner">Pianifica la Visita</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  )
}
