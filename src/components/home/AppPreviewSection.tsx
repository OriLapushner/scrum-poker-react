"use client"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function AppPreviewSection() {
	return (
		<section className="py-12 md:py-24 lg:py-32">
			<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
					<div className="space-y-4">
						<h2 className="text-3xl font-bold tracking-tighter text-gray-900 md:text-4xl">See How It Works</h2>
						<p className="text-lg text-gray-600">
							Our intuitive interface makes it easy for teams to collaborate on estimations, regardless of whether
							they&apos;re in the same room or distributed across the globe.
						</p>
						<ul className="space-y-2">
							<li className="flex items-start gap-2">
								<div className="rounded-full bg-blue-100 p-1 mt-1">
									<ArrowRight className="h-3 w-3 text-blue-600" />
								</div>
								<span className="text-gray-700">Create a room and share the link with your team</span>
							</li>
							<li className="flex items-start gap-2">
								<div className="rounded-full bg-blue-100 p-1 mt-1">
									<ArrowRight className="h-3 w-3 text-blue-600" />
								</div>
								<span className="text-gray-700">Add your user stories or tasks for estimation</span>
							</li>
							<li className="flex items-start gap-2">
								<div className="rounded-full bg-blue-100 p-1 mt-1">
									<ArrowRight className="h-3 w-3 text-blue-600" />
								</div>
								<span className="text-gray-700">Vote simultaneously and reveal when everyone is ready</span>
							</li>
							<li className="flex items-start gap-2">
								<div className="rounded-full bg-blue-100 p-1 mt-1">
									<ArrowRight className="h-3 w-3 text-blue-600" />
								</div>
								<span className="text-gray-700">Discuss and re-vote until consensus is reached</span>
							</li>
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
			</div>
		</section>
	)
} 