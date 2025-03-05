import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

type RoundsHistoryProps = {
	gameRounds: GameRoundResult[];
	className?: string;
	selectedRoundIndex?: number | null;
	onRoundSelect?: (index: number) => void;
};

export const RoomRoundsHistory: React.FC<RoundsHistoryProps> = ({
	gameRounds = [],
	className,
	selectedRoundIndex = null,
	onRoundSelect = () => { }
}) => {
	// Create a reversed copy of gameRounds for display purposes
	const displayRounds = [...gameRounds].reverse();

	return (
		<Card className={`min-w-[180px] w-full ${className} border-slate-200 shadow-sm`}>
			<CardHeader className="pb-2">
				<CardTitle className="text-lg font-medium text-slate-800">Round History</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-72 pr-4">
					<div className="space-y-1.5">
						{gameRounds.length === 0 ? (
							<div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
								<p className="text-sm text-slate-500">No completed rounds yet</p>
							</div>
						) : (
							// Map through the reversed array, but we need to convert indexes back
							// for selection and display purposes
							displayRounds.map((round, displayIndex) => {
								// Convert display index back to original index for selection
								const originalIndex = gameRounds.length - 1 - displayIndex;
								const isSelected = selectedRoundIndex === originalIndex;

								return (
									<div
										key={originalIndex}
										className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer
											${isSelected
												? 'bg-blue-50 border border-blue-200 shadow-sm'
												: 'bg-slate-50 border border-slate-100 hover:bg-slate-100'}`}
										onClick={() => onRoundSelect(originalIndex)}
									>
										<span className={`text-sm ${isSelected ? 'text-blue-700 font-medium' : 'text-slate-600'}`}>
											Round {originalIndex + 1}
										</span>
										<span className={`px-2.5 py-1 rounded text-sm font-medium
											${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
											{round.result}
										</span>
									</div>
								);
							})
						)}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
};