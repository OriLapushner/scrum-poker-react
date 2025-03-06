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
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MobileRoomLayout } from '@/components/MobileRoomLayout';

const ScrumPokerLayout = () => {
	const router = useRouter();
	const { toast } = useToast();
	const [selectedRoundIndex, setSelectedRoundIndex] = useState<number | null>(null);

	const deck = useRoomStore(state => state.deck);
	const roomName = useRoomStore(state => state.roomName);
	const roomIdFromStore = useRoomStore(state => state.roomId);
	const isRevealed = useRoomStore(state => state.isRevealed);

	const currentRoundResults = useRoomStore(state => state.getCurrentRoundResults());
	const previousRoundsResults = useRoomStore(state => state.getPreviousRoundsResults());
	const isReadyToReveal = useRoomStore(state => state.getIsReadyToReveal());
	const allGuests = useRoomStore(state => state.getAllGuests());
	const votesState = useRoomStore(state => state.getVotesState());
	const localGuestVoteValue = useRoomStore(state => state.getLocalGuestVoteValue());
	const getVotesStateForRound = useRoomStore(state => state.getVotesStateForPreviousRound);

	const vote = useRoomStore(state => state.vote);
	const joinRoom = useRoomStore(state => state.join);
	const revealCards = useRoomStore(state => state.revealCards);
	const startNewRound = useRoomStore(state => state.startNewRound);

	const params = useParams();
	const roomId = typeof params.id === 'string' ? params.id : '';
	const domain = window?.location?.host || '';
	const protocol = window?.location?.protocol || 'https'
	const roomLink = `${protocol}://${domain}/room/${roomId}`;

	// Determine which votes to display based on selection
	const displayedVotes = selectedRoundIndex !== null
		? getVotesStateForRound(selectedRoundIndex)
		: votesState;

	const displayedResults = selectedRoundIndex !== null
		? previousRoundsResults[selectedRoundIndex]
		: currentRoundResults;

	const isViewingHistory = selectedRoundIndex !== null;
	const isMobile = useMediaQuery('(max-width: 1023px)');

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
		if (selectedRoundIndex === index) {
			setSelectedRoundIndex(null);
		} else {
			setSelectedRoundIndex(index);
		}
	};

	const handleStartNewRound = () => {
		// Reset selected round when starting a new round
		setSelectedRoundIndex(null);
		startNewRound();
	};

	if (!roomIdFromStore) {
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
		<div className="min-h-screen w-full bg-slate-50 p-4 md:p-8 flex flex-col pb-28 lg:pb-8">
			<div className="flex flex-col sm:flex-row justify-between items-center mb-4 md:mb-8 pb-4 border-b border-slate-200">
				<div className="flex flex-col mb-3 sm:mb-0 items-center sm:items-start">
					<span className="text-sm font-medium text-slate-500">Room Name</span>
					<span className="text-xl md:text-2xl font-bold text-slate-800">{roomName}</span>
				</div>
				<JoinRoomLink roomLink={roomLink} />
			</div>

			{isMobile ? (
				<MobileRoomLayout
					isViewingHistory={isViewingHistory}
					selectedRoundIndex={selectedRoundIndex}
					displayedVotes={displayedVotes}
					isRevealed={isRevealed}
					displayedResults={displayedResults}
					isReadyToReveal={isReadyToReveal}
					allGuests={allGuests}
					previousRoundsResults={previousRoundsResults}
					handleRevealCardClicked={handleRevealCardClicked}
					handleStartNewRound={handleStartNewRound}
					setSelectedRoundIndex={setSelectedRoundIndex}
					handleRoundSelect={handleRoundSelect}
				/>
			) : (
				// Desktop layout
				<div className="flex-1 flex gap-6 min-w-0 overflow-hidden">
					<div className="flex-shrink basis-72 min-w-[180px]">
						<RoomGuestList
							guests={allGuests}
						/>
					</div>

					<div className="flex-grow flex flex-col items-center justify-center space-y-8 basis-96 min-w-[300px]">
						{isViewingHistory && (
							<div className="w-full max-w-md mb-4">
								<Alert className="bg-amber-50 border border-amber-200 shadow-sm">
									<div className="flex items-center justify-between w-full">
										<div className="flex items-center gap-2">
											<AlertCircle className="h-4 w-4 text-amber-600" />
											<div>
												<AlertTitle className="text-amber-900 font-medium text-sm mb-0">
													Round {selectedRoundIndex + 1} History
												</AlertTitle>
												<AlertDescription className="text-amber-800 text-xs">
													Viewing Round history
												</AlertDescription>
											</div>
										</div>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setSelectedRoundIndex(null)}
											className="h-8 border-amber-300 bg-amber-100/50 text-amber-800 hover:bg-amber-100 hover:text-amber-900"
										>
											Back to Current
										</Button>
									</div>
								</Alert>
							</div>
						)}

						<RoomVoteStatus
							votes={displayedVotes}
							isRevealed={isViewingHistory ? true : isRevealed}
							currentRoundResult={displayedResults}
						/>

						{!isViewingHistory && !isRevealed && (
							<PulsatingButton
								onClick={handleRevealCardClicked}
								className="bg-blue-600 hover:bg-blue-700"
								disabled={!isReadyToReveal}
								isPulsating={isReadyToReveal}
							>
								Reveal Votes
							</PulsatingButton>
						)}

						{!isViewingHistory && isRevealed && (
							<Button onClick={handleStartNewRound}>
								New round
							</Button>
						)}
					</div>

					<div className="flex-shrink basis-72 min-w-[180px] ml-auto">
						<RoomRoundsHistory
							gameRounds={previousRoundsResults}
							selectedRoundIndex={selectedRoundIndex}
							onRoundSelect={handleRoundSelect}
						/>
					</div>
				</div>
			)}

			<div className="fixed lg:static bottom-0 left-0 right-0 bg-slate-50 shadow-lg lg:shadow-none pt-2 lg:pt-0 z-10">
				<RoomDeck deck={deck} selectedCard={localGuestVoteValue} onCardClicked={handleCardClicked} />
			</div>
			<Toaster />
		</div>
	);
};

export default ScrumPokerLayout;