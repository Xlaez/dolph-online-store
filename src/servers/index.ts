import routes from '@/routes';
import Dolph from '@dolphjs/core';
import config from '@/configs';

const mongoConfig = { options: config.mongoose.options, url: config.mongoose.url };
const dolph = new Dolph(routes, '8181', 'development', mongoConfig, []);
dolph.listen();
