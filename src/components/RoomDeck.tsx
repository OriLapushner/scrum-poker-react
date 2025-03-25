import React from 'react';
import { Card } from "@/components/ui/card";

interface RoomDeckProps {
	deck: Deck;
	selectedCard: number | null;
	onCardClicked: (idx: number) => void;
}

export const RoomDeck: React.FC<RoomDeckProps> = ({ deck, selectedCard, onCardClicked }) => {
	return (
		<div className="flex min-w-full py-3 px-4 space-x-3 justify-center">
			{deck.cards.map((card, index) => (
				<Card
					onClick={() => onCardClicked(index)}
					key={index}
					className={`
								flex-shrink-0 w-12 h-16 md:w-16 md:h-24 
								flex items-center justify-center 
								text-base md:text-xl font-bold cursor-pointer 
								transition-all duration-200
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
	);
};

export default RoomDeck;