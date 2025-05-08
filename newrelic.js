'use strict';

exports.config = {
  app_name: ['my-nestjs-app'],
  license_key: 'YOUR_NEW_RELIC_LICENSE_KEY',
  logging: {
    level: 'info',
  },
  distributed_tracing: {
    enabled: true,
  },
};
