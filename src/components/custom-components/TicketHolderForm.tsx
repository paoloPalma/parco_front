"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useTickets } from "@/providers/TicketProvider"

interface TicketHolderFormProps {
  onComplete: () => void
}

export default function TicketHolderForm({ onComplete }: TicketHolderFormProps) {
  const { adults, children, setTicketHolders } = useTickets()
  const [holders, setHolders] = useState<Array<{
    ticketType: "adult" | "child"
    firstName: string
    lastName: string
    dateOfBirth: string
  }>>([])

  const handleInputChange = (index: number, field: string, value: string) => {
    const newHolders = [...holders]
    newHolders[index] = {
      ...newHolders[index],
      [field]: value,
    }
    setHolders(newHolders)
  }

  const isFormValid = () => {
    return holders.length === (adults + children) &&
      holders.every(holder => 
        holder.firstName.trim() !== "" && 
        holder.lastName.trim() !== "" && 
        holder.dateOfBirth.trim() !== ""
      )
  }

  const handleSubmit = () => {
    if (isFormValid()) {
      setTicketHolders(holders)
      onComplete()
    }
  }

  // Inizializza i form per ogni biglietto
  useEffect(() => {
    const initialHolders = []
    for (let i = 0; i < adults; i++) {
      initialHolders.push({
        ticketType: "adult" as const,
        firstName: "",
        lastName: "",
        dateOfBirth: "",
      })
    }
    for (let i = 0; i < children; i++) {
      initialHolders.push({
        ticketType: "child" as const,
        firstName: "",
        lastName: "",
        dateOfBirth: "",
      })
    }
    setHolders(initialHolders)
  }, [adults, children])

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {holders.map((holder, index) => (
          <div key={index} className="p-4 border rounded-xl bg-white/50 dark:bg-gray-800/50 space-y-4">
            <h3 className="font-medium">
              {holder.ticketType === "adult" ? "Biglietto Adulto" : "Biglietto Bambino"} #{index + 1}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`firstName-${index}`}>Nome</Label>
                <Input
                  id={`firstName-${index}`}
                  value={holder.firstName}
                  onChange={(e) => handleInputChange(index, "firstName", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor={`lastName-${index}`}>Cognome</Label>
                <Input
                  id={`lastName-${index}`}
                  value={holder.lastName}
                  onChange={(e) => handleInputChange(index, "lastName", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor={`dateOfBirth-${index}`}>Data di nascita</Label>
              <Input
                id={`dateOfBirth-${index}`}
                type="date"
                value={holder.dateOfBirth}
                onChange={(e) => handleInputChange(index, "dateOfBirth", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!isFormValid()}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600"
      >
        Continua
      </Button>
    </div>
  )
} 