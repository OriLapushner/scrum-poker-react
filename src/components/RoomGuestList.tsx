import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, UserCheck, Clock, WifiOff } from "lucide-react";
import { cn } from '@/lib/utils';
import { useRoomStore } from '@/store/Room/Room';

export const RoomGuestList = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
	const localGuest = useRoomStore(state => state.localGuest);
	const remoteGuests = useRoomStore(state => state.remoteGuests);
	const guests = useMemo(() => [localGuest, ...remoteGuests], [localGuest, remoteGuests]);

	const getGuestIcon = (guest: typeof localGuest) => {
		if (!guest.isConnected) {
			return <WifiOff className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />;
		}

		if (guest.isSpectator) {
			return <Eye className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0 text-muted-foreground" />;
		}

		if (!guest.isInRound) {
			return <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />;
		}

		return <UserCheck className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0 text-primary" />;
	};

	return (
		<Card className={cn("border-slate-200 shadow-sm", className)} {...props}>
			<CardHeader className="pb-2 md:pb-3">
				<CardTitle className="text-base md:text-lg font-medium">Participants</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-60 md:h-72 px-2">
					<div className="space-y-1">
						{guests.map((guest) => (
							<div
								key={guest.id}
								className="flex items-center justify-between p-1.5 md:p-2 rounded-lg bg-secondary/70 transition-colors hover:bg-secondary"
							>
								<div className="flex items-center gap-1.5 md:gap-2 min-w-0">
									{getGuestIcon(guest)}
									<span className={`text-xs md:text-sm ${guest.isInRound ? "font-medium" : "text-muted-foreground"} truncate`}>
										{guest.name}
									</span>
								</div>
							</div>
						))}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
};
