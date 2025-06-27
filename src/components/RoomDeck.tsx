import React, { type HTMLAttributes, useMemo, useState } from 'react';
import { Card } from "@/components/ui/card";
import { useRoomStore } from '@/store/Room/Room';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { getGuestVoteValue, getIsDeckDisabled } from '@/store/Room/RoomGetters';
import { toast } from "sonner";

export const RoomDeck: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className }) => {
	const localGuest = useRoomStore(state => state.localGuest);
	const currentRound = useRoomStore(state => state.currentRound);
	const isRevealed = useRoomStore(state => state.isRevealed);
	const deck = useRoomStore(state => state.deck);
	const vote = useRoomStore(state => state.vote);
	const isVotingDisabled = useMemo(() => getIsDeckDisabled(isRevealed, localGuest), [isRevealed, localGuest]);
	const localGuestVoteValue = getGuestVoteValue(localGuest, currentRound);

	const [openTooltipIndex, setOpenTooltipIndex] = useState<number | null>(null);

	const handleCardClicked = async (idx: number) => {
		let value: number | null = idx;
		if (isVotingDisabled) {
			setOpenTooltipIndex(idx);
			setTimeout(() => setOpenTooltipIndex(null), 3000);
			return;
		}
		if (localGuestVoteValue === idx) value = null;
		try {
			await vote(value);
		} catch (error) {
			toast.error("Failed to submit vote", {
				description: error instanceof Error ? error.message : "An unexpected error occurred",
			});
		}
	}

	return (
		<div className={cn("flex min-w-full py-3 px-4 space-x-3 justify-center", className)}>
			{deck.cards.map((card, index) => (
				<TooltipProvider key={index}>
					<Tooltip open={openTooltipIndex === index}>
						<TooltipTrigger asChild>
							<Card
								onClick={() => handleCardClicked(index)}
								className={`
									flex-shrink-0 w-12 h-16 md:w-16 md:h-24 
									flex items-center justify-center text-base md:text-xl font-bold
									transition-all duration-200 hover:bg-primary-900/80 hover:text-gray-100
									${isVotingDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
									${localGuestVoteValue === index ?
										'bg-primary-900 -translate-y-2 shadow-lg text-gray-100' : ''}
								`}
							>
								{card.displayName}
							</Card>
						</TooltipTrigger>
						{isVotingDisabled && (
							<TooltipContent className='bg-primary-500 text-white'>
								<p>Can&apos;t vote this round</p>
							</TooltipContent>
						)}
					</Tooltip>
				</TooltipProvider>
			))}
		</div>
	);
};

export default RoomDeck;