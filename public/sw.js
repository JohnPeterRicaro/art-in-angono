if(!self.define){let e,c={};const s=(s,n)=>(s=new URL(s+".js",n).href,c[s]||new Promise((c=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=c,document.head.appendChild(e)}else e=s,importScripts(s),c()})).then((()=>{let e=c[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(n,i)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(c[a])return;let t={};const o=e=>s(e,a),r={module:{uri:a},exports:t,require:o};c[a]=Promise.all(n.map((e=>r[e]||o(e)))).then((e=>(i(...e),t)))}}define(["./workbox-1bb06f5e"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"2ae6e70f4bfee8dbe3c6c3a5b947843b"},{url:"/_next/static/chunks/0e5ce63c-1f6ba91fef7a33e8.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/117-d5f4621107b9f81c.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/137-9598eab4ff025283.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/145-94189eaa7b1f3bae.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/188-8e0f5aa0877354a3.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/314-139a9fb4a3c08480.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/451-0d88a959e6706521.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/520-b8d1988125f35159.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/894-67069c20de241c75.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/app/_not-found/page-6d6f02352e3a435e.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/app/layout-4e2a73791de1c234.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/app/page-388578fbb8f8c8fb.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/app/tracking/add-time/page-7eb8738129331a88.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/app/tracking/input-time/page-55a9d1977e1d1a95.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/app/tracking/layout-21dedbe78ba4c36c.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/app/tracking/location/page-2856b5f51026df15.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/app/tracking/map/page-ddfefe6c15c615a4.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/app/tracking/notifications/page-541ceeae26c2c271.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/app/tracking/page-072ffd01965e91e6.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/app/tracking/stop/page-b32a4fdc44995275.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/app/tracking/suggestive-system/page-c559b777e8829a24.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/app/tracking/timer/page-252250ffb72f5f04.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/app/tracking/traffic/page-ed7e5cf994590e9c.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/fd9d1056-dd504a17eef30e15.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/framework-fc91bf93558a0105.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/main-92229f33e930dd12.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/main-app-1ed92d21b451bf26.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/pages/_app-fcd9b2d75ca80448.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/pages/_error-7ba65e1336b92748.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-7a4ecfc4ffdf2db9.js",revision:"kZeBmo72ZjKzeYbZqccgL"},{url:"/_next/static/css/6ca1b35434cf4d55.css",revision:"6ca1b35434cf4d55"},{url:"/_next/static/kZeBmo72ZjKzeYbZqccgL/_buildManifest.js",revision:"c155cce658e53418dec34664328b51ac"},{url:"/_next/static/kZeBmo72ZjKzeYbZqccgL/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/art-in-angono-header-logo.png",revision:"666f0ea500cad0474249b90da23dc5db"},{url:"/art-in-angono-logo.png",revision:"0985ca499cd2020b3ec0df6b693653c1"},{url:"/bg-image.png",revision:"47b887163b19bacb034f1b28e2304d96"},{url:"/icons/bell-icon.png",revision:"22ee61978044de26aa95f7af93410bcc"},{url:"/icons/cellphone-art.png",revision:"fb193dbb935c205d13d8530058a3bcf1"},{url:"/icons/clock-art.png",revision:"e93fb6f178256d1454e6123bd12a731d"},{url:"/icons/icon-128x128.png",revision:"411a3f2766587d639d66ed42e3268c18"},{url:"/icons/icon-144x144.png",revision:"6d102a21dd513d1ebadbc5c6fd285f9a"},{url:"/icons/icon-152x152.png",revision:"404a220916fb7b1c00c9a67dd0c319c0"},{url:"/icons/icon-192x192.png",revision:"56dca2107e20ac01ab1e5f9cc11d22c1"},{url:"/icons/icon-384x384.png",revision:"73c0a2e77b3033343d09d53393669304"},{url:"/icons/icon-512x512.png",revision:"f800ff17b0437c298ec5ef7cfb504a4c"},{url:"/icons/icon-72x72.png",revision:"de50c1cef8d911234a583003097fcb39"},{url:"/icons/icon-96x96.png",revision:"c86fc02ef78470688e92cdeb1fdba483"},{url:"/icons/location-art.png",revision:"365d9148f2c8a96a2405722a1f6fcaed"},{url:"/icons/museum-icon.png",revision:"7b48ce49889418d99ba9821f261474c0"},{url:"/icons/placeholder.svg",revision:"7b9f10f9265985d41bff676756e96d0b"},{url:"/icons/suggestive-system-art.png",revision:"213105d14b77521b08570745bd4882ff"},{url:"/icons/timer-icon.png",revision:"711e08e1e2908a5a3d16a1106c108c7a"},{url:"/icons/traffic-art.png",revision:"3101a5bd7e7a2860654c4893cb77972a"},{url:"/manifest.json",revision:"e28ea860d5c5b5d9924eefcdbca3cff3"},{url:"/place-holder-place-icon.png",revision:"eec7a647ddf2a1daf1bde2a4873d5aac"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:c,event:s,state:n})=>c&&"opaqueredirect"===c.type?new Response(c.body,{status:200,statusText:"OK",headers:c.headers}):c}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const c=e.pathname;return!c.startsWith("/api/auth/")&&!!c.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));