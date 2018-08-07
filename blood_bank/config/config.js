require('dotenv').config();//instatiate environment variables

CONFIG = {} //Make this global to use all over the application

CONFIG.app          = process.env.APP   || 'dev';
CONFIG.port         = process.env.PORT  || '3000';

CONFIG.db_dialect   = 'mysql';
CONFIG.db_host      = process.env.DB_HOST       || '127.0.0.1';
CONFIG.db_port      = process.env.DB_PORT       || '3306';
CONFIG.db_name      = process.env.DB_NAME       || 'blood_bank';
CONFIG.db_user      = process.env.DB_USER       || 'root';
CONFIG.db_password  = process.env.DB_PASSWORD   || 'sunrise';
CONFIG.host         = 'http://ec2-13-59-96-53.us-east-2.compute.amazonaws.com'
CONFIG.dr_host      = 'http://ec2-18-218-58-179.us-east-2.compute.amazonaws.com';
CONFIG.cb_host      = 'http://ec2-18-218-39-44.us-east-2.compute.amazonaws.com';
/* local host */
// CONFIG.db_host      = process.env.DB_HOST       || '127.0.0.1';
// CONFIG.db_port      = process.env.DB_PORT       || '3306';
// CONFIG.db_name      = process.env.DB_NAME       || 'blood_bank';
// CONFIG.db_user      = process.env.DB_USER       || 'root';
// CONFIG.db_password  = process.env.DB_PASSWORD   || '';
// CONFIG.host         = 'http://127.0.0.1:3000';
// CONFIG.dr_host      = 'http://127.0.0.1:4000';
// CONFIG.cb_host      = 'http://127.0.0.1:5000';


CONFIG.jwt_encryption  = process.env.JWT_ENCRYPTION || 'jwt_please_change';
CONFIG.jwt_expiration  = process.env.JWT_EXPIRATION || '10000';