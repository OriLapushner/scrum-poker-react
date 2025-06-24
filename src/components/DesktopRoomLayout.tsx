import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from "@/components/ui/button";
import { RoomGuestList } from '@/components/RoomGuestList';
import { RoomRoundsHistory } from '@/components/RoomRoundsHistory';
import { RoomTable } from '@/components/RoomTable';
import { AlertCircle } from 'lucide-react';
import { RoomControls } from './RoomControls';

interface DesktopRoomLayoutProps {
	isViewingHistory: boolean;
	selectedRoundIndex: number | null;
	displayedResults: GameRoundResult | null;
	previousRoundsResults: GameRoundResult[];
	setSelectedRoundIndex: (index: number | null) => void;
	handleRoundSelect: (index: number) => void;
}

export const DesktopRoomLayout = ({
	isViewingHistory,
	selectedRoundIndex,
	displayedResults,
	previousRoundsResults,
	setSelectedRoundIndex,
	handleRoundSelect,
}: DesktopRoomLayoutProps) => {
	return (
		<div className="flex flex-col justify-center items-center">
			<div className="flex gap-4 justify-center w-full">
				<RoomGuestList
					className='min-w-56 w-1/5 max-w-64'
				/>

				<div className="flex-grow flex flex-col justify-between items-center">
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

					<RoomTable
						currentRoundResult={displayedResults || { result: 0 }}
					/>
					<RoomControls />
				</div>
				<RoomRoundsHistory
					className='min-w-56 w-1/5 max-w-64'
					gameRounds={previousRoundsResults}
					selectedRoundIndex={selectedRoundIndex}
					onRoundSelect={handleRoundSelect}
				/>
			</div>
		</div>
	);
}; 