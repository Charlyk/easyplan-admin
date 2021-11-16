import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';
import { fetchAppData } from "../middleware/api/initialization";

class AppDocument extends Document {
  static async getInitialProps(ctx) {
    // Render app and page and get the context of the page with collected side effects.
    const { req } = ctx;
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () => originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

    const initialProps = await Document.getInitialProps(ctx);

    let appData = {};
    try {
      const response = await fetchAppData(req.headers);
      appData = response.data;
    } catch (error) {
      console.error(error.message);
    }
    return {
      ...initialProps,
      ...appData,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [
        ...React.Children.toArray(initialProps.styles),
        sheets.getStyleElement(),
      ],
    };
  }

  render() {
    const { currentClinic } = this.props;
    const currentPage = this.props.__NEXT_DATA__.page
    console.log(currentPage)
    const clinicName = currentClinic?.clinicName || 'EasyPlan.pro';
    return (
      <Html>
        <Head>
          <title>{clinicName}</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          {!currentPage.includes('confirmation') ? (
            <script type="text/javascript" src="/tawkto.js"/>
          ) : null}
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" />
        </Head>
        <body>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    )
  }
}

export default AppDocument;
