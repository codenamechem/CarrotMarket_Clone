//@ts-nocheck
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      <div className="mx-auto w-full max-w-xl">
        <Component {...pageProps} />
      </div>

      {/* <Script
        src="https://developers.kakao.com/sdk/js/kakao.js"
        strategy="lazyOnload"
      />
          strategy를 사용하여 script를 언제 불러올지 제어가 가능!

      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        onLoad={() => {
          // onLoad를 사용하여 실행
          window.fbAsyncInit = function () {
            FB.init({
              appId: "your-app-id",
              autoLogAppEvents: true,
              xfbml: true,
              version: "v13.0",
            });
          };
        }}
      /> */}
    </SWRConfig> //모든 페이지에 적용되어 기본값 지정가능한 프로바이더
  );
}

export default MyApp;
