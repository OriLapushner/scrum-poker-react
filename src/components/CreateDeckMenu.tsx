"use client"

import type React from "react"

import { Plus, Trash2 } from "lucide-react"
import { useDecksManagerStore } from "@/store/DecksManager"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CreateDeckMenuProps {
	onClose?: () => void
}

export const CreateDeckMenu: React.FC<CreateDeckMenuProps> = ({ onClose }) => {
	const deckName = useDecksManagerStore((state) => state.deckName)
	const cardValue = useDecksManagerStore((state) => state.cardValue)
	const cardDisplayName = useDecksManagerStore((state) => state.cardDisplayName)
	const cards = useDecksManagerStore((state) => state.cards)
	const selectedDeckIdx = useDecksManagerStore((state) => state.selectedDeckIdx)
	const userDecks = useDecksManagerStore((state) => state.userDecks)

	const setDeckName = useDecksManagerStore((state) => state.setDeckName)
	const setCardValue = useDecksManagerStore((state) => state.setCardValue)
	const setCardDisplayName = useDecksManagerStore((state) => state.setCardDisplayName)
	const resetCards = useDecksManagerStore((state) => state.resetDeckCreation)
	const createDeck = useDecksManagerStore((state) => state.createDeck)
	const editDeck = useDecksManagerStore((state) => state.editDeck)
	const addCard = useDecksManagerStore((state) => state.addCard)
	const deleteCard = useDecksManagerStore((state) => state.deleteCard)
	const deleteDeck = useDecksManagerStore((state) => state.deleteDeck)
	const setSelectedDeck = useDecksManagerStore((state) => state.setSelectedDeck)

	const handleAddCard = () => {
		const numericValue = Number.parseFloat(cardValue)
		if (cardDisplayName && !isNaN(numericValue)) {
			addCard({
				displayName: cardDisplayName,
				value: numericValue,
			})
			setCardValue("")
			setCardDisplayName("")
		}
	}

	const handleCreateOrUpdateDeck = () => {
		if (deckName && cards.length > 0) {
			if (selectedDeckIdx !== null) {
				editDeck()
			} else {
				createDeck({
					name: deckName,
					cards: cards,
				})
			}
			setDeckName("")
			resetCards()
			if (onClose) {
				onClose()
			}
		}
	}

	const handleDeckSelect = (value: string) => {
		const index = Number.parseInt(value)
		if (!isNaN(index)) {
			setSelectedDeck(index)
			const selectedDeck = userDecks[index]
			if (selectedDeck) {
				setDeckName(selectedDeck.name)
			}
		} else {
			setSelectedDeck(null)
			setDeckName("")
			resetCards()
		}
	}

	return (
		<div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-3xl mx-auto">
			<div className="flex justify-between items-center">
				<h2 className="text-xl sm:text-2xl font-bold">Create/Edit Deck</h2>
			</div>

			<div className="space-y-4">
				<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
					<div className="flex-1">
						<Label>Select Deck to Edit</Label>
						<Select onValueChange={handleDeckSelect} value={selectedDeckIdx?.toString() || ""}>
							<SelectTrigger>
								<SelectValue placeholder="Create new deck" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="new">Create new deck</SelectItem>
								{userDecks.map((deck, index) => (
									<SelectItem key={index} value={index.toString()}>
										{deck.name} ({deck.cards.length} cards)
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{selectedDeckIdx !== null && (
						<div className="flex sm:items-end mt-2 sm:mt-0">
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="destructive" className="w-full sm:w-auto">
										<Trash2 className="h-4 w-4 mr-2" />
										Delete Deck
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent className="max-w-[90vw] sm:max-w-md">
									<AlertDialogHeader>
										<AlertDialogTitle>Are you sure?</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This will permanently delete the deck.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => {
												deleteDeck(selectedDeckIdx)
												setSelectedDeck(null)
												setDeckName("")
												resetCards()
											}}
										>
											Delete
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					)}
				</div>

				<div>
					<Label htmlFor="deckName">Deck Name</Label>
					<Input
						id="deckName"
						value={deckName}
						onChange={(e) => setDeckName(e.target.value)}
						placeholder="Enter deck name..."
						className="mt-1"
					/>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
					<div>
						<Label htmlFor="displayName">Display Name</Label>
						<Input
							id="displayName"
							value={cardDisplayName}
							onChange={(e) => setCardDisplayName(e.target.value)}
							placeholder="e.g., '☕' or '1/2'"
							className="mt-1"
						/>
					</div>
					<div>
						<Label htmlFor="value">Value</Label>
						<Input
							id="value"
							type="number"
							value={cardValue}
							onChange={(e) => setCardValue(e.target.value)}
							placeholder="e.g., 0.5"
							className="mt-1"
						/>
					</div>
					<div className="flex items-end mt-2 sm:mt-0">
						<Button onClick={handleAddCard} className="w-full" disabled={!cardDisplayName || !cardValue}>
							<Plus className="h-4 w-4 mr-2" />
							Add Card
						</Button>
					</div>
				</div>
			</div>

			<div className="mt-6 sm:mt-8">
				<h3 className="text-md sm:text-lg font-semibold mb-3 sm:mb-4">Cards in Deck</h3>
				<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
					{cards.map((card, index) => (
						<Card key={index} className="relative group hover:shadow-md transition-shadow">
							<CardContent className="p-3 sm:p-4 text-center flex flex-col items-center justify-center min-h-[80px] sm:min-h-[100px]">
								<div className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">{card.displayName}</div>
								<div className="text-xs sm:text-sm text-muted-foreground">Value: {card.value}</div>
								<Button
									variant="ghost"
									size="icon"
									className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 sm:h-8 sm:w-8"
									onClick={() => deleteCard(index)}
								>
									<Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			<Button
				onClick={handleCreateOrUpdateDeck}
				className="w-full mt-4 sm:mt-6"
				size="lg"
				disabled={!deckName || cards.length === 0}
			>
				{selectedDeckIdx !== null ? "Update Deck" : "Create Deck"}
			</Button>
		</div>
	)
}

export default CreateDeckMenu

