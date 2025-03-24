"use client"
import { Button } from "@/components/ui/button"

export function CTASection() {
	return (
		<section className="bg-primary-500 text-white">
			<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-24 lg:py-32">
				<div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
					<h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
						Ready to Improve Your Estimation Process?
					</h2>
					<p className="max-w-[750px] text-xl text-primary-100">
						Join thousands of agile teams who use our Scrum Poker tool to make better estimates and deliver more
						predictable results.
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
			</div>
		</section>
	)
} 