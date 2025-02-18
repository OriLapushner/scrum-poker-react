'use client';

import { useParams, useRouter } from 'next/navigation';
import { useRoomStore } from '@/store/Room';
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast"
import { PulsatingButton } from "@/components/magicui/pulsating-button";
import { JoinRoomLink } from "@/components/JoinRoomLink";
import { RoomDeck } from '@/components/RoomDeck';
import { RoomVoteStatus } from '@/components/RoomVoteStatus';
import { JoinRoomMenu } from '@/components/JoinRoomMenu';
import { RoomGuestList } from '@/components/RoomGuestList';
import { RoomRoundsHistory } from '@/components/RoomRoundsHistory';

const ScrumPokerLayout = () => {
	const router = useRouter();
	const { toast } = useToast();

	const deck = useRoomStore(state => state.deck);
	const roomName = useRoomStore(state => state.roomName);
	const roomIdFromStore = useRoomStore(state => state.roomId);
	const isRevealed = useRoomStore(state => state.isRevealed);

	const previousRoundsResults = useRoomStore(state => state.getPreviousRoundsResults());
	const isReadyToReveal = useRoomStore(state => state.getIsReadyToReveal());
	const allGuests = useRoomStore(state => state.getAllGuests());
	const votesState = useRoomStore(state => state.getVotesState());
	const localGuestVoteValue = useRoomStore(state => state.getLocalGuestVoteValue());

	const vote = useRoomStore(state => state.vote);
	const joinRoom = useRoomStore(state => state.join);
	const revealCards = useRoomStore(state => state.revealCards);
	const startNewRound = useRoomStore(state => state.startNewRound);

	const params = useParams();
	const roomId = typeof params.id === 'string' ? params.id : '';
	const roomLink = `https://scrum-poker.app/room/${roomId}`;

	const handleRevealCardClicked = async () => {
		try {
			await revealCards();
		} catch (err) {
			toast({
				variant: "destructive",
				title: "Failed to reveal cards",
				description: err instanceof Error ? err.message : 'An unknown error occurred',
			})
		}
	}


	const handleJoinRoom = async (guestName: string) => {
		try {
			await joinRoom({ guestName, roomId });
			router.push(`/room/${roomId}`);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
			toast({
				variant: "destructive",
				title: "Failed to join room",
				description: errorMessage,
			});
			return;
		}
	};

	const handleCardClicked = (idx: number) => {
		if (localGuestVoteValue === idx) {
			vote(null);
		}
		else vote(idx);
	}

	if (!roomIdFromStore) {
		return (
			<div className="h-screen w-full bg-gray-100 p-14 flex flex-col">
				<div className="flex-1 flex items-center justify-center">
					<JoinRoomMenu onSubmit={handleJoinRoom} />
				</div>
				<Toaster />
			</div>
		);
	}

	return (
		<div className="h-screen w-full bg-gray-100 p-14 flex flex-col">
			<div className="flex justify-between items-center mb-8">
				<div className="text-2xl font-bold">
					<p>Room Name:</p>
					<p>{roomName}</p>
				</div>
				<JoinRoomLink roomLink={roomLink} />
			</div>

			<div className="flex-1 flex gap-4 min-w-0">
				<div className="flex-shrink basis-72 min-w-[180px]">
					<RoomGuestList
						guests={allGuests}
						className="w-full"
					/>
				</div>

				<div className="flex-grow flex flex-col items-center justify-center space-y-8 basis-96 min-w-[300px]">
					<RoomVoteStatus votes={votesState} isRevealed={isRevealed} />
					<PulsatingButton
						onClick={handleRevealCardClicked}
						className="bg-blue-600 hover:bg-blue-700"
						disabled={!isReadyToReveal}
						isPulsating={isReadyToReveal}
					>
						Reveal Votes
					</PulsatingButton>
					{isRevealed && <Button onClick={startNewRound}>
						New round</Button>}
				</div>

				<div className="flex-shrink basis-72 min-w-[180px] ml-auto">
					<RoomRoundsHistory gameRounds={previousRoundsResults} />
				</div>
			</div>

			<RoomDeck deck={deck} selectedCard={localGuestVoteValue} onCardClicked={handleCardClicked} />
			<Toaster />
		</div>
	);
};

export default ScrumPokerLayout;