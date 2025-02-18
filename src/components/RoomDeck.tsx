import React from 'react';
import { Card } from "@/components/ui/card";

interface RoomDeckProps {
	deck: Deck;
	selectedCard: number | null;
	onCardClicked: (idx: number) => void;
}

export const RoomDeck: React.FC<RoomDeckProps> = ({ deck, selectedCard, onCardClicked }) => {
	return (
		<div className="mt-8 w-full">
			<div className="flex justify-center pb-4 gap-4">
				{deck.cards.map((card, index) => (
					<Card
						onClick={() => onCardClicked(index)}
						key={index}
						className={`
                            flex-shrink-0 w-16 h-24 
                            flex items-center justify-center 
                            text-xl font-bold cursor-pointer 
                            transition-all duration-200
                            ${selectedCard === index ?
								'bg-blue-300 -translate-y-2 shadow-lg hover:bg-blue-400' :
								'hover:bg-blue-200'
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