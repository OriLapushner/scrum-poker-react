"use client"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"

export function CTASection() {
	return (
		<Section className="bg-primary-500 text-white">
			<Container>
				<div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
					<h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
						Ready to Improve Your Estimation Process?
					</h2>
					<p className="max-w-[750px] text-xl text-primary-100">
						Start using our Scrum Poker tool today to make better estimates and deliver more predictable
						results for your agile team.

					</p>
					<Button
						size="lg"
						className="mt-4 bg-white text-primary-800 hover:bg-primary-50"
						onClick={() => {
							window.scrollTo({ top: 0, behavior: "smooth" })
						}}
					>
						Get Started Now
					</Button>
				</div>
			</Container>
		</Section>
	)
} 