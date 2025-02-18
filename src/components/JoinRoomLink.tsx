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
		<div className="flex flex-col">
			<span className="mb-1">Share this link to invite guests:</span>
			<div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border">
				<span className="text-sm text-gray-600">{roomLink}</span>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								onClick={copyToClipboard}
							>
								{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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