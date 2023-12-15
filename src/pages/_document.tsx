import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <body>
                <div className="dark:bg-boxdark-2 dark:text-bodydark h-screen overflow-hidden">
                    <Main />
                    <NextScript />
                </div>
            </body>
        </Html>
    );
}
