"use client"

import { useEffect, useRef } from "react"
import QRCode from "qrcode"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface QRCodeGeneratorProps {
  data: string
  size?: number
}

export default function QRCodeGenerator({ data, size = 200 }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, data, {
        width: size,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      })
    }
  }, [data, size])

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement("a")
      link.download = "qr-code.png"
      link.href = canvasRef.current.toDataURL()
      link.click()
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvasRef} />
      <Button onClick={handleDownload} variant="outline" className="flex text-black items-center gap-2">
        <Download className="h-4 w-4" />
        Scarica QR Code
      </Button>
    </div>
  )
} 