"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, Check, RefreshCw, ExternalLink, AlertTriangle } from "lucide-react"
import { ethers } from "ethers"

interface WalletData {
  address: string
  privateKey: string
}

const FAUCETS = [
  { name: "Sepolia", url: "https://sepoliafaucet.com", network: "Sepolia Testnet" },
  { name: "Alchemy Sepolia", url: "https://www.alchemy.com/faucets/ethereum-sepolia", network: "Sepolia Testnet" },
  { name: "Infura Sepolia", url: "https://www.infura.io/faucet/sepolia", network: "Sepolia Testnet" },
  { name: "Holesky", url: "https://holesky-faucet.pk910.de/", network: "Holesky Testnet" },
  {
    name: "Google Cloud Faucet",
    url: "https://cloud.google.com/application/web3/faucet/ethereum",
    network: "Multiple Testnets",
  },
]

export function WalletGenerator() {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateWallet = () => {
    setIsGenerating(true)
    setShowPrivateKey(false)

    // Small delay for UX feedback
    setTimeout(() => {
      const newWallet = ethers.Wallet.createRandom()
      setWallet({
        address: newWallet.address,
        privateKey: newWallet.privateKey,
      })
      setIsGenerating(false)
    }, 300)
  }

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const maskPrivateKey = (key: string) => {
    return key.slice(0, 10) + "•".repeat(40) + key.slice(-10)
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      <Card className="border-2">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Ethereum Wallet Generator</CardTitle>
          <CardDescription className="text-balance">
            Generate a new Ethereum wallet instantly. Your keys are created locally and never leave your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button onClick={generateWallet} className="w-full h-12 text-lg" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-5 w-5" />
                {wallet ? "Generate New Wallet" : "Generate Wallet"}
              </>
            )}
          </Button>

          {wallet && (
            <div className="space-y-4 animate-in fade-in-50 duration-300">
              {/* Public Address */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-muted-foreground">Public Address</label>
                  <Badge variant="secondary">Safe to share</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded-lg bg-muted p-3 text-sm font-mono break-all">{wallet.address}</code>
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(wallet.address, "address")}>
                    {copiedField === "address" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Private Key */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-muted-foreground">Private Key</label>
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Keep secret
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded-lg bg-muted p-3 text-sm font-mono break-all">
                    {showPrivateKey ? wallet.privateKey : maskPrivateKey(wallet.privateKey)}
                  </code>
                  <Button variant="outline" size="icon" onClick={() => setShowPrivateKey(!showPrivateKey)}>
                    {showPrivateKey ? "🙈" : "👁️"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(wallet.privateKey, "privateKey")}
                  >
                    {copiedField === "privateKey" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Security Warning */}
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-destructive">Security Warning</p>
                    <p className="text-sm text-muted-foreground">
                      Never share your private key with anyone. Anyone with your private key has full control over your
                      wallet and funds.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Faucet Links */}
      {wallet && (
        <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle className="text-lg">Testnet Faucets</CardTitle>
            <CardDescription>
              Get free testnet ETH to start developing. These tokens have no real value.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {FAUCETS.map((faucet) => (
                <a
                  key={faucet.name}
                  href={faucet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
                >
                  <div>
                    <p className="font-medium">{faucet.name}</p>
                    <p className="text-xs text-muted-foreground">{faucet.network}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground text-center">
              Paste your public address ({wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}) into any faucet to
              receive test ETH
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
