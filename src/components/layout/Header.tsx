import { 
  Package2, 
  Boxes, 
  BarChart2, 
  Settings, 
  Users,
  List
} from "lucide-react";
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
            <Package2 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Miinventory Manager</h1>
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
                  <Link to="/reports" className={navigationMenuTriggerStyle()}>
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Reports
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Boxes className="mr-2 h-8 w-4" />
                    Inventory
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-4 p-3">
                        <Link
                          to="/inventory"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        >
                          <Boxes className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Inventory Management
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
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
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Manage product categories and subcategories
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/products"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Products</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Manage Products
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/stock-levels"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Stock Levels</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Monitor and update inventory stock levels
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/warehouses"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Warehouses</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Manage warehouses
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/suppliers" className={navigationMenuTriggerStyle()}>
                    <Settings className="mr-2 h-4 w-4" />
                    Suppliers
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/customers" className={navigationMenuTriggerStyle()}>
                    <Settings className="mr-2 h-4 w-4" />
                    Customers
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Boxes className="mr-2 h-4 w-4" />
                    Orders
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3">
                        <Link
                          to="/orders"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        >
                          <Boxes className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Orders Management
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Manage orders
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/purchase-orders"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Purchase Orders</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Manage product categories and subcategories
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/sales-orders"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Sales Orders</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Sales Orders
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/transfer-orders"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Transfer Orders</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Transfer Orders
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/users" className={navigationMenuTriggerStyle()}>
                    <Users className="mr-2 h-4 w-4" />
                    Users
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