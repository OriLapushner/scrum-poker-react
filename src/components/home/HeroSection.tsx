"use client"
import CreateRoomMenu from "@/components/CreateRoomMenu"
import { ArrowRight } from "lucide-react"
import { AuroraBackground } from "../ui/aurora-background"

export function HeroSection() {
	return (
		<section>
			<AuroraBackground className="py-12 md:py-20">

				<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
						<div className="flex flex-col gap-4 items-center text-center">
							<h1 className="text-3xl font-bold leading-tight tracking-tighter text-gray-900 md:text-4xl lg:text-5xl">
								Scrum Poker Made Easy. Streamline Your Agile Estimations
							</h1>
							<p className="text-lg text-gray-600 max-w-md">
								Our Scrum Poker tool makes team estimation simple, collaborative, and effective. Enhance your planning sessions with real-time voting and intuitive visualization of team consensus. No registration required.
							</p>
							<a
								href="#"
								className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
							>
								Learn more about Scrum Poker
								<ArrowRight className="ml-2 h-4 w-4" />
							</a>
						</div>

						<CreateRoomMenu />
					</div>
				</div>
			</AuroraBackground>
		</section>
	)
} 