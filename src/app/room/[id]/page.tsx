'use client';
import { useParams, useRouter } from 'next/navigation';
import { useRoomStore } from '@/store/Room/Room';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast"
import { RoomDeck } from '@/components/RoomDeck';
import { JoinRoomMenu } from '@/components/JoinRoomMenu';
import { useState, useMemo, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MobileRoomLayout } from '@/components/MobileRoomLayout';
import { DesktopRoomLayout } from '@/components/DesktopRoomLayout';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { getRoundsResults, getResultFromRound } from '@/store/Room/RoomGetters';
import { useLocalStorageRoomsStore } from '@/store/localStorageRooms';
import { VoteResults } from '@/components/VoteResults';
import { RoomHeader } from '@/components/RoomHeader';

const isRoomInLocalStorage = (roomId: string) => {
	const localStorageRooms = useLocalStorageRoomsStore.getState().rooms
	const roomToJoin = localStorageRooms[roomId]
	return !!roomToJoin
}

const ScrumPokerLayout = () => {
	const params = useParams();
	const roomId = typeof params.id === 'string' ? params.id : '';
	const [isLoading, setIsLoading] = useState(true);
	const [shouldShowJoinMenu, setShouldShowJoinMenu] = useState(false);

	const router = useRouter();
	const { toast } = useToast();

	const deck = useRoomStore(state => state.deck);
	const roomIdFromStore = useRoomStore(state => state.roomId);
	const currentRound = useRoomStore(state => state.currentRound);
	const previousRounds = useRoomStore(state => state.previousRounds);
	const localGuest = useRoomStore(state => state.localGuest);
	const remoteGuests = useRoomStore(state => state.remoteGuests);
	const rejoinRoom = useRoomStore(state => state.rejoinRoom);
	const leaveRoom = useRoomStore(state => state.leaveRoom);
	const historySelectedRoundIndex = useRoomStore(state => state.historySelectedRoundIndex);
	const setHistorySelectedRoundIndex = useRoomStore(state => state.setHistorySelectedRoundIndex);

	const currentRoundResults = useMemo(() => getResultFromRound(currentRound, deck), [currentRound, deck]);
	const allGuests = useMemo(() => [localGuest, ...remoteGuests], [localGuest, remoteGuests]);
	const previousRoundsResults = useMemo(() => getRoundsResults(previousRounds, deck), [previousRounds, deck]);

	const joinRoom = useRoomStore(state => state.join);

	const displayedResults = historySelectedRoundIndex !== null
		? previousRoundsResults[historySelectedRoundIndex]
		: currentRoundResults;

	const isViewingHistory = historySelectedRoundIndex !== null;
	const isMobile = useMediaQuery('(max-width: 1023px)');

	// check if the room is in local storage
	useEffect(() => {
		const localStorageRooms = useLocalStorageRoomsStore.getState().rooms;
		const roomToJoin = localStorageRooms[roomId];
		setShouldShowJoinMenu(!roomIdFromStore && !roomToJoin);
		setIsLoading(false);
	}, [roomId, roomIdFromStore]);

	useEffect(() => {
		const currentRoomId = useRoomStore.getState().roomId
		if (currentRoomId !== roomId && isRoomInLocalStorage(roomId)) {
			rejoinRoom(roomId);
		}
		return () => {
			leaveRoom();
		}
	}, [roomId, rejoinRoom, leaveRoom]);

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

	const handleRoundSelect = (index: number) => {
		// If already selected, deselect it (toggle behavior)
		if (historySelectedRoundIndex === index) {
			setHistorySelectedRoundIndex(null);
		} else {
			setHistorySelectedRoundIndex(index);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen w-full bg-slate-50 p-4 md:p-8 flex flex-col lg:pb-8">
				<div className="flex-1 flex items-center justify-center">
					<div className="animate-pulse">Loading...</div>
				</div>
			</div>
		);
	}

	if (shouldShowJoinMenu) {
		return (
			<div className="min-h-screen w-full bg-slate-50 p-4 md:p-8 flex flex-col lg:pb-8">
				<div className="flex-1 flex items-center justify-center">
					<JoinRoomMenu onSubmit={handleJoinRoom} />
				</div>
				<Toaster />
			</div>
		);
	}

	return (
		<div className="min-h-screen w-full bg-slate-50">
			<RoomHeader />
			<div className='px-4 md:px-8 flex flex-col lg:pb-8'>
				{isMobile ? (
					<MobileRoomLayout
						isViewingHistory={isViewingHistory}
						selectedRoundIndex={historySelectedRoundIndex}
						displayedResults={displayedResults}
						allGuests={allGuests}
						previousRoundsResults={previousRoundsResults}
						setSelectedRoundIndex={setHistorySelectedRoundIndex}
						handleRoundSelect={handleRoundSelect}
					/>
				) : (
					<DesktopRoomLayout
						isViewingHistory={isViewingHistory}
						selectedRoundIndex={historySelectedRoundIndex}
						displayedResults={displayedResults}
						allGuests={allGuests}
						previousRoundsResults={previousRoundsResults}
						setSelectedRoundIndex={setHistorySelectedRoundIndex}
						handleRoundSelect={handleRoundSelect}
					/>
				)}
				<VoteResults
					className='w-xlg max-w-[90vw] h-72 max-h-[80vh] m-auto'
				/>

				<div className="z-10 absolute bottom-0 left-0 right-0">
					<ScrollArea className="w-full overflow-x-auto">
						<RoomDeck />
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</div>
				<Toaster />
			</div>

		</div>
	);
};

export default ScrumPokerLayout;