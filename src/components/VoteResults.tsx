import { type HTMLAttributes } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { useRoomStore } from '@/store/Room/Room';
import { VoteResultsGuestNames } from '@/components/VoteResultsGuestNames';
import { getGroupedVotes } from '@/store/Room/RoomGetters';
const MotionCard = motion.create(Card);

export const VoteResults: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className }) => {
	const isVoteResultsOpen = useRoomStore(state => state.isVoteResultsOpen);
	const setIsVoteResultsOpen = useRoomStore(state => state.setIsVoteResultsOpen);
	const currentRound = useRoomStore(state => state.currentRound);
	const deck = useRoomStore(state => state.deck);
	const localGuest = useRoomStore(state => state.localGuest);
	const remoteGuests = useRoomStore(state => state.remoteGuests);
	const historySelectedRoundIndex = useRoomStore(state => state.historySelectedRoundIndex);
	const previousRounds = useRoomStore(state => state.previousRounds);
	const roundToDisplay = historySelectedRoundIndex !== null ? previousRounds[historySelectedRoundIndex] : currentRound;
	const allGuests = [localGuest, ...remoteGuests];
	const groupedVotes = getGroupedVotes(roundToDisplay, deck, allGuests);

	return (
		<AnimatePresence mode="wait">
			{isVoteResultsOpen && (
				<MotionCard
					className={cn(
						'z-50 absolute left-0 right-0 bottom-10',
						'w-full h-full'
						, className)}
					initial={{
						clipPath: 'inset(50% 47% 50% 75%)'
					}}
					animate={{
						clipPath: [
							'inset(50% 47% 50% 47%)',
							'inset(0 47% 0 47%)',      // First phase: vertical reveal keeping 15% width
							'inset(0 0 0 0)'           // Second phase: horizontal reveal to full width
						]
					}}
					exit={{
						clipPath: [
							'inset(0 0 0 0)',           // Start from full width
							'inset(0 45% 0 45%)',      // First phase: horizontal collapse to center
							'inset(50% 47% 50% 47%)'   // Second phase: vertical collapse
						]
					}}
					transition={{
						duration: 0.45,
						times: [0, 0.25, 1],
						ease: "easeInOut"
					}}
				>
					<CardHeader className="flex flex-row p-4 justify-between items-center">
						<CardTitle as="h2" className="text-xl font-bold">Game Results</CardTitle>
						<Button variant="ghost" size="icon" onClick={() => setIsVoteResultsOpen(false)} className="rounded-full h-8 w-8" aria-label="Close">
							<X className="h-4 w-4" />
						</Button>
					</CardHeader>

					<CardContent className="flex flex-wrap justify-center gap-4">
						{groupedVotes.map(({ card, guests }) => (
							<div key={card.value} className="flex flex-col items-center max-w-48">
								<div className={cn(
									"h-16 lg:h-16 xl:h-20 aspect-[3/5]",
									"rounded-md flex items-center justify-center text-white font-bold",
									"bg-primary-600"
								)}>
									<span>{card.displayName}</span>
								</div>
								<div className="flex flex-col items-center mt-1">
									<span>
										{guests.length} {guests.length === 1 ? 'Vote' : 'Votes'}
									</span>
									<VoteResultsGuestNames guests={guests} />
								</div>
							</div>
						))}
					</CardContent>
				</MotionCard>
			)}
		</AnimatePresence>
	);
}; 