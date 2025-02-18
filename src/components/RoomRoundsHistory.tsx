import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

type RoundsHistoryProps = {
	gameRounds: GameRoundResult[];
	className?: string;
};

export const RoomRoundsHistory: React.FC<RoundsHistoryProps> = ({ gameRounds = [], className }) => {
	return (
		<Card className={`min-w-[180px] w-full ${className}`}>
			<CardHeader className="pb-3">
				<CardTitle className="text-lg font-medium">Round History</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-72 pr-4">
					<div className="space-y-1">
						{gameRounds.length === 0 ? (
							<div className="p-2 rounded-lg bg-secondary/20">
								<p className="text-sm text-muted-foreground">No completed rounds yet</p>
							</div>
						) : (
							gameRounds.map((round, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-2 rounded-lg bg-secondary/20 transition-colors hover:bg-secondary/30"
								>
									<span className="text-sm text-muted-foreground">
										Round {gameRounds.length - index}
									</span>
									<span className="px-2 py-1 bg-primary/10 rounded text-sm font-medium text-primary">
										{round.result}
									</span>
								</div>
							))
						)}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
};