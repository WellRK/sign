// import { RestPkiClient, StandardSecurityContexts } from 'restpki-client';
// import { Config } from './config.utils';

// export class Util {
  
//   static getRestPkiClient(): RestPkiClient {
    
//     Config.load();

    
//     const restPkiConfig = Config.get('restPki');
//     const token = restPkiConfig.accessToken;
//     const endpoint = restPkiConfig.endpoint;

    
//     if (!token || token.includes('ACCESS TOKEN')) {
//       throw new Error('O token de acesso do REST PKI não foi definido! Dica: para '
//         + 'executar esta amostra, você deve gerar um token de acesso à API no site '
//         + 'do REST PKI e colá-lo no arquivo config/default.js.');
//     }

//     return new RestPkiClient(endpoint, token);
//   }

//   static getSecurityContextId(): string {
    
//     Config.load();

//     const trustLacunaTestRoot = Config.get('trustLacunaTestRoot');

//     if (trustLacunaTestRoot) {
//       return StandardSecurityContexts.LACUNA_TEST;
//     }

//     return StandardSecurityContexts.PKI_BRAZIL;
//   }

//   static setExpiredPage(res): any {
//     res.set({
//         'Cache-Control': 'private, no-store, max-age=0, no-cache, must-revalidate, post-check=0, pre-check=0',
//         Pragma: 'no-cache',
//     });
// }
  
// }

import { Module, Injectable } from '@nestjs/common';
import { RestPkiClient, StandardSecurityContexts } from 'restpki-client';
import Config from './config.utils';

//@Injectable()
export  class Util {
    config = new Config();

    static getRestPkiClient() {
		// Get configuration from config/{env}.js file. It will choose the
		// desirable configuration according to the environment of the
		// application.
		const CONFIG = Config.getInstance().get('restPki');

		// Get your token and endpoint values from used configuration file.
		const token = CONFIG.accessToken;
		const { endpoint } = CONFIG;

		// Throw exception if token is not set (this check is here just for the
		// sake of newcomers, you can remove it).
		if (!token || token.indexOf(' ACCESS TOKEN ') >= 0) {
			throw new Error('The REST PKI access token was not set! Hint: to '
				+ 'run this sample you must generate an API access token on the '
				+ 'REST PKI website and paste it on the file config/default.js.');
		}

		return new RestPkiClient(endpoint, token);
	}

    static getSecurityContextId(): string {
        
        const CONFIG = Config.getInstance();

		if (CONFIG.get('trustLacunaTestRoot')) {
			
			return StandardSecurityContexts.LACUNA_TEST;
			
		}

		return StandardSecurityContexts.PKI_BRAZIL;
        
    }

    static setExpiredPage(res): any {
        res.set({
            'Cache-Control': 'private, no-store, max-age=0, no-cache, must-revalidate, post-check=0, pre-check=0',
            Pragma: 'no-cache',
        });
    }
}



