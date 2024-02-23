import "@mantine/core/styles.css"
import "@/styles/globals.css"
import "@mantine/dates/styles.css"
import type { AppProps } from "next/app"
import { MantineProvider, createTheme } from "@mantine/core"
import { DatesProvider } from "@mantine/dates"
import "dayjs/locale/vi"
import "@mantine/carousel/styles.css"

const App = ({ Component, pageProps }: AppProps) => {
    const theme = createTheme({
        /** Put your mantine theme override here */
    })
    return (
        <MantineProvider theme={theme}>
            <DatesProvider settings={{ locale: "vi" }}>
                <Component {...pageProps} />
            </DatesProvider>
        </MantineProvider>
    )
}

export default App
