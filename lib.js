const {Pool}=require('pg');const crypto=require('crypto');
const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.NODE_ENV==='production'?{rejectUnauthorized:false}:undefined});
const send=(res,status,data)=>res.status(status).json(data);
const body=req=>typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
const validNick=nick=>typeof nick==='string'&&/^[A-Za-z0-9_]{3,16}$/.test(nick);
const hash=(value,salt=crypto.randomBytes(16).toString('hex'))=>new Promise((resolve,reject)=>crypto.scrypt(value,salt,64,(e,k)=>e?reject(e):resolve(`${salt}:${k.toString('hex')}`)));
const compare=async(value,stored)=>{const [salt,expected]=stored.split(':');const actual=await hash(value,salt);return crypto.timingSafeEqual(Buffer.from(actual.split(':')[1],'hex'),Buffer.from(expected,'hex'));};
async function setup(){await pool.query(`CREATE TABLE IF NOT EXISTS accounts(id SERIAL PRIMARY KEY,nickname VARCHAR(16) UNIQUE NOT NULL,password_hash TEXT NOT NULL,created_at TIMESTAMPTZ DEFAULT now());CREATE TABLE IF NOT EXISTS registration_codes(id TEXT PRIMARY KEY,nickname VARCHAR(16) NOT NULL,code TEXT NOT NULL,expires_at TIMESTAMPTZ NOT NULL,delivered BOOLEAN DEFAULT false);CREATE TABLE IF NOT EXISTS applications(id SERIAL PRIMARY KEY,role TEXT NOT NULL,payload JSONB NOT NULL,created_at TIMESTAMPTZ DEFAULT now())`);}
const pluginAuth=req=>{const received=String(req.headers['x-boltovka-plugin-key']||''),expected=String(process.env.BOLTOVKA_PLUGIN_KEY||'');return received.length>0&&received.length===expected.length&&crypto.timingSafeEqual(Buffer.from(received),Buffer.from(expected));};
module.exports={pool,send,body,validNick,hash,compare,setup,pluginAuth,crypto};
