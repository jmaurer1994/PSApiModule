define(function (require) {
    var module = require('components/jmaurer/psapimoduletest/teachers/module');
    module.controller('PsApiModuleTestController', ['$scope', 'SchemaService', function ($scope, SchemaService) {
        $scope.logintest = () => {
            SchemaService.makeGetRecordCountRequest({ tableName: 'U_PS_API_TEST_TABLE' }).then(response => {
                console.log(response)
            }).catch(e => {
                console.log(e)
            }).finally(_ => {
                closeLoading();
            })
        }
    }]);
});