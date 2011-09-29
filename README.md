Javascript (jquery) Library for talking to crowd 2.2.x rest api

# Crowd REST API Documentation

https://developer.atlassian.com/display/CROWDDEV/Crowd+REST+Resources

# Cross Site Scripting

In order for this library to work, your site must be hosted from the
same domain as where Crowd is hosted. Otherwise, the browser won't
let the crowd.js make ajax requests to a different domain.

# Warning about Security

This script contains the crowd app basic auth username and password
right in the browser page's source. So, unless it's protected behind a
firewall, and/or protected with ssl, it's definitely not secure!

# Usage

Create a crowd client like so: 

    var client = crowd({ 
        crowdRestUrl: "http://localhost:8095/rest/usermanagement/latest", 
        crowdAppUsername: "Your Crowd App Username",
        crowdAppPassword: "Your Crowd App Password"
    });

Get active users (will return first 10 by default): 

    client.getActiveUsers({
        '*',
        { 
          success: function(result){ 
                   doSomething(results['users']);
          },
          failure: function(jqXHR, textStatus, errorThrown){
                   alert("Error: " + textStatus);
          }
        }
    });

Get the next 20 active users: 

    client.getActiveUsers({
        '*',
        'start-index': 10,
        'max-results': 20,
        { 
          success: function(result){ 
                   doSomething(results['users']);
          },
          failure: function(jqXHR, textStatus, errorThrown){
                   alert("Error: " + textStatus);
          }
        }
    });


Look in `test.js` for examples of how to call other methods. Note that
the calls to `start();` and `stop();` are needed for qunit, but you
should ignore those when calling the api. 

# Run Tests

Tests are written using Qunit. Host the public directory under the
same domain as Crowd and then browse to test.html to run the qunit
tests.

Keeping async calls coordinated can be tricky! When writing new qunit be
careful about start/stop method calls. 

# Released under MIT License
Copyright (c) 2011 Dave Paroulek

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
