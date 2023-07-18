import { NavLink } from "@remix-run/react"
import {
  FaceIcon,
  HomeIcon,
  LockOpen1Icon,
  MagnifyingGlassIcon,
  PersonIcon,
} from "@radix-ui/react-icons"

import { cn } from "~/libs"
import { TooltipAuto, TooltipProvider } from "~/components"

const navItems = [
  { to: "/", text: "Home", icon: <HomeIcon className="icon" /> },
  {
    to: "/search",
    text: "Search",
    icon: <MagnifyingGlassIcon className="icon" />,
  },
  { to: "/mentors", text: "Mentors", icon: <FaceIcon className="icon" /> },
  { to: "/mentees", text: "Mentees", icon: <PersonIcon className="icon" /> },
  { to: "/login", text: "Login", icon: <LockOpen1Icon className="icon" /> },
]

export function HeaderNavigation() {
  return (
    <header
      className={cn(
        "z-10 select-none",
        "border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-950",
        "fixed bottom-0 left-0 flex w-full items-center justify-center border-t-2",
        "lg:top-0 lg:h-screen lg:w-16 lg:border-r-2 lg:border-t-0",
      )}
    >
      <nav className="w-full max-w-md sm:max-w-3xl">
        <TooltipProvider delayDuration={300}>
          <ul className="flex justify-between gap-4 p-2 lg:flex-col lg:gap-2">
            {navItems.map((navItem) => {
              return (
                <li key={navItem.to}>
                  <TooltipAuto
                    content={navItem.text}
                    className="hidden lg:block"
                    side="right"
                  >
                    <NavLink
                      to={navItem.to}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center justify-center gap-2 rounded p-2 font-bold ",
                          isActive
                            ? "dark:bg-emerald-950 dark:hover:bg-emerald-900"
                            : "hover:bg-stone-800",
                        )
                      }
                    >
                      {navItem.icon}
                      <span className="hidden sm:block lg:hidden">
                        {navItem.text}
                      </span>
                    </NavLink>
                  </TooltipAuto>
                </li>
              )
            })}
          </ul>
        </TooltipProvider>
      </nav>
    </header>
  )
}
