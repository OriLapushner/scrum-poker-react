"use client"
import CreateRoomMenu from "@/components/CreateRoomMenu"
import { ArrowRight } from "lucide-react"
import { AuroraBackground } from "../ui/aurora-background"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"

export function HeroSection() {
	return (
		<Section>
			<AuroraBackground>
				<Container className="z-10 max-w-8xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
					<div className="flex flex-col gap-4 items-center text-center max-w-lg">
						<h1 className="text-3xl font-bold leading-tight tracking-tighter text-gray-900 md:text-4xl lg:text-5xl">
							Scrum Poker <span className="bg-gradient-to-r from-primary-700/90 to-primary-600 text-transparent bg-clip-text">Made Easy</span> Streamline Your Agile Estimations
						</h1>
						<p className="text-lg text-gray-600 max-w-lg">
							Our Scrum Poker tool makes team estimation simple, collaborative, and effective. Enhance your planning sessions with real-time voting and intuitive visualization of team consensus. No registration required.
						</p>
						<a
							href="#how-it-works"
							className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
						>
							Learn more about Scrum Poker
							<ArrowRight className="ml-2 h-4 w-4" />
						</a>
					</div>

					<CreateRoomMenu />
				</Container>
			</AuroraBackground>
		</Section>
	)
} 