import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

const APP_ROOT = process.cwd();
const DEFAULT_ENVIRONMENT = 'default';
let config = null;

export default class Config {
   _initialized: boolean = false;
    _file: string | null = null;
    _settings: any = null;
  

  constructor(
     environment = null
  ) {
    
    
    if (environment) {
			this.load(environment);
		}
  }

  static getInstance(environment = DEFAULT_ENVIRONMENT) {
		if (!config) {
			config = new Config(environment);
		}
		return config;
	}

   load(environment = DEFAULT_ENVIRONMENT): any {
    const defaults = require('../../../config/default.js');
    
    //const defaults = require(path.join(APP_ROOT, 'config', 'default.js'));

    const settingsFile = `${environment}.js`;
    const configPath = path.join(APP_ROOT, 'config', settingsFile);
    if (!fs.existsSync(configPath)) {
      throw new Error(`O arquivo de configuração do ambiente não foi encontrado. Adicione o arquivo ${settingsFile} na sua pasta config/.`);
    }

    this._file = settingsFile;
    try {
      const settings = require(configPath);
      this._settings = _.merge({}, defaults, settings);
    } catch (err) {
      throw new Error(`Existe um módulo inválido no arquivo ${settingsFile}.`);
    }

    this._initialized = true;
  }

  getFile(): string | null {
    return this._file;
  }

  get initialized(): boolean {
    return this._initialized;
  }


  get(key: string): any {
    if (!this._initialized) {
      throw new Error('Config not initialized. Please call Config.load() first.');
    }
    return this._settings[key] || null;
  }

  set(key: string, value: any): void {
    if (!this._initialized) {
      throw new Error('Config not initialized. Please call Config.load() first.');
    }
    this._settings[key] = value;
  }

  
 
}


