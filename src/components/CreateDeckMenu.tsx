"use client"

import type React from "react"

import { Trash2 } from "lucide-react"
import { useDecksManagerStore } from "@/store/DecksManager"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
import { toast } from "sonner"

interface CreateDeckMenuProps {
	onClose?: () => void
}

export const CreateDeckMenu: React.FC<CreateDeckMenuProps> = ({ onClose }) => {
	const deckName = useDecksManagerStore((state) => state.deckName)
	const cardsInput = useDecksManagerStore((state) => state.cardsInput)
	const cards = useDecksManagerStore((state) => state.cards)
	const selectedDeckIdx = useDecksManagerStore((state) => state.selectedDeckIdx)
	const userDecks = useDecksManagerStore((state) => state.userDecks)

	const setDeckName = useDecksManagerStore((state) => state.setDeckName)
	const setCardsInput = useDecksManagerStore((state) => state.setCardsInput)
	const resetCards = useDecksManagerStore((state) => state.resetDeckCreation)
	const createDeck = useDecksManagerStore((state) => state.createDeck)
	const editDeck = useDecksManagerStore((state) => state.editDeck)
	const deleteCard = useDecksManagerStore((state) => state.deleteCard)
	const deleteDeck = useDecksManagerStore((state) => state.deleteDeck)
	const setSelectedDeck = useDecksManagerStore((state) => state.setSelectedDeck)

	const handleCreateOrUpdateDeck = () => {
		if (deckName && cards.length > 0) {
			if (selectedDeckIdx !== null) {
				editDeck()
				toast.success("Deck updated successfully", {
					description: `"${deckName}" has been updated.`,
				})
			} else {
				try {
					createDeck({
						name: deckName,
						cards: cards,
					})
					toast.success("Deck created successfully", {
						description: `"${deckName}" has been saved.`,
					})
				} catch (error) {
					toast.error("Deck creation failed", {
						description: `${error instanceof Error ? error.message : 'Unknown error'}`,
					})
				}
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
		<div className="w-full flex flex-col items-center">
			<div className="grid grid-cols-1 gap-8">
				<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
					<div>
						<Label>Select Deck to Edit</Label>
						<Select onValueChange={handleDeckSelect} value={selectedDeckIdx?.toString() || ""}>
							<SelectTrigger className="sm:min-w-52">
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

				<div className="flex flex-col gap-2 w-full">
					<Label htmlFor="deckName">Deck Name</Label>
					<Input
						id="deckName"
						value={deckName}
						onChange={(e) => setDeckName(e.target.value)}
						placeholder="My deck name"
						className="mt-1"
					/>
				</div>

				<div className="flex flex-col gap-2 w-full justify-center">
					<Label htmlFor="cardsInput">Cards (comma-separated)</Label>
					<Input
						id="cardsInput"
						value={cardsInput}
						onChange={(e) => setCardsInput(e.target.value)}
						placeholder="1,2,3,4,5..."
						className="mt-1"
					/>
				</div>
			</div>

			<div className="mt-6 sm:mt-8">
				<h3 className="text-md sm:text-lg font-semibold mb-3 sm:mb-4">Cards in Deck</h3>
				<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
					{cards.map((card, index) => (
						<div key={index} className="relative group hover:shadow-md hover:shadow-primary-500/20 transition-shadow border border-primary-400 rounded-md p-2 w-20 h-28">
							<div className="text-xl sm:text-2xl md:text-3xl flex items-center justify-center h-full text-primary-900">{card.displayName}</div>
							<Button
								variant="ghost"
								size="icon"
								className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 sm:h-8 sm:w-8"
								onClick={() => deleteCard(index)}
							>
								<Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
							</Button>
						</div>
					))}
				</div>
			</div>

			<div className="mt-4 sm:mt-6 flex gap-3 justify-center">
				<Button
					onClick={onClose}
					variant="outline"
					size="lg"
				>
					Close
				</Button>
				<Button
					className="bg-primary-600 hover:bg-primary-700"
					onClick={handleCreateOrUpdateDeck}
					size="lg"
					disabled={!deckName || cards.length === 0}
				>
					{selectedDeckIdx !== null ? "Update Deck" : "Create Deck"}
				</Button>
			</div>
		</div>
	)
}

export default CreateDeckMenu

