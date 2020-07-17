import Vue from 'vue'
import router from '../router'
import { Auth0Plugin } from '../services/authenticate-service'
import { domain, clientId, redirectUri } from '../config/auth_config.json'

Vue.use(Auth0Plugin, {
  domain,
  clientId,
  redirectUri,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    )
  }
})
