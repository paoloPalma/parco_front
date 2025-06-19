'use client'
import Link from "next/link"
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock, ArrowRight, Ticket, CalendarDays, Star, Sparkles, MapPinned, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface Star {
  id: number;
  top: number;
  left: number;
  delay: number;
}



export default function Footer() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    setStars(
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 2
      }))
    )
  }, [])

  return (
    <footer className="relative bg-gradient-to-b from-[#1B1B3A] to-[#0D0D1F] text-white overflow-hidden">
      {/* Elementi decorativi */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>
      
      {/* Stelle animate */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              animationDelay: `${star.delay}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-4 pt-16 pb-8 relative z-10">
        {/* Newsletter Section */}
        <motion.div 
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl p-8 mb-12 border border-white/10 backdrop-blur-sm"
>
  <div className="grid md:grid-cols-2 gap-8 items-center">
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-purple-400" />
        <span className="text-purple-400 text-sm font-medium">IL NOSTRO PROGETTO</span>
      </div>
      <h3 className="text-2xl font-bold mb-2">Crescere con cura e creatività</h3>
      <p className="text-gray-300">
        Ogni attività è pensata per accompagnare i bambini nel loro percorso di crescita, valorizzando l’espressione, il gioco e la scoperta.
      </p>
    </div>
    <div>
      <p className="text-md text-gray-400 leading-relaxed">
        Attraverso laboratori, feste e momenti educativi, creiamo esperienze significative in un ambiente sicuro, accogliente e stimolante.
        La nostra missione è coltivare la curiosità, la socialità e la fantasia di ogni bambino.
      </p>
    </div>
  </div>
</motion.div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Prima colonna - Info Parco */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-400" />
              EnjoyPark
            </h3>
            <p className="text-gray-300 mb-6">
              Il parco divertimenti più emozionante d&apos;Italia, dove i sogni prendono vita e l&apos;avventura non ha limiti.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group">
                <div className="bg-purple-500/10 p-2 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                  <MapPin className="h-5 w-5 text-purple-400" />
                </div>
                <span>Via del Divertimento, 123 - Roma</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group">
                <div className="bg-purple-500/10 p-2 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                  <Phone className="h-5 w-5 text-purple-400" />
                </div>
                <span>+39 123 456 7890</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group">
                <div className="bg-purple-500/10 p-2 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                  <Mail className="h-5 w-5 text-purple-400" />
                </div>
                <span>info@enjoypark.it</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group">
                <div className="bg-purple-500/10 p-2 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                  <Clock className="h-5 w-5 text-purple-400" />
                </div>
                <span>Aperto tutti i giorni 9:00 - 23:00</span>
              </div>
            </div>
          </motion.div>

          {/* Seconda colonna - Link Rapidi */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-purple-400" />
              Link Rapidi
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/attrazioni" className="text-gray-300 hover:text-white flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:w-3 transition-all duration-300"></span>
                  Attrazioni
                </Link>
              </li>
              <li>
                <Link href="/spettacoli" className="text-gray-300 hover:text-white flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:w-3 transition-all duration-300"></span>
                  Spettacoli
                </Link>
              </li>
              <li>
                <Link href="/ristoranti" className="text-gray-300 hover:text-white flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:w-3 transition-all duration-300"></span>
                  Ristoranti
                </Link>
              </li>
              <li>
                <Link href="/negozi" className="text-gray-300 hover:text-white flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:w-3 transition-all duration-300"></span>
                  Negozi
                </Link>
              </li>
              <li>
                <Link href="/mappa" className="text-gray-300 hover:text-white flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:w-3 transition-all duration-300"></span>
                  Mappa del Parco
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Terza colonna - Info Utili */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Gift className="h-5 w-5 text-purple-400" />
              Info Utili
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/biglietti" className="text-gray-300 hover:text-white flex items-center gap-2 group">
                  <Ticket className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  Biglietti e Prezzi
                </Link>
              </li>
              <li>
                <Link href="/orari" className="text-gray-300 hover:text-white flex items-center gap-2 group">
                  <CalendarDays className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  Orari e Calendario
                </Link>
              </li>
              <li>
                <Link href="/hotel" className="text-gray-300 hover:text-white flex items-center gap-2 group">
                  <MapPinned className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  Hotel Partner
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white flex items-center gap-2 group">
                  <ArrowRight className="h-4 w-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contatti" className="text-gray-300 hover:text-white flex items-center gap-2 group">
                  <ArrowRight className="h-4 w-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                  Contatti
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Quarta colonna - Social */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              Seguici
            </h3>
            <div className="flex gap-4 mb-6">
              <Link
                href="#"
                className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 transition-colors p-3 rounded-xl border border-white/10 group"
              >
                <Facebook className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 transition-colors p-3 rounded-xl border border-white/10 group"
              >
                <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 transition-colors p-3 rounded-xl border border-white/10 group"
              >
                <Twitter className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Star className="h-4 w-4 text-purple-400" />
                App EnjoyPark
              </h4>
              <p className="text-sm text-gray-300 mb-4">
                Scarica la nostra app per un&apos;esperienza ancora più magica!
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-white">
                  App Store
                </Button>
                <Button variant="outline" className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-white">
                  Play Store
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} EnjoyPark. Tutti i diritti riservati.
            </p>
            <div className="flex gap-6 md:justify-end text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/termini" className="hover:text-white transition-colors">Termini e Condizioni</Link>
              <Link href="/cookie" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </footer>
  )
}
