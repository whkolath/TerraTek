import React from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Link,
} from "@heroui/react";

const Layout = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const menuItems = [
        { name: "Home", link: "/" },
        { name: "Freshwater Tank", link: "/tank1" },
        { name: "Greywater Tank", link: "/tank2" },
        { name: "Weather Conditions", link: "/weather" },
        { name: "Reports", link: "/reports" },
    ];



    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Navbar className="h-[50px]" onMenuOpenChange={setIsMenuOpen} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <NavbarContent>
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="sm:hidden"
                    />
                    <NavbarBrand className="hidden sm:flex gap-4" justify="start">
                        <NavbarItem>
                            <Link color="foreground" href="/">
                                Home
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link color="foreground" href="/tank1">
                                Freshwater Tank
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link color="foreground" href="/tank2">
                                Greywater Tank
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link color="foreground" href="weather">
                                Weather Conditions
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link color="foreground" href="reports">
                                Reports
                            </Link>
                        </NavbarItem>
                    </NavbarBrand>
                </NavbarContent>

                <NavbarMenu>
                    {menuItems.map((item, index) => (
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link
                                className="w-full"
                                color={"primary"}
                                href={item.link}
                                size="lg"
                            >
                                {item.name}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </NavbarMenu>
            </Navbar>

            <main className="h-[calc(100vh-50px)]">
                {children}
            </main>
        </div>
    );
}

export default Layout;