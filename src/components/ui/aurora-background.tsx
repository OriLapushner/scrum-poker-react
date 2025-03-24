"use client"

import { cn } from "@/lib/utils"
import type React from "react"
import type { ReactNode } from "react"

const defaultColors = {
  primary100: "#cffafe", // lightest
  primary200: "#b2f6fd",
  primary300: "#94ecf8",
  primary400: "#8ceffc", // darkest

  bgLight: "#fff",
  bgDark: "#000",

  transparent: "transparent",
}

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode
  showRadialGradient?: boolean
  colors?: typeof defaultColors
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  colors = defaultColors,
  ...props
}: AuroraBackgroundProps) => {
  // Construct gradients using the color variables
  const cssVars = {
    "--aurora": `repeating-linear-gradient(135deg,${colors.primary200} 0%,${colors.primary300} 20%,${colors.primary100} 40%,${colors.primary200} 60%,${colors.primary300} 80%)`,
    "--dark-gradient": `repeating-linear-gradient(135deg,${colors.bgDark} 0%,${colors.transparent} 10%,${colors.bgDark} 20%,${colors.transparent} 30%)`,
    "--white-gradient": `repeating-linear-gradient(135deg,${colors.bgLight} 0%,${colors.transparent} 10%,${colors.bgLight} 20%,${colors.transparent} 30%)`,

    "--primary-100": colors.primary100,
    "--primary-200": colors.primary200,
    "--primary-300": colors.primary300,
    "--primary-400": colors.primary400,
    "--bg-light": colors.bgLight,
    "--bg-dark": colors.bgDark,
    "--transparent": colors.transparent,
  } as React.CSSProperties

  return (
    <div
      className={cn(
        "transition-bg relative flex h-[100vh] flex-col items-center justify-center bg-zinc-50 text-slate-950 dark:bg-zinc-900",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden" style={cssVars}>
        <div
          className={cn(
            `pointer-events-none absolute -inset-[10px] opacity-30 blur-[10px] invert filter
            [background-image:var(--white-gradient),var(--aurora)]
            [background-size:400%,_200%]
            [background-position:0%_0%,0%_0%]
            after:absolute after:inset-0 after:animate-aurora-after   
            after:[background-image:var(--white-gradient),var(--aurora)]
            after:[background-size:300%,_150%]
            after:[background-position:0%_0%,0%_0%]
            after:[background-attachment:fixed]
            after:mix-blend-difference
            after:content-[""]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            dark:invert-0
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]`,

            showRadialGradient &&
            `[mask-image:radial-gradient(ellipse_at_50%_50%,black_60%,var(--transparent)_95%),
              radial-gradient(ellipse_at_20%_50%,black_30%,var(--transparent)_70%),
              radial-gradient(ellipse_at_80%_50%,black_30%,var(--transparent)_70%)]`,
          )}
        ></div>
      </div>
      {children}
    </div>
  )
}

