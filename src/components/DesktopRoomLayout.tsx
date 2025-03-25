import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from "@/components/ui/button";
import { PulsatingButton } from "@/components/magicui/pulsating-button";
import { RoomGuestList } from '@/components/RoomGuestList';
import { RoomRoundsHistory } from '@/components/RoomRoundsHistory';
import { RoomVoteStatus } from '@/components/RoomVoteStatus';
import { AlertCircle } from 'lucide-react';

interface DesktopRoomLayoutProps {
	isViewingHistory: boolean;
	selectedRoundIndex: number | null;
	displayedVotes: VoteEntry[];
	isRevealed: boolean;
	displayedResults: GameRoundResult | null;
	isReadyToReveal: boolean;
	allGuests: Guest[];
	previousRoundsResults: GameRoundResult[];
	handleRevealCardClicked: () => void;
	handleStartNewRound: () => void;
	setSelectedRoundIndex: (index: number | null) => void;
	handleRoundSelect: (index: number) => void;
}

export const DesktopRoomLayout = ({
	isViewingHistory,
	selectedRoundIndex,
	displayedVotes,
	isRevealed,
	displayedResults,
	isReadyToReveal,
	allGuests,
	previousRoundsResults,
	handleRevealCardClicked,
	handleStartNewRound,
	setSelectedRoundIndex,
	handleRoundSelect
}: DesktopRoomLayoutProps) => {
	return (
		<div className="flex-1 flex gap-6 min-w-0 overflow-hidden">
			<div className="flex-shrink basis-72 min-w-[180px]">
				<RoomGuestList
					guests={allGuests}
				/>
			</div>

			<div className="flex-grow flex flex-col items-center justify-center space-y-8 basis-96 min-w-[300px]">
				{isViewingHistory && (
					<div className="w-full max-w-md mb-4">
						<Alert className="bg-amber-50 border border-amber-200 shadow-sm">
							<div className="flex items-center justify-between w-full">
								<div className="flex items-center gap-2">
									<AlertCircle className="h-4 w-4 text-amber-600" />
									<div>
										<AlertTitle className="text-amber-900 font-medium text-sm mb-0">
											Round {selectedRoundIndex! + 1} History
										</AlertTitle>
										<AlertDescription className="text-amber-800 text-xs">
											Viewing Round history
										</AlertDescription>
									</div>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setSelectedRoundIndex(null)}
									className="h-8 border-amber-300 bg-amber-100/50 text-amber-800 hover:bg-amber-100 hover:text-amber-900"
								>
									Back to Current
								</Button>
							</div>
						</Alert>
					</div>
				)}

				<RoomVoteStatus
					votes={displayedVotes}
					isRevealed={isViewingHistory ? true : isRevealed}
					currentRoundResult={displayedResults || { result: 0 }}
				/>

				{!isViewingHistory && !isRevealed && (
					<PulsatingButton
						onClick={handleRevealCardClicked}
						className="bg-primary-800 hover:bg-primary-900"
						disabled={!isReadyToReveal}
						isPulsating={isReadyToReveal}
						pulseColor="#06b6d4"
					>
						Reveal Votes
					</PulsatingButton>
				)}

				{!isViewingHistory && isRevealed && (
					<Button onClick={handleStartNewRound}>
						New round
					</Button>
				)}
			</div>

			<div className="flex-shrink basis-72 min-w-[180px] ml-auto">
				<RoomRoundsHistory
					gameRounds={previousRoundsResults}
					selectedRoundIndex={selectedRoundIndex}
					onRoundSelect={handleRoundSelect}
				/>
			</div>
		</div>
	);
}; 