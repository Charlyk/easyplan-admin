import React from 'react';
import { ServerStyleSheets } from '@material-ui/core/styles';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { fetchAppData } from 'middleware/api/initialization';

class AppDocument extends Document {
  static async getInitialProps(ctx) {
    // Render app and page and get the context of the page with collected side effects.
    const { req } = ctx;
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
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
    return (
      <Html>
        <Head>
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap'
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default AppDocument;
