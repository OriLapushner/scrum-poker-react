"use client"

import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { FlippableCard } from "@/components/FlippableCard"
import { Button } from "@/components/ui/button"
import { useRoomStore } from "@/store/Room/Room"
import { getDisplayedVotes } from "@/store/Room/RoomGetters"

interface RoomTableProps {
	currentRoundResult: GameRoundResult;
	className?: string;
}

export function RoomTable({ className, currentRoundResult }: RoomTableProps) {
	const [flippedCards, setFlippedCards] = useState<{ [key: string]: boolean }>({});
	const isVoteResultsOpen = useRoomStore(state => state.isVoteResultsOpen);
	const setIsVoteResultsOpen = useRoomStore(state => state.setIsVoteResultsOpen);
	const isRevealed = useRoomStore(state => state.isRevealed);
	const historySelectedRoundIndex = useRoomStore(state => state.historySelectedRoundIndex);
	const deck = useRoomStore(state => state.deck);
	const currentRound = useRoomStore(state => state.currentRound);
	const previousRounds = useRoomStore(state => state.previousRounds);
	const localGuest = useRoomStore(state => state.localGuest);
	const remoteGuests = useRoomStore(state => state.remoteGuests);

	const allGuests = useMemo(() => [localGuest, ...remoteGuests], [localGuest, remoteGuests]);
	const votes = useMemo(() =>
		getDisplayedVotes(historySelectedRoundIndex, currentRound, previousRounds, allGuests, deck),
		[historySelectedRoundIndex, currentRound, previousRounds, allGuests, deck]
	);

	const toggleVoteResults = () => {
		setIsVoteResultsOpen(!useRoomStore.getState().isVoteResultsOpen);
	}
	useEffect(() => {
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

	const positionedPlayers = positionPlayers(votes);
	const shouldShowResults = isRevealed || historySelectedRoundIndex !== null;
	return (
		<div className={cn("w-full max-w-3xl mx-auto", className)}>
			<div className="relative w-[85%] mx-auto aspect-[4/3] md:aspect-[3/2] rounded-lg">
				{/* Table */}
				<div className="absolute inset-[30%] bg-blue-100 rounded-[50%] shadow-md flex flex-col items-center justify-center gap-2">
					{shouldShowResults && (
						<>
							<div className="px-4 py-1.5 bg-white rounded-full shadow-sm">
								<div className="flex items-baseline gap-2">
									<span className="text-xs text-slate-500">Average:</span>
									<span className="text-sm font-bold text-primary">
										{currentRoundResult.result}
									</span>
								</div>
							</div>
							<Button
								onClick={toggleVoteResults}
								variant="outline"
								size="sm"
								className="bg-white/80 hover:bg-white"
							>
								{isVoteResultsOpen ? "Hide Results" : "View Results"}
							</Button>
						</>
					)}
				</div>

				{positionedPlayers.map((player) => {
					const frontCard = (
						<div className={cn(
							"w-full h-full rounded-md flex items-center justify-center text-white font-bold",
							player.cardValue !== null
								? "bg-primary-900"
								: "bg-primary-600/70",
						)}>
							<span>{player.cardValue !== null ? "✓" : ""}</span>
						</div>
					);

					const backCard = (
						<div className="w-full h-full rounded-md flex items-center justify-center text-white font-bold bg-primary-900">
							{player.displayName && <span>{player.displayName}</span>}
						</div>
					);

					return (
						<div
							key={player.guest.id}
							className="absolute flex flex-col items-center gap-2"
							style={{
								left: `${player.position.x}%`,
								top: `${player.position.y}%`,
								transform: "translate(-50%, -50%)",
							}}
						>
							<FlippableCard
								frontContent={frontCard}
								backContent={backCard}
								isFlipped={flippedCards[player.guest.id] || false}
								className="h-12 lg:h-14 xl:h-16 aspect-[3/5]"
							/>

							<span className="text-white text-xs md:text-sm font-medium bg-gray-600/80 px-2 py-0.5 rounded-full shadow-sm">
								{player.guest.name}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	)
}

// Helper function to position players around the table
function positionPlayers(votes: VoteEntry[]) {
	// Limit to 8 players maximum
	const activePlayers = votes.slice(0, 8);
	const totalPlayers = activePlayers.length;

	// Calculate positions in a circle with appropriate radius
	const positions = calculateCircularPositions(totalPlayers);

	// Combine player data with positions
	return activePlayers.map((player, index) => ({
		...player,
		position: positions[index],
	}));
}

// Calculate positions in a symmetrical circle
function calculateCircularPositions(playerCount: number): Array<{ x: number, y: number }> {
	const positions: Array<{ x: number, y: number }> = [];

	// Center coordinates
	const centerX = 50;
	const centerY = 50;

	// Table is at inset-[20%] which means it starts at 20% from edges
	// We want players outside this area with some margin
	const safeRadius = 35; // 50 - 20 = 30 (from center to table edge) + 5 margin

	// Special cases for aesthetic positioning
	if (playerCount === 1) {
		// Single player at bottom
		positions.push({ x: centerX, y: centerY + safeRadius });
	}
	else if (playerCount === 2) {
		// Two players at bottom, symmetrically positioned
		positions.push({ x: centerX - 25, y: centerY + safeRadius });
		positions.push({ x: centerX + 25, y: centerY + safeRadius });
	}
	else if (playerCount === 4) {
		// For 4 players, position in cross pattern with left/right closer to center
		positions.push({ x: centerX, y: centerY - safeRadius }); // Top
		positions.push({ x: centerX - (safeRadius * 0.8), y: centerY }); // Left (closer to center)
		positions.push({ x: centerX, y: centerY + safeRadius }); // Bottom
		positions.push({ x: centerX + (safeRadius * 0.8), y: centerY }); // Right (closer to center)
	}
	else {
		// For other player counts, distribute evenly around the circle
		// Start at the top and go clockwise
		const startAngle = -Math.PI / 2; // Start at top (-90 degrees)

		for (let i = 0; i < playerCount; i++) {
			// Calculate the angle for this player
			const angle = startAngle + (i * 2 * Math.PI / playerCount);

			// Calculate position
			const x = centerX + safeRadius * Math.cos(angle);
			const y = centerY + safeRadius * Math.sin(angle);

			positions.push({ x, y });
		}
	}

	return positions;
} 