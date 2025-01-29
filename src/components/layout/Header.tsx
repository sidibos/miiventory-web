import { Package2, Boxes, BarChart2, Settings, Users } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package2 className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">Warehouse Manager</h1>
          </div>

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
                  <Boxes className="mr-2 h-4 w-4" />
                  Inventory
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <Link
                        to="/inventory"
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-50 to-blue-100 p-6 no-underline outline-none focus:shadow-md"
                      >
                        <Boxes className="h-6 w-6" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Inventory Management
                        </div>
                        <p className="text-sm leading-tight text-gray-600">
                          Manage your warehouse inventory, track stock levels, and handle item categories.
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/categories"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Categories</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-600">
                          Manage product categories and subcategories
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/stock-levels"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Stock Levels</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-600">
                          Monitor and update inventory stock levels
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/settings" className={navigationMenuTriggerStyle()}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/users" className={navigationMenuTriggerStyle()}>
                  <Users className="mr-2 h-4 w-4" />
                  Users
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};