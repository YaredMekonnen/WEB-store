import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"

const Layout = () => {
    return (
        <main className="App">
            <Navbar className="mb-0"/>
            <main className="mt-100px">
            <Outlet />
            </main>
            <Footer />
        </main>
    )
}

export default Layout
