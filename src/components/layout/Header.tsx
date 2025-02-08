
import { Tool, BarChart2, Settings, Users, History, AlertTriangle } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Tool className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Tools Monitor</h1>
          </div>

          <div className="flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className={navigationMenuTriggerStyle()}>
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Tool className="mr-2 h-4 w-4" />
                    Tools
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3">
                        <Link
                          to="/tools"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        >
                          <Tool className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Tools Management
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Monitor and manage your tools inventory, track maintenance status, and handle assignments.
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/maintenance"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Maintenance</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Schedule and track tool maintenance
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/alerts"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Alerts</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            View and manage tool alerts and notifications
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/history" className={navigationMenuTriggerStyle()}>
                    <History className="mr-2 h-4 w-4" />
                    History
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/settings" className={navigationMenuTriggerStyle()}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
