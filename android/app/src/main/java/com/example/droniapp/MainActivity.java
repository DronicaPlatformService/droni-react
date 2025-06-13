package com.example.droniapp;

import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Capacitor 브릿지에서 웹뷰 인스턴스를 가져옵니다.
        // getBridge()가 null을 반환할 수 있으므로 null 체크를 하는 것이 좋습니다.
        if (this.bridge != null) {
            WebView webView = this.bridge.getWebView();

            if (webView != null) {
                webView.setWebViewClient(new WebViewClient() {
                    @Override
                    public boolean shouldOverrideUrlLoading(WebView view, String url) {
                        Uri uri = Uri.parse(url);
                        // http 또는 https 스킴을 가진 URL은 웹뷰 내부에서 로드합니다.
                        // 특정 도메인(예: "nid.naver.com")만 내부에서 처리하도록 조건을 추가할 수도 있습니다.
                        // if ("nid.naver.com".equals(uri.getHost())) {
                        if ("http".equals(uri.getScheme()) || "https".equals(uri.getScheme())) {
                            // 웹뷰가 직접 URL을 로드하도록 false를 반환합니다.
                            return false;
                        }
                        // 그 외 다른 스킴(intent://, market:// 등)은 기본 동작에 맡깁니다.
                        return super.shouldOverrideUrlLoading(view, url);
                    }
                });
            }
        }
    }
}
