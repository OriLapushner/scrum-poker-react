import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlippableCard } from "@/components/FlippableCard";
import { Separator } from "@/components/ui/separator";

interface RoomVoteStatusProps {
	votes: VoteEntry[];
	isRevealed: boolean;
	currentRoundResult: GameRoundResult;
}

export function RoomVoteStatus({ votes, isRevealed, currentRoundResult }: RoomVoteStatusProps) {
	const totalVotes = votes.length;
	const votedCount = votes.filter(vote => vote.cardValue !== null).length;
	const [flippedCards, setFlippedCards] = useState<{ [key: string]: boolean }>({});

	useEffect(() => {
		// Reset flipped cards state when votes change
		setFlippedCards({});

		if (isRevealed) {
			votes.forEach((vote, index) => {
				setTimeout(() => {
					setFlippedCards(prev => ({
						...prev,
						[vote.guest.id]: true
					}));
				}, index * 200);
			});
		}
	}, [isRevealed, votes]);

	const renderFrontContent = (value: number | null) => (
		<Card
			className={`w-full h-full flex items-center justify-center transition-all duration-200 
            ${value !== null
					? 'bg-blue-50 shadow-sm border-blue-200'
					: 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
		>
			{value !== null ? (
				<span className="text-blue-600 font-bold text-lg">✓</span>
			) : (
				<span className="text-slate-400 text-sm">pending</span>
			)}
		</Card>
	);

	const renderBackContent = (displayName: string | null) => (
		<Card
			className="w-full h-full flex items-center justify-center bg-blue-600 text-white border-blue-700 shadow-md"
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
						<span className="text-sm font-medium text-slate-700 truncate max-w-full px-2">
							{guest.name}
						</span>
					</div>
				))}
			</div>

			<div className="flex flex-col items-center space-y-4">
				{!isRevealed && (
					<Badge className="px-5 py-2 text-sm font-semibold bg-slate-100 text-slate-700 border border-slate-200" variant="outline">
						<span>{`${votedCount} / ${totalVotes} votes`}</span>
					</Badge>
				)}

				{isRevealed && (
					<>
						<Separator className="my-2 bg-slate-200" />
						<Card className="px-8 py-4 border-blue-200 shadow-sm">
							<div className="flex items-baseline gap-2">
								<span className="text-sm text-slate-500">Average:</span>
								<span className="text-2xl font-bold text-blue-600">
									{currentRoundResult.result}
								</span>
							</div>
						</Card>
					</>
				)}
			</div>
		</div>
	);
}