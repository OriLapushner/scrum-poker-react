import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface RoomDeckProps {
	deck: Deck;
	selectedCard: number | null;
	onCardClicked: (idx: number) => void;
	isDisabled: boolean;
}

export const RoomDeck: React.FC<RoomDeckProps> = ({ deck, selectedCard, onCardClicked, isDisabled }) => {
	const [openTooltipIndex, setOpenTooltipIndex] = useState<number | null>(null);

	const handleCardClick = (index: number) => {
		if (isDisabled) {
			setOpenTooltipIndex(index);
			setTimeout(() => setOpenTooltipIndex(null), 1500); // Hide tooltip after 1.5 seconds
			return;
		}
		onCardClicked(index);
	};

	return (
		<div className="flex min-w-full py-3 px-4 space-x-3 justify-center">
			{deck.cards.map((card, index) => (
				<TooltipProvider key={index}>
					<Tooltip open={isDisabled && openTooltipIndex === index}>
						<TooltipTrigger asChild>
							<Card
								onClick={() => handleCardClick(index)}
								className={`
									flex-shrink-0 w-12 h-16 md:w-16 md:h-24 
									flex items-center justify-center 
									text-base md:text-xl font-bold
									transition-all duration-200
									${isDisabled ?
										'opacity-60 cursor-not-allowed' :
										'cursor-pointer'}
									${selectedCard === index && !isDisabled ?
										'bg-primary-400 -translate-y-2 shadow-lg hover:bg-primary-500' :
										!isDisabled ? 'hover:bg-primary-400/60' : ''}
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