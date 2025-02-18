import { Plus, Trash2 } from 'lucide-react';
import { useDecksManagerStore } from "@/store/DecksManager";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/alert-dialog";

interface CreateDeckMenuProps {
	onClose?: () => void;
}

export const CreateDeckMenu: React.FC<CreateDeckMenuProps> = ({ onClose }) => {

	const deckName = useDecksManagerStore(state => state.deckName);
	const cardValue = useDecksManagerStore(state => state.cardValue);
	const cardDisplayName = useDecksManagerStore(state => state.cardDisplayName);
	const cards = useDecksManagerStore(state => state.cards);
	const selectedDeckIdx = useDecksManagerStore(state => state.selectedDeckIdx);
	const userDecks = useDecksManagerStore(state => state.userDecks);

	const setDeckName = useDecksManagerStore(state => state.setDeckName);
	const setCardValue = useDecksManagerStore(state => state.setCardValue);
	const setCardDisplayName = useDecksManagerStore(state => state.setCardDisplayName);
	const resetCards = useDecksManagerStore(state => state.resetDeckCreation);
	const createDeck = useDecksManagerStore(state => state.createDeck);
	const editDeck = useDecksManagerStore(state => state.editDeck);
	const addCard = useDecksManagerStore(state => state.addCard);
	const deleteCard = useDecksManagerStore(state => state.deleteCard);
	const deleteDeck = useDecksManagerStore(state => state.deleteDeck);
	const setSelectedDeck = useDecksManagerStore(state => state.setSelectedDeck);

	const handleAddCard = () => {
		const numericValue = parseFloat(cardValue);
		if (cardDisplayName && !isNaN(numericValue)) {
			addCard({
				displayName: cardDisplayName,
				value: numericValue
			});
			setCardValue('');
			setCardDisplayName('');
		}
	};

	const handleCreateOrUpdateDeck = () => {
		if (deckName && cards.length > 0) {
			if (selectedDeckIdx !== null) {
				editDeck();
			} else {
				createDeck({
					name: deckName,
					cards: cards
				});
			}
			setDeckName('');
			resetCards();
			if (onClose) {
				onClose();
			}
		}
	};

	const handleDeckSelect = (value: string) => {
		const index = parseInt(value);
		if (!isNaN(index)) {
			setSelectedDeck(index);
			const selectedDeck = userDecks[index];
			if (selectedDeck) {
				setDeckName(selectedDeck.name);
			}
		} else {
			setSelectedDeck(null);
			setDeckName('');
			resetCards();
		}
	};

	return (
		<div className="p-6 space-y-6 max-w-3xl mx-auto">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Create/Edit Deck</h2>
			</div>

			<div className="space-y-4">
				<div className="flex gap-4">
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
										{deck.name} ({deck.cards.map(c => c.displayName).join(', ')})
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{selectedDeckIdx !== null && (
						<div className="flex items-end">
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="destructive">
										<Trash2 className="h-4 w-4 mr-2" />
										Delete Deck
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Are you sure?</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This will permanently delete the deck.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction onClick={() => {
											deleteDeck(selectedDeckIdx);
											setSelectedDeck(null);
											setDeckName('');
											resetCards();
										}}>
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

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
					<div className="flex items-end">
						<Button
							onClick={handleAddCard}
							className="w-full"
							disabled={!cardDisplayName || !cardValue}
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Card
						</Button>
					</div>
				</div>
			</div>

			<div className="mt-8">
				<h3 className="text-lg font-semibold mb-4">Cards in Deck</h3>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
					{cards.map((card, index) => (
						<Card key={index} className="relative group">
							<CardContent className="p-6 text-center">
								<div className="text-3xl mb-2">{card.displayName}</div>
								<div className="text-sm text-muted-foreground">Value: {card.value}</div>
								<Button
									variant="ghost"
									size="icon"
									className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
									onClick={() => deleteCard(index)}
								>
									<Trash2 className="h-4 w-4 text-destructive" />
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			<Button
				onClick={handleCreateOrUpdateDeck}
				className="w-full mt-6"
				size="lg"
				disabled={!deckName || cards.length === 0}
			>
				{selectedDeckIdx !== null ? 'Update Deck' : 'Create Deck'}
			</Button>
		</div>
	);
};

export default CreateDeckMenu;