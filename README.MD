# PowerSchool API Module

Injectable Angular Library Wrapper for the Powerschool API


## Purpose

PowerSchool doesn't support use of the table resource endpoint from the /teachers
portal, which presents a challenge when developing plugins that use custom tables.


Essentially, if you have a scenerio where you're developing a plugin on the /admin
side and want input from the teachers (e.g. a fancy form with some kind of approval
flow) this may help you.


See [jmaurer1994/PSApiOAuthConnector](https://github.com/jmaurer1994/PSApiOAuthConnector) 
for information on the backend server.


## How the client library works

Essentially wraps the Table resource API in an AngularJS service. For use in the 
/admin portal, no backend server or provider configuration is necessary. Simply 
inject the module and the user will be internally authenticated by PowerSchool.


If using from the /teacher portal, the user will instead be proxied to the 
backend server which will use the PowerSchool authorization server to authenticate
the user and proxy the request from the client code back to PowerSchool's API with
the plugin's credentials. The response is then returned to the client.s

## Features

### Automatic Client Registration

Install, enable, and allow the client plugin to register with the backend server to 
start using. Client id and secret are passed to the registration server and stored
in a local libsql database. 


### Configurable AngularJS Provider

Inject the module and configure the provider in your AngularJS code:


`PSApiModule.config(['ExternalResourceServiceProvider', 'SchemaServiceProvider', function (ExternalResourceServiceProvider, SchemaServiceProvider) {
        
        //This should be the hostname and port (if not 443) of your external resource server.
        ExternalResourceServiceProvider.setOAuth2BaseUrl('https://[hostname]:[port]');
        //This should match the id provided by your plugin.xml callback data to associate the correct credentials
        ExternalResourceServiceProvider.setPluginId('[your-plugin-id]');

        SchemaServiceProvider.useExternalResourceService(true);
    }]);`


See examples for a full implementation.


## Install

* Modify plugin.xml file
    * If using for /admin portal only, the <registration> and <oauth> blocks may 
    be omitted
    * If using for /teachers or both, set the <registration> and <oauth> blocks 
    to point toward the backend server instance
* Zip plugin directory and install through the PowerSchool plugin console
* Modify your AngularJS code to include the module