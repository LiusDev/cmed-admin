import { Html, Head, Main, NextScript } from "next/document";

const Document = () => {
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
};

export default Document;
