"use client"

import Link from "next/link"
import styles from "@/css/layout/header.module.css"
import { pretendard } from "@/constants/fonts/localFont"

export default function header() {

    return (
        <>
            <header className={styles.header}>
                <div className={styles.inner}>
                    <Link 
                        href="/" 
                        className={styles.logo}
                    ><span className={pretendard.className}>Reading-Books</span></Link>

                    <nav className={styles.nav}>
                        <Link 
                            href="/login"
                            className={styles.navLink}
                        >로그인</Link>
                        <Link 
                            href="/register"
                            className={styles.navLink}
                        >회원가입</Link>
                    </nav>
                </div>
            </header>
        </>
    )
}