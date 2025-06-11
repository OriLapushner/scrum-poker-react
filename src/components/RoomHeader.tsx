"use client"

import { useState, useEffect } from "react"
import { JoinRoomLink } from "@/components/JoinRoomLink"
import { UserNameEditor } from "@/components/UserNameEditor"
import { SpectatorToggle } from "@/components/SpectatorToggle"
import { Button } from "@/components/ui/button"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"

import { useRoomStore } from "@/store/Room/Room"
const RoomHeader = () => {
	const [roomLink, setRoomLink] = useState('')
	const [popoverOpen, setPopoverOpen] = useState(false)

	const roomId = useRoomStore(state => state.roomId)
	const roomName = useRoomStore(state => state.roomName)

	useEffect(() => {
		const domain = window?.location?.host || '';
		const protocol = window?.location?.protocol || 'https:';
		setRoomLink(`${protocol}//${domain}/room/${roomId}`);
	}, [roomId]);

	return (
		<header className="sticky top-0 z-50 w-full border-b px-4 mb-4">
			<div className="flex h-14 items-center justify-between">
				<span className="text-xl md:text-2xl font-bold text-slate-800">Room: <span className="text-primary-900">{roomName}</span></span>

				<div className="hidden lg:flex items-center gap-6">
					<SpectatorToggle />
					<UserNameEditor />
					<JoinRoomLink roomLink={roomLink} />
				</div>

				<div className="lg:hidden">
					<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
						<PopoverTrigger asChild>
							<Button variant="outline">Settings</Button>
						</PopoverTrigger>
						<PopoverContent
							onOpenAutoFocus={(event) => event.preventDefault()}
							align="end"
							className="p-2 w-auto min-w-40"
						>
							<div className="flex flex-col gap-3">
								<div className="flex justify-center w-full">
									<SpectatorToggle />
								</div>
								<div className="flex justify-center w-full">
									<UserNameEditor />
								</div>
								<div className="flex justify-center w-full">
									<JoinRoomLink roomLink={roomLink} />
								</div>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		</header>
	)
}

export { RoomHeader }

