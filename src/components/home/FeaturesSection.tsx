"use client"
import { Clock, Users, Settings } from "lucide-react"

export function FeaturesSection() {
	return (
		<section id="features" className="py-12 md:py-24 bg-gray-50 scroll-mt-16">
			<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
					<h2 className="text-3xl font-bold leading-tight tracking-tighter text-gray-900 md:text-4xl">
						Features That Make Estimation Easy
					</h2>
					<p className="max-w-[750px] text-lg text-gray-600">
						Our Scrum Poker application is designed to make your estimation sessions smooth and productive.
					</p>
				</div>
				<div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 lg:gap-16 mt-12">
					<div className="flex flex-col items-center text-center">
						<div className="mb-4 rounded-full bg-primary-100 p-4">
							<Clock className="h-8 w-8 text-primary-600" />
						</div>
						<h3 className="text-xl font-bold text-gray-900">Quick Setup</h3>
						<p className="text-gray-600">
							Create a room in seconds and invite your team with a simple link. No registration required to get
							started.
						</p>
					</div>
					<div className="flex flex-col items-center text-center">
						<div className="mb-4 rounded-full bg-primary-100 p-4">
							<Settings className="h-8 w-8 text-primary-600" />
						</div>
						<h3 className="text-xl font-bold text-gray-900">Custom Decks</h3>
						<p className="text-gray-600">
							Choose from Fibonacci, T-shirt sizes, or create your own custom deck to match your team&apos;s estimation
							style.
						</p>
					</div>
					<div className="flex flex-col items-center text-center">
						<div className="mb-4 rounded-full bg-primary-100 p-4">
							<Users className="h-8 w-8 text-primary-600" />
						</div>
						<h3 className="text-xl font-bold text-gray-900">Real-time Collaboration</h3>
						<p className="text-gray-600">
							See team members join, vote in real-time, and reveal results together for transparent decision making.
						</p>
					</div>
				</div>
			</div>
		</section>
	)
} 