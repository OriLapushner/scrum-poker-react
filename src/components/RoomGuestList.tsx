import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, UserCheck } from "lucide-react";

type GuestListProps = {
	guests: Guest[];
};

export const RoomGuestList = ({ guests }: GuestListProps) => {
	return (
		<Card>
			<CardHeader className="pb-2 md:pb-3">
				<CardTitle className="text-base md:text-lg font-medium">Participants</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-60 md:h-72 pr-2 md:pr-4">
					<div className="space-y-1">
						{guests.map((guest) => (
							<div
								key={guest.id}
								className="flex items-center justify-between p-1.5 md:p-2 rounded-lg bg-secondary/70 transition-colors hover:bg-secondary"
							>
								<div className="flex items-center gap-1.5 md:gap-2 min-w-0">
									{guest.isInRound ? (
										<UserCheck className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0 text-primary" />
									) : (
										<Eye className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0 text-muted-foreground" />
									)}
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
