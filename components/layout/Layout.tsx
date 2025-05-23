import Header from "./Header"
import Footer from "./Footer"
import styles from "@/css/layout/layout.module.css"

export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <Header />
                <main className={styles.layout}>
                    {children}
                </main>
            <Footer />
        </>
    )
}