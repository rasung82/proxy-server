import express from "express";
import NodeCache from 'node-cache';
import { createProxyMiddleware, responseInterceptor } from "http-proxy-middleware";

const app = express();

const cache  = new NodeCache();

/**
 * Option for 'createProxyMiddleware'.
 */
const proxyOptions = {
  target: "http://vcsapi.skstoa.com",  // http://localhost:3000/vcs/api/main/TV00/2
  changeOrigin: true,
  xfwd: true,
  selfHandleResponse: true,
  onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
    const response = responseBuffer.toString('utf8');
    cache.set(req.url, response);
    return responseBuffer;
  }),
  onProxyReq : (proxyReq, req, res) => {
    // Add any additional headers or modify the request as needed
    // For example, you can add an authentication token to the headers
    // proxyReq.setHeader('Authorization', `Bearer ${token}`);
  },
  onError: (err, req, res) => {
    // Handle any errors that occur during the proxy request
    console.error(`Proxy error: ${err}`);
    res.status(500).send(`Proxy error: ${err}`);
  },
}

// Use the http-proxy-middleware with the options defined above
const proxyMiddleware = createProxyMiddleware(proxyOptions);


// Use the middleware for all requests
app.use('/', (req, res) => {
  // Check if the response is already cached
  const key = req.originalUrl || req.url;
  const value = cache.get(key);
  if (value) {
    // If the response is cached, return it immediately
    console.log(`Returning cached response for ${key} size is ${value.length}`);
    res.send(JSON.parse(value));
  } else {
    // If the response is not cached, proxy the request
    proxyMiddleware(req, res);
  }
});

app.listen(3000);