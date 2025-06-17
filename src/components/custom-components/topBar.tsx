'use client'
import { useScroll, useTransform, motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "../ui/button"
import Link from "next/link"
import { ChevronRight, PartyPopper, Ticket, Sparkles, Star } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Badge } from "../ui/badge"

interface Particle {
  id: number;
  width: number;
  height: number;
  x: number;
  y: number;
  opacity: number;
  duration: number;
}

export default function TopBar({badgeText, title1, title2, description, buttonText, buttonLink} : {badgeText: string, title1: string, title2: string, description: string, buttonText: string, buttonLink: string}) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [particles, setParticles] = useState<Particle[]>([])
    const heroRef = useRef(null)
    const { scrollYProgress } = useScroll({
      target: heroRef,
      offset: ["start start", "end start"],
    })
  
    const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8])
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 100])

    useEffect(() => {
        setIsLoaded(true)
        // Genera le particelle solo lato client
        const newParticles = Array.from({ length: 20 }).map((_, i) => ({
          id: i,
          width: Math.random() * 4 + 2,
          height: Math.random() * 4 + 2,
          x: Math.random() * 100,
          y: Math.random() * 100,
          opacity: Math.random() * 0.5 + 0.3,
          duration: Math.random() * 15 + 10
        }))
        setParticles(newParticles)
    }, [])

    return (
        <section ref={heroRef} className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale, y: heroY }} className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920&text=Spettacoli"
            alt="Spettacoli EnjoyPark"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-950/90 via-purple-900/85 to-pink-900/80 z-10"></div>

          {/* Particelle animate */}
          <div className="absolute inset-0 z-20 overflow-hidden">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full bg-gradient-to-r from-purple-400 to-pink-300"
                style={{
                  width: particle.width + "px",
                  height: particle.height + "px",
                  filter: "blur(1px)",
                  left: particle.x + "%",
                  top: particle.y + "%",
                }}
                animate={{
                  y: [0, Math.random() * 100 + "%"],
                  opacity: [particle.opacity, particle.opacity * 0.6],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>
        </motion.div>

        <div className="container mx-auto z-20 px-4 py-12 relative text-center">
          <AnimatePresence>
            {isLoaded && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-white max-w-4xl mx-auto"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center justify-center gap-3 mb-6"
                >
                  <div className="h-[2px] w-12 bg-gradient-to-r from-purple-500/30 to-purple-500"></div>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 text-sm rounded-full font-medium uppercase tracking-wide">
                    <Sparkles className="h-4 w-4 mr-1.5 inline-block" />
                    {badgeText}
                  </Badge>
                  <div className="h-[2px] w-12 bg-gradient-to-r from-purple-500 to-purple-500/30"></div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                >
                  {title1}
                  <span className="relative">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                      {title2}
                    </span>
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.3 }}
                      className="absolute -top-6 -right-6"
                    >
                      <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                    </motion.div>
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-xl md:text-2xl mb-10 text-purple-100/90 max-w-2xl mx-auto leading-relaxed"
                >
                  {description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex flex-wrap gap-5 justify-center"
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 rounded-full px-8 py-6 text-lg font-medium group overflow-hidden relative shadow-lg shadow-purple-500/20"
                    onClick={() => {
                      const element = document.getElementById("shows-section");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {buttonText}
                      <motion.div
                        animate={{ rotate: [0, 10, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                      >
                        <PartyPopper className="h-5 w-5" />
                      </motion.div>
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "linear" }}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-purple-300/30 text-purple-500 hover:bg-purple-300/10 rounded-full px-8 py-6 text-lg font-medium group relative"
                    asChild
                  >
                    <Link href="/biglietti" className="flex items-center gap-3">
                      <span>{buttonLink}</span>
                      <motion.div
                        animate={{ 
                          rotate: [0, 15, 0, -15, 0],
                          scale: [1, 1.1, 1, 1.1, 1]
                        }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                      >
                        <Ticket className="h-5 w-5" />
                      </motion.div>
                      <motion.div
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          background: "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.1) 0%, transparent 100%)"
                        }}
                      />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
        >
          <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm">
            <ChevronRight className="h-8 w-8 text-purple-200 rotate-90" />
          </div>
        </motion.div>
      </section>
    )
}