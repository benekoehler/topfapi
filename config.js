/**
 * Configuration file for Gamitch
 * this should host all variables needed for all deployment environments
 */

 var config = {
   production: {
     redis: '/home/benek/.redis/sock',
   },
   staging: {
     redis: '/home/benek/.redis/sock',
   },
   default: {
     redis: '',
   },
 }

 exports.get = function get(env) {
   return config[env] || config.default;
 }
