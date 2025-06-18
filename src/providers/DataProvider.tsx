'use client'

import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Definizione dei tipi
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
  position: [number, number];
}

interface Show {
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
  position: [number, number];
}

interface Ticket {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  image: string;
  badge: string | null;
}

interface Extra {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface DataContextType {
  attractions: Attraction[];
  shows: Show[];
  tickets: Ticket[];
  extras: Extra[];
  loading: boolean;
  error: string | null;
  fetchAttractions: () => Promise<void>;
  fetchShows: () => Promise<void>;
  fetchTickets: () => Promise<void>;
  fetchExtras: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Usa la variabile d'ambiente NEXT_PUBLIC_BACKEND_URL, fallback a localhost per sicurezza
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(BASE_URL);

  const fetchAttractions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/attractions`);
      setAttractions(response.data);
    } catch (err) {
      setError('Errore durante il caricamento delle attrazioni');
      console.error('Errore nel fetch delle attrazioni:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchShows = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/shows`);
      setShows(response.data);
    } catch (err) {
      setError('Errore durante il caricamento degli spettacoli');
      console.error('Errore nel fetch degli spettacoli:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/tickets`);
      setTickets(response.data);
    } catch (err) {
      setError('Errore durante il caricamento dei biglietti');
      console.error('Errore nel fetch dei biglietti:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchExtras = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/ticket-options`);
      setExtras(response.data);
    } catch (err) {
      setError('Errore durante il caricamento degli extra');
      console.error('Errore nel fetch degli extra:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttractions();
    fetchShows();
    fetchTickets();
    fetchExtras();
  }, []);

  const value = {
    attractions,
    shows,
    tickets,
    extras,
    loading,
    error,
    fetchAttractions,
    fetchShows,
    fetchTickets,
    fetchExtras,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// Hook personalizzato per utilizzare il contesto
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData deve essere utilizzato all'interno di un DataProvider");
  }
  return context;
}
