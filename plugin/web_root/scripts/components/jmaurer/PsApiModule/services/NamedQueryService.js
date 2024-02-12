'use strict';
define(function(require) {
    const module = require('components/jmaurer/PSApiModule/module');
    const serviceId = 'NamedQueryService'

    const providerOptions = {
        //If setting to true, remember to configure the service as well
        useExternalResourceService: false,
    }

    function Service($http, config) {
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
        
        const parseQueryResponse = ({ definitions, paths }) => {
            try{
                const namedQueries = []
                Object.keys(paths).map((path) => {
                    const name = path.split('/')[4]
                    
                    let data = {}
                    
                    try{
                        const { post } = paths[path]
                       
                        const fields = ['dat', 'description', 'operationId', 'responses', 'summary', 'tags', 'x-access-restrictions-applied', 'x-hide','x-ps-version', 'x-ps-version-changes', 'x-resource-permission-path', 'x-plugin-id', 'x-sql' , 'x-trusted']
                        
                        let parameters = {}
                        
                        if(post.parameters){
                            //get param defs
                            const definition = post.parameters[0].schema.$ref.split('/')[2]
                            
                            const schema = definitions[definition]
                            
                            schema.required?.map(required_field => {
                                schema.properties[required_field].required = true;
                            })
                            
                            parameters = schema.properties
                        }
                        
                        const response = definitions[`powerquery.resp.${name}.record`].properties
                        
                        const properties = {
                            name
                        }
                        
                        fields.map(field => post[field] !== undefined ? properties[field] = post[field] : null)
                        
                        namedQueries.push(new NamedQuery($http, properties, parameters, response))
                    } catch(e) {
                        //do nothing - just dont parse this query
                        console.debug(e)
                    }
                })
                
                return namedQueries
            } catch(e) {
                throw e
            }
            
        }
        
        function executeNamedQuery({queryName, queryArgs, extensions, page, pagesize}){
            if (!queryName) {
                return Promise.reject("executeNamedQuery(): query name not supplied");
            }

            const params = _buildParams({
                extensions,
                page,
                pagesize
            });

            const requestOptions = {
                method: 'POST',
                url: `/ws/schema/query/${queryName}?${params}`,
                data: {
                    queryArgs
                }
            }

            return _makeRequest(requestOptions);
        }

        function getNamedQueryRowCount({queryName, queryArgs}){
            if (!queryName) {
                return Promise.reject("getNamedQueryRowCount(): query name not supplied");
            }

            const requestOptions = {
                method: 'POST',
                url: `/ws/schema/query/${queryName}`,
                data: {
                    queryArgs
                }
            }

            return _makeRequest(requestOptions);
        }

        function listNamedQueries({query}){
            const params = _buildParams({
                query
            });

            const requestOptions = {
                method: 'POST',
                url: `/ws/schema/query/api?${params}`,
                data: {
                    queryArgs
                }
            }

            return _makeRequest(requestOptions);

        }
        
        return {
            executeNamedQuery,
            getNamedQueryRowCount,
            listNamedQueries,
            parseQueryResponse
        }
    }
    
    module.provider(serviceId, function ServiceProvider(){
        Object.keys(providerOptions).forEach(option => {
            this[option] = (value) => {
                providerOptions[option] = !!value;
            }
        })

        this.$get = ['$http', 'ExternalResourceService', function ServiceFactory($http, ExternalResourceService) {
            return new Service({ ...providerOptions }, $http, ExternalResourceService)
        }]
    })
});