// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { KeycloakConfig } from 'keycloak-angular';

const keycloakConfig: KeycloakConfig = {
  url: 'http://192.168.1.21:8901/auth',
  realm: 'construction',
  clientId: 'master'
};


export const environment = {
  production: false,
  apiUrl: 'http://192.168.1.21:5555',
  fileUrl: 'http://192.168.1.21:6699',
  userAdminUrl: 'http://192.168.1.21:8901',
  keycloakConfig,
  title: '建设工程审批系统'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
