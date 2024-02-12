'use strict';
define(function (require) {
    // This line will ensure angular is loaded,
    // if it has not been loaded yet RequireJS will load it.
    // Once loaded we will instantiate the var and use it setup our module.
    var angular = require('angular');
    // If we have dependencies on other AngularJS modules define like this.
    require('components/jmaurer/PSApiModule/index');
    const PSApiModule = angular.module('PSApiModule');
    // powerSchoolModule is the main AngularJS module of PowerSchool which is what we use to bootstrap the document.
    PSApiModule.config(['ExternalResourceServiceProvider', 'SchemaServiceProvider', function (ExternalResourceServiceProvider, SchemaServiceProvider) {
        
    }]);
    return angular.module('PSApiModuleTest', ['powerSchoolModule', 'PSApiModule']);
});