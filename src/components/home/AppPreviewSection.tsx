import { ArrowRight } from "lucide-react"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { RotatingImages } from "./RotatingImages"
import { useState } from "react"
import { motion } from "framer-motion"


interface PreviewItem {
	title: string;
	description: string;
	image: string;
}

const previewItems: PreviewItem[] = [
	{
		title: "Create Custom Estimation Decks",
		description: "Build personalized card decks that match your team's estimation style, or choose from proven default options for instant setup.",
		image: "/create_deck.webp",
	},
	{
		title: "Create a room and invite your team",
		description: "Create instant estimation rooms with shareable links. No account creation required - your team joins immediately and starts estimating together.",
		image: "/join_room.webp",
	},
	{
		title: "Vote Anonymously Together",
		description: "Vote anonymously in order to eliminate anchoring bias. This ensures honest, independent assessments that lead to more accurate estimations.",
		image: "/revealed.webp",
	},
	{
		title: "Reveal and Reach Consensus",
		description: "Display all votes together, discuss differences openly, and re-vote as needed until your team achieves accurate estimation consensus.",
		image: "/voted.webp",
	}
]

export function AppPreviewSection() {
	const [activeIdx, setActiveIdx] = useState(0)

	return (
		<Section id="why-scrum-poker" className="bg-primary-500 text-gray-100">
			<Container>
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
					<div className="space-y-8 lg:space-y-14">
						<h2 className="text-3xl font-bold tracking-tighter md:text-4xl">See How It Works</h2>
						<motion.div
							className="min-h-[5.5rem]"
							key={activeIdx}
							initial={{
								y: 20,
								opacity: 0,
							}}
							animate={{
								y: 0,
								opacity: 1,
							}}
							exit={{
								y: -20,
								opacity: 0,
							}}
							transition={{
								duration: 0.2,
								ease: "easeInOut",
							}}
						>
							<motion.p className="text-lg mt-8">
								{previewItems[activeIdx].description.split(" ").map((word: string, index: number) => (
									<motion.span
										key={index}
										initial={{
											filter: "blur(10px)",
											opacity: 0,
											y: 5,
										}}
										animate={{
											filter: "blur(0px)",
											opacity: 1,
											y: 0,
										}}
										transition={{
											duration: 0.2,
											ease: "easeInOut",
											delay: 0.02 * index,
										}}
										className="inline-block"
									>
										{word}&nbsp;
									</motion.span>
								))}
							</motion.p>
						</motion.div>
						<ul className="space-y-2">
							{previewItems.map((item, index) => (
								<li
									onClick={() => setActiveIdx(index)}
									key={item.title}
									className={`flex items-start gap-3 p-2 rounded-lg transition-all duration-200 ease-in-out cursor-pointer group 
									${activeIdx === index ? 'bg-primary-800 scale-105 transition-all duration-400' :
											'hover:bg-primary-800/80 hover:shadow-sm hover:scale-[1.02]'}`}
								>
									<div className="rounded-full bg-gray-100 p-1.5 transition-colors duration-200">
										<ArrowRight className="h-3 w-3 text-gray-700 transition-colors duration-200 group-hover:text-primay-900" />
									</div>
									<span className="transition-colors duration-200 leading-relaxed">
										{item.title}
									</span>
								</li>
							))}
						</ul>
					</div>
					<RotatingImages className="max-lg:hidden" initialImages={previewItems.map(item => item.image)} activeIdx={activeIdx} />
				</div>
			</Container>
		</Section>
	)
} 