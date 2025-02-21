// This file is used to set the global configuration for the application.
const config = {
    apiURL: import.meta.env.VITE_API_URL,
    slash: '/',
    devAuth0Domain: 'miiventory.auth0.com',
    localAuthDomain: 'miiventory.auth0.com',
    stgAuth0Domain: 'miiventory.auth0.com',
    prdAUth0Domain: 'miiventory.auth0.com',
    devAUthClientId: '0J9Z',
    localAuthClientId: '0J9Z',
    stgAuthClientId: '0J9Z',
    prdAuthClientId: '0J9Z'
};

console.log(import.meta.env.VITE_API_URL)

export default config;