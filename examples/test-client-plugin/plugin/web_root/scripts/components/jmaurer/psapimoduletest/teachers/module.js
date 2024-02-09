'use strict';
define(function (require) {
    // This line will ensure angular is loaded,
    // if it has not been loaded yet RequireJS will load it.
    // Once loaded we will instantiate the var and use it setup our module.
    var angular = require('angular');
    // If we have dependencies on other AngularJS modules define like this.
    require('components/jmaurer/psApiModule/index');
    const psApiModule = angular.module('psApiModule');
    // powerSchoolModule is the main AngularJS module of PowerSchool which is what we use to bootstrap the document.
    psApiModule.config(['ExternalResourceServiceProvider', 'SchemaServiceProvider', function (ExternalResourceServiceProvider, SchemaServiceProvider) {
        
        //This should be the hostname and port (if not 443) of your external resource server.
        ExternalResourceServiceProvider.setOAuth2BaseUrl('https://[hostname]:[port]');
        //This should match the id provided by your plugin.xml callback data to associate the correct credentials
        ExternalResourceServiceProvider.setPluginId('[your-plugin-id]');

        SchemaServiceProvider.useExternalResourceService(true);
    }]);
    return angular.module('psApiModuleTest', ['powerSchoolModule', 'psApiModule']);
});