"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface TicketContextType {
  selectedDate: Date | undefined
  setSelectedDate: (date: Date | undefined) => void
  adults: number
  setAdults: (count: number) => void
  children: number
  setChildren: (count: number) => void
  selectedTicketType: string
  setSelectedTicketType: (type: string) => void
  ticketHolders: Array<{
    ticketType: "adult" | "child"
    firstName: string
    lastName: string
    dateOfBirth: string
  }>
  setTicketHolders: (holders: Array<{
    ticketType: "adult" | "child"
    firstName: string
    lastName: string
    dateOfBirth: string
  }>) => void
}

interface TicketProviderProps {
  children: ReactNode
}

const TicketContext = createContext<TicketContextType | undefined>(undefined)

export function TicketProvider({ children }: TicketProviderProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [adults, setAdults] = useState(1)
  const [childrenCount, setChildrenCount] = useState(0)
  const [selectedTicketType, setSelectedTicketType] = useState("standard")
  const [ticketHolders, setTicketHolders] = useState<Array<{
    ticketType: "adult" | "child"
    firstName: string
    lastName: string
    dateOfBirth: string
  }>>([])

  return (
    <TicketContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        adults,
        setAdults,
        children: childrenCount,
        setChildren: setChildrenCount,
        selectedTicketType,
        setSelectedTicketType,
        ticketHolders,
        setTicketHolders,
      }}
    >
      {children}
    </TicketContext.Provider>
  )
}

export function useTickets() {
  const context = useContext(TicketContext)
  if (context === undefined) {
    throw new Error("useTickets must be used within a TicketProvider")
  }
  return context
} 