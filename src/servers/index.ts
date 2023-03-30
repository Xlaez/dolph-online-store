import routes from '@/routes';
import Dolph from '@dolphjs/core';
import config from '@/configs';
import xss from 'xss-clean';
import helmet from 'helmet';

const middlewares = [xss(), helmet()];

const mongoConfig = { options: config.mongoose.options, url: config.mongoose.url };
const dolph = new Dolph(routes, '8181', 'development', mongoConfig, middlewares);
dolph.listen();

const dolphServer = dolph.app;
export default dolphServer;
