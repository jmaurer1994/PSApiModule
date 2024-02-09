'use strict';
define(function (require) {
    // This will load the main AngularJS module of PowerSchool which is what we use to bootstrap the document.
    require('components/shared/index');
    // These will load and configure all your AngularJS code to be bootstrapped.
    require('components/jmaurer/PsApiModule/module');
    require('components/jmaurer/PsApiModule/services/index');
});