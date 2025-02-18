import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, UserCheck } from "lucide-react";

type GuestListProps = {
	guests: Guest[];
	className?: string; // Add className prop for flexibility
};

export const RoomGuestList = ({ guests, className }: GuestListProps) => {
	return (
		<Card className={`min-w-[180px] w-full ${className}`}>
			<CardHeader className="pb-3">
				<CardTitle className="text-lg font-medium">Participants</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-72 pr-4">
					<div className="space-y-1">
						{guests.map((guest) => (
							<div
								key={guest.id}
								className="flex items-center justify-between p-2 rounded-lg bg-secondary/70 transition-colors hover:bg-secondary"
							>
								<div className="flex items-center gap-2 min-w-0">
									{guest.isInRound ? (
										<UserCheck className="h-4 w-4 flex-shrink-0 text-primary" />
									) : (
										<Eye className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
									)}
									<span className={`${guest.isInRound ? "font-medium" : "text-muted-foreground"} truncate`}>
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
