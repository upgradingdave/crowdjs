// Javascript Library for accessing Crowd Rest API
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

function crowd(options){

    /*====================
     * Settings 
     * ====================*/
    var settings = {
	    crowdRestUrl: "/crowd/rest/usermanagement/latest",
	    crowdAppUsername: "REPLACE WITH crowd app username",
	    crowdAppPassword: "REPLACE WITH crowd app password",
	    defaultMaxResults: 10
	};

    $.extend(settings, options);

    /*=======================
     * Public API
     *======================= 
     */
    return {

        /**
         * Uncomment to give clients access to settings. 
         */
        // settings: settings,
        
        /**
         * Helper for basic auth header
         */
        basicAuthHeader: function(username, password){
	    return "Basic " +
	        $.base64Encode(username + ":" + password);
        },

	/**
	 * Convenience Method for creating xml that represents a user
	 */
	userXml: function(username, first, last, email, displayname, password){
	    var xmlString = '<?xml version="1.0" encoding="UTF-8"?>'
		+ '<user name="'+username+'" expand="attributes">'
		+ '<first-name>'+first+'</first-name>'
		+ '<last-name>'+last+'</last-name>'
		+ '<display-name>'+displayname+'</display-name>'
		+ '<email>'+email+'</email>'
		+ '<active>true</active>'
		+ '<attributes>'
		+ '<link rel="self" href="link_to_user_attributes"/>'
		+ '</attributes>'
		+ '<password>'
		+ '<link rel="edit" href="link_to_user_password"/>'
		+ '<value>'+password+'</value>'
		+ '</password>'
		+ '</user>';
	    return xmlString;
	},

	/**
	 * Convenience Method for creating xml that represents a group
	 */
	groupXml: function(groupname, opt_description){
	    var xmlString = '<?xml version="1.0" encoding="UTF-8"?>'
                + '<group name="'+groupname+'" expand="attributes">'
                + '<type>GROUP</type>';
            var group_desc = opt_description || "Crowd Group Created By crowd.js";
            xmlString += '<description>'+group_desc+'</description>'
                + '<active>true</active>'
                + '<attributes>'
                + '<link rel="self" href="link_to_group_attributes"/>'
                + '</attributes>'
                + '</group>';
	    return xmlString;
	},

        /*------------------------------------------------------------
         * USER MANAGEMENT
         */

	/**
	 * Retrieve info on specific user
	 */
	getUser: function(username, opt_options) {
	    this.crowdRequest(
                $.extend (
		    {
		        url: settings.crowdRestUrl+'/user',
		        data: {
			    'username': username
		        }
		    }, opt_options));
	},
	
	/**
	 * Create a new user in crowd. Be sure to create a user with a
	 * password.
	 */
	createUser: function(xmlUser, opt_options) {
	    this.crowdRequest(
                $.extend (
		    {
		        url: settings.crowdRestUrl+'/user',
		        type: 'post',
		        contentType: 'application/xml',
		        processData: false,
		        data: xmlUser
		    }, opt_options));
	},

	/**
	 * Update information about a user.
	 */
	updateUser: function(username, xmlUser, opt_options) {
	    this.crowdRequest(
                $.extend(
		{   
		    url: settings.crowdRestUrl+'/user?username='+username,
		    type: 'put',
		    contentType: 'application/xml',
		    processData: false,
		    data: xmlUser
		}, opt_options));
	},

	/**
	 * Delete a user from crowd. 
	 */
	deleteUser: function(username, opt_options) {
	    this.crowdRequest(
                $.extend (
		{   
		    url: settings.crowdRestUrl+'/user?username='+username,
		    type: 'delete'
		}, opt_options));
	},

        /*------------------------------------------------------------
         * Group Management
         */

	/**
	 * Retrieve info on specific group
	 */
	getGroup: function(groupname, opt_options) {
	    this.crowdRequest(
                $.extend (
		    {
		        url: settings.crowdRestUrl+
                            '/group?groupname='+groupname
		    }, opt_options));
	},
	
	/**
	 * Create a new group in crowd.
	 */
	createGroup: function(groupname, opt_groupdescription, opt_options) {
            var xmlGroup = this.groupXml(groupname, opt_groupdescription);
	    this.crowdRequest(
                $.extend (
		    {
		        url: settings.crowdRestUrl+'/group',
		        type: 'post',
		        contentType: 'application/xml',
		        processData: false,
		        data: xmlGroup
		    }, opt_options));
	},

	/**
	 * Update information about a Group
	 */
	updateGroup: function(groupname, groupdesc, opt_options) {
            var xmlGroup = this.groupXml(groupname, groupdesc);
	    this.crowdRequest(
                $.extend(
		{   
		    url: settings.crowdRestUrl+'/group?groupname='+groupname,
		    type: 'put',
		    contentType: 'application/xml',
		    processData: false,
		    data: xmlGroup
		}, opt_options));
	},

	/**
	 * Delete a group 
	 */
	deleteGroup: function(groupname, opt_options) {
	    this.crowdRequest(
                $.extend (
		{   
		    url: settings.crowdRestUrl+'/group?groupname='+groupname,
		    type: 'delete'
		}, opt_options));
	},        

        /*------------------------------------------------------------
         * Search
         */         

	/**
	 * Do a search for active users. You can use fuzzy search like *bob
	 * or *bob*. If name is passed, it will try to match 'name' or
	 * 'email' user fields.
	 */
	getActiveUsers: function(name, opt_options) {
	    this.crowdRequest(
                $.extend (
		    {
		        url: settings.crowdRestUrl+'/search',
		        data: {
			    'entity-type': 'user',
			    'start-index': opt_options.startIndex || 0,
			    'max-results': opt_options.maxResults || 
                                settings.defaultMaxResults,
			    'restriction': name ? 'name='+name+
			        ' OR email='+name : ''
		        }
		    }, opt_options));
        },

        /*------------------------------------------------------------
         * Users Group Memberships
         */
        
	/*
	 * Return a list of groups the user is a direct member of.
	 */
	getUserGroups: function(username, opt_options) {
	    this.crowdRequest(
                $.extend (
                    {
                        url: settings.crowdRestUrl+'/user/group/direct',
		        data: {
			    'username': username,
			    'start-index': '0',
			    'max-results': '10000' //just get all memberships
		        }
                    }, opt_options));
        },

	/*
	 * Add a user to a group
	 */
	addUserToGroup: function(username, groupname, opt_options) {
	    this.crowdRequest(
                $.extend (
		    {
		        url: settings.crowdRestUrl+
			    '/group/user/direct?groupname='+groupname,
		        type: 'post',
		        contentType: 'application/xml',
		        data: '<?xml version="1.0" encoding="UTF-8"?>'
			    + '<user name="'+username+'"/>'
		    }, opt_options));
	},

	/*
	 * Remove a user from a group
	 */
	removeUserFromGroup: function(username, groupname, opt_options) {
	    this.crowdRequest(
                $.extend (
		{
		    url: settings.crowdRestUrl+'/group/user/direct?groupname='
			+ groupname+'&username='+username,
		    type: 'delete'
		}, opt_options));
	},

	/**
	 * Convenience method for making jqery ajax call
	 */
	crowdRequest: function(opt_options) {
	    console.log("Attempting "+(opt_options['type']||'get')+
	     	  " request to "+opt_options['url']);
	    $.ajax(
		$.extend (
		    {
                        //username: settings.crowdAppUsername,
                        //password: settings.crowdAppPassword,
			//crossDomain: true,
			headers: {
			    'Authorization': 
                            this.basicAuthHeader(settings.crowdAppUsername, 
			         	         settings.crowdAppPassword),
			    'Accept': 'application/json'
			},
			type: 'get',
			error: function(jqXHR, textStatus, errorThrown){},
			complete: function(jqXHR, textStatus){}, 
			cache: false,
			ifModified: true
		    }, opt_options));
	}
    };
}
