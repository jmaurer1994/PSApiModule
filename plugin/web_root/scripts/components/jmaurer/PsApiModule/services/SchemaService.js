'use strict';

define(function (require) {
    const module = require('components/jmaurer/PsApiModule/module');
    const serviceId = 'SchemaService';

    const providerOptions = {
        //If setting to true, remember to configure the service as well
        useExternalResourceService: false,
        useTypeConversion: true,
    }

    function Service(config, $http, ExternalResourceService) {
        //https://support.powerschool.com/developer/#/page/table-resources
        function _makeRequest(requestOptions) {
            if (config.useExternalResourceService) {
                return ExternalResourceService.makeExternalApiRequest(requestOptions);
            }
            return $http(requestOptions)
        }

        function _buildParams(params = {}) {
            const urlParams = new URLSearchParams();
            for (const [key, param] of Object.entries(params)) {
                if (param) {
                    params.set(key, param);
                }
            }

            return urlParams;
        }

        function makeCreateRecordRequest({ tableName, payload = {} }) {
            if (!tableName) {
                return Promise.reject("makeRetrieveRecordsRequest(): table name not supplied");
            }

            const requestOptions = {
                method: 'POST',
                url: `/ws/schema/table/${tableName}?${params}`,
                data: {
                    tables: {}
                }
            }

            data.tables[tableName] = payload;

            return _makeRequest(requestOptions);
        }

        function makeRetrieveRecordRequest({ tableName, recordId, projection }) {
            if (!tableName || !recordId) {
                return Promise.reject("makeRetrieveRecordRequest(): table name or record Id not supplied");
            }

            if (!projection) {
                projection = '*';
            }

            const params = _buildParams({
                projection
            });

            const requestOptions = {
                method: 'GET',
                url: `/ws/schema/table/${tableName}/${recordId}?${params}}`
            };

            return _makeRequest(requestOptions);
        }

        function makeRetrieveRecordsRequest({ tableName, query_expression, projection, page, pagesize, sort, sortdescending }) {
            if (!tableName) {
                return Promise.reject("makeRetrieveRecordsRequest(): table name not supplied");
            }

            if (!projection) {
                projection = '*'
            }

            const params = _buildParams({
                query_expression,
                projection,
                page,
                pagesize,
                sort,
                sortdescending
            });

            const requestOptions = {
                method: 'GET',
                url: `/ws/schema/table/${tableName}?${params}`
            };

            return _makeRequest(requestOptions);
        }

        function makeUpdateRecordRequest({ tableName, recordId, payload = {} }) {
            if (!tableName || !recordId) {
                return Promise.reject("makeUpdateRecordRequest(): table name or record Id not supplied");
            }

            const requestOptions = {
                method: 'PUT',
                url: `/ws/schema/table/${tableName}?${params}`,
                data: {
                    tables: {}
                }
            };

            tables[tableName] = payload;

            return _makeRequest(requestOptions);
        }

        function makeDeleteRecordRequest({ tableName, recordId }) {
            if (!tableName || !recordId) {
                return Promise.reject("makeRecordRequest(): table name or record Id not supplied");
            }

            const requestOptions = {
                method: 'DELETE',
                url: `/ws/schema/table/${tableName}`
            };

            return _makeRequest(requestOptions);
        }

        function makeGetRecordCountRequest({ tableName, query_expression }) {
            if (!tableName) {
                return Promise.reject("makeRetrieveRecordRequest(): table name or record Id not supplied");
            }

            const params = _buildParams({
                query_expression
            });

            const requestOptions = {
                method: 'GET',
                url: `/ws/schema/table/${tableName}/count?${params}`
            };

            return _makeRequest(requestOptions);
        }

        return {
            makeCreateRecordRequest,
            makeRetrieveRecordRequest,
            makeRetrieveRecordsRequest,
            makeUpdateRecordRequest,
            makeDeleteRecordRequest,
            makeGetRecordCountRequest
        }
    }

    module.provider(serviceId, function ServiceProvider() {
        //this only works because all providerOptions are boolean
        Object.keys(providerOptions).forEach(option => {
            this[option] = (value) => {
                providerOptions[option] = !!value;
            }
        });

        this.$get = ['$http', 'ExternalResourceService', function ServiceFactory($http, ExternalResourceService) {
            return new Service({ ...providerOptions }, $http, ExternalResourceService)
        }]
    })
});