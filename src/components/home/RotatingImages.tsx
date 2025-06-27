"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { HTMLAttributes } from "react";

interface RotatingImagesProps extends HTMLAttributes<HTMLDivElement> {
	initialImages: string[];
	activeIdx: number;
}

export const RotatingImages = ({ initialImages, activeIdx, ...props }: RotatingImagesProps) => {

	const [images, setImages] = useState<string[]>(initialImages);

	const setSelected = (selectedIdx: number) => {
		const idxToSwap = images.findIndex(image => image === initialImages[selectedIdx])
		if (idxToSwap === 0) return
		const temp = images[0]
		images[0] = images[idxToSwap]
		images[idxToSwap] = temp
		setImages(images)
	};

	setSelected(activeIdx)

	const calculateOffset = (index: number) => {
		return 15 * index;
	};

	return (
		<div {...props}>
			<div className="relative w-full aspect-[748/589]">
				<AnimatePresence>
					{images.map((image, index) => {
						const isActive = index === 0
						return (
							<motion.div
								key={image}
								initial={{
									opacity: 0,
									z: -100,
									x: calculateOffset(index),
									y: calculateOffset(index),
								}}
								animate={{
									opacity: isActive ? 1 : 0.7,
									scale: 1,
									z: isActive ? 0 : -100,
									x: isActive ? 0 : calculateOffset(index),
									y: isActive ? 0 : calculateOffset(index),
									zIndex: isActive ? 999 : images.length + 2 - index,
								}}
								exit={{
									opacity: 0,
									z: 100,
									x: calculateOffset(index),
									y: calculateOffset(index),
								}}
								transition={{
									duration: 0.4,
									ease: "easeInOut",
								}}
								className="absolute inset-0 origin-bottom"
							>
								<Image
									src={image}
									alt={image}
									width={748}
									height={589}
									draggable={false}
									className="h-full w-full object-cover object-center"
								/>
							</motion.div>
						)
					})}
				</AnimatePresence>
			</div>
		</div>
	);
};