'use client';
import { shallow } from 'zustand/shallow';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Users, Diamond, NotebookText } from 'lucide-react';
import { useDecksManagerStore } from '@/store/DecksManager';
import { useRoomStore } from '@/store/Room';
import { useRouter } from 'next/navigation'
import { CreateDeckMenu } from '@/components/CreateDeckMenu';

interface FormData {
	roomName: string;
	guestName: string;
	deckId: string;
}

export default function CreateGameMenu() {
	const createRoom = useRoomStore(state => state.create);
	const allDecks = useDecksManagerStore(state => state.getAllDecks(), shallow);
	const router = useRouter();
	const [isEditorOpen, setIsEditorOpen] = useState(false);
	const [decks, setDecks] = useState<Deck[]>([]);

	const [formData, setFormData] = useState<FormData>({
		roomName: '',
		guestName: '',
		deckId: allDecks.length > 0 ? allDecks[0].name : '' // Default to first deck if a\ailable
	});

	const handleSubmit = async (e: React.FormEvent) => {
		const roomId = await createRoom({
			roomName: formData.roomName,
			guestName: formData.guestName,
			deck: allDecks.find(deck => deck.name === formData.deckId)!
		});
		router.push(`/room/${roomId}`);
		e.preventDefault();
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	useEffect(() => {
		setDecks(allDecks);
	}, [allDecks]);

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">Create New Room</CardTitle>
				<CardDescription>
					Set up a new planning poker session for your team
				</CardDescription>
			</CardHeader>

			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="roomName">Room Name</Label>
						<div className="relative">
							<Input
								id="roomName"
								name="roomName"
								value={formData.roomName}
								onChange={handleChange}
								className="pl-10"
								placeholder="Room Name"
								required
							/>
							<NotebookText className="absolute left-2.5 top-2 h-5 w-5 text-gray-400" />
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="guestName">Your Name</Label>
						<div className='relative'>
							<Input
								id="guestName"
								name="guestName"
								value={formData.guestName}
								onChange={handleChange}
								className='pl-10'
								placeholder="Your Name"
								required
							/>
							<Users className="absolute left-2.5 top-2 h-5 w-5 text-gray-400" />
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="deckId">Card Deck</Label>
						<div className="relative">
							<select
								id="deckId"
								name="deckId"
								value={formData.deckId}
								onChange={handleChange}
								className="w-full p-2 pl-10 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
								required
							>
								{decks.map(deck => (
									<option key={deck.name} value={deck.name}>
										{deck.name} ({deck.cards.map(card => card.displayName).join(', ')})
									</option>
								))}
							</select>
							<Diamond className="absolute left-2.5 top-2 h-5 w-5 text-gray-400" />
						</div>
					</div>
				</form>
			</CardContent>

			<CardFooter className="flex flex-col gap-4">
				<Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
					<DialogTrigger asChild>
						<Button variant="outline" className="w-full">
							Create / Edit Custom Deck
						</Button>
					</DialogTrigger>
					<DialogContent aria-description='create / edit scrum poker decks' className="max-w-4xl">
						<DialogTitle className='sr-only'>Create / Edit Custom Deck</DialogTitle>
						<CreateDeckMenu onClose={() => setIsEditorOpen(false)} />
					</DialogContent>
				</Dialog>
				<Button
					onClick={handleSubmit}
					className="w-full bg-sky-600 hover:bg-sky-700"
				>
					Create Room
				</Button>
			</CardFooter>
		</Card>
	);
}