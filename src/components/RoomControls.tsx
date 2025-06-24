import { HTMLAttributes, useMemo } from "react";
import { PulsatingButton } from "./magicui/pulsating-button";
import { Button } from "./ui/button";
import { getIsRevealDisabled } from "@/store/Room/RoomGetters";
import { useRoomStore } from "@/store/Room/Room";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export const RoomControls: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className }) => {
	const currentRound = useRoomStore(state => state.currentRound);
	const isRevealDisabled = useMemo(() => getIsRevealDisabled(currentRound), [currentRound]);
	const historySelectedRoundIndex = useRoomStore(state => state.historySelectedRoundIndex);
	const isViewingHistory = historySelectedRoundIndex !== null;
	const isRevealed = useRoomStore(state => state.isRevealed);
	const revealCards = useRoomStore(state => state.revealCards);
	const startNewRound = useRoomStore(state => state.startNewRound);

	const { toast } = useToast();

	const handleRevealCardClicked = async () => {
		try {
			await revealCards();
		} catch (err) {
			toast({
				variant: "destructive",
				title: "Failed to reveal cards",
				description: err instanceof Error ? err.message : 'An unknown error occurred',
			})
		}
	}
	return (
		<div className={cn(className)}>
			{!isViewingHistory && !isRevealed && (
				<PulsatingButton
					onClick={handleRevealCardClicked}
					className="bg-primary-800 hover:bg-primary-900 mt-4 w-28"
					disabled={!isRevealDisabled}
					isPulsating={isRevealDisabled}
				>
					Reveal Votes
				</PulsatingButton>
			)}
			{!isViewingHistory && isRevealed && (
				<Button
					onClick={startNewRound}
					className='bg-primary-600 hover:bg-primary-700 w-28 my-6'
				>
					New round
				</Button>
			)}
		</div>
	);
};
