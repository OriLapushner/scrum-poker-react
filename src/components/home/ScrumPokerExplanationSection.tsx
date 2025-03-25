"use client"

export function ScrumPokerExplanationSection() {
	const howItWorksSteps = [
		{
			title: "Present User Story",
			description: "The product owner presents a user story to be estimated by the team."
		},
		{
			title: "Silent Voting",
			description: "Team members privately select a card representing their estimate."
		},
		{
			title: "Reveal and Discuss",
			description: "All estimates are revealed simultaneously. Team members with outlier values explain their reasoning."
		},
		{
			title: "Reach Consensus",
			description: "After discussion, the team re-votes until consensus is reached on a final estimate."
		}
	];

	const benefitsItems = [
		{
			title: "Reduces Anchoring Bias",
			description: "By revealing estimates simultaneously, no team member influences others with their initial estimate."
		},
		{
			title: "Encourages Discussion",
			description: "Different estimates lead to valuable conversations about assumptions and implementation details."
		},
		{
			title: "Builds Understanding",
			description: "Through discussion, the team develops a common understanding of requirements and complexity."
		},
		{
			title: "Improves Accuracy",
			description: "Collective wisdom of the team leads to more realistic and balanced estimates over time."
		}
	];

	return (
		<section id="how-it-works" className="bg-white py-8 md:py-24 mt-auto scroll-mt-16">
			<div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
				<div className="mx-auto text-center mb-6">
					<h2 className="text-3xl font-bold text-primary-700 md:text-3xl">Understanding Scrum Poker</h2>
					<p className="mt-2 text-gray-600 max-w-3xl mx-auto">
						Also known as Planning Poker, Scrum Poker is a consensus-based estimation technique used by agile teams to
						estimate effort or relative size of user stories.
					</p>
				</div>

				<div className="space-y-6">
					<div className="border-t-2 border-primary-600 pt-4">
						<h3 className="text-lg font-semibold text-primary-700 mb-3 text-center">How It Works</h3>
						<p className="text-gray-600 mb-4">
							Scrum Poker uses cards with numbers that represent story points or effort. Team members select cards
							simultaneously to prevent anchoring bias, then discuss differences to reach consensus.
						</p>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{howItWorksSteps.map((step, index) => (
								<div key={`how-it-works-${index}`} className="bg-primary-50 p-3 rounded">
									<h4 className="font-medium text-primary-950/80">{step.title}</h4>
									<p className="text-sm text-gray-600 mt-1">
										{step.description}
									</p>
								</div>
							))}
						</div>
					</div>

					<div className="border-t-2 border-primary-600 pt-4">
						<h3 className="text-lg font-semibold text-primary-700 mb-3 text-center">Benefits of Scrum Poker</h3>
						<p className="text-gray-600 mb-4">
							Scrum Poker improves estimation accuracy and team collaboration through structured consensus
							building, allowing development teams to leverage diverse perspectives and reduce individual biases
						</p>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{benefitsItems.map((benefit, index) => (
								<div key={`benefits-${index}`} className="bg-primary-50 p-3 rounded">
									<h4 className="font-medium text-primary-950/80">{benefit.title}</h4>
									<p className="text-sm text-gray-600 mt-1">
										{benefit.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

