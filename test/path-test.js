/*
	The Cedric's Swiss Knife (CSK) - CSK REST Query test suite

	Copyright (c) 2015 Cédric Ronvel 
	
	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

/* jshint unused:false */
/* global describe, it, before, after */

"use strict" ;



var restQuery = require( '../lib/restQueryShared.js' ) ;

var stream = require( 'stream' ) ;
var expect = require( 'expect.js' ) ;




			/* Tests */



describe( "Path's node parsing" , function() {
	
	var parsePathNode = function parsePathNode( str ) {
		
		try {
			return restQuery.path.parseNode( str ) ;
		}
		catch ( error ) {
			return error ;
		}
	} ;
	
	it( "should parse a valid collection node as an collection's child of the current object" , function() {
		expect( parsePathNode( 'Users' ) ).to.eql( { type: 'collection' , isCollection: true , isDocument: false , identifier: 'users' , value: 'Users' } ) ;
		expect( parsePathNode( 'U' ) ).to.eql( { type: 'collection' , isCollection: true , isDocument: false , identifier: 'u' , value: 'U' } ) ;
	} ) ;
	
	it( "should parse a valid method node as a method" , function() {
		expect( parsePathNode( 'REGENERATE-TOKEN' ) ).to.eql( { type: 'method' , isCollection: false , isDocument: false , identifier: 'regenerateToken' , value: 'REGENERATE-TOKEN' } ) ;
		expect( parsePathNode( 'FILE' ) ).to.eql( { type: 'method' , isCollection: false , isDocument: false , identifier: 'file' , value: 'FILE' } ) ;
	} ) ;
	
	it( "should parse a valid offset node as an offset" , function() {
		expect( parsePathNode( '1258' ) ).to.eql( { type: 'offset' , isCollection: false , isDocument: true , identifier: 1258 , value: '1258' } ) ;
		expect( parsePathNode( '01258' ) ).to.eql( { type: 'offset' , isCollection: false , isDocument: true , identifier: 1258 , value: '01258' } ) ;
		expect( parsePathNode( '0' ) ).to.eql( { type: 'offset' , isCollection: false , isDocument: true , identifier: 0 , value: '0' } ) ;
		expect( parsePathNode( '000' ) ).to.eql( { type: 'offset' , isCollection: false , isDocument: true , identifier: 0 , value: '000' } ) ;
		
		// Invalid entries
		expect( parsePathNode( '000b' ).type ).not.to.be.equal( 'offset' ) ;
	} ) ;
	
	it( "should parse a valid range node as a range" , function() {
		expect( parsePathNode( '0-100' ) ).to.eql( { type: 'range' , isCollection: true , isDocument: false , min: 0 , max: 100 , value: '0-100' } ) ;
		expect( parsePathNode( '156-345' ) ).to.eql( { type: 'range' , isCollection: true , isDocument: false , min: 156 , max: 345 , value: '156-345' } ) ;
		
		// Invalid entries
		expect( parsePathNode( '12-13-15' ).type ).not.to.be.equal( 'range' ) ;
	} ) ;
	
	it( "should parse a valid ID node as an ID" , function() {
		expect( parsePathNode( '51d18492541d2e3614ca2a80' ) ).to.eql( { type: 'id' , isCollection: false , isDocument: true , identifier: '51d18492541d2e3614ca2a80' , value: '51d18492541d2e3614ca2a80' } ) ;
		expect( parsePathNode( 'a1d18492541d2e3614ca2a80' ) ).to.eql( { type: 'id' , isCollection: false , isDocument: true , identifier: 'a1d18492541d2e3614ca2a80' , value: 'a1d18492541d2e3614ca2a80' } ) ;
		expect( parsePathNode( 'aaaaaaaaaaaaaaaaaaaaaaaa' ) ).to.eql( { type: 'id' , isCollection: false , isDocument: true , identifier: 'aaaaaaaaaaaaaaaaaaaaaaaa' , value: 'aaaaaaaaaaaaaaaaaaaaaaaa' } ) ;
		expect( parsePathNode( '111111111111111111111111' ) ).to.eql( { type: 'id' , isCollection: false , isDocument: true , identifier: '111111111111111111111111' , value: '111111111111111111111111' } ) ;
		
		// Invalid entries
		expect( parsePathNode( '51d18492541d2e3614ca2a8' ).type ).not.to.be.equal( 'id' ) ;
		expect( parsePathNode( '51d18492541d2e3614ca2a80a' ).type ).not.to.be.equal( 'id' ) ;
		expect( parsePathNode( '51d18492541h2e3614ca2a80' ).type ).not.to.be.equal( 'id' ) ;
	} ) ;
	
	it( "should parse a valid slugId node as a slugId" , function() {
		expect( parsePathNode( 'abc' ) ).to.eql( { type: 'slugId' , isCollection: false , isDocument: true , identifier: 'abc' , value: 'abc' } ) ;
		expect( parsePathNode( 'cronvel' ) ).to.eql( { type: 'slugId' , isCollection: false , isDocument: true , identifier: 'cronvel' , value: 'cronvel' } ) ;
		expect( parsePathNode( 'c20nv31' ) ).to.eql( { type: 'slugId' , isCollection: false , isDocument: true , identifier: 'c20nv31' , value: 'c20nv31' } ) ;
		expect( parsePathNode( 'my-blog-entry' ) ).to.eql( { type: 'slugId' , isCollection: false , isDocument: true , identifier: 'my-blog-entry' , value: 'my-blog-entry' } ) ;
		expect( parsePathNode( 'a-24-characters-long-sid' ) ).to.eql( { type: 'slugId' , isCollection: false , isDocument: true , identifier: 'a-24-characters-long-sid' , value: 'a-24-characters-long-sid' } ) ;
		expect( parsePathNode( 'agaaaaaaaaaaaaaaaaaaaaaa' ) ).to.eql( { type: 'slugId' , isCollection: false , isDocument: true , identifier: 'agaaaaaaaaaaaaaaaaaaaaaa' , value: 'agaaaaaaaaaaaaaaaaaaaaaa' } ) ;
		expect( parsePathNode( '01b' ) ).to.eql( { type: 'slugId' , isCollection: false , isDocument: true , identifier: '01b' , value: '01b' } ) ;
		expect( parsePathNode( 'azekjsdlmfjqmsljdfmklqsdlmfjslmfvqsdmljfgqsdjgmklhsdmhqgfqsdlmghlmkdhfga' ) ).to.eql( { type: 'slugId' , isCollection: false , isDocument: true , identifier: 'azekjsdlmfjqmsljdfmklqsdlmfjslmfvqsdmljfgqsdjgmklhsdmhqgfqsdlmghlmkdhfga' , value: 'azekjsdlmfjqmsljdfmklqsdlmfjslmfvqsdmljfgqsdjgmklhsdmhqgfqsdlmghlmkdhfga' } ) ;
		expect( parsePathNode( 'a' ) ).to.eql( { type: 'slugId' , isCollection: false , isDocument: true , identifier: 'a' , value: 'a' } ) ;
		
		// Invalid entries
		expect( parsePathNode( 'afaaaaaaaaaaaaaaaaaaaaaa' ).type ).not.to.be.equal( 'slugId' ) ;
		expect( parsePathNode( 'my-Blog-entry' ) ).to.be.an( Error ) ;
		expect( parsePathNode( 'My-blog-entry' ) ).to.be.an( Error ) ;
		expect( parsePathNode( 'azekjsdlmfjqmsljdfmklqsdlmfjslmfvqsdmljfgqsdjgmklhsdmhqgfqsdlmghlmkdhfgaz' ) ).to.be.an( Error ) ;
	} ) ;
	
	it( "should parse a valid property node as a property of the current object" , function() {
		expect( parsePathNode( '.bob' ) ).to.eql( { type: 'property' , isCollection: false , isDocument: true , identifier: 'bob' , value: '.bob' } ) ;
		expect( parsePathNode( '.name' ) ).to.eql( { type: 'property' , isCollection: false , isDocument: true , identifier: 'name' , value: '.name' } ) ;
		expect( parsePathNode( '.n' ) ).to.eql( { type: 'property' , isCollection: false , isDocument: true , identifier: 'n' , value: '.n' } ) ;
		expect( parsePathNode( '.embedded.data' ) ).to.eql( { type: 'property' , isCollection: false , isDocument: true , identifier: 'embedded.data' , value: '.embedded.data' } ) ;
		
		// Invalid entries
		expect( parsePathNode( '.' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '.embedded..data' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '.name.' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '.name..' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '..name' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '.embedded.data.' ) ).to.be.an( Error ) ;
	} ) ;
	
	it( "should parse a valid link property node as a link property of the current object" , function() {
		expect( parsePathNode( '~name' ) ).to.eql( { type: 'linkProperty' , isCollection: false , isDocument: true , identifier: 'name' , value: '~name' } ) ;
		expect( parsePathNode( '~n' ) ).to.eql( { type: 'linkProperty' , isCollection: false , isDocument: true , identifier: 'n' , value: '~n' } ) ;
		expect( parsePathNode( '~embedded.data' ) ).to.eql( { type: 'linkProperty' , isCollection: false , isDocument: true , identifier: 'embedded.data' , value: '~embedded.data' } ) ;
		
		// Invalid entries
		expect( parsePathNode( '~' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~.' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~embedded..data' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~name.' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~name..' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~.name' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~embedded.data.' ) ).to.be.an( Error ) ;
	} ) ;
	
	it( "should parse a valid multi-link property node as a multi-link property of the current object" , function() {
		expect( parsePathNode( '~~name' ) ).to.eql( { type: 'multiLinkProperty' , isCollection: true , isDocument: false , identifier: 'name' , value: '~~name' } ) ;
		expect( parsePathNode( '~~n' ) ).to.eql( { type: 'multiLinkProperty' , isCollection: true , isDocument: false , identifier: 'n' , value: '~~n' } ) ;
		
		// Invalid entries
		expect( parsePathNode( '~~' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~~.' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~~embedded.data' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~~name.' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~~name..' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~~.name' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~~embedded.data.' ) ).to.be.an( Error ) ;
	} ) ;
	
	it( "edge cases" , function() {	
		expect( parsePathNode( 'U-' ) ).to.eql( { type: 'method' , isCollection: false , isDocument: false , identifier: 'u' , value: 'U-' } ) ;
		expect( parsePathNode( 'U---' ) ).to.eql( { type: 'method' , isCollection: false , isDocument: false , identifier: 'u' , value: 'U---' } ) ;
		expect( parsePathNode( '-U' ) ).to.be.an( Error ) ;
	} ) ;
} ) ;



