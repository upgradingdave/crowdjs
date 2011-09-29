// Unit Tests for crowd.js
// Copyright (c) 2011 Dave Paroulek

// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var client = crowd(
    { crowdRestUrl: "/crowd22/rest/usermanagement/latest", 
      crowdAppUsername: "crowd-app-username",
      crowdAppPassword: "crowd-app-password"
    });

/*------------------------------------------------------------
 * Setup and Helper Methods
 */

var tstGroup = {
    name: 'crowdunittestgroup',
    desc: 'Created by javascript unit test'
};

function createTstGroup() {
    stop();
    client.createGroup(
        tstGroup.name,
        tstGroup.desc,
        {
            complete: function(jqXHR, textStatus){ 
                //Note: ignore error if group already exists
                //equal(jqXHR.status, 201);
		start(); 
            },
            error: function(jqXHR, textStatus, errorThrown){
                //Note: ignore error if group already exists
                //notEqual(textStatus, "error", "Make sure we don't get any errors: "
                //         +errorThrown);
                start();
            }
        });
}

function deleteTstGroup(){
    stop();
    client.deleteGroup(
        tstGroup.name, 
        {
      	    complete :
	    function(jqXHR, textStatus){
                equal(jqXHR.status, 204, "Successfully deleted Group");
                start();
	    },
	    error: function(jqXHR, textStatus, errorThrown){
                notEqual(textStatus, "error", "Make sure we don't get any errors: "
                         +errorThrown);
                start();
            }
	});
}

var tstUsrName = 'crowdunittest1';

var tstUsr = client.userXml(
    tstUsrName, 'unit', 
    'test1', 'someone@somewhere.com', 
    'Crowd Test User 1', 'supersecret');

var updateUsr = client.userXml(
    tstUsrName, 'updated', 
    'test1', 'someone@somewhere.com', 
    'Crowd Test User 1', 'supersecret');

function createTstUser(){
    stop();
    client.createUser(
        tstUsr, {
            complete: function(jqXHR, textStatus){ 
                //Note: ignore error if user already exists
                //equal(jqXHR.status, 201);
		start(); 
            },
            error: function(jqXHR, textStatus, errorThrown){
                //notEqual(textStatus, "error", "Make sure we don't get any errors: "
                //         +errorThrown);
                start();
            }
        });
}

function deleteTstUser(){
    stop();
    client.deleteUser(
        tstUsrName, 
        {
      	    complete :
	    function(jqXHR, textStatus){
                equal(jqXHR.status, 204, "Successfully deleted user");
                start();
	    },
	    error: function(jqXHR, textStatus, errorThrown){
                notEqual(textStatus, "error", "Make sure we don't get any errors: "
                         +errorThrown);
                start();
            }
	});
}

function getUserGroups(username, expectedGroupCount){
    stop();
    client.getUserGroups(
        username, 
        {
            success:function(response){
		equal(expectedGroupCount, 
                      response['groups'].length, "ensure correct number of groups");
                start();
            },
            error:function(jqXHR, textStatus, errorThrown){
                notEqual(textStatus, "error", "Make sure we don't get any errors: "
                         +errorThrown);
                start();
            }
        });
}

function addUserToGroup(username, groupname){
    stop();
    client.addUserToGroup(
        username, 
        groupname,
        {
            complete:function(jqXHR, textStatus){
                equal(jqXHR.status, 201, "Successfully added user to group");
                start();
                removeUserFromGroup(username, groupname);
            },
            error:function(jqXHR, textStatus, errorThrown){
                notEqual(textStatus, "error", "Make sure we don't get any errors: "
                         +errorThrown);
                start();
            }
        });
}

function removeUserFromGroup(username, groupname){
    stop();
    client.removeUserFromGroup(
        username, 
        groupname,
        {
            complete:function(jqXHR, textStatus){
                equal(jqXHR.status, 204, "Successfully removed user from group");
                start();
                getUserGroups(username, 0);
            },
            error:function(jqXHR, textStatus, errorThrown){
                notEqual(textStatus, "error", "Make sure we don't get any errors: "
                         +errorThrown);
                start();
            }
        });
}

/*------------------------------------------------------------
 * Qunit Tests
 */

/** 
 * Example Basic Qunit Test
 */
test("make sure qunit is working", function() {
         ok( true, "this test is fine" );
         var value = "hello";
         equal( value, "hello", "We expect value to be hello" );
     });

/**
 * Get Users
 */ 
test(
    "get all active users", 
    1,
    function(){
        stop();
	client.getActiveUsers(
            '*', { success: function(res){ 
                       ok(res && res['users'], "getActiveUsers");
		       start(); 
                   },
                   error: function(jqXHR, textStatus, errorThrown){
                       notEqual(textStatus, "error", "Make sure we don't get any errors: "
                                +errorThrown);
                       start();
                   }
                 });
    });


module("crud-user-tests", {
           setup: function(){createTstUser();},
           teardown: function(){deleteTstUser();}
       });

/**
 * Test to see if we can retrieve the test user
 */
test("get user", 
	  function(){
              stop();
	      client.getUser(
                  tstUsrName, 
                  {
		      success: function(response){
                          ok(response);
                          equal(response['name'], tstUsrName, "Found test user");
                          start();
		      },
                      error: function(jqXHR, textStatus, errorThrown){
                          notEqual(textStatus, "error", 
                                   "Make sure we don't get any errors: "
                                   +errorThrown);
                          start();
                      }
                  });
          });

/**
 * Test to see if we can update a user
 */
test(
    "update user", 
    function(){
        stop();
	client.updateUser(
            tstUsrName, 
            updateUsr,
            {
		complete: function(jqXHR, textStatus){
                    equal(jqXHR.status, 204, "Updated user");
                    start();
		},
		error: function(jqXHR, textStatus, errorThrown){
                    notEqual(textStatus, "error", 
                             "Make sure we don't get any errors: "
                             +errorThrown);
                    start();
		}
            });
    });

module("crud-group-tests", {
           setup: function() {createTstGroup();},
           teardown: function(){deleteTstGroup();}
       });

/**
 * Test to see if we can retrieve the test group
 */
test("get group", 
	  function(){
              stop();
	      client.getGroup(
                  tstGroup.name,
                  {
		      success: function(response){
                          ok(response);
                          equal(response['name'], tstGroup.name, "Found test Group");
                          start();
		      },
                      error: function(jqXHR, textStatus, errorThrown){
                          notEqual(textStatus, "error", 
                                   "Make sure we don't get any errors: "
                                   +errorThrown);
                          start();
                      }
                  });
          });

/**
 * Test to see if we can update a group
 */
test(
    "update group", 
    function(){
        stop();
	client.updateGroup(
            tstGroup.name, 
            tstGroup.desc,
            {
		complete: function(jqXHR, textStatus){
                    equal(jqXHR.status, 200, "Updated Group");
                    start();
		},
		error: function(jqXHR, textStatus, errorThrown){
                    notEqual(textStatus, "error", 
                             "Make sure we don't get any errors: "
                             +errorThrown);
                    start();
		}
            });
    });


module("group-membership-tests", {
           setup: function() {
               createTstUser();
               createTstGroup();
           },
           teardown: function(){
               deleteTstUser();
               deleteTstGroup();}
       });

test("add group, then get user groups, then remove user from group",
     function(){
         getUserGroups(tstUsrName, 0);
         addUserToGroup(tstUsrName, tstGroup.name);
     });

