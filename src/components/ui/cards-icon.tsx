import * as React from "react";
import { cn } from "@/lib/utils";

interface CardsIconProps extends React.SVGProps<SVGSVGElement> {
	className?: string;
}

const CardsIcon = React.forwardRef<SVGSVGElement, CardsIconProps>(
	({ className, ...props }, ref) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="32"
			height="32"
			viewBox="0 0 24 24"
			fill="none"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={cn("stroke-primary-800", className)}
			ref={ref}
			{...props}
		>
			<rect x="3" y="2" width="18" height="20" rx="2" ry="2"></rect>
			<polygon points="12,6 16,12 12,18 8,12" className="fill-primary-600/30"></polygon>
		</svg>
	)
);

CardsIcon.displayName = "CardsIcon";

export { CardsIcon }; 