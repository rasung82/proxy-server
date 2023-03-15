
import cache from 'node-cache';
import { createClient } from 'redis';

class ProxyCache {

  /**
   * 생성자
   * @param {*} address 
   * @param {*} port 
   * @param {*} isRedis 
   */
  constructor(address, port, isRedis = true) {
    this.address = address;
    this.port = port;
    this.isRedis = isRedis;

    if( isRedis ) {
      this.client = createClient({
        host: this.address,
        port: this.port
      });
    } else {
      this.client = new cache();
    }
  }


  /**
   * Redis에 연결
   */
  async connect() {
    if( this.isRedis ) {
      await this.client.connect()
    }
  }


  /**
   * 키에 대한 값을 반환한다.
   * @param {*} key 
   * @returns 
   */
  async get(key) {
     if( this.isRedis ) {
      return await this.client.get(key);
     } else {
      return this.client.get(key);
     }
  }


  /**
   * 키에 대한 값을 저장한다.
   * @param {*} key 
   * @param {*} value 
   */
  async set(key, value) {
    if( this.isRedis ) {
      return await this.client.set(key, value);
    } else {
      return this.client.set(key, value);
    }

    
  }

}

export default ProxyCache;