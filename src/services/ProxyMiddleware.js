
import { createProxyMiddleware, responseInterceptor } from "http-proxy-middleware";

class ProxyMiddeware {

  /**
   * 생성자
   * @param {*} path 
   * @param {*} target 
   * @param {*} proxyCache 
   */
  constructor(express, proxyCache, path, target) {
    this.express = express;
    this.parh = path;
    this.target = target;
    this.proxyCache = proxyCache; 
  }


  /**
   * Create a proxy middleware.
   */
  create() {
    let options = {
      target: this.target,
      changeOrigin: true,
      xfwd: true,
      selfHandleResponse: true,
      onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        const key = req.originalUrl || req.url;
        const response = responseBuffer.toString('utf8');
        this.proxyCache.set(key, response);
        return responseBuffer;
      }),
      onError: this.onError
    }
    this.middleware = createProxyMiddleware(options);
  }

  /**
   * 
   */
  listen() {
    this.express.use(this.parh, async(req, res) => {
      // Check if the response is already cached
      const key = req.originalUrl || req.url;
      this.proxyCache.get(key).then( value => {
        if (value) {
          // If the response is cached, return it immediately
          console.log(`Returning cached response for ${key}, Response size is ${value.length}`);
          res.send(JSON.parse(value));
        } else {
          // If the response is not cached, proxy the request
          this.middleware(req, res);
        }
      });
    })
  }


  onError(err, req, res) {
    // Handle any errors that occur during the proxy request
    console.error(`Proxy error: ${err}`);
    res.status(500).send(`Proxy error: ${err}`);
  }

}

export default ProxyMiddeware;