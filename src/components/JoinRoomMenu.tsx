import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


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
		<div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
			<h2 className="text-xl font-bold text-center mb-6">Join Room</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-1">
						Your Name
					</label>
					<Input
						id="guestName"
						type="text"
						value={guestName}
						onChange={(e) => setGuestName(e.target.value)}
						placeholder="Enter your name"
						className="w-full"
						required
					/>
				</div>
				<Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
					Join
				</Button>
			</form>
		</div>
	);
};