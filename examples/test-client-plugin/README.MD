# Test Client Plugin

Barebones implementation to test client code in PS. Can also serve as a demo for 
consuming the client library. Both `data access` and `plugin` each zip to their
own plugin file. Load the main plugin first, and then the data access plugin to 
avoid the plugin installer complaining. See `build` for built zip files.

Upon installation, the `data access` plugin will register with the backend server.