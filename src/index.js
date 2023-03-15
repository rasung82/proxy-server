import ProxyCache from "./model/ProxyCache.js";
import ProxyMiddeware from "./services/ProxyMiddleware.js";

import express from "express";


const app = express();

/**
 * 캐시 모듈을 생성 후 초기화한다.
 * FIXME: Please update your redis server address and port.
 */
const REDIS_ADDRESS = '172.20.221.24'
const REDIS_PORT = 6379
const proxyCache = new ProxyCache(REDIS_ADDRESS, REDIS_PORT);
proxyCache.connect();

/**
 * 미들웨어 모듈을 생성 후 초기화한다.
  FIXME: Please update your H/E server address and path.
 */
const adminMiddleware = new ProxyMiddeware(
  app, 
  proxyCache, 
  '/vcs' , 
  'http://vcsapi.skstoa.com');
adminMiddleware.create();
adminMiddleware.listen();

const boMiddleware = new ProxyMiddeware(
  app, 
  proxyCache, 
  '/cloud' , 
  'https://cloudapi.skstoa.com:8443');
boMiddleware.create();
boMiddleware.listen();


app.listen(3000);