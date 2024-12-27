import React from 'react';
import Link from 'next/link';
import styles from './Layout.module.css';
import { Switch } from "@nextui-org/react";


const Layout = ({ children }) => {
     return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <ul className={styles.navList}>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/tank1">Tank 1</Link></li>
                    <li><Link href="/tank2">Tank 2</Link></li>
                    <li><Link href="/tank3">Tank 3</Link></li>
                    <li><Link href="/tank4">Tank 4</Link></li>
                    <li><Link href="/weather">Weather Conditions</Link></li>
                    <li><Link href="/reports">Reports</Link></li>
                </ul>
            </nav>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
