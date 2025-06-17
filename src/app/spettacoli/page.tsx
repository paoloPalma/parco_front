"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CalendarIcon,
  Clock,
  MapPin,
  Search,
  X,
  Star,
  ChevronRight,
  PartyPopper,
  Music,
  Sparkles,
  Users,
  Share2,
  Heart,
  Info,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/custom-components/topBar";
import { useData } from "@/providers/DataProvider";

interface ShowCardProps {
  show: {
    id: number;
    name: string;
    description: string;
    shortDescription: string;
    location: string;
    duration: number;
    times: string[];
    category: string;
    image: string;
    rating: number;
    popular: boolean;
    capacity: number;
    features: string[];
    position?: [number, number];
  };
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

// Funzione per ottenere l'icona della categoria
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "acqua":
      return <Sparkles className="h-5 w-5" />;
    case "acrobatico":
      return <PartyPopper className="h-5 w-5" />;
    case "parata":
      return <Users className="h-5 w-5" />;
    case "musical":
      return <Music className="h-5 w-5" />;
    case "magia":
      return <Sparkles className="h-5 w-5" />;
    case "serale":
      return <Star className="h-5 w-5" />;
    default:
      return <Info className="h-5 w-5" />;
  }
};

// Funzione per ottenere il colore della categoria
const getCategoryColor = (category: string): string => {
  switch (category) {
    case "acqua":
      return "bg-blue-500";
    case "acrobatico":
      return "bg-purple-500";
    case "parata":
      return "bg-amber-500";
    case "musical":
      return "bg-pink-500";
    case "magia":
      return "bg-violet-500";
    case "serale":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

// Funzione per ottenere il gradiente della categoria
const getCategoryGradient = (category: string): string => {
  switch (category) {
    case "acqua":
      return "from-blue-500 to-cyan-600";
    case "acrobatico":
      return "from-purple-500 to-fuchsia-600";
    case "parata":
      return "from-amber-500 to-orange-600";
    case "musical":
      return "from-pink-500 to-rose-600";
    case "magia":
      return "from-violet-500 to-purple-600";
    case "serale":
      return "from-red-500 to-rose-600";
    default:
      return "from-gray-500 to-gray-600";
  }
};

// Componente per la card dello spettacolo
function ShowCard({ show, onClick, isFavorite, onToggleFavorite }: ShowCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <Card className=" pt-0 overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full bg-white dark:bg-gray-800 group">
        <div className="overflow-hidden relative h-48">
          <Image
            src={show.image || "/placeholder.svg"}
            alt={show.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          <div className="absolute top-3 left-3">
            <Badge className={`${getCategoryColor(show.category)} text-white`}>
              {show.category.charAt(0).toUpperCase() + show.category.slice(1)}
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 text-white hover:bg-black/20"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>

          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-xl font-bold text-white">{show.name}</h3>
            <div className="flex items-center gap-1 text-white/80 text-sm">
              <MapPin className="h-3 w-3" />
              <span>{show.location}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.floor(show.rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
              {show.rating.toFixed(1)}
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {show.shortDescription}
          </p>

          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              <Clock className="h-3 w-3 text-gray-500 dark:text-gray-400" />
              <span>{show.duration} min</span>
            </div>

            {show.popular && (
              <div className="flex items-center gap-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                <Star className="h-3 w-3" />
                <span>Popolare</span>
              </div>
            )}
          </div>

          <div className="mb-4">
            <h4 className="text-xs font-semibold mb-2 text-gray-500 dark:text-gray-400">
              ORARI:
            </h4>
            <div className="flex flex-wrap gap-2">
              {show.times.map((time, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {time}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={onClick}
            className={`w-full bg-gradient-to-r ${getCategoryGradient(show.category)} text-white rounded-xl`}
          >
            Dettagli
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Funzione per filtrare gli orari
const getFilteredTimes = (show: ShowCardProps["show"], activeTab: string): string[] => {
  if (activeTab === "tutti") return show.times;
  if (activeTab === "mattina") {
    return show.times.filter((time: string) => {
      const hour = Number.parseInt(time.split(":")[0]);
      return hour < 12;
    });
  }
  if (activeTab === "pomeriggio") {
    return show.times.filter((time: string) => {
      const hour = Number.parseInt(time.split(":")[0]);
      return hour >= 12 && hour < 18;
    });
  }
  if (activeTab === "sera") {
    return show.times.filter((time: string) => {
      const hour = Number.parseInt(time.split(":")[0]);
      return hour >= 18;
    });
  }
  return show.times;
};

export default function ShowsPage() {
  const { shows, loading, error } = useData();
  const [activeTab, setActiveTab] = useState("tutti");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShow, setSelectedShow] = useState<ShowCardProps["show"] | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    // Simulazione di uno spettacolo selezionato all'avvio per mostrare la funzionalità
    const timer = setTimeout(() => {
      const popularShow = shows.find((s) => s.popular);
      if (popularShow) {
        setSelectedShow(popularShow);
        setShowDetailPanel(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [shows]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Caricamento spettacoli...</p>
        </div>
      </div>
    );
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
    );
  }

  // Filtra gli spettacoli in base alla ricerca e al tab attivo
  const filteredShows = shows.filter((show) => {
    // Filtra per ricerca
    const matchesSearch =
      searchQuery === "" ||
      show.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      show.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      show.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Filtra per tab
    if (activeTab === "tutti") return matchesSearch;
    if (activeTab === "mattina") {
      return (
        matchesSearch &&
        show.times.some((time) => {
          const hour = Number.parseInt(time.split(":")[0]);
          return hour < 12;
        })
      );
    }
    if (activeTab === "pomeriggio") {
      return (
        matchesSearch &&
        show.times.some((time) => {
          const hour = Number.parseInt(time.split(":")[0]);
          return hour >= 12 && hour < 18;
        })
      );
    }
    if (activeTab === "sera") {
      return (
        matchesSearch &&
        show.times.some((time) => {
          const hour = Number.parseInt(time.split(":")[0]);
          return hour >= 18;
        })
      );
    }
    if (activeTab === "preferiti") {
      return matchesSearch && favorites.includes(show.id);
    }

    return matchesSearch;
  });

  // Gestisce il click su uno spettacolo
  const handleShowClick = (show: ShowCardProps["show"]) => {
    setSelectedShow(show);
    setShowDetailPanel(true);
  };

  // Chiude il pannello dei dettagli
  const handleCloseDetails = () => {
    setSelectedShow(null);
    setShowDetailPanel(false);
  };

  // Gestisce l'aggiunta/rimozione dai preferiti
  const handleToggleFavorite = (id: number) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((showId) => showId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <TopBar
      badgeText='intrattenimento'
        title1="Calendario "
        title2="spettacoli"
        description="Scopri tutti gli spettacoli e gli eventi dal vivo che renderanno la tua giornata a EnjoyPark ancora
                  più magica!"
                  buttonText="Esplora Spettacoli"
                  buttonLink="Acquista Biglietti"
      />

      {/* Sezione Principale Spettacoli */}
      <section id="shows-section" className="py-12 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar con calendario e filtri */}
            <div className="md:w-80 flex-shrink-0">
              <div className="space-y-6 sticky top-4">
                <Card className="border-none  shadow-xl overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <CardHeader>
                    <CardTitle>Seleziona Data</CardTitle>
                    <CardDescription>
                      Scegli il giorno della tua visita
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal rounded-xl"
                          onClick={(e) => e.preventDefault()}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, "PPP", { locale: it })
                          ) : (
                            <span>Seleziona una data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-xl">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          locale={it}
                          className="rounded-xl border-none"
                        />
                      </PopoverContent>
                    </Popover>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-xl overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <CardHeader>
                    <CardTitle>Cerca Spettacoli</CardTitle>
                    <CardDescription>
                      Filtra per nome o categoria
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Cerca spettacoli..."
                        className="pl-9 rounded-xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
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
                  </CardContent>
                </Card>

                <Card className="border-none shadow-xl overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <CardHeader>
                    <CardTitle>Categorie</CardTitle>
                    <CardDescription>
                      Filtra per tipo di spettacolo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        "acqua",
                        "acrobatico",
                        "parata",
                        "musical",
                        "magia",
                        "serale",
                      ].map((category) => (
                        <Button
                          key={category}
                          variant="outline"
                          className={`w-full justify-start text-left font-normal rounded-xl mb-2 ${
                            searchQuery.toLowerCase() === category
                              ? "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                              : ""
                          }`}
                          onClick={() => setSearchQuery(category)}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-6 h-6 rounded-full ${getCategoryColor(
                                category
                              )} flex items-center justify-center text-white`}
                            >
                              {getCategoryIcon(category)}
                            </div>
                            <span>
                              {category.charAt(0).toUpperCase() +
                                category.slice(1)}
                            </span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-xl overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <CardHeader className="pb-3">
                    <CardTitle>I tuoi preferiti</CardTitle>
                    <CardDescription>Spettacoli salvati</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {favorites.length > 0 ? (
                      <ScrollArea className="h-40">
                        <div className="space-y-2">
                          {shows
                            .filter((show) => favorites.includes(show.id))
                            .map((show) => (
                              <div
                                key={show.id}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                onClick={() => handleShowClick(show)}
                              >
                                <div
                                  className={`w-8 h-8 rounded-full ${getCategoryColor(
                                    show.category
                                  )} flex items-center justify-center text-white`}
                                >
                                  {getCategoryIcon(show.category)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">
                                    {show.name}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {show.times[0]} - {show.duration} min
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        <Heart className="h-10 w-10 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                        <p>Nessuno spettacolo preferito</p>
                        <p className="text-xs mt-1">
                          Clicca sul cuore per aggiungere
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl"
                      onClick={() => setActiveTab("preferiti")}
                      disabled={favorites.length === 0}
                    >
                      Visualizza tutti
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>

            {/* Contenuto principale */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid h-full w-full grid-cols-5 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
                    <TabsTrigger
                      value="tutti"
                      className="data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-full py-2"
                    >
                      Tutti
                    </TabsTrigger>
                    <TabsTrigger
                      value="mattina"
                      className="data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-full py-2"
                    >
                      Mattina
                    </TabsTrigger>
                    <TabsTrigger
                      value="pomeriggio"
                      className="data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-full py-2"
                    >
                      Pomeriggio
                    </TabsTrigger>
                    <TabsTrigger
                      value="sera"
                      className="data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-full py-2"
                    >
                      Sera
                    </TabsTrigger>
                    <TabsTrigger
                      value="preferiti"
                      className="data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-full py-2"
                      disabled={favorites.length === 0}
                    >
                      Preferiti
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lista degli spettacoli */}
                <div
                  className={
                    showDetailPanel ? "lg:col-span-1" : "lg:col-span-3"
                  }
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab + searchQuery}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {filteredShows.length > 0 ? (
                        <div
                          className={`grid grid-cols-1 ${
                            showDetailPanel
                              ? ""
                              : "md:grid-cols-2 lg:grid-cols-3"
                          } gap-6`}
                        >
                          {filteredShows.map((show) => (
                            <ShowCard
                              key={show.id}
                              show={{
                                ...show,
                                times: getFilteredTimes(show, activeTab),
                              }}
                              onClick={() => handleShowClick(show)}
                              isFavorite={favorites.includes(show.id)}
                              onToggleFavorite={() => handleToggleFavorite(show.id)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                          <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">
                            Nessun risultato trovato
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Prova a modificare i filtri o la ricerca
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSearchQuery("");
                              setActiveTab("tutti");
                            }}
                          >
                            Reimposta filtri
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Pannello dettagli */}
                {showDetailPanel && selectedShow && (
                  <div className="lg:col-span-2">
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="border-none pt-0 shadow-xl overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                          <div className="relative overflow-hidden h-64">
                            <Image
                              src={selectedShow.image || "/placeholder.svg"}
                              alt={selectedShow.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-3 right-3 text-white hover:bg-black/20 z-10"
                              onClick={handleCloseDetails}
                            >
                              <X className="h-5 w-5" />
                            </Button>
                            <div className="absolute top-3 left-3">
                              <Badge
                                className={`${getCategoryColor(
                                  selectedShow.category
                                )} text-white`}
                              >
                                {selectedShow.category.charAt(0).toUpperCase() +
                                  selectedShow.category.slice(1)}
                              </Badge>
                            </div>
                            <div className="absolute bottom-4 left-4">
                              <h3 className="text-3xl font-bold text-white">
                                {selectedShow.name}
                              </h3>
                              <div className="flex items-center gap-2 text-white/80">
                                <MapPin className="h-4 w-4" />
                                <span>{selectedShow.location}</span>
                              </div>
                            </div>
                          </div>

                          <CardContent className="p-6">
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-xl font-semibold mb-3">
                                  Descrizione
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300">
                                  {selectedShow.description}
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300">
                                    <Clock className="h-6 w-6" />
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      Durata
                                    </div>
                                    <div className="font-bold text-lg">
                                      {selectedShow.duration} min
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300">
                                    <Users className="h-6 w-6" />
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      Capacità
                                    </div>
                                    <div className="font-bold text-lg">
                                      {selectedShow.capacity}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300">
                                    <Star className="h-6 w-6 fill-purple-600 dark:fill-purple-300" />
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      Valutazione
                                    </div>
                                    <div className="font-bold text-lg flex items-center">
                                      {selectedShow.rating}
                                      <div className="flex ml-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <Star
                                            key={star}
                                            className={`h-4 w-4 ${
                                              star <=
                                              Math.floor(selectedShow.rating)
                                                ? "text-amber-400 fill-amber-400"
                                                : "text-gray-300 dark:text-gray-600"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-xl font-semibold mb-3">
                                  Caratteristiche
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  {selectedShow.features?.map(
                                    (feature, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl"
                                      >
                                        <div
                                          className={`w-8 h-8 rounded-full bg-gradient-to-r ${
                                            getCategoryGradient(selectedShow.category)
                                          } flex items-center justify-center text-white`}
                                        >
                                          {index === 0 ? (
                                            <Sparkles className="h-4 w-4" />
                                          ) : index === 1 ? (
                                            <Music className="h-4 w-4" />
                                          ) : (
                                            <PartyPopper className="h-4 w-4" />
                                          )}
                                        </div>
                                        <span>{feature}</span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>

                              <div>
                                <h4 className="text-xl font-semibold mb-3">
                                  Orari Spettacoli
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  {selectedShow.times.map((time, index) => (
                                    <Button
                                      key={index}
                                      variant="outline"
                                      className="rounded-xl border-purple-200 dark:border-purple-900 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                    >
                                      <Clock className="h-4 w-4 mr-2 text-purple-500" />{" "}
                                      {time}
                                    </Button>
                                  ))}
                                </div>
                              </div>

                              <div className="flex gap-3 pt-4">
                                <Button
                                  className={`flex-1 bg-gradient-to-r ${getCategoryGradient(selectedShow.category)} text-white rounded-xl group overflow-hidden relative`}
                                >
                                  <span className="relative z-10 flex items-center justify-center gap-2">
                                    Prenota Posto
                                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                  </span>
                                  <span className="absolute inset-0 w-full h-full bg-white/20 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-300"></span>
                                </Button>
                                <Button
                                  variant="outline"
                                  className="rounded-xl"
                                  onClick={() =>
                                    handleToggleFavorite(selectedShow.id)
                                  }
                                >
                                  <Heart
                                    className={`h-5 w-5 mr-2 ${
                                      favorites.includes(selectedShow.id)
                                        ? "text-red-500 fill-red-500"
                                        : "text-gray-400"
                                    }`}
                                  />
                                  {favorites.includes(selectedShow.id)
                                    ? "Salvato"
                                    : "Salva"}
                                </Button>
                                <Button
                                  variant="outline"
                                  className="rounded-xl"
                                >
                                  <Share2 className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sezione Spettacoli in Evidenza */}
      <section className="py-16 px-4 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-300 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-pink-300 opacity-10 rounded-full blur-3xl"></div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-purple-100 text-purple-800 mb-4 px-3 py-1 text-sm rounded-full">
              IN EVIDENZA
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Gli spettacoli più amati
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Non perdere gli spettacoli più popolari di EnjoyPark, amati da
              grandi e piccini!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {shows
              .filter((show) => show.popular)
              .slice(0, 3)
              .map((show, index) => (
                <motion.div
                  key={show.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="h-full"
                >
                  <Card className="overflow-hidden pt-0 border-none shadow-xl hover:shadow-2xl transition-all duration-300 h-full bg-white dark:bg-gray-800 group">
                    <div className="relative overflow-hidden h-56">
                      <Image
                        src={show.image || "/placeholder.svg"}
                        alt={show.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      <div className="absolute top-3 left-3">
                        <Badge
                          className={`${getCategoryColor(
                            show.category
                          )} text-white`}
                        >
                          {show.category.charAt(0).toUpperCase() +
                            show.category.slice(1)}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <h3 className="text-2xl font-bold text-white">
                          {show.name}
                        </h3>
                        <div className="flex items-center gap-1 text-white/80">
                          <MapPin className="h-4 w-4" />
                          <span>{show.location}</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= Math.floor(show.rating)
                                ? "text-amber-400 fill-amber-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                          {show.rating.toFixed(1)}
                        </span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {show.shortDescription}
                      </p>

                      <div className="flex flex-wrap gap-3 mb-6">
                        <div className="flex items-center gap-1 text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                          <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span>{show.duration} min</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full">
                          <Star className="h-4 w-4" />
                          <span>Popolare</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleShowClick(show)}
                        className={`w-full bg-gradient-to-r ${getCategoryGradient(show.category)} text-white rounded-xl group overflow-hidden relative`}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Scopri di più
                          <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <span className="absolute inset-0 w-full h-full bg-white/20 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-300"></span>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
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
            <Badge className="bg-white/20 text-white mb-6 px-3 py-1 text-sm rounded-full">
              PRENOTA ORA
            </Badge>
            <h2 className="text-4xl font-bold mb-6">
              Non perderti nessuno spettacolo!
            </h2>
            <p className="text-xl mb-10 text-white/80">
              Acquista ora i tuoi biglietti e preparati a vivere un&apos;esperienza indimenticabile a EnjoyPark!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white  text-purple-600 hover:bg-white/90 rounded-full px-8 py-6 text-lg"
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
    </div>
  );
}
