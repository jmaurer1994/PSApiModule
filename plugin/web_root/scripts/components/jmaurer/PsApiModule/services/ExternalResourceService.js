'use strict';
define(function (require) {
    const module = require('components/jmaurer/PsApiModule/module');
    const serviceId = 'ExternalResourceService';
    const providerOptions = {
        oAuth2BaseUrl: '', //must match base url configured in Powerschool
        pluginId: '', //must match value in plugin.xml
    }

    function Service(config, $http, $window) {
        const getClientInformation = async () => {
            const options = {
                method: 'GET',
                url: `${config.oAuth2BaseUrl}/oauth2/getClientInformation?pluginId=jmaurer/psam&serverHost=${self.location.host}`,
            }
            try {
                const response = await $http(options);
                return [response.data.client_id, undefined]
            } catch (e) {
                return [undefined, e]
            }
        }

        /**
         * Initiates a login request to the PowerSchool Auth Server
         * This should result in a Promise that resolves to the
         * user's access token, the ERS will have stored the refresh token
         */
        const getToken = async () => {
            const savedToken = localStorage.getItem('jmaurer/psam-token'); //this could probably be scoped by plugin and ACL implemented on the server side
            if (savedToken) {
                console.log("Retrieved token from local storage", savedToken)
                return [savedToken, undefined];
            }

            const [clientId, error] = await getClientInformation()
            if (error) {
                console.log(error)
                return [undefined, error]
            }

            const randArr = new Uint8Array(32);
            self.crypto.getRandomValues(randArr);

            //per ps developer docs for using auth code flow
            const params = [
                'response_type=code',
                `client_id=${clientId}`,
                `redirect_uri=${config.oAuth2BaseUrl}/oauth2`,
                `state=jmaurer/psam:${randArr.join('')}`,
                'scope=openid'
            ]
            try {
                //Access token is returned in the response body from the psApiOAuthConnector server upon success
                const response = await $http.get(`/oauth2/authorize.action?${params.join('&')}`)

                if (!response.data) {
                    return [undefined, new Error('Response from resource server contained no token')];
                }

                localStorage.set('jmaurer/psam-token', response.data);

                return [response.data, undefined];
            } catch (e) {
                return [undefined, e];
            }
        }

        return {
            makeExternalApiRequest: async (request) => {
                try {
                    const [token, error] = await getToken();
                    console.log(token);
                    if (error) {
                        console.log(error);
                        return Promise.reject(`Error getting token:\n`);
                    }

                    const options = {
                        url: `${config.oAuth2BaseUrl}/proxyRequest`,
                        method: 'POST',
                        headers: {
                            'authorization': `Bearer ${token}`,
                            'psampluginid': config.pluginId
                        },
                        data: request
                    }

                    return $http(options);
                } catch (e) {
                    console.log(e);
                    return Promise.reject(`Unexpected Error while getting token:\n`);
                }
            }
        }
    }

    module.provider(serviceId, function ServiceProvider() {
        this.setOAuth2BaseUrl = (value) => {
            providerOptions.oAuth2BaseUrl = value;
        }

        this.setPluginId = (value) => {
            providerOptions.pluginId = value;
        }
        this.$get = ['$http', '$window', function ServiceFactory($http, $window) {
            return new Service({ ...providerOptions }, $http, $window);
        }]
    })
});