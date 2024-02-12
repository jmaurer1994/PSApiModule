'use strict';

define(function (require) {
    const module = require('components/jmaurer/PSApiModule/module');
    const serviceId = 'SchemaService';

    const providerOptions = {
        //If setting to true, remember to configure the service as well
        useExternalResourceService: false,
        useTypeConversion: true,
    }

    function Service(config, $http, ExternalResourceService) {
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
                    urlParams.set(key, param);
                }
            }

            return urlParams;
        }

        function getFunctionalAreas() {
            const requestOptions = {
                method: 'GET',
                url: `/ws/schema/area`
            };

            return _makeRequest(requestOptions);
        }

        function getTablesForFunctionalArea({ functionalArea }) {
            if (!functionalArea) {
                return Promise.reject("getTablesForFunctionalArea(): table name or record Id not supplied");
            }

            const requestOptions = {
                method: 'GET',
                url: `/ws/schema/area/${functionalArea}/table`
            };

            return _makeRequest(requestOptions);
        }

        function getAllTables() {
            const requestOptions = {
                method: 'GET',
                url: `/ws/schema/table`
            };

            return _makeRequest(requestOptions);
        }

        function getTableMetadata({ tableName, expansion }) {
            if (!tableName) {
                return Promise.reject("getTableMetadata(): table name or record Id not supplied");
            }

            const params = _buildParams({
                expansion
            });

            const requestOptions = {
                method: 'GET',
                url: `/ws/schema/table/${tableName}/metadata?${params}`
            };

            return _makeRequest(requestOptions);
        }

        function createRecord({ tableName, payload = {} }) {
            if (!tableName) {
                return Promise.reject("makeRetrieveRecordsRequest(): table name not supplied");
            }

            const requestOptions = {
                method: 'POST',
                url: `/ws/schema/table/${tableName}`,
                data: payload
            }

            requestOptions.data.tables[tableName] = payload;

            return _makeRequest(requestOptions);
        }

        function retrieveRecord({ tableName, recordId, projection }) {
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
                url: `/ws/schema/table/${tableName}/${recordId}?${params}`
            };

            return _makeRequest(requestOptions);
        }

        function retrieveRecords({ tableName, query_expression, projection, page, pagesize, sort, sortdescending }) {
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

        function updateRecord({ tableName, recordId, payload = {} }) {
            if (!tableName || !recordId) {
                return Promise.reject("makeUpdateRecordRequest(): table name or record Id not supplied");
            }

            const requestOptions = {
                method: 'PUT',
                url: `/ws/schema/table/${tableName}`,
                data: payload
            };
            
            return _makeRequest(requestOptions);
        }

        function massUpdateRecords({ tableName, payload }) {
            if (!tableName) {
                return Promise.reject("massUpdateRecords(): table name or record Id not supplied");
            }

            const requestOptions = {
                method: 'POST',
                url: `/ws/schema/table/${tableName}/massupdatebycriteria`,
                data: payload
            };
            
            return _makeRequest(requestOptions);
        }

        function deleteRecord({ tableName, recordId }) {
            if (!tableName || !recordId) {
                return Promise.reject("makeRecordRequest(): table name or record Id not supplied");
            }

            const requestOptions = {
                method: 'DELETE',
                url: `/ws/schema/table/${tableName}`
            };

            return _makeRequest(requestOptions);
        }

        function getRecordCount({ tableName, query_expression }) {
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
            getFunctionalAreas,
            getTablesForFunctionalArea,
            getAllTables,
            getTableMetadata,
            createRecord,
            retrieveRecord,
            retrieveRecords,
            updateRecord,
            massUpdateRecords,
            deleteRecord,
            getRecordCount
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