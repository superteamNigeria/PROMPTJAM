"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function WalletForm({ onSubmit }: { onSubmit: (address: string) => void }) {
  const [address, setAddress] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(address)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <Input
        type="text"
        placeholder="Enter Solana wallet address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit">Search</Button>
    </form>
  )
}

