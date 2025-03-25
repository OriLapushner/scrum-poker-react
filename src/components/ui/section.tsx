import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"

export const Section = ({
	className,
	children,
	...props
}: HTMLAttributes<HTMLElement> & {
	className?: string,
	children: React.ReactNode
}) => {
	return <section className={cn("w-full scroll-mt-16", className)} {...props}>{children}</section>
}