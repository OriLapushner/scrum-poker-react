import { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export const Container = ({ className, children, ...props }: HTMLAttributes<HTMLElement> & { className?: string, children: React.ReactNode }) => {
	return <div className={cn("mx-auto max-w-6xl px-6 sm:px-8 md:px-12 lg:px-14 py-12 md:py-20", className)} {...props}>{children}</div>
}
