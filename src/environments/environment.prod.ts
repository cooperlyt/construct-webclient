import { KeycloakConfig } from 'keycloak-angular';

const keycloakConfig: KeycloakConfig = {
  url: 'http://192.168.1.21:8901/auth',
  realm: 'construction',
  clientId: 'master'
};

export const environment = {
  production: true,
  keycloakConfig,
  title: '建设工程审批系统',
  apiUrl: window["env"]["apiUrl"] || "http://192.168.1.21:5555",
  fileUrl: window["env"]["fileUrl"] || "http://192.168.1.21:6699",
};
