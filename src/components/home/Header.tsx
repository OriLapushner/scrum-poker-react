"use client"
import { CardsIcon } from "@/components/ui/cards-icon"
import { useState, useEffect, useRef } from "react"

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [activeSection, setActiveSection] = useState("home")
	const activeSectionRef = useRef(activeSection)

	useEffect(() => {
		activeSectionRef.current = activeSection
	}, [activeSection])

	useEffect(() => {
		const sections = ["features", "how-it-works", "why-scrum-poker"]
		let sectionElements: Array<{ id: string, element: HTMLElement, top: number, bottom: number }> = []

		const calculateSectionPositions = () => {
			sectionElements = sections.map(id => {
				const element = document.getElementById(id)
				if (!element) return { id, element: null, top: 0, bottom: 0 }

				const rect = element.getBoundingClientRect()
				return {
					id,
					element,
					top: window.scrollY + rect.top - 80,
					bottom: window.scrollY + rect.bottom
				}
			}).filter(section => section.element !== null) as Array<{ id: string, element: HTMLElement, top: number, bottom: number }>
		}

		calculateSectionPositions()

		const determineActiveSection = () => {
			if (window.scrollY < 200) {
				return "home"
			}

			const currentPosition = window.scrollY + 100

			for (const section of sectionElements) {
				if (currentPosition >= section.top && currentPosition < section.bottom) {
					return section.id
				}
			}

			if (sectionElements.length > 0 &&
				currentPosition >= sectionElements[sectionElements.length - 1].bottom) {
				return sectionElements[sectionElements.length - 1].id
			}

			return "home"
		}

		let isThrottled = false
		const THROTTLE_TIME = 100 // ms

		const handleScroll = () => {
			if (isThrottled) return

			isThrottled = true
			setTimeout(() => { isThrottled = false }, THROTTLE_TIME)

			const newActiveSection = determineActiveSection()
			if (newActiveSection !== activeSectionRef.current) {
				setActiveSection(newActiveSection)
			}
		}

		const handleResize = () => {
			calculateSectionPositions()
			handleScroll()
		}

		window.addEventListener("scroll", handleScroll)
		window.addEventListener("resize", handleResize)

		handleScroll()

		return () => {
			window.removeEventListener("scroll", handleScroll)
			window.removeEventListener("resize", handleResize)
		}
	}, [])

	const isActive = (section: string) => activeSection === section

	const desktopMenu = (
		<nav className="hidden lg:flex flex-1 justify-center">
			<div className="flex space-x-8">
				<a
					href="#"
					className={`inline-flex items-center border-b-2 pt-1 text-sm font-medium ${isActive("home")
						? "border-primary-700 text-gray-900"
						: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
						}`}
				>
					Create Room
				</a>
				<a
					href="#features"
					className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${isActive("features")
						? "border-primary-700 text-gray-900"
						: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
						}`}
				>
					Features
				</a>
				<a
					href="#how-it-works"
					className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${isActive("how-it-works")
						? "border-primary-700 text-gray-900"
						: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
						}`}
				>
					How it works
				</a>
				<a
					href="#why-scrum-poker"
					className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${isActive("why-scrum-poker")
						? "border-primary-700 text-gray-900"
						: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
						}`}
				>
					Why ScrumPoker?
				</a>
			</div>
		</nav>
	)

	const mobileMenu = (
		<div className="lg:hidden">
			<div className="space-y-1 pb-3 pt-2">
				<a
					href="#"
					className={`block border-l-4 py-2 pl-4 pr-3 text-base font-medium ${isActive("home")
						? "border-primary-600 bg-primary-50/80 text-gray-700"
						: "border-transparent text-gray-700"
						}`}
				>
					Create Room
				</a>
				<a
					href="#features"
					className={`block border-l-4 py-2 pl-4 pr-3 text-base font-medium ${isActive("features")
						? "border-primary-600 bg-primary-50/80 text-gray-700"
						: "border-transparent text-gray-700"
						}`}
				>
					Features
				</a>
				<a
					href="#how-it-works"
					className={`block border-l-4 py-2 pl-4 pr-3 text-base font-medium ${isActive("how-it-works")
						? "border-primary-600 bg-primary-50/80 text-gray-700"
						: "border-transparent text-gray-700"
						}`}
				>
					How it works
				</a>
				<a
					href="#why-scrum-poker"
					className={`block border-l-4 py-2 pl-4 pr-3 text-base font-medium ${isActive("why-scrum-poker")
						? "border-primary-600 bg-primary-50/80 text-gray-700"
						: "border-transparent text-gray-700"
						}`}
				>
					Why ScrumPoker?
				</a>
			</div>
		</div>
	)

	return (
		<header className="sticky top-0 z-40 bg-white shadow">
			<div className="flex min-h-16 max-w-7xl px-4 sm:px-6 lg:px-8 justify-between">
				<div className="flex shrink-0 items-center gap-2 px-2">
					<CardsIcon width={40} height={40} className="rounded" />
					<div className="flex flex-col -space-y-1">
						<span className="text-lg font-bold text-gray-900">ScrumPoker</span>
						<span className="text-sm text-primary-600 self-center">Made Easy</span>
					</div>
				</div>

				{desktopMenu}

				<div className="flex lg:hidden ml-auto">
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-600"
					>
						<span className="absolute -inset-0.5" />
						<span className="sr-only">Open main menu</span>
						{mobileMenuOpen ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
							</svg>
						)}
					</button>
				</div>
			</div>

			{/* Mobile menu, show/hide based on menu state */}
			{mobileMenuOpen && mobileMenu}
		</header>
	)
}