import { useState, KeyboardEvent, useEffect } from "react"
import { Edit, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRoomStore } from "@/store/Room/Room"

export const UserNameEditor = () => {
	const [editMode, setEditMode] = useState(false)
	const changeLocalGuestName = useRoomStore((state) => state.changeLocalGuestName)
	const userName = useRoomStore((state) => state.localGuest.name)
	const [editName, setEditName] = useState(userName)

	useEffect(() => {
		setEditName(userName)
	}, [userName])

	const handleNameChange = async () => {
		if (editName.trim() && editName.trim() !== userName) {
			try {
				await changeLocalGuestName(editName.trim())
			} catch (error) {
				console.error("Failed to change name:", error)
				setEditName(userName)
			}
		} else {
			setEditName(userName)
		}
		setEditMode(false)
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleNameChange()
		} else if (e.key === "Escape") {
			setEditName(userName)
			setEditMode(false)
		}
	}

	return (
		<div className="flex items-center gap-2">
			{editMode ? (
				<div className="flex items-center gap-1">
					<Input
						value={editName}
						onChange={(e) => setEditName(e.target.value)}
						onBlur={handleNameChange}
						onKeyDown={handleKeyDown}
						className="h-full md:max-w-32 max-w-24"
						autoFocus
						autoComplete="off"
					/>
					<Button
						variant="ghost"
						size="icon"
						className="h-6 w-6"
						onClick={handleNameChange}
					>
						<Check className="h-3.5 w-3.5" />
						<span className="sr-only">Save name</span>
					</Button>
				</div>
			) : (
				<>
					<span className="text-sm font-medium">{userName}</span>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-6 w-6"
									onClick={() => {
										setEditName(userName)
										setEditMode(true)
									}}
								>
									<Edit className="h-3.5 w-3.5" />
									<span className="sr-only">Edit name</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Edit name</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</>
			)}
		</div>
	)
} 