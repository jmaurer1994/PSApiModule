'use strict';
define(function (require) {
    // This will load the main AngularJS module of PowerSchool which is what we use to bootstrap the document.
    require('components/shared/index');
    // These will load and configure all your AngularJS code to be bootstrapped.
    require('components/jmaurer/PSApiModule/module');
    require('components/jmaurer/PSApiModule/services/index');
});