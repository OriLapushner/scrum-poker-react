import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JoinRoomMenuProps {
	onSubmit: (guestName: string) => void;
}

export const JoinRoomMenu = ({ onSubmit }: JoinRoomMenuProps) => {
	const [guestName, setGuestName] = useState('');

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (guestName.trim()) {
			onSubmit(guestName);
		}
	};

	return (
		<Card className="w-full max-w-md mx-auto border-slate-200 shadow-md">
			<CardHeader className="pb-2 space-y-1">
				<CardTitle className="text-xl font-bold text-center text-slate-800">Join Room</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="guestName" className="block text-sm font-medium text-slate-700 mb-1">
							Your Name
						</label>
						<Input
							id="guestName"
							type="text"
							value={guestName}
							onChange={(e) => setGuestName(e.target.value)}
							placeholder="Enter your name"
							className="w-full border-slate-200 focus:border-blue-300 focus:ring-blue-200"
							required
						/>
					</div>
					<Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
						Join Room
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};