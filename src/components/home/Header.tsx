"use client"
import Link from "next/link"
import Image from "next/image"

export function Header() {
	return (
		<header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
			<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between py-4">
					<div className="flex items-center gap-2">
						<Image
							src="/cards-icon.svg"
							width={40}
							height={40}
							alt="Scrum Poker Logo"
							className="rounded"
						/>
						<div className="flex flex-col -space-y-1">
							<span className="text-lg font-bold text-gray-900">ScrumPoker</span>
							<span className="text-sm text-blue-600 self-center">Made Easy</span>
						</div>
					</div>
					<nav className="hidden sm:flex items-center gap-6">
						<Link href="#features" className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline">
							Features
						</Link>
						<Link href="#how-it-works" className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline">
							How It Works
						</Link>
					</nav>
				</div>
			</div>
		</header>
	)
} 