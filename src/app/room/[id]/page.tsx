'use client';
import { useParams, useRouter } from 'next/navigation';
import { useRoomStore } from '@/store/Room/Room';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast"
import { JoinRoomLink } from "@/components/JoinRoomLink";
import { RoomDeck } from '@/components/RoomDeck';
import { JoinRoomMenu } from '@/components/JoinRoomMenu';
import { useState, useMemo, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MobileRoomLayout } from '@/components/MobileRoomLayout';
import { DesktopRoomLayout } from '@/components/DesktopRoomLayout';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
	getVotesStateFromRound, getRoundsResults,
	getResultFromRound, getIsReadyToReveal, getGuestVoteValue
} from '@/store/Room/RoomGetters';
import { useLocalStorageRoomsStore } from '@/store/localStorageRooms';

const isRoomInLocalStorage = (roomId: string) => {
	const localStorageRooms = useLocalStorageRoomsStore.getState().rooms
	const roomToJoin = localStorageRooms[roomId]
	return !!roomToJoin
}

const ScrumPokerLayout = () => {
	const params = useParams();
	const roomId = typeof params.id === 'string' ? params.id : '';
	const domain = window?.location?.host || '';
	const protocol = window?.location?.protocol || 'https'
	const roomLink = `${protocol}://${domain}/room/${roomId}`;

	const router = useRouter();
	const { toast } = useToast();
	const [historySelectedRoundIndex, setHistorySelectedRoundIndex] = useState<number | null>(null);

	const deck = useRoomStore(state => state.deck);
	const roomName = useRoomStore(state => state.roomName);
	const roomIdFromStore = useRoomStore(state => state.roomId);
	const isRevealed = useRoomStore(state => state.isRevealed);
	const currentRound = useRoomStore(state => state.currentRound);
	const previousRounds = useRoomStore(state => state.previousRounds);
	const localGuest = useRoomStore(state => state.localGuest);
	const remoteGuests = useRoomStore(state => state.remoteGuests);
	const rejoinRoom = useRoomStore(state => state.rejoinRoom);
	const leaveRoom = useRoomStore(state => state.leaveRoom);

	const localGuestVoteValue = getGuestVoteValue(localGuest, currentRound);
	const currentRoundResults = useMemo(() => getResultFromRound(currentRound, deck), [currentRound, deck]);
	const isReadyToReveal = useMemo(() => getIsReadyToReveal(currentRound), [currentRound]);
	const allGuests = useMemo(() => [localGuest, ...remoteGuests], [localGuest, remoteGuests]);
	const previousRoundsResults = useMemo(() => getRoundsResults(previousRounds, deck), [previousRounds, deck])
	const currentRoundVotesState = useMemo(() => {
		return getVotesStateFromRound(currentRound, allGuests, deck)
	}, [currentRound, allGuests, deck]);

	// Determine which votes to display based on selection
	const displayedVotes = useMemo(() => {
		if (historySelectedRoundIndex === null) return currentRoundVotesState;
		return getVotesStateFromRound(previousRounds[historySelectedRoundIndex], allGuests, deck);
	}, [historySelectedRoundIndex, currentRoundVotesState, previousRounds, allGuests, deck]);

	const vote = useRoomStore(state => state.vote);
	const joinRoom = useRoomStore(state => state.join);
	const revealCards = useRoomStore(state => state.revealCards);
	const startNewRound = useRoomStore(state => state.startNewRound);

	const displayedResults = historySelectedRoundIndex !== null
		? previousRoundsResults[historySelectedRoundIndex]
		: currentRoundResults;

	const isViewingHistory = historySelectedRoundIndex !== null;
	const isMobile = useMediaQuery('(max-width: 1023px)');


	useEffect(() => {
		const currentRoomId = useRoomStore.getState().roomId
		if (currentRoomId !== roomId && isRoomInLocalStorage(roomId)) {
			rejoinRoom(roomId);
		}
		return () => {
			leaveRoom();
		}
	}, [roomId, rejoinRoom, leaveRoom]);

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

	const handleRoundSelect = (index: number) => {
		// If already selected, deselect it (toggle behavior)
		if (historySelectedRoundIndex === index) {
			setHistorySelectedRoundIndex(null);
		} else {
			setHistorySelectedRoundIndex(index);
		}
	};

	const handleStartNewRound = () => {
		// Reset selected round when starting a new round
		setHistorySelectedRoundIndex(null);
		startNewRound();
	};

	if (!roomIdFromStore && !isRoomInLocalStorage(roomId)) {
		return (
			<div className="h-screen w-full bg-slate-50 p-8 flex flex-col">
				<div className="flex-1 flex items-center justify-center">
					<JoinRoomMenu onSubmit={handleJoinRoom} />
				</div>
				<Toaster />
			</div>
		);
	}

	return (
		<div className="min-h-screen w-full bg-slate-50 p-4 md:p-8 flex flex-col lg:pb-8">
			<div className="flex flex-col sm:flex-row justify-between items-center mb-4 md:mb-8 pb-4 border-b border-slate-200">
				<span className="text-xl md:text-2xl font-bold text-slate-800">{roomName}</span>
				<JoinRoomLink roomLink={roomLink} />
			</div>

			{isMobile ? (
				<MobileRoomLayout
					isViewingHistory={isViewingHistory}
					selectedRoundIndex={historySelectedRoundIndex}
					displayedVotes={displayedVotes}
					isRevealed={isRevealed}
					displayedResults={displayedResults}
					isReadyToReveal={isReadyToReveal}
					allGuests={allGuests}
					previousRoundsResults={previousRoundsResults}
					handleRevealCardClicked={handleRevealCardClicked}
					handleStartNewRound={handleStartNewRound}
					setSelectedRoundIndex={setHistorySelectedRoundIndex}
					handleRoundSelect={handleRoundSelect}
				/>
			) : (
				<DesktopRoomLayout
					isViewingHistory={isViewingHistory}
					selectedRoundIndex={historySelectedRoundIndex}
					displayedVotes={displayedVotes}
					isRevealed={isRevealed}
					displayedResults={displayedResults}
					isReadyToReveal={isReadyToReveal}
					allGuests={allGuests}
					previousRoundsResults={previousRoundsResults}
					handleRevealCardClicked={handleRevealCardClicked}
					handleStartNewRound={handleStartNewRound}
					setSelectedRoundIndex={setHistorySelectedRoundIndex}
					handleRoundSelect={handleRoundSelect}
				/>
			)}

			<div className="z-10 absolute bottom-0 left-0 right-0">
				<ScrollArea className="w-full overflow-x-auto">
					<RoomDeck isDisabled={!localGuest.isInRound} deck={deck} selectedCard={localGuestVoteValue} onCardClicked={handleCardClicked} />
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</div>
			<Toaster />
		</div>
	);
};

export default ScrumPokerLayout;