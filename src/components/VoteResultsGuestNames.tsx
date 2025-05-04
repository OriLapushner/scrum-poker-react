import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface VoteResultsGuestNamesProps {
	guests: Guest[];
	className?: string;
}

export const VoteResultsGuestNames = ({ guests, className }: VoteResultsGuestNamesProps) => {
	const showQuestionMark = guests.length > 2;

	const guestListJsx = guests.map((guest) => (
		<div
			key={guest.id}
			className="text-white text-xs md:text-sm font-medium bg-gray-600/80 px-2 py-0.5 rounded-full shadow-sm"
		>
			{guest.name}
		</div>
	));

	const questionMarkJsx = (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div className="text-white text-xs md:text-sm font-medium bg-gray-600/80 px-2 py-0.5 rounded-full shadow-sm cursor-pointer">
						?
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<div className="flex flex-row flex-wrap justify-center gap-1 max-w-[200px]">
						{guests.map((guest) => (
							<span
								key={guest.id}
								className="text-white text-xs font-medium bg-gray-600/80 px-2 py-0.5 rounded-full"
							>
								{guest.name}
							</span>
						))}
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);

	return (
		<div className={cn("flex flex-row flex-wrap justify-center gap-1 w-full", className)}>
			{!showQuestionMark ? guestListJsx : questionMarkJsx}
		</div>
	);
}; 