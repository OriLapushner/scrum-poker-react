import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlippableCard } from "@/components/FlippableCard";

interface RoomVoteStatusProps {
	votes: VoteEntry[];
	isRevealed: boolean;
}

export function RoomVoteStatus({ votes, isRevealed }: RoomVoteStatusProps) {
	const totalVotes = votes.length;
	const votedCount = votes.filter(vote => vote.cardValue !== null).length;
	const [flippedCards, setFlippedCards] = useState<{ [key: string]: boolean }>({});

	useEffect(() => {
		if (isRevealed) {
			// Flip cards sequentially
			votes.forEach((vote, index) => {
				setTimeout(() => {
					setFlippedCards(prev => ({
						...prev,
						[vote.guest.id]: true
					}));
				}, index * 200); // 0.2s delay between each card
			});
		} else {
			// Reset all cards when isRevealed becomes false
			setFlippedCards({});
		}
	}, [isRevealed, votes]);

	const renderFrontContent = (value: number | null) => (
		<Card
			className={`w-full h-full flex items-center justify-center transition-all duration-200 
        ${value !== null
					? 'bg-blue-100 shadow-lg ring-2 ring-blue-400'
					: 'bg-gray-50 hover:bg-gray-100'}`}
		>
			{value !== null ? (
				<span className="text-blue-600 font-bold text-lg">✓{value}</span>
			) : (
				<span className="text-gray-400 text-sm">pending</span>
			)}
		</Card>
	);

	const renderBackContent = (displayName: string | null) => (
		<Card
			className="w-full h-full flex items-center justify-center bg-blue-500 text-white"
		>
			<span className="font-bold text-2xl">
				{displayName ?? '?'}
			</span>
		</Card>
	);

	return (
		<div className="space-y-6 w-full max-w-lg">
			<div className="grid grid-cols-3 gap-4 place-items-center">
				{votes.map(({ guest, cardValue, displayName }) => (
					<div key={guest.id} className="w-full flex flex-col items-center space-y-2">
						<FlippableCard
							frontContent={renderFrontContent(cardValue)}
							backContent={renderBackContent(displayName)}
							isFlipped={flippedCards[guest.id] ?? false}
							width="w-16"
							height="h-24"
							className="max-w-16"
						/>
						<span className="text-sm font-medium text-gray-700 truncate max-w-full px-2">
							{guest.name}
						</span>
					</div>
				))}
			</div>

			<div className="flex justify-center text-lg">
				<Badge className="px-5 py-2 text-sm font-semibold bg-slate-600 text-gray-200" variant="outline">
					<span>{`${votedCount} / ${totalVotes} votes`}</span>
				</Badge>
			</div>
		</div>
	);
}