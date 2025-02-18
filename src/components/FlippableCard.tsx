import { ReactNode } from 'react';

interface FlippableCardCardProps {
	frontContent: ReactNode;
	backContent: ReactNode;
	isFlipped: boolean;
	className?: string;
	width?: string;
	height?: string;
}

export const FlippableCard: React.FC<FlippableCardCardProps> = ({
	frontContent,
	backContent,
	isFlipped,
	className = '',
	width = 'w-16',
	height = 'h-24'
}) => {
	return (
		<div className="w-full h-full flex items-center justify-center p-8">
			<div
				className={`relative ${width} ${height} transform-gpu transition-transform duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''
					} ${className}`}
			>
				{/* Front of card */}
				<div className="absolute w-full h-full backface-hidden">
					<div className="w-full h-full rounded-lg shadow-lg">
						{frontContent}
					</div>
				</div>

				{/* Back of card */}
				<div className="absolute w-full h-full backface-hidden rotate-y-180">
					<div className="w-full h-full rounded-lg shadow-lg">
						{backContent}
					</div>
				</div>
			</div>

			<style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
		</div>
	);
};