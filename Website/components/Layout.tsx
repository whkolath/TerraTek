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
import { useRouter } from "next/router";

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
        { name: "Home", link: "/" },
        { name: "Freshwater Tank", link: "/tank1" },
        { name: "Greywater Tank", link: "/tank2" },
        { name: "Weather Conditions", link: "/weather" },
        { name: "Reports", link: "/reports" },
        { name: "System Health", link: "/system-health" },
        { name: "About", link: "/about" },
    ];
    const router = useRouter();
    const currentPath = typeof window !== "undefined" ? window.location.pathname : router.pathname;

    const isActive = (path: string) => currentPath === path;

    return (
        <div className={`${geistSans.variable} ${geistMono.variable} antialiased`} style={{ display: 'flex', flexDirection: 'column' }}>
            <Navbar className="h-[50px]" onMenuOpenChange={setIsMenuOpen} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <NavbarContent>
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="md:hidden"
                    />
                    <NavbarBrand className="hidden md:flex gap-4">
                        {menuItems.map((item) => (
                            <NavbarItem key={item.link}>
                                <Link
                                    color={isActive(item.link) ? "primary" : "foreground"}
                                    href={item.link}
                                    className={isActive(item.link) ? "text-blue-800 underline" : ""}
                                >
                                    {item.name}
                                </Link>
                            </NavbarItem>
                        ))}
                    </NavbarBrand>
                    {/* Disclaimer as a NavbarItem */}
                    <NavbarItem className="text-red-500 font-semibold text-center flew flew-grow">
                        <span>
                            ⚠️ This system is in testing. 
                            <br className="sm:hidden" />
                            Data may not be accurate.
                        </span>
                    </NavbarItem>
                </NavbarContent>

                <NavbarMenu>
                    {menuItems.map((item, index) => (
                        <React.Fragment key={`${item}-${index}`}>
                            <NavbarMenuItem className="p-0" style={{ margin: 0 }}>
                                <Link
                                    className={`w-full block ${isActive(item.link) ? "text-blue-500 underline" : ""}`}
                                    color={isActive(item.link) ? "primary" : "foreground"}
                                    href={item.link}
                                    size="lg"
                                    style={{ margin: 0, padding: 0 }}
                                >
                                    {item.name}
                                </Link>
                            </NavbarMenuItem>
                        </React.Fragment>
                    ))}
                </NavbarMenu>
            </Navbar>

            <main>
                {children}
            </main>
        </div>
    );

}





