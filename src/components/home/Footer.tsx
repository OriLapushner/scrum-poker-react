"use client"
import Link from "next/link"

export function Footer() {
	return (
		<footer className="border-t border-gray-200 bg-gray-50">
			<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex justify-center">
					<Link href="#" className="text-sm text-gray-500 hover:text-gray-700">
						Terms of Use
					</Link>
				</div>
				<div className="mt-4 text-center text-sm text-gray-500">
					© {new Date().getFullYear()} ScrumPoker. All rights reserved.
				</div>
			</div>
		</footer>
	)
} 