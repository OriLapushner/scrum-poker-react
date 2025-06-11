import { useState } from 'react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Copy, Check } from 'lucide-react';

interface JoinRoomLinkProps {
	roomLink: string;
}

export const JoinRoomLink: React.FC<JoinRoomLinkProps> = ({ roomLink }) => {
	const [copied, setCopied] = useState(false);

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(roomLink);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	};

	return (
		<div className="flex flex-col w-auto items-center sm:items-start">
			<div className="flex items-center bg-white rounded-lg pl-2 shadow-sm border w-auto">
				<span className="text-xs md:text-sm text-gray-600 overflow-x-auto">
					Room Link
				</span>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								onClick={copyToClipboard}
							>
								{copied ? <Check /> : <Copy />}
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>{copied ? 'Copied!' : 'Copy link'}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
};

export default JoinRoomLink;