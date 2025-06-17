"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Ticket, Menu, X, Home, PartyPopper, Info, Sparkles } from "lucide-react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
    { name: "Attrazioni", href: "/attrazioni", icon: <MapPin className="h-5 w-5" /> },
    { name: "Spettacoli", href: "/spettacoli", icon: <PartyPopper className="h-5 w-5" /> },
    { name: "Biglietti", href: "/biglietti", icon: <Ticket className="h-5 w-5" /> },
    { name: "Mappa", href: "/mappa", icon: <MapPin className="h-5 w-5" /> },
  ]

  return (
    <header
      className={` fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md py-2" : "bg-purple-400   py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between ">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }} transition={{ duration: 0.5 }}>
              <Sparkles className={`h-8 w-8 ${scrolled ? "text-purple-600" : "text-yellow-300"} mr-2`} />
            </motion.div>
            <span
              className={`font-bold text-2xl ${
                scrolled ? "text-purple-800 dark:text-white" : "text-white"
              } transition-colors duration-300`}
            >
              Enjoy<span className="text-pink-500">Park</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.div key={item.name} whileHover={{ y: -3 }} whileTap={{ y: 0 }}>
                <Link
                  href={item.href}
                  className={`px-3 py-2 rounded-full flex items-center ${
                    scrolled
                      ? "text-purple-800 hover:bg-purple-100 dark:text-white dark:hover:bg-gray-800"
                      : " hover:bg-white/20 text-white"
                  } transition-colors duration-300`}
                >
                  {item.icon}
                  <span className="ml-1">{item.name}</span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className={`rounded-full ${
                  scrolled
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    : "bg-white/20 backdrop-blur-sm border-2 border-white/50 hover:bg-white/30"
                } text-white font-bold`}
                asChild
              >
                <Link href="/planner" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Pianifica Visita
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${scrolled ? "text-purple-800 dark:text-white" : "text-white"}`}
              onClick={() => setIsOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 bg-gradient-to-b from-purple-600 to-pink-600 z-50 md:hidden"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-8">
                <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                  <Sparkles className="h-8 w-8 text-yellow-300 mr-2" />
                  <span className="font-bold text-2xl text-white">
                    Enjoy<span className="text-yellow-300">Park</span>
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <nav className="flex flex-col space-y-4 flex-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-4 py-3 rounded-xl flex items-center text-white hover:bg-white/20 transition-colors duration-300 text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto">
                <Button
                  className="w-full rounded-full bg-white text-purple-700 hover:bg-white/90 font-bold py-6"
                  asChild
                >
                  <Link href="/planner" onClick={() => setIsOpen(false)}>
                    <Calendar className="mr-2 h-5 w-5" />
                    Pianifica la tua Visita
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
