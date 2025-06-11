import React, { type HTMLAttributes, useState } from 'react';
import { Card } from "@/components/ui/card";
import { useRoomStore } from '@/store/Room/Room';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { getGuestVoteValue } from '@/store/Room/RoomGetters';

export const RoomDeck: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className }) => {
	const localGuest = useRoomStore(state => state.localGuest);
	const currentRound = useRoomStore(state => state.currentRound);
	const isRevealed = useRoomStore(state => state.isRevealed);
	const deck = useRoomStore(state => state.deck);
	const vote = useRoomStore(state => state.vote);
	const localGuestVoteValue = getGuestVoteValue(localGuest, currentRound);

	const [openTooltipIndex, setOpenTooltipIndex] = useState<number | null>(null);

	const isDisabled = !localGuest.isInRound || isRevealed;

	const handleCardClicked = (idx: number) => {
		if (!localGuest.isInRound) {
			setOpenTooltipIndex(idx);
			setTimeout(() => setOpenTooltipIndex(null), 1500);
			return;
		}
		if (localGuestVoteValue === idx) {
			vote(null);
		}
		else vote(idx);
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
									flex items-center justify-center 
									text-base md:text-xl font-bold
									transition-all duration-200
									${isDisabled ?
										'opacity-60 cursor-not-allowed' :
										'cursor-pointer'}
									${localGuestVoteValue === index ?
										'bg-primary-400 -translate-y-2 shadow-lg hover:bg-primary-500' :
										isDisabled ? 'hover:bg-primary-400/60' : ''}
								`}
							>
								{card.displayName}
							</Card>
						</TooltipTrigger>
						{isDisabled && (
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