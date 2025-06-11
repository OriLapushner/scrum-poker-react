import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRoomStore } from "@/store/Room/Room"

const SpectatorToggle = () => {
	const localGuest = useRoomStore(state => state.localGuest)
	const setLocalGuestAsSpectator = useRoomStore(state => state.setLocalGuestAsSpectator)

	const isSpectator = localGuest.isSpectator
	const handleToggle = (value: boolean) => {
		setLocalGuestAsSpectator(value).catch(error => {
			console.error("Failed to set spectator status:", error)
		})
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Toggle
						pressed={isSpectator}
						onPressedChange={handleToggle}
						aria-label="Toggle spectator mode"
						className={`lg:text-sm lg:w-28 text-xs w-24 text-center font-medium
              ${isSpectator ? "text-yellow-500 border border-yellow-500 hover:bg-yellow-500/10" :
								"text-green-500 border border-green-500 hover:bg-green-500/10"}`}
					>
						{isSpectator ? "Spectating" : "Voting"}
					</Toggle>
				</TooltipTrigger>
				<TooltipContent>
					<p>Toggle spectator mode</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

export { SpectatorToggle } 