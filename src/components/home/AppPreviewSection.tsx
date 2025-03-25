"use client"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"

export function AppPreviewSection() {
	const steps = [
		"Create a room and share the link with your team",
		"Add your user stories or tasks for estimation",
		"Vote simultaneously and reveal when everyone is ready",
		"Discuss and re-vote until consensus is reached"
	]

	return (
		<Section id="why-scrum-poker" className="bg-gray-50">
			<Container>
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
					<div className="space-y-8 lg:space-y-14">
						<h2 className="text-3xl font-bold tracking-tighter text-gray-900 md:text-4xl">See How It Works</h2>
						<p className="text-lg text-gray-600">
							Our intuitive interface makes it easy for teams to collaborate on estimations, regardless of whether
							they&apos;re in the same room or distributed across the globe.
						</p>
						<ul className="space-y-2">
							{steps.map((item, index) => (
								<li key={index} className="flex items-start gap-2">
									<div className="rounded-full bg-primary-100 p-1 mt-1">
										<ArrowRight className="h-3 w-3 text-primary-800" />
									</div>
									<span className="text-gray-700">{item}</span>
								</li>
							))}
						</ul>
					</div>
					<div className="relative aspect-video overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
						<Image
							src="/game-preview.png"
							alt="Scrum Poker Application Interface"
							width={1280}
							height={720}
							className="object-cover"
						/>
					</div>
				</div>
			</Container>
		</Section>
	)
} 