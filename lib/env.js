function load(key, defaultValue) {
  const env = process.env.NODE_ENV;
  const root = process.cwd();
  const config = require(`${root}/environments/${env}.json`);

  return config[key] || process.env[key] || defaultValue;
}
