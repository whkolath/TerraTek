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
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

<meta name="apple-mobile-web-app-title" content="TerraTek" />

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
  });
  
  const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
  });
  
  export const metadata: Metadata = {
    title: "TerraTek",
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  };
  
  
  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);


    const menuItems = [
        { name: "Home", link: "/home" },
        { name: "Freshwater Tank", link: "/tank1" },
        { name: "Greywater Tank", link: "/tank2" },
        { name: "Weather Conditions", link: "/weather" },
        { name: "Reports", link: "/reports" },
        { name: "System Health", link: "/system-health" },
    ];



    return (
        <div  className={`${geistSans.variable} ${geistMono.variable} antialiased`} style={{ display: 'flex', flexDirection: 'column' }}>
            <Navbar className="h-[50px]" onMenuOpenChange={setIsMenuOpen} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <NavbarContent>
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="sm:hidden"
                    />
                    <NavbarBrand className="hidden sm:flex gap-4">
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
                            <Link color="foreground" href="/weather">
                                Weather Conditions
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link color="foreground" href="/reports">
                                Reports
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link color="foreground" href="/system-health">
                             System Health
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





{/* <div className="h-4 w-4 bg-slate-100 text-black flex items-left"> */}
    {/* Sidebar */}
    {/* <Dropdown className="w-full">
        <DropdownTrigger>
            <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                Pages
            </Button>
        </DropdownTrigger>
        <DropdownMenu>
            <DropdownItem key="tanks">
                <Dropdown className="w-full">
                    <DropdownTrigger>
                        <Button className="w-full items-left" variant="light" size="sm">
                            Tanks
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                        <DropdownItem key="fresh-water">
                            <Link href="/tank1">Fresh Water</Link>
                        </DropdownItem>
                        <DropdownItem key="grey-water">
                            <Link href="/tank2">Grey Water</Link>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </DropdownItem>
            <DropdownItem key="condition"><Link href="/weather">Condition</Link></DropdownItem>
            <DropdownItem key="reports"><Link href="/reports">Reports</Link></DropdownItem>
            <DropdownItem key="comments">Comments</DropdownItem>
        </DropdownMenu>
    </Dropdown>
</div> */}