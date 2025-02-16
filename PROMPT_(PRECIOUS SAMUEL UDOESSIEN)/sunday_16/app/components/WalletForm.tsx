"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function WalletForm({ onSubmit }: { onSubmit: (address: string) => void }) {
  const [address, setAddress] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(address)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Input
        type="text"
        placeholder="Enter Solana wallet address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="flex-grow bg-purple-800 text-white placeholder-purple-300 border-purple-600"
      />
      <Button type="submit" className="bg-secondary text-purple-900 hover:bg-secondary/80">
        Search
      </Button>
    </motion.form>
  )
}

