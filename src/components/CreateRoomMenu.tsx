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

interface FormErrors {
	roomName?: string;
	guestName?: string;
}

export default function CreateGameMenu() {
	const createRoom = useRoomStore(state => state.create);
	const allDecks = useDecksManagerStore(state => state.getAllDecks(), shallow);
	const router = useRouter();
	const [isEditorOpen, setIsEditorOpen] = useState(false);
	const [decks, setDecks] = useState<Deck[]>([]);
	const [errors, setErrors] = useState<FormErrors>({});

	const [formData, setFormData] = useState<FormData>({
		roomName: '',
		guestName: '',
		deckId: allDecks.length > 0 ? allDecks[0].name : ''
	});

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};
		let isValid = true;

		if (!formData.roomName.trim()) {
			newErrors.roomName = 'Room name is required';
			isValid = false;
		}

		if (!formData.guestName.trim()) {
			newErrors.guestName = 'Guest name is required';
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		const roomId = await createRoom({
			roomName: formData.roomName,
			guestName: formData.guestName,
			deck: allDecks.find(deck => deck.name === formData.deckId)!
		});
		router.push(`/room/${roomId}`);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));

		if (errors[name as keyof FormErrors]) {
			setErrors(prev => ({
				...prev,
				[name]: undefined
			}));
		}
	};

	// this use effect is because decks are coming from local storage
	useEffect(() => {
		setDecks(allDecks);
	}, [allDecks]);

	return (
		<Card className="w-full bg-white shadow-lg">
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
							<NotebookText className="absolute left-2.5 top-2 h-5 w-5 text-primary-600" />
						</div>
						{errors.roomName && (
							<p className="text-sm text-destructive mt-1">{errors.roomName}</p>
						)}
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
							<Users className="absolute left-2.5 top-2 h-5 w-5 text-primary-600" />
						</div>
						{errors.guestName && (
							<p className="text-sm text-destructive mt-1">{errors.guestName}</p>
						)}
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
							<Diamond className="absolute left-2.5 top-2 h-5 w-5 text-primary-600" />
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
					className="w-full bg-primary-600 hover:bg-primary-700"
				>
					Create Room
				</Button>
			</CardFooter>
		</Card>
	);
}