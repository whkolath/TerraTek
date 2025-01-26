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
    Button,
} from "@nextui-org/react";

const Layout = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const menuItems = [
        { name: "Tank 1", link: "/tank1" },
        { name: "Tank 2", link: "/tank2" },
        { name: "Tank 3", link: "/tank3" },
        { name: "Tank 4", link: "/tank4" },
        { name: "Weather Conditions", link: "/weather" },
        { name: "Reports", link: "/reports" },
    ];



return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar onMenuOpenChange={setIsMenuOpen} style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand className="hidden sm:flex gap-4" justify="start">
                    <NavbarItem>
                        <Link color="foreground" href="/tank1">
                            Tank 1
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link color="foreground" href="/tank2">
                            Tank 2
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link color="foreground" href="/tank3">
                            Tank 3
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link color="foreground" href="/tank4">
                            Tank 4
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

        <main>
            {children}
        </main>
    </div>
);
}

export default Layout;