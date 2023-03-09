import express from "express";
import { createProxyMiddleware, responseInterceptor } from "http-proxy-middleware";
import NodeCache from 'node-cache';

const app = express();
const cache  = new NodeCache();

const options = {
  target: "http://vcsapi.skstoa.com",  // http://localhost:3000/vcs/api/main/TV00/2
  changeOrigin: true,
  pathRewrite: {
  },
  selfHandleResponse: true,
  onProxyRes : responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
    const response = responseBuffer.toString('utf8');
    console.log(response.length);
    return responseBuffer;
  })
}

const options2 = {
  target: "http://vcsapi.skstoa.com",
  changeOrigin: true,
  onProxyRes: (proxyRes, req, res) => {
    const url = req.url;
    console.log('[A]:onProxyRes', req.url);
    cache.set(url, proxyRes);
  },
  onProxReq: (proxyReq, req, res) => {
    const url = req.url;
    console.log('[B]:onProxReq', req.url);
    const cachedResponse = cache.get(url);
    if(cachedResponse) {
      res.send(cachedResponse);
      return;
    }
  }
}

app.use("/", createProxyMiddleware(options2));
app.listen(3000);