describe( "Path parsing" , function() {
	
	var parse = restQuery.path.parse ;
	
	it( "should parse a full URL path, returning an array of node" , function() {
		expect( parse( '/' ) ).to.eql( [] ) ;
		expect( parse( '/Users' ) ).to.eql( [ { type: 'collection' , isCollection: true , isDocument: false , identifier: 'users' , value: 'Users' } ] ) ;
		expect( parse( '/Users/51d18492541d2e3614ca2a80' ) ).to.eql( [
			{ type: 'collection' , isCollection: true , isDocument: false , identifier: 'users' , value: 'Users' } ,
			{ type: 'id' , isCollection: false , isDocument: true , identifier: '51d18492541d2e3614ca2a80' , value: '51d18492541d2e3614ca2a80' }
		] ) ;
		
		// /!\ more test are needed, but no time for that now /!\
	} ) ;
	
	it( "a parsed path array, when transformed to a string, should be the original path string" , function() {
		expect( parse( '/Users/51d18492541d2e3614ca2a80' ).toString() ).to.be( '/Users/51d18492541d2e3614ca2a80' ) ;
	} ) ;
} ) ;



describe( "zzz NEW Path pattern matching" , function() {
	
	var pathMatch = restQuery.path.match_new ;
	
	it( "xxx Basic pattern matching" , function() {
		var matches ;
		
		expect( pathMatch( '/' , '/' ) ).to.be.ok() ;
		expect( pathMatch( '/Users' , '/' ) ).not.to.be.ok() ;
		expect( pathMatch( '/' , '/Users' ) ).not.to.be.ok() ;
		expect( pathMatch( '/Users' , '/Users' ) ).to.be.ok() ;
		expect( pathMatch( '/Users/' , '/Users' ) ).to.be.ok() ;
		expect( pathMatch( '/Users' , '/Users/' ) ).to.be.ok() ;
		expect( pathMatch( '/Users' , '/Group' ) ).not.to.be.ok() ;
		expect( pathMatch( '/Users/123456789012345678901234' , '/Users' ) ).not.to.be.ok() ;
		expect( pathMatch( '/Users' , '/Users/123456789012345678901234' ) ).not.to.be.ok() ;
		
		matches = pathMatch( '/Users/123456789012345678901234' , '/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches ) ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"usersDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		expect( matches.users.upto.toString() ).to.be( '/Users' ) ;
		expect( matches.usersDocument.upto.toString() ).to.be( '/Users/123456789012345678901234' ) ;
		expect( matches.usersDocument.match.toString() ).to.be( '/123456789012345678901234' ) ;
		expect( matches.usersDocument.match[ 0 ].value ).to.be( '123456789012345678901234' ) ;
		
		expect( pathMatch( '/Users/12345678901234567890123a' , '/Users/123456789012345678901234' ) ).not.to.be.ok() ;
		
		matches = pathMatch( '/Boards/123456789012345678901234/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"boardsDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"usersDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		expect( matches.boards.upto.toString() ).to.be( '/Boards' ) ;
		expect( matches.boardsDocument.upto.toString() ).to.be( '/Boards/123456789012345678901234' ) ;
		expect( matches.users.upto.toString() ).to.be( '/Boards/123456789012345678901234/Users' ) ;
		expect( matches.usersDocument.upto.toString() ).to.be( '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		expect( matches.users.onward.toString() ).to.be( '/Users/123456789012345678901234' ) ;
		
		expect( pathMatch( '/Boards/12345678901234567890123a/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
	} ) ;
	
	it( "Pattern matching with the '{id}' wildcard" , function() {
		var matches ;
		
		matches = pathMatch( '/Boards/{id}' , '/Boards/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildId":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"boardsDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		expect( matches.wildId.toString() ).to.be( '/123456789012345678901234' ) ;
		expect( matches.wildId.match.toString() ).to.be( '/123456789012345678901234' ) ;
		expect( matches.wildId.upto.toString() ).to.be( '/Boards/123456789012345678901234' ) ;
		expect( matches.wildId ).to.eql( matches.boardsDocument ) ;
		
		expect( pathMatch( '/Boards/{id}' , '/Boards/slug' ) ).not.to.be.ok() ;
		
		matches = pathMatch( '/Boards/{id}/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildId":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"boardsDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"usersDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		
		
		matches = pathMatch( '/Boards/{id}/Users/{id}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"boardsDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildId1":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildId2":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"usersDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		expect( matches.wildId1.upto.toString() ).to.be( '/Boards/123456789012345678901234' ) ;
		expect( matches.wildId2.upto.toString() ).to.be( '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		expect( matches.wildId1 ).to.eql( matches.boardsDocument ) ;
		expect( matches.wildId2 ).to.eql( matches.usersDocument ) ;
		
		expect( pathMatch( '/Boards/123456789012345678901234/{id}/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
		expect( pathMatch( '/{id}/123456789012345678901234/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
	} ) ;
	
	it( "Pattern matching with the '{*}' wildcard" , function() {
		var matches ;
		
		matches = pathMatch( '/Boards/{*}' , '/Boards/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '  ' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wild":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		expect( matches.wild.toString() ).to.be( '/123456789012345678901234' ) ;
		expect( matches.wild.match.toString() ).to.be( '/123456789012345678901234' ) ;
		expect( matches.wild.upto.toString() ).to.be( '/Boards/123456789012345678901234' ) ;
		
		expect( pathMatch( '/Boards/{*}' , '/Boards/slug' ) ).to.be.ok() ;
		
		matches = pathMatch( '/Boards/{*}/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '  ' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wild":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"usersDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		
		
		matches = pathMatch( '/Boards/{*}/Users/{*}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '  ' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wild1":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wild2":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		expect( matches.wild1.upto.toString() ).to.be( '/Boards/123456789012345678901234' ) ;
		expect( matches.wild2.upto.toString() ).to.be( '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		
		matches = pathMatch( '/Boards/123456789012345678901234/{*}/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"boardsDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wild":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		
		matches = pathMatch( '/{*}/123456789012345678901234/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"wild":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"usersDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
	} ) ;
	
	it( "yyy Pattern matching with the '{...}' wildcard at the end of the pattern" , function() {
		var matches ;
		
		matches = pathMatch( '/Boards/{...}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"subPath":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		expect( matches.subPath.toString() ).to.be( '/123456789012345678901234/Users/123456789012345678901234' ) ;
		expect( matches.subPath.before.toString() ).to.be( '/Boards' ) ;
		expect( matches.boards.toString() ).to.be( '/Boards' ) ;
		expect( matches.subPath.match[0].toString() ).to.be( '123456789012345678901234' ) ;
	} ) ;
} ) ;


	
describe( "Path pattern matching" , function() {
	
	var pathMatch = restQuery.path.match ;
	
	it( "Basic pattern matching" , function() {
		expect( pathMatch( '/' , '/' ) ).to.be.ok() ;
		expect( pathMatch( '/Users' , '/' ) ).not.to.be.ok() ;
		expect( pathMatch( '/' , '/Users' ) ).not.to.be.ok() ;
		expect( pathMatch( '/Users' , '/Users' ) ).to.be.ok() ;
		expect( pathMatch( '/Users/' , '/Users' ) ).to.be.ok() ;
		expect( pathMatch( '/Users' , '/Users/' ) ).to.be.ok() ;
		expect( pathMatch( '/Users' , '/Group' ) ).not.to.be.ok() ;
		expect( pathMatch( '/Users/123456789012345678901234' , '/Users' ) ).not.to.be.ok() ;
		expect( pathMatch( '/Users' , '/Users/123456789012345678901234' ) ).not.to.be.ok() ;
		expect( pathMatch( '/Users/123456789012345678901234' , '/Users/123456789012345678901234' ) ).to.eql( {
			path: {
				type: 'id',
				value: '/Users/123456789012345678901234' ,
				value: '123456789012345678901234'
			},
			collectionPath: {
				type: 'collection' ,
				value: '/Users' ,
				value: 'Users'
			}
		} ) ;
		expect( pathMatch( '/Users/12345678901234567890123a' , '/Users/123456789012345678901234' ) ).not.to.be.ok() ;
		expect( pathMatch( '/Boards/123456789012345678901234/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).to.eql( {
			path: {
				type: 'id',
				value: '/Boards/123456789012345678901234/Users/123456789012345678901234',
				value: '123456789012345678901234'
			},
			collectionPath: {
				type: 'collection' ,
				value: '/Boards/123456789012345678901234/Users',
				value: 'Users'
			}
		} ) ;
		expect( pathMatch( '/Boards/12345678901234567890123a/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
	} ) ;
	
	it( "Pattern matching with the '{*}' wildcard" , function() {
		expect( pathMatch( '/Boards/{*}/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).to.eql( {
			path: {
				type: 'id',
				value: '/Boards/123456789012345678901234/Users/123456789012345678901234',
				value: '123456789012345678901234'
			},
			collectionPath: {
				type: 'collection' ,
				value: '/Boards/123456789012345678901234/Users',
				value: 'Users'
			}
		} ) ;
		expect( pathMatch( '/Boards/{*}/Users/{*}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).to.eql( {
			path: {
				type: 'id',
				value: '/Boards/123456789012345678901234/Users/123456789012345678901234',
				value: '123456789012345678901234'
			},
			collectionPath: {
				type: 'collection' ,
				value: '/Boards/123456789012345678901234/Users',
				value: 'Users'
			}
		} ) ;
		expect( pathMatch( '/Boards/{*}/{*}/{*}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).to.eql( {
			path: {
				type: 'id',
				value: '/Boards/123456789012345678901234/Users/123456789012345678901234',
				value: '123456789012345678901234'
			},
			collectionPath: {
				type: 'collection' ,
				value: '/Boards/123456789012345678901234/Users',
				value: 'Users'
			}
		} ) ;
		expect( pathMatch( '/Boards/123456789012345678901234/{*}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
		expect( pathMatch( '/Boards/123456789012345678901234/Users/{*}' , '/Boards/123456789012345678901234/Users' ) ).not.to.be.ok() ;
	} ) ;
	
	it( "Pattern matching with the '{...}' wildcard at the end of the pattern" , function() {
		expect( pathMatch( '/Boards/{...}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) )
			.to.eql( {
				path: {
					type: 'collection',
					value: '/Boards',
					value: 'Boards',
					selectedChild: {
						type: 'id',
						value: '123456789012345678901234'
					}
				},
				collectionPath: {
					type: 'collection' ,
					value: '/Boards',
					value: 'Boards'
				},
				subPath: {
					type: 'id',
					value: '/123456789012345678901234/Users/123456789012345678901234',
					value: '123456789012345678901234'
				}
			} ) ;
		
		expect( pathMatch( '/Boards/123456789012345678901234/Users/{...}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) )
			.to.eql( {
				path: {
					type: 'collection',
					value: '/Boards/123456789012345678901234/Users',
					value: 'Users',
					selectedChild: {
						type: 'id',
						value: '123456789012345678901234'
					}
				},
				collectionPath: {
					type: 'collection' ,
					value: '/Boards/123456789012345678901234/Users',
					value: 'Users'
				},
				subPath: {
					type: 'id',
					value: '/123456789012345678901234',
					value: '123456789012345678901234'
				}
			} ) ;
		
		expect( pathMatch( '/Boards/123456789012345678901234/{...}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) )
			.to.eql( {
				path: {
					type: 'id',
					value: '/Boards/123456789012345678901234',
					value: '123456789012345678901234',
					selectedChild: {
						type: 'collection',
						value: 'Users'
					}
				},
				collectionPath: {
					type: 'collection' ,
					value: '/Boards',
					value: 'Boards'
				},
				subPath: {
					type: 'id',
					value: '/Users/123456789012345678901234',
					value: '123456789012345678901234'
				}
			} ) ;
		
		expect( pathMatch( '/Boards/123456789012345678901234/Users/123456789012345678901234/{...}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) )
			.to.eql( {
				path: {
					type: 'id',
					value: '/Boards/123456789012345678901234/Users/123456789012345678901234',
					value: '123456789012345678901234'
				} ,
				collectionPath: {
					type: 'collection' ,
					value: '/Boards/123456789012345678901234/Users',
					value: 'Users'
				},
			} ) ;
		
		expect( pathMatch( '/Boards/123456789012345678901234/Users/123456789012345678901234/{...}' , '/Boards/123456789012345678901234/Users' ) ).not.to.be.ok() ;
	} ) ;
	
	it( "Pattern matching with the '{...}' wildcard at the begining of the pattern" , function() {
		expect( pathMatch( '{...}/Users/{id}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) )
			.to.eql( {
				path: {
					type: null,
					value: '/',
					value: null,
					selectedChild: {
						type: 'collection',
						value: 'Boards'
					}
				},
				collectionPath: null ,
				subPath: {
					type: 'id',
					value: '/Boards/123456789012345678901234',
					value: '123456789012345678901234'
				} ,
				endPath: {
					type: 'id',
					value: '/Users/123456789012345678901234',
					value: '123456789012345678901234'
				}
			} ) ;
		
		expect( pathMatch( '{...}/Users/{id}' , '/Users/123456789012345678901234' ) )
			.to.eql( {
				path: {
					type: null,
					value: '/',
					value: null,
					selectedChild: {
						type: 'collection',
						value: 'Users'
					}
				},
				collectionPath: null ,
				endPath: {
					type: 'id',
					value: '/Users/123456789012345678901234',
					value: '123456789012345678901234'
				}
			} ) ;
	} ) ;
	
	it( "Pattern matching with the '{...}' wildcard at the middle of the pattern" , function() {
		expect( pathMatch( '/Blogs/{id}/{...}/Comments/{id}' , '/Blogs/123456789012345678901234/Articles/123456789012345678901234/Comments/123456789012345678901234' ) )
			.to.eql( {
				path: {
					type: 'id',
					value: '/Blogs/123456789012345678901234',
					value: '123456789012345678901234',
					selectedChild: {
						type: 'collection',
						value: 'Articles'
					}
				},
				collectionPath: {
					value: 'Blogs',
					type: 'collection',
					value: '/Blogs'
				} ,
				subPath: {
					type: 'id',
					value: '/Articles/123456789012345678901234',
					value: '123456789012345678901234'
				} ,
				endPath: {
					type: 'id',
					value: '/Comments/123456789012345678901234',
					value: '123456789012345678901234'
				}
			} ) ;
		
		expect( pathMatch( '/Blogs/{id}/{...}/Comments/{id}' , '/Blogs/123456789012345678901234/Comments/123456789012345678901234' ) )
			.to.eql( {
				path: {
					type: 'id',
					value: '/Blogs/123456789012345678901234',
					value: '123456789012345678901234',
					selectedChild: {
						type: 'collection',
						value: 'Comments'
					}
				},
				collectionPath: {
					value: 'Blogs',
					type: 'collection',
					value: '/Blogs'
				} ,
				endPath: {
					type: 'id',
					value: '/Comments/123456789012345678901234',
					value: '123456789012345678901234'
				}
			} ) ;
	} ) ;
	
	it( "Pattern matching with the '{id}' wildcard" , function() {
		expect( pathMatch( '/Boards/{id}' , '/Boards/123456789012345678901234' ) ).to.eql( {
			path: {
				type: 'id',
				value: '/Boards/123456789012345678901234',
				value: '123456789012345678901234'
			},
			collectionPath: {
				type: 'collection' ,
				value: '/Boards',
				value: 'Boards'
			}
		} ) ;
		expect( pathMatch( '/Boards/{id}' , '/Boards/slug' ) ).not.to.be.ok() ;
		expect( pathMatch( '/Boards/{id}/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).to.eql( {
			path: {
				type: 'id',
				value: '/Boards/123456789012345678901234/Users/123456789012345678901234',
				value: '123456789012345678901234'
			},
			collectionPath: {
				type: 'collection' ,
				value: '/Boards/123456789012345678901234/Users',
				value: 'Users'
			}
		} ) ;
		expect( pathMatch( '/Boards/{id}/Users/{id}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).to.eql( {
			path: {
				type: 'id',
				value: '/Boards/123456789012345678901234/Users/123456789012345678901234',
				value: '123456789012345678901234'
			},
			collectionPath: {
				type: 'collection' ,
				value: '/Boards/123456789012345678901234/Users',
				value: 'Users'
			}
		} ) ;
		expect( pathMatch( '/Boards/123456789012345678901234/{id}/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
		expect( pathMatch( '/{id}/123456789012345678901234/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
	} ) ;
	
	it( "Pattern matching with the '{slugId}' wildcard" , function() {
		expect( pathMatch( '/Boards/{slugId}' , '/Boards/123456789012345678901234' ) ).not.to.be.ok() ;
		expect( pathMatch( '/Boards/{slugId}' , '/Boards/some-slug' ) ).to.eql( {
			path: {
				type: 'slugId',
				value: '/Boards/some-slug',
				value: 'some-slug'
			},
			collectionPath: {
				type: 'collection' ,
				value: '/Boards',
				value: 'Boards'
			}
		} ) ;
		expect( pathMatch( '/Boards/{slugId}/Users/123456789012345678901234' , '/Boards/my-boards/Users/123456789012345678901234' ) ).to.eql( {
			path: {
				type: 'id',
				value: '/Boards/my-boards/Users/123456789012345678901234',
				value: '123456789012345678901234'
			},
			collectionPath: {
				type: 'collection' ,
				value: '/Boards/my-boards/Users',
				value: 'Users'
			}
		} ) ;
		expect( pathMatch( '/Boards/{slugId}/Users/{slugId}' , '/Boards/my-boards/Users/bob' ) ).to.eql( {
			path: {
				type: 'slugId',
				value: '/Boards/my-boards/Users/bob',
				value: 'bob'
			},
			collectionPath: {
				type: 'collection' ,
				value: '/Boards/my-boards/Users',
				value: 'Users'
			}
		} ) ;
		expect( pathMatch( '/Boards/123456789012345678901234/{slugId}/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
	} ) ;
	
	it( "Pattern matching with the '{document}' wildcard" , function() {
		expect( pathMatch( '/Boards/{document}' , '/Boards/123456789012345678901234' ) ).to.eql( {
			path: {
				type: 'id',
				value: '/Boards/123456789012345678901234',
				value: '123456789012345678901234'
			},
			collectionPath: {
				type: 'collection' ,
				value: '/Boards',
				value: 'Boards'
			}
		} ) ;
		expect( pathMatch( '/Boards/{document}' , '/Boards/slug' ) ).to.eql( {
			path: {
				type: 'slugId',
				value: '/Boards/slug',
				value: 'slug'
			},
			collectionPath: {
				type: 'collection' ,
				value: '/Boards',
				value: 'Boards'
			}
		} ) ;
	} ) ;
	
	it( "Pattern matching with the '{collection}' wildcard" , function() {
		expect( pathMatch( '/Boards/123456789012345678901234/{collection}/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).to.eql( {
			path: {
				type: 'id',
				value: '/Boards/123456789012345678901234/Users/123456789012345678901234',
				value: '123456789012345678901234'
			},
			collectionPath: {
				type: 'collection' ,
				value: '/Boards/123456789012345678901234/Users',
				value: 'Users'
			}
		} ) ;
		expect( pathMatch( '/{collection}/123456789012345678901234/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).to.eql( {
			path: {
				type: 'id',
				value: '/Boards/123456789012345678901234/Users/123456789012345678901234',
				value: '123456789012345678901234'
			},
			collectionPath: {
				type: 'collection' ,
				value: '/Boards/123456789012345678901234/Users',
				value: 'Users'
			}
		} ) ;
		expect( pathMatch( '/{collection}/123456789012345678901234/{collection}/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).to.eql( {
			path: {
				type: 'id',
				value: '/Boards/123456789012345678901234/Users/123456789012345678901234',
				value: '123456789012345678901234'
			},
			collectionPath: {
				type: 'collection' ,
				value: '/Boards/123456789012345678901234/Users',
				value: 'Users'
			}
		} ) ;
		expect( pathMatch( '/Boards/{collection}/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
		expect( pathMatch( '/Boards/{collection}/Users/{collection}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
	} ) ;
} ) ;

	

describe( "Full path parsing" , function() {
	
	var parse = restQuery.path.fullPathParse ;
	
	it( "should parse a full URL path, returning an array of node" , function() {
		expect( parse( '/' ) ).to.eql( { path: [] } ) ;
		expect( parse( '/Users' ) ).to.eql( { path: [ { type: 'collection' , isCollection: true , isDocument: false , identifier: 'users' , value: 'Users' } ] } ) ;
		expect( parse( '/Users/51d18492541d2e3614ca2a80' ) ).to.eql( {
			path: [
				{ type: 'collection' , isCollection: true , isDocument: false , identifier: 'users' , value: 'Users' } ,
				{ type: 'id' , isCollection: false , isDocument: true , identifier: '51d18492541d2e3614ca2a80' , value: '51d18492541d2e3614ca2a80' }
			]
		} ) ;
		expect( parse( '/Users/51d18492541d2e3614ca2a80#edit' ) ).to.eql( {
			path: [
				{ type: 'collection' , isCollection: true , isDocument: false , identifier: 'users' , value: 'Users' } ,
				{ type: 'id' , isCollection: false , isDocument: true , identifier: '51d18492541d2e3614ca2a80' , value: '51d18492541d2e3614ca2a80' }
			] ,
			fragment: 'edit'
		} ) ;
		expect( parse( '/Users/51d18492541d2e3614ca2a80?filter=name' ) ).to.eql( {
			path: [
				{ type: 'collection' , isCollection: true , isDocument: false , identifier: 'users' , value: 'Users' } ,
				{ type: 'id' , isCollection: false , isDocument: true , identifier: '51d18492541d2e3614ca2a80' , value: '51d18492541d2e3614ca2a80' }
			] ,
			query: 'filter=name'
		} ) ;
		expect( parse( '/Users/51d18492541d2e3614ca2a80?filter=name#edit' ) ).to.eql( {
			path: [
				{ type: 'collection' , isCollection: true , isDocument: false , identifier: 'users' , value: 'Users' } ,
				{ type: 'id' , isCollection: false , isDocument: true , identifier: '51d18492541d2e3614ca2a80' , value: '51d18492541d2e3614ca2a80' }
			] ,
			query: 'filter=name',
			fragment: 'edit'
		} ) ;
		
		// /!\ more test are needed, but no time for that now /!\
	} ) ;
} ) ;



describe( "Full path pattern matching" , function() {
	
	var pathMatch = restQuery.path.fullPathMatch ;
	
	it( "Basic pattern matching" , function() {
		expect( pathMatch( '/' , '/' ) ).to.be.ok() ;
		expect( pathMatch( '/#edit' , '/' ) ).not.to.be.ok() ;
		expect( pathMatch( '/' , '/#edit' ) ).to.be.ok() ;
		expect( pathMatch( '/#edit' , '/#edit' ) ).to.be.ok() ;
		expect( pathMatch( '/#edit' , '/#ed' ) ).not.to.be.ok() ;
		expect( pathMatch( '/#ed' , '/#edit' ) ).not.to.be.ok() ;
		
		expect( pathMatch( '/Users' , '/' ) ).not.to.be.ok() ;
		expect( pathMatch( '/Users#edit' , '/#edit' ) ).not.to.be.ok() ;
		expect( pathMatch( '/' , '/Users' ) ).not.to.be.ok() ;
		expect( pathMatch( '/#edit' , '/Users#edit' ) ).not.to.be.ok() ;
		
		expect( pathMatch( '/Users' , '/Users' ) ).to.be.ok() ;
		expect( pathMatch( '/Users#edit' , '/Users#edit' ) ).to.be.ok() ;
		expect( pathMatch( '/Users#ed' , '/Users#edit' ) ).not.to.be.ok() ;
		expect( pathMatch( '/Users#edit' , '/Users#ed' ) ).not.to.be.ok() ;
		expect( pathMatch( '/Users#edit' , '/Users' ) ).not.to.be.ok() ;
		expect( pathMatch( '/Users' , '/Users#edit' ) ).to.be.ok() ;
		
		expect( pathMatch( '/Users/123456789012345678901234' , '/Users/123456789012345678901234' ) ).to.eql( {
			path: {
				type: 'id',
				value: '/Users/123456789012345678901234' ,
				value: '123456789012345678901234'
			},
			collectionPath: {
				type: 'collection' ,
				value: '/Users' ,
				value: 'Users'
			}
		} ) ;
		
		expect( pathMatch( '/Users/123456789012345678901234#edit' , '/Users/123456789012345678901234#edit' ) ).to.eql( {
			path: {
				type: 'id',
				value: '/Users/123456789012345678901234' ,
				value: '123456789012345678901234'
			},
			collectionPath: {
				type: 'collection' ,
				value: '/Users' ,
				value: 'Users'
			} ,
			fragment: 'edit'
		} ) ;
		
		expect( pathMatch( '/Users/123456789012345678901234#edit' , '/Users/123456789012345678901234' ) ).not.to.be.ok() ;
		expect( pathMatch( '/Users/123456789012345678901234' , '/Users/123456789012345678901234#edit' ) ).to.be.ok() ;
	} ) ;
	
	it( "Complex pattern matching" , function() {
		expect( pathMatch( '/Boards/123456789012345678901234/{collection}/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).to.eql( {
			path: {
				type: 'id',
				value: '/Boards/123456789012345678901234/Users/123456789012345678901234',
				value: '123456789012345678901234'
			},
			collectionPath: {
				type: 'collection' ,
				value: '/Boards/123456789012345678901234/Users',
				value: 'Users'
			}
		} ) ;
		
		expect( pathMatch( '/Boards/123456789012345678901234/{collection}/123456789012345678901234#edit' , '/Boards/123456789012345678901234/Users/123456789012345678901234#edit' ) ).to.eql( {
			path: {
				type: 'id',
				value: '/Boards/123456789012345678901234/Users/123456789012345678901234',
				value: '123456789012345678901234'
			},
			collectionPath: {
				type: 'collection' ,
				value: '/Boards/123456789012345678901234/Users',
				value: 'Users'
			},
			fragment: 'edit'
		} ) ;
		
		expect( pathMatch( '/Boards/123456789012345678901234/{collection}/123456789012345678901234#edit' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
		expect( pathMatch( '/Boards/123456789012345678901234/{collection}/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234#edit' ) ).to.be.ok() ;
		
		// /!\ more test are needed, but no time for that now /!\
	} ) ;
} ) ;


