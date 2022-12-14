import React from 'react';
import createEmotionServer from '@emotion/server/create-instance';
import { ServerStyleSheets } from '@material-ui/styles';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionCache from 'app/utils/createEmotionCache';

class AppDocument extends Document {
  static async getInitialProps(ctx) {
    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = () => {
      return originalRenderPage({
        enhanceApp: (App) => (props) =>
          sheets.collect(<App emotionCache={cache} {...props} />),
      });
    };

    const initialProps = await Document.getInitialProps(ctx);

    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));
    return {
      ...initialProps,
      emotionStyleTags,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: (
        <>
          {initialProps.styles}
          {sheets.getStyleElement()}
          {emotionStyleTags}
        </>
      ),
    };
  }

  render() {
    return (
      <Html lang={this.props.locale}>
        <Head>
          {this.props.emotionStyleTags}
          <link rel='icon' href='/favicon.ico' />
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/apple-touch-icon.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/favicon-16x16.png'
          />
          <link rel='manifest' href='/site.webmanifest' />
          <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
          <meta name='msapplication-TileColor' content='#da532c' />
          <meta
            name='description'
            content='Administration made easier than ever'
          />
          <link rel='apple-touch-icon' href='/logo192.png' />

          <link rel='manifest' href='/manifest.json' />
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
