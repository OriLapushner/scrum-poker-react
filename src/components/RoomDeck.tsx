import React from 'react';
import { Card } from "@/components/ui/card";

interface RoomDeckProps {
	deck: Deck;
	selectedCard: number | null;
	onCardClicked: (idx: number) => void;
}

export const RoomDeck: React.FC<RoomDeckProps> = ({ deck, selectedCard, onCardClicked }) => {
	return (
		<div className="w-full">
			<div className="
				flex overflow-x-auto pb-4 pt-3 px-2 snap-x snap-mandatory justify-center
				lg:flex-wrap lg:justify-center lg:overflow-visible lg:gap-2 lg:px-0 lg:pb-2
			">
				{deck.cards.map((card, index) => (
					<Card
						onClick={() => onCardClicked(index)}
						key={index}
						className={`
							flex-shrink-0 w-12 h-16 md:w-16 md:h-24 
							flex items-center justify-center 
							text-base md:text-xl font-bold cursor-pointer 
							transition-all duration-200
							mx-1.5 snap-center lg:mx-0
							${selectedCard === index ?
								'bg-primary-400 -translate-y-2 shadow-lg hover:bg-primary-500' :
								'hover:bg-primary-400/60'
							}
						`}
					>
						{card.displayName}
					</Card>
				))}
			</div>
		</div>
	);
};

export default RoomDeck;