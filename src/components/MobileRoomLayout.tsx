import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { RoomTable } from './RoomTable';
import { RoomGuestList } from './RoomGuestList';
import { RoomRoundsHistory } from './RoomRoundsHistory';
import { useState } from 'react';
import { RoomControls } from './RoomControls';

interface MobileRoomLayoutProps {
	isViewingHistory: boolean;
	selectedRoundIndex: number | null;
	displayedResults: GameRoundResult | null;
	previousRoundsResults: GameRoundResult[];
	setSelectedRoundIndex: (index: number | null) => void;
	handleRoundSelect: (index: number) => void;
}

export const MobileRoomLayout: React.FC<MobileRoomLayoutProps> = ({
	isViewingHistory,
	selectedRoundIndex,
	displayedResults,
	previousRoundsResults,
	setSelectedRoundIndex,
	handleRoundSelect,
}) => {
	const [activeTab, setActiveTab] = useState("game");

	const handleTabChange = (value: string) => {
		setActiveTab(value);
	};

	const handleRoundSelected = (index: number) => {
		handleRoundSelect(index);
		setActiveTab("game");
	};

	return (
		<div className="flex-1 flex flex-col min-w-0 overflow-hidden">
			<Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex-1 flex flex-col">
				<TabsList className="w-full mb-4 flex-shrink-0">
					<TabsTrigger value="game" className="flex-1">Game</TabsTrigger>
					<TabsTrigger value="history" className="flex-1">History</TabsTrigger>
					<TabsTrigger value="participants" className="flex-1">Participants</TabsTrigger>
				</TabsList>

				<TabsContent value="game">
					<div className="flex-grow flex flex-col items-center space-y-4 pb-4">
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
							className='w-full'
							currentRoundResult={displayedResults || { result: 0 }}
						/>

						<RoomControls />
					</div>
				</TabsContent>

				<TabsContent value="history" className="flex justify-center">
					<RoomRoundsHistory
						className='w-full max-w-md'
						gameRounds={previousRoundsResults}
						selectedRoundIndex={selectedRoundIndex}
						onRoundSelect={handleRoundSelected}
					/>
				</TabsContent>

				<TabsContent value="participants" className="flex justify-center">
					<RoomGuestList
						className='w-full max-w-md'
					/>
				</TabsContent>

			</Tabs>
		</div>
	);
}; 