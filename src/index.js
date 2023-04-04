import ProxyCache from "./model/ProxyCache.js";
import InterfaceProxyMiddeware from "./services/InterfaceProxyMiddeware.js";
import ImageProxyMiddeware from "./services/ImageProxyMiddleware.js";

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
const adminMiddleware = new InterfaceProxyMiddeware(
  app, 
  proxyCache, 
  '/vcs' , 
  'http://vcsapi.skstoa.com');
adminMiddleware.create();
adminMiddleware.listen();

const boMiddleware = new InterfaceProxyMiddeware(
  app, 
  proxyCache, 
  '/cloud' , 
  'https://cloudapi.skstoa.com:8443');
boMiddleware.create();
boMiddleware.listen();

// http://localhost:3000/upload/banner/lnb/230228155750036q45hMs.png
const adminImageMiddleware = new ImageProxyMiddeware(
  app, 
  proxyCache, 
  '/upload' , 
  'http://vcsrsrc.skstoa.com');
adminImageMiddleware.create();
adminImageMiddleware.listen();


const boImageMiddleware = new ImageProxyMiddeware(
  app, 
  proxyCache, 
  '/goods' , 
  'http://imagecdn.skstoa.com');
boImageMiddleware.create();
boImageMiddleware.listen();

const mmImageMiddleware = new ImageProxyMiddeware(
  app, 
  proxyCache, 
  '/images' , 
  'http://39.124.244.135');
boImageMiddleware.create();
boImageMiddleware.listen();


app.listen(3000);