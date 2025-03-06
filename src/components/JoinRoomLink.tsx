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
			<span className="mb-1 text-xs md:text-sm text-center sm:text-left">Share this link to invite guests:</span>
			<div className="flex items-center gap-2 bg-white rounded-lg px-2 md:px-3 py-1 md:py-2 shadow-sm border w-auto">
				<span className="text-xs md:text-sm text-gray-600 overflow-x-auto">
					{roomLink}
				</span>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7 md:h-8 md:w-8 flex-shrink-0"
								onClick={copyToClipboard}
							>
								{copied ? <Check className="h-3.5 w-3.5 md:h-4 md:w-4" /> : <Copy className="h-3.5 w-3.5 md:h-4 md:w-4" />}
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