/*
	Rest Query (shared lib)

	Copyright (c) 2014 - 2020 Cédric Ronvel

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

/* global describe, it, expect */

"use strict" ;



const restQuery = require( '..' ) ;
//const stream = require( 'stream' ) ;
const unicode = require( 'string-kit/lib/unicode.js' ) ;



describe( "Path's node parsing" , () => {

	var parsePathNode = function parsePathNode( str ) {
		try {
			return restQuery.path.parseNode( str ) ;
		}
		catch ( error ) {
			return error ;
		}
	} ;

	it( "should parse a valid collection node as an collection's child of the current object" , () => {
		expect( parsePathNode( 'Users' ) ).to.equal( {
			type: 'collection' , isCollection: true , isDocument: false , identifier: 'users' , value: 'Users'
		} ) ;
		expect( parsePathNode( 'U' ) ).to.equal( {
			type: 'collection' , isCollection: true , isDocument: false , identifier: 'u' , value: 'U'
		} ) ;
	} ) ;

	it( "should parse a valid method node as a method" , () => {
		expect( parsePathNode( 'REGENERATE-TOKEN' ) ).to.equal( {
			type: 'method' , isCollection: false , isDocument: false , identifier: 'regenerateToken' , value: 'REGENERATE-TOKEN'
		} ) ;
		expect( parsePathNode( 'FILE' ) ).to.equal( {
			type: 'method' , isCollection: false , isDocument: false , identifier: 'file' , value: 'FILE'
		} ) ;
	} ) ;

	it( "should parse a valid offset node as an offset" , () => {
		expect( parsePathNode( '1258' ) ).to.equal( {
			type: 'offset' , isCollection: false , isDocument: true , identifier: 1258 , value: '1258'
		} ) ;
		expect( parsePathNode( '01258' ) ).to.equal( {
			type: 'offset' , isCollection: false , isDocument: true , identifier: 1258 , value: '01258'
		} ) ;
		expect( parsePathNode( '0' ) ).to.equal( {
			type: 'offset' , isCollection: false , isDocument: true , identifier: 0 , value: '0'
		} ) ;
		expect( parsePathNode( '000' ) ).to.equal( {
			type: 'offset' , isCollection: false , isDocument: true , identifier: 0 , value: '000'
		} ) ;

		// Invalid entries
		expect( parsePathNode( '000b' ).type ).not.to.be( 'offset' ) ;
	} ) ;

	it( "should parse a valid range node as a range" , () => {
		expect( parsePathNode( '0-100' ) ).to.equal( {
			type: 'range' , isCollection: true , isDocument: false , min: 0 , max: 100 , value: '0-100'
		} ) ;
		expect( parsePathNode( '156-345' ) ).to.equal( {
			type: 'range' , isCollection: true , isDocument: false , min: 156 , max: 345 , value: '156-345'
		} ) ;

		// Invalid entries
		expect( parsePathNode( '12-13-15' ).type ).not.to.be( 'range' ) ;
	} ) ;

	it( "should parse a valid ID node as an ID" , () => {
		expect( parsePathNode( '51d18492541d2e3614ca2a80' ) ).to.equal( {
			type: 'id' , isCollection: false , isDocument: true , identifier: '51d18492541d2e3614ca2a80' , value: '51d18492541d2e3614ca2a80'
		} ) ;
		expect( parsePathNode( 'a1d18492541d2e3614ca2a80' ) ).to.equal( {
			type: 'id' , isCollection: false , isDocument: true , identifier: 'a1d18492541d2e3614ca2a80' , value: 'a1d18492541d2e3614ca2a80'
		} ) ;
		expect( parsePathNode( 'aaaaaaaaaaaaaaaaaaaaaaaa' ) ).to.equal( {
			type: 'id' , isCollection: false , isDocument: true , identifier: 'aaaaaaaaaaaaaaaaaaaaaaaa' , value: 'aaaaaaaaaaaaaaaaaaaaaaaa'
		} ) ;
		expect( parsePathNode( '111111111111111111111111' ) ).to.equal( {
			type: 'id' , isCollection: false , isDocument: true , identifier: '111111111111111111111111' , value: '111111111111111111111111'
		} ) ;

		// Invalid entries
		expect( parsePathNode( '51d18492541d2e3614ca2a8' ).type ).not.to.be( 'id' ) ;
		expect( parsePathNode( '51d18492541d2e3614ca2a80a' ).type ).not.to.be( 'id' ) ;
		expect( parsePathNode( '51d18492541h2e3614ca2a80' ).type ).not.to.be( 'id' ) ;
	} ) ;

	it( "should parse a valid slugId node as a slugId" , () => {
		expect( parsePathNode( 'abc' ) ).to.equal( {
			type: 'slugId' , unicode: false ,isCollection: false , isDocument: true , identifier: 'abc' , value: 'abc'
		} ) ;
		expect( parsePathNode( 'cronvel' ) ).to.equal( {
			type: 'slugId' , unicode: false ,isCollection: false , isDocument: true , identifier: 'cronvel' , value: 'cronvel'
		} ) ;
		expect( parsePathNode( 'c20nv31' ) ).to.equal( {
			type: 'slugId' , unicode: false ,isCollection: false , isDocument: true , identifier: 'c20nv31' , value: 'c20nv31'
		} ) ;
		expect( parsePathNode( 'my-blog-entry' ) ).to.equal( {
			type: 'slugId' , unicode: false ,isCollection: false , isDocument: true , identifier: 'my-blog-entry' , value: 'my-blog-entry'
		} ) ;
		expect( parsePathNode( 'a-24-characters-long-sid' ) ).to.equal( {
			type: 'slugId' , unicode: false ,isCollection: false , isDocument: true , identifier: 'a-24-characters-long-sid' , value: 'a-24-characters-long-sid'
		} ) ;
		expect( parsePathNode( 'agaaaaaaaaaaaaaaaaaaaaaa' ) ).to.equal( {
			type: 'slugId' , unicode: false ,isCollection: false , isDocument: true , identifier: 'agaaaaaaaaaaaaaaaaaaaaaa' , value: 'agaaaaaaaaaaaaaaaaaaaaaa'
		} ) ;
		expect( parsePathNode( '01b' ) ).to.equal( {
			type: 'slugId' , unicode: false ,isCollection: false , isDocument: true , identifier: '01b' , value: '01b'
		} ) ;
		expect( parsePathNode( 'azekjsdlmfjqmsljdfmklqsdlmfjslmfvqsdmljfgqsdjgmklhsdmhqgfqsdlmghlmkdhfga' ) ).to.equal( {
			type: 'slugId' , unicode: false ,isCollection: false , isDocument: true , identifier: 'azekjsdlmfjqmsljdfmklqsdlmfjslmfvqsdmljfgqsdjgmklhsdmhqgfqsdlmghlmkdhfga' , value: 'azekjsdlmfjqmsljdfmklqsdlmfjslmfvqsdmljfgqsdjgmklhsdmhqgfqsdlmghlmkdhfga'
		} ) ;
		expect( parsePathNode( 'aa' ) ).to.equal( {
			type: 'slugId' , unicode: false ,isCollection: false , isDocument: true , identifier: 'aa' , value: 'aa'
		} ) ;

		// Invalid entries
		expect( parsePathNode( 'afaaaaaaaaaaaaaaaaaaaaaa' ).type ).not.to.be( 'slugId' ) ;
		expect( parsePathNode( 'a' ) ).to.be.an( Error ) ;
		expect( parsePathNode( 'my-Blog-entry' ) ).to.be.an( Error ) ;
		expect( parsePathNode( 'My-blog-entry' ) ).to.be.an( Error ) ;
		expect( parsePathNode( 'azekjsdlmfjqmsljdfmklqsdlmfjslmfvqsdmljfgqsdjgmklhsdmhqgfqsdlmghlmkdhfgaz' ) ).to.be.an( Error ) ;
	} ) ;

	it( "should parse a valid unicode slugId node as a slugId" , () => {
		var arabic , arabicHyphen ;
		arabic = 'عِنْدَمَا ذَهَبْتُ إِلَى ٱلْمَكْتَبَةِ' ;
		arabicHyphen = arabic.replace( / /g , '-' ) ;
		//console.log( arabicHyphen ) ;
		expect( parsePathNode( arabicHyphen ) ).to.equal( {
			type: 'slugId' , unicode: true ,isCollection: false , isDocument: true , identifier: arabicHyphen , value: arabicHyphen
		} ) ;
		
		// Warning: arabic diacritics count as one char, unlike french diacritics which are composed with the letter,
		// so we can hit the 72-chars limit faster.
		// The first has 77 chars because it has all the vowels (uncommon), the last has 47 chars, using the more common spelling.
		//arabic = 'كُنْتُ أُرِيدُ أَنْ أَقْرَأَ كِتَابًا عَنْ تَارِيخِ ٱلْمَرْأَةِ فِي فَرَنْسَا' ;
		arabic = 'كنت أريد أن أقرأ كتابا عن تاريخ المرأة في فرنسا' ;
		arabicHyphen = arabic.replace( / /g , '-' ) ;
		//console.log( arabicHyphen , arabicHyphen.length , unicode.length( arabicHyphen ) ) ;
		//var array = unicode.toArray( arabicHyphen ) ; console.log( array.length , array ) ;
		expect( parsePathNode( arabicHyphen ) ).to.equal( {
			type: 'slugId' , unicode: true ,isCollection: false , isDocument: true , identifier: arabicHyphen , value: arabicHyphen
		} ) ;
	} ) ;

	it( "should parse a valid property node as a property of the current object" , () => {
		expect( parsePathNode( '.bob' ) ).to.equal( {
			type: 'property' , isCollection: false , isDocument: true , identifier: 'bob' , value: '.bob'
		} ) ;
		expect( parsePathNode( '.name' ) ).to.equal( {
			type: 'property' , isCollection: false , isDocument: true , identifier: 'name' , value: '.name'
		} ) ;
		expect( parsePathNode( '.n' ) ).to.equal( {
			type: 'property' , isCollection: false , isDocument: true , identifier: 'n' , value: '.n'
		} ) ;
		expect( parsePathNode( '.embedded.data' ) ).to.equal( {
			type: 'property' , isCollection: false , isDocument: true , identifier: 'embedded.data' , value: '.embedded.data'
		} ) ;

		// Invalid entries
		expect( parsePathNode( '.' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '.embedded..data' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '.name.' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '.name..' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '..name' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '.embedded.data.' ) ).to.be.an( Error ) ;
	} ) ;

	it( "should parse a valid link property node as a link property of the current object" , () => {
		expect( parsePathNode( '~name' ) ).to.equal( {
			type: 'linkProperty' , isCollection: false , isDocument: true , identifier: 'name' , value: '~name'
		} ) ;
		expect( parsePathNode( '~n' ) ).to.equal( {
			type: 'linkProperty' , isCollection: false , isDocument: true , identifier: 'n' , value: '~n'
		} ) ;
		expect( parsePathNode( '~embedded.data' ) ).to.equal( {
			type: 'linkProperty' , isCollection: false , isDocument: true , identifier: 'embedded.data' , value: '~embedded.data'
		} ) ;

		// Invalid entries
		expect( parsePathNode( '~' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~.' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~embedded..data' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~name.' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~name..' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~.name' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~embedded.data.' ) ).to.be.an( Error ) ;
	} ) ;

	it( "should parse a valid multi-link property node as a multi-link property of the current object" , () => {
		expect( parsePathNode( '~~name' ) ).to.equal( {
			type: 'multiLinkProperty' , isCollection: true , isDocument: false , identifier: 'name' , value: '~~name'
		} ) ;
		expect( parsePathNode( '~~n' ) ).to.equal( {
			type: 'multiLinkProperty' , isCollection: true , isDocument: false , identifier: 'n' , value: '~~n'
		} ) ;

		// Invalid entries
		expect( parsePathNode( '~~' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~~.' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~~embedded.data' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~~name.' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~~name..' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~~.name' ) ).to.be.an( Error ) ;
		expect( parsePathNode( '~~embedded.data.' ) ).to.be.an( Error ) ;
	} ) ;

	it( "edge cases" , () => {
		expect( parsePathNode( 'U-' ) ).to.equal( {
			type: 'method' , isCollection: false , isDocument: false , identifier: 'u' , value: 'U-'
		} ) ;
		expect( parsePathNode( 'U---' ) ).to.equal( {
			type: 'method' , isCollection: false , isDocument: false , identifier: 'u' , value: 'U---'
		} ) ;
		expect( parsePathNode( '-U' ) ).to.be.an( Error ) ;
	} ) ;
} ) ;



describe( "Path parsing" , () => {

	var parse = restQuery.path.parse ;

	it( "should parse a full URL path, returning an array of node" , () => {
		expect( parse( '/' ) ).to.equal( [] ) ;
		expect( parse( '/Users' ) ).to.equal( [ {
			type: 'collection' , isCollection: true , isDocument: false , identifier: 'users' , value: 'Users'
		} ] ) ;
		expect( parse( '/Users/51d18492541d2e3614ca2a80' ) ).to.equal( [
			{
				type: 'collection' , isCollection: true , isDocument: false , identifier: 'users' , value: 'Users'
			} ,
			{
				type: 'id' , isCollection: false , isDocument: true , identifier: '51d18492541d2e3614ca2a80' , value: '51d18492541d2e3614ca2a80'
			}
		] ) ;

		// /!\ more test are needed, but no time for that now /!\
	} ) ;

	it( "a parsed path array, when transformed to a string, should be the original path string" , () => {
		expect( parse( '/Users/51d18492541d2e3614ca2a80' ).toString() ).to.be( '/Users/51d18492541d2e3614ca2a80' ) ;
	} ) ;
} ) ;



describe( "Path pattern matching" , () => {

	var pathMatch = restQuery.path.match ;

	it( "Basic pattern matching" , () => {
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
		expect( matches ).to.equal( { "full": [ {
			"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
		} , {
			"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
		} ] ,
		"users": {
			"match": [ {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} ] ,
			"before": [] ,
			"after": [ {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"upto": [ {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} ] ,
			"onward": [ {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ]
		} ,
		"usersDocument": {
			"match": [ {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"before": [ {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} ] ,
			"after": [] ,
			"upto": [ {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"onward": [ {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ]
		} } ) ;
		expect( matches.primaryPath ).to.be( matches.full ) ;
		expect( matches.users.upto.toString() ).to.be( '/Users' ) ;
		expect( matches.usersDocument.upto.toString() ).to.be( '/Users/123456789012345678901234' ) ;
		expect( matches.usersDocument.match.toString() ).to.be( '/123456789012345678901234' ) ;
		expect( matches.usersDocument.match[ 0 ].value ).to.be( '123456789012345678901234' ) ;

		expect( pathMatch( '/Users/12345678901234567890123a' , '/Users/123456789012345678901234' ) ).not.to.be.ok() ;

		matches = pathMatch( '/Boards/123456789012345678901234/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} , {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"boards": {
				"match": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"onward": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"boardsDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"users": {
				"match": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"onward": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"usersDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			}
		} ) ;
		expect( matches.primaryPath ).to.be( matches.full ) ;
		expect( matches.boards.upto.toString() ).to.be( '/Boards' ) ;
		expect( matches.boardsDocument.upto.toString() ).to.be( '/Boards/123456789012345678901234' ) ;
		expect( matches.users.upto.toString() ).to.be( '/Boards/123456789012345678901234/Users' ) ;
		expect( matches.usersDocument.upto.toString() ).to.be( '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		expect( matches.users.onward.toString() ).to.be( '/Users/123456789012345678901234' ) ;

		expect( pathMatch( '/Boards/12345678901234567890123a/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
	} ) ;

	it( "Pattern matching with the '{*}' wildcard" , () => {
		var matches ;

		matches = pathMatch( '/Boards/{*}' , '/Boards/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '  ' ) ) ;
		expect( matches ).to.equal( { "full": [ {
			"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
		} , {
			"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
		} ] ,
		"boards": {
			"match": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} ] ,
			"before": [] ,
			"after": [ {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"upto": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} ] ,
			"onward": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ]
		} ,
		"wild": {
			"match": [ {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"before": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} ] ,
			"after": [] ,
			"upto": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"onward": [ {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ]
		} } ) ;
		expect( matches.primaryPath ).to.be( matches.full ) ;
		expect( matches.wild.toString() ).to.be( '/123456789012345678901234' ) ;
		expect( matches.wild.match.toString() ).to.be( '/123456789012345678901234' ) ;
		expect( matches.wild.upto.toString() ).to.be( '/Boards/123456789012345678901234' ) ;

		expect( pathMatch( '/Boards/{*}' , '/Boards/slug' ) ).to.be.ok() ;

		matches = pathMatch( '/Boards/{*}/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '  ' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} , {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"boards": {
				"match": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"onward": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"wild": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"users": {
				"match": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"onward": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"usersDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			}
		} ) ;


		matches = pathMatch( '/Boards/{*}/Users/{*}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '  ' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} , {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"boards": {
				"match": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"onward": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"users": {
				"match": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"onward": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"wild1": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"wild2": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			}
		} ) ;
		expect( matches.primaryPath ).to.be( matches.full ) ;
		expect( matches.wild1.upto.toString() ).to.be( '/Boards/123456789012345678901234' ) ;
		expect( matches.wild2.upto.toString() ).to.be( '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;

		matches = pathMatch( '/Boards/123456789012345678901234/{*}/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} , {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"boards": {
				"match": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"onward": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"boardsDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"wild": {
				"match": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"onward": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			}
		} ) ;

		matches = pathMatch( '/{*}/123456789012345678901234/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '  ' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} , {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"wild": {
				"match": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"onward": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"users": {
				"match": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"onward": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"usersDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			}
		} ) ;
	} ) ;

	it( "Pattern matching with the '{id}' wildcard" , () => {
		var matches ;

		matches = pathMatch( '/Boards/{id}' , '/Boards/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"boards": {
				"match": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"onward": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"wildId": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"boardsDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			}
		} ) ;
		expect( matches.primaryPath ).to.be( matches.full ) ;
		expect( matches.wildId.toString() ).to.be( '/123456789012345678901234' ) ;
		expect( matches.wildId.match.toString() ).to.be( '/123456789012345678901234' ) ;
		expect( matches.wildId.upto.toString() ).to.be( '/Boards/123456789012345678901234' ) ;
		expect( matches.wildId ).to.equal( matches.boardsDocument ) ;

		expect( pathMatch( '/Boards/{id}' , '/Boards/slug' ) ).not.to.be.ok() ;

		matches = pathMatch( '/Boards/{id}/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} , {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"boards": {
				"match": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"onward": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"wildId": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"boardsDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"users": {
				"match": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"onward": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"usersDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			}
		} ) ;
		expect( matches.primaryPath ).to.be( matches.full ) ;


		matches = pathMatch( '/Boards/{id}/Users/{id}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} , {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"boards": {
				"match": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"onward": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"boardsDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"users": {
				"match": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"onward": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"wildId1": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"wildId2": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"usersDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			}
		} ) ;
		expect( matches.primaryPath ).to.be( matches.full ) ;
		expect( matches.wildId1.upto.toString() ).to.be( '/Boards/123456789012345678901234' ) ;
		expect( matches.wildId2.upto.toString() ).to.be( '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		expect( matches.wildId1 ).to.equal( matches.boardsDocument ) ;
		expect( matches.wildId2 ).to.equal( matches.usersDocument ) ;

		expect( pathMatch( '/Boards/123456789012345678901234/{id}/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
		expect( pathMatch( '/{id}/123456789012345678901234/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
	} ) ;

	it( "Pattern matching with the '{slugId}' wildcard" , () => {
		var matches ;

		expect( pathMatch( '/Boards/{slugId}' , '/Boards/123456789012345678901234' ) ).not.to.be.ok() ;

		matches = pathMatch( '/Boards/{slugId}' , '/Boards/slug' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
			} ] ,
			"boards": {
				"match": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"onward": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			} ,
			"wildSlugId": {
				"match": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"onward": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			} ,
			"boardsDocument": {
				"match": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"onward": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			}
		} ) ;
		expect( matches.primaryPath ).to.be( matches.full ) ;
		expect( matches.wildSlugId.toString() ).to.be( '/slug' ) ;
		expect( matches.wildSlugId.match.toString() ).to.be( '/slug' ) ;
		expect( matches.wildSlugId.upto.toString() ).to.be( '/Boards/slug' ) ;

		matches = pathMatch( '/Boards/{slugId}/Users/slug' , '/Boards/slug/Users/slug' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
			} , {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
			} ] ,
			"boards": {
				"match": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"onward": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			} ,
			"wildSlugId": {
				"match": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"onward": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			} ,
			"boardsDocument": {
				"match": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"onward": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			} ,
			"users": {
				"match": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"after": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"onward": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			} ,
			"usersDocument": {
				"match": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"onward": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			}
		} ) ;


		matches = pathMatch( '/Boards/{slugId}/Users/{slugId}' , '/Boards/slug/Users/slug' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
			} , {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
			} ] ,
			"boards": {
				"match": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"onward": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			} ,
			"boardsDocument": {
				"match": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"onward": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			} ,
			"users": {
				"match": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"after": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"onward": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			} ,
			"wildSlugId1": {
				"match": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"onward": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			} ,
			"wildSlugId2": {
				"match": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"onward": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			} ,
			"usersDocument": {
				"match": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"onward": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			}
		} ) ;
		expect( matches.wildSlugId1.upto.toString() ).to.be( '/Boards/slug' ) ;
		expect( matches.wildSlugId2.upto.toString() ).to.be( '/Boards/slug/Users/slug' ) ;

		expect( pathMatch( '/Boards/123456789012345678901234/{slugId}/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
		expect( pathMatch( '/{slugId}/123456789012345678901234/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
	} ) ;

	it( "Pattern matching with the '{document}' wildcard" , () => {
		var matches ;

		matches = pathMatch( '/Boards/{document}' , '/Boards/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"boards": {
				"match": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"onward": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"wildDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"boardsDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			}
		} ) ;
		expect( matches.primaryPath ).to.be( matches.full ) ;
		expect( matches.wildDocument.toString() ).to.be( '/123456789012345678901234' ) ;
		expect( matches.wildDocument.match.toString() ).to.be( '/123456789012345678901234' ) ;
		expect( matches.wildDocument.upto.toString() ).to.be( '/Boards/123456789012345678901234' ) ;

		matches = pathMatch( '/Boards/{document}' , '/Boards/slug' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
			} ] ,
			"boards": {
				"match": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"onward": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			} ,
			"wildDocument": {
				"match": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"onward": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			} ,
			"boardsDocument": {
				"match": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"onward": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			}
		} ) ;
		expect( matches.wildDocument.toString() ).to.be( '/slug' ) ;
		expect( matches.wildDocument.match.toString() ).to.be( '/slug' ) ;
		expect( matches.wildDocument.upto.toString() ).to.be( '/Boards/slug' ) ;

		matches = pathMatch( '/Boards/{document}/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} , {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"boards": {
				"match": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"onward": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"wildDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"boardsDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"users": {
				"match": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"onward": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"usersDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			}
		} ) ;

		matches = pathMatch( '/Boards/{document}/Users/slug' , '/Boards/slug/Users/slug' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
			} , {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
			} ] ,
			"boards": {
				"match": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"onward": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			} ,
			"wildDocument": {
				"match": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"onward": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			} ,
			"boardsDocument": {
				"match": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"onward": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			} ,
			"users": {
				"match": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"after": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"onward": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			} ,
			"usersDocument": {
				"match": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"onward": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			}
		} ) ;


		matches = pathMatch( '/Boards/{document}/Users/{document}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} , {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"boards": {
				"match": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"onward": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"boardsDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"users": {
				"match": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"onward": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"wildDocument1": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"wildDocument2": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"usersDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			}
		} ) ;
		expect( matches.wildDocument1.upto.toString() ).to.be( '/Boards/123456789012345678901234' ) ;
		expect( matches.wildDocument2.upto.toString() ).to.be( '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;

		matches = pathMatch( '/Boards/{document}/Users/{document}' , '/Boards/slug/Users/slug' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
			} , {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
			} ] ,
			"boards": {
				"match": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"onward": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			} ,
			"boardsDocument": {
				"match": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"onward": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			} ,
			"users": {
				"match": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"after": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"onward": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			} ,
			"wildDocument1": {
				"match": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"onward": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			} ,
			"wildDocument2": {
				"match": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"onward": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			} ,
			"usersDocument": {
				"match": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ] ,
				"onward": [ {
					"value": "slug" , "isDocument": true , "isCollection": false , "type": "slugId" , "unicode": false , "identifier": "slug"
				} ]
			}
		} ) ;
		expect( matches.wildDocument1.upto.toString() ).to.be( '/Boards/slug' ) ;
		expect( matches.wildDocument2.upto.toString() ).to.be( '/Boards/slug/Users/slug' ) ;

		expect( pathMatch( '/Boards/123456789012345678901234/{document}/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
		expect( pathMatch( '/{document}/123456789012345678901234/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
	} ) ;

	it( "Pattern matching with the '{collection}' wildcard" , () => {
		var matches ;

		expect( pathMatch( '/Boards/{collection}' , '/Boards/123456789012345678901234' ) ).not.to.be.ok() ;

		matches = pathMatch( '/{collection}/123456789012345678901234' , '/Boards/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.equal( { "full": [ {
			"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
		} , {
			"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
		} ] ,
		"wildCollection": {
			"match": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} ] ,
			"before": [] ,
			"after": [ {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"upto": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} ] ,
			"onward": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ]
		} ,
		"wildCollectionDocument": {
			"match": [ {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"before": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} ] ,
			"after": [] ,
			"upto": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"onward": [ {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ]
		} } ) ;
		expect( matches.primaryPath ).to.be( matches.full ) ;
	} ) ;

	it( "Pattern matching with the '{...}' wildcard at the end of the pattern" , () => {
		var matches ;

		matches = pathMatch( '/Boards/{...}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.equal( { "full": [ {
			"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
		} , {
			"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
		} , {
			"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
		} , {
			"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
		} ] ,
		"boards": {
			"match": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} ] ,
			"before": [] ,
			"after": [ {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} , {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"upto": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} ] ,
			"onward": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} , {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ]
		} ,
		"subPath": {
			"match": [ {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} , {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"before": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} ] ,
			"after": [] ,
			"upto": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} , {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"onward": [ {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} , {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ]
		} } ) ;
		expect( matches.primaryPath ).to.be( matches.subPath.before ) ;
		expect( matches.subPath.toString() ).to.be( '/123456789012345678901234/Users/123456789012345678901234' ) ;
		expect( matches.subPath.before.toString() ).to.be( '/Boards' ) ;
		expect( matches.boards.toString() ).to.be( '/Boards' ) ;
		expect( matches.subPath.match[0].toString() ).to.be( '123456789012345678901234' ) ;
	} ) ;

	it( "Pattern matching with the '{...}' wildcard at the begining of the pattern" , () => {
		var matches ;

		matches = pathMatch( '/{...}/Users/{document}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} , {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"subPath": {
				"match": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"users": {
				"match": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"onward": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"wildDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"usersDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			}
		} ) ;
		expect( matches.primaryPath ).to.be( matches.subPath.before ) ;
		expect( matches.subPath.toString() ).to.be( '/Boards/123456789012345678901234' ) ;
		expect( matches.subPath.after.toString() ).to.be( '/Users/123456789012345678901234' ) ;
		expect( matches.users.toString() ).to.be( '/Users' ) ;
		expect( matches.usersDocument.toString() ).to.be( '/123456789012345678901234' ) ;
		expect( matches.usersDocument.upto.toString() ).to.be( '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		expect( matches.wildDocument.toString() ).to.be( '/123456789012345678901234' ) ;
		expect( matches.subPath.match[0].toString() ).to.be( 'Boards' ) ;
		expect( matches.subPath.match.last.toString() ).to.be( '123456789012345678901234' ) ;
	} ) ;

	it( "Pattern matching with the '{...}' wildcard at the middle of the pattern" , () => {
		var matches ;

		matches = pathMatch( '/Blogs/{id}/{...}/Comments/{id}' , '/Blogs/123456789012345678901234/Articles/123456789012345678901234/Comments/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Blogs" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "blogs"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} , {
				"value": "Articles" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "articles"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} , {
				"value": "Comments" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "comments"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"blogs": {
				"match": [ {
					"value": "Blogs" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "blogs"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Articles" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "articles"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Comments" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "comments"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Blogs" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "blogs"
				} ] ,
				"onward": [ {
					"value": "Blogs" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "blogs"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Articles" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "articles"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Comments" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "comments"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"blogsDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Blogs" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "blogs"
				} ] ,
				"after": [ {
					"value": "Articles" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "articles"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Comments" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "comments"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Blogs" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "blogs"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Articles" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "articles"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Comments" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "comments"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"subPath": {
				"match": [ {
					"value": "Articles" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "articles"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Blogs" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "blogs"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"after": [ {
					"value": "Comments" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "comments"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Blogs" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "blogs"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Articles" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "articles"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "Articles" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "articles"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Comments" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "comments"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"comments": {
				"match": [ {
					"value": "Comments" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "comments"
				} ] ,
				"before": [ {
					"value": "Blogs" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "blogs"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Articles" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "articles"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Blogs" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "blogs"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Articles" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "articles"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Comments" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "comments"
				} ] ,
				"onward": [ {
					"value": "Comments" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "comments"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"wildId1": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Blogs" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "blogs"
				} ] ,
				"after": [ {
					"value": "Articles" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "articles"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Comments" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "comments"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Blogs" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "blogs"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Articles" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "articles"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Comments" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "comments"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"wildId2": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Blogs" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "blogs"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Articles" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "articles"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Comments" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "comments"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Blogs" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "blogs"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Articles" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "articles"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Comments" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "comments"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"commentsDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Blogs" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "blogs"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Articles" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "articles"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Comments" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "comments"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Blogs" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "blogs"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Articles" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "articles"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Comments" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "comments"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			}
		} ) ;
		expect( matches.primaryPath ).to.be( matches.subPath.before ) ;
		expect( matches.subPath.toString() ).to.be( '/Articles/123456789012345678901234' ) ;
		expect( matches.subPath.upto.toString() ).to.be( '/Blogs/123456789012345678901234/Articles/123456789012345678901234' ) ;
		expect( matches.subPath.onward.toString() ).to.be( '/Articles/123456789012345678901234/Comments/123456789012345678901234' ) ;
		expect( matches.wildId1.upto.toString() ).to.be( '/Blogs/123456789012345678901234' ) ;
		expect( matches.wildId2.upto.toString() ).to.be( '/Blogs/123456789012345678901234/Articles/123456789012345678901234/Comments/123456789012345678901234' ) ;
	} ) ;

	it( "Giving custom names to matches" , () => {
		var matches ;

		matches = pathMatch( '/Users:people/123456789012345678901234' , '/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches ) ) ;
		expect( matches ).to.equal( { "full": [ {
			"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
		} , {
			"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
		} ] ,
		"people": {
			"match": [ {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} ] ,
			"before": [] ,
			"after": [ {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"upto": [ {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} ] ,
			"onward": [ {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ]
		} ,
		"peopleDocument": {
			"match": [ {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"before": [ {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} ] ,
			"after": [] ,
			"upto": [ {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"onward": [ {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ]
		} } ) ;
		expect( matches.users ).not.to.be.ok() ;
		expect( matches.people.onward.toString() ).to.be( '/Users/123456789012345678901234' ) ;
		expect( matches.peopleDocument.onward.toString() ).to.be( '/123456789012345678901234' ) ;

		matches = pathMatch( '/Users:people/{document:connectedUser}' , '/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '  ' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"people": {
				"match": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"onward": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"connectedUser": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"peopleDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			}
		} ) ;
		expect( matches.users ).not.to.be.ok() ;
		expect( matches.people.onward.toString() ).to.be( '/Users/123456789012345678901234' ) ;
		expect( matches.wildDocument ).not.to.be.ok() ;
		expect( matches.connectedUser.onward.toString() ).to.be( '/123456789012345678901234' ) ;
	} ) ;

	it( "Contextified patterns" , () => {
		var matches , context ;

		//console.log( restQuery.path.parse( '/Users/{$connectedUser}/Friends/' , true ) ) ;
		expect( pathMatch( '/Users/{$connectedUser}/Friends/' , '/Users/123456789012345678901234/Friends' , { connectedUser: '123456789012345678901237' } ) ).not.to.be.ok() ;

		matches = pathMatch( '/Users/{$connectedUser}/Friends/' , '/Users/123456789012345678901234/Friends' , { connectedUser: '123456789012345678901234' } ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} , {
				"value": "Friends" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "friends"
			} ] ,
			"users": {
				"match": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Friends" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "friends"
				} ] ,
				"upto": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"onward": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Friends" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "friends"
				} ]
			} ,
			"usersDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [ {
					"value": "Friends" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "friends"
				} ] ,
				"upto": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Friends" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "friends"
				} ]
			} ,
			"friends": {
				"match": [ {
					"value": "Friends" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "friends"
				} ] ,
				"before": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Friends" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "friends"
				} ] ,
				"onward": [ {
					"value": "Friends" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "friends"
				} ]
			}
		} ) ;

		context = pathMatch( '/Users:people/{document:connectedUser}' , '/Users/123456789012345678901234' ) ;
		expect( pathMatch( '/Users/{$connectedUser.match}/Friends/' , '/Users/123456789012345678901234/Friends' , context ) ).to.be.ok() ;
		expect( pathMatch( '/Users/{$connectedUser.match}/Friends/' , '/Users/123456789012345678901237/Friends' , context ) ).not.to.be.ok() ;

		context = pathMatch( '/Users:people/{document:connectedUser}' , '/Users/123456789012345678901234' ) ;
		expect( pathMatch( '/{$connectedUser.upto}/Friends/' , '/Users/123456789012345678901234/Friends' , context ) ).to.be.ok() ;
		expect( pathMatch( '/{$connectedUser.upto}/Friends/' , '/Users/123456789012345678901237/Friends' , context ) ).not.to.be.ok() ;
	} ) ;

	it( "Contextified patterns without the context object should throw " , () => {
		expect( () => { pathMatch( '/Users/{$connectedUser}/Friends/' , '/Users/123456789012345678901234/Friends' ) ; } ).to.throw() ;
	} ) ;

	it( "Contextified patterns referencing an unexistant key should not match, returning undefined instead of false (help debugging)" , () => {
		expect( pathMatch( '/Users/{$unexistant}/Friends/' , '/Users/123456789012345678901234/Friends' , {} ) ).to.be( undefined ) ;
	} ) ;
} ) ;



describe( "Apply context" , () => {

	var applyContext = restQuery.path.applyContext ;

	it( "Contextified path referencing an unexistant key should return false" , () => {
		expect( applyContext( '/Users/{$unexistant}/Friends' , {} ) ).to.be( false ) ;
	} ) ;

	it( "Contextified path referencing an existant key should replace it" , () => {
		expect( applyContext( '/Users/{$connectedUser}/Friends' , { connectedUser: "123456789012345678901234" } ).toString() )
			.to.be( '/Users/123456789012345678901234/Friends' ) ;
	} ) ;

	it( "Contextified path referencing a path (array) should replace it" , () => {
		expect( applyContext( '/{$connectedUser}/Friends' , { connectedUser: "/Users/123456789012345678901234" } ).toString() )
			.to.be( '/Users/123456789012345678901234/Friends' ) ;

		expect( applyContext( '/{$connectedUser}/Friends' , { connectedUser: "/Users/123456789012345678901234" } ).toString() )
			.to.be( '/Users/123456789012345678901234/Friends' ) ;

		expect( applyContext( '/{$connectedUser}/Friends' , { connectedUser: "/Users/123456789012345678901234" } ) )
			.to.equal( [ {
				value: 'Users' , isDocument: false , isCollection: true , type: 'collection' , identifier: 'users'
			} , {
				value: '123456789012345678901234' , isDocument: true , isCollection: false , type: 'id' , identifier: '123456789012345678901234'
			} , {
				value: 'Friends' , isDocument: false , isCollection: true , type: 'collection' , identifier: 'friends'
			} ] ) ;

		expect( applyContext( '/{$connectedUser}/Friends' , { connectedUser: restQuery.path.parse( "/Users/123456789012345678901234" ) } ) )
			.to.equal( [ {
				value: 'Users' , isDocument: false , isCollection: true , type: 'collection' , identifier: 'users'
			} , {
				value: '123456789012345678901234' , isDocument: true , isCollection: false , type: 'id' , identifier: '123456789012345678901234'
			} , {
				value: 'Friends' , isDocument: false , isCollection: true , type: 'collection' , identifier: 'friends'
			} ] ) ;
	} ) ;
} ) ;



describe( "Full path parsing" , () => {

	var fullPathParse = restQuery.path.fullPathParse ;

	it( "should parse a full URL path, returning an array of node" , () => {
		expect( fullPathParse( '/' ) ).to.equal( { path: [] } ) ;
		expect( fullPathParse( '/Users' ) ).to.equal( { path: [ {
			type: 'collection' , isCollection: true , isDocument: false , identifier: 'users' , value: 'Users'
		} ] } ) ;
		expect( fullPathParse( '/Users/51d18492541d2e3614ca2a80' ) ).to.equal( {
			path: [
				{
					type: 'collection' , isCollection: true , isDocument: false , identifier: 'users' , value: 'Users'
				} ,
				{
					type: 'id' , isCollection: false , isDocument: true , identifier: '51d18492541d2e3614ca2a80' , value: '51d18492541d2e3614ca2a80'
				}
			]
		} ) ;
		expect( fullPathParse( '/Users/51d18492541d2e3614ca2a80#edit' ) ).to.equal( {
			path: [
				{
					type: 'collection' , isCollection: true , isDocument: false , identifier: 'users' , value: 'Users'
				} ,
				{
					type: 'id' , isCollection: false , isDocument: true , identifier: '51d18492541d2e3614ca2a80' , value: '51d18492541d2e3614ca2a80'
				}
			] ,
			hash: { action: 'edit' }
		} ) ;
		expect( fullPathParse( '/Users/51d18492541d2e3614ca2a80?filter=name' ) ).to.equal( {
			path: [
				{
					type: 'collection' , isCollection: true , isDocument: false , identifier: 'users' , value: 'Users'
				} ,
				{
					type: 'id' , isCollection: false , isDocument: true , identifier: '51d18492541d2e3614ca2a80' , value: '51d18492541d2e3614ca2a80'
				}
			] ,
			query: 'filter=name'
		} ) ;
		expect( fullPathParse( '/Users/51d18492541d2e3614ca2a80?filter=name#edit' ) ).to.equal( {
			path: [
				{
					type: 'collection' , isCollection: true , isDocument: false , identifier: 'users' , value: 'Users'
				} ,
				{
					type: 'id' , isCollection: false , isDocument: true , identifier: '51d18492541d2e3614ca2a80' , value: '51d18492541d2e3614ca2a80'
				}
			] ,
			query: 'filter=name' ,
			hash: { action: 'edit' }
		} ) ;

		// /!\ more test are needed, but no time for that now /!\
	} ) ;

	it( "should parse a hash using the 'action:path' syntax" , () => {
		expect( fullPathParse( '/Users/51d18492541d2e3614ca2a80#edit:/Users/51d18492541d2e3614ca2a80/~~friends' ) ).to.equal( {
			path: [
				{
					type: 'collection' , isCollection: true , isDocument: false , identifier: 'users' , value: 'Users'
				} ,
				{
					type: 'id' , isCollection: false , isDocument: true , identifier: '51d18492541d2e3614ca2a80' , value: '51d18492541d2e3614ca2a80'
				}
			] ,
			hash: {
				action: 'edit' ,
				path: [
					{
						type: 'collection' , isCollection: true , isDocument: false , identifier: 'users' , value: 'Users'
					} ,
					{
						type: 'id' , isCollection: false , isDocument: true , identifier: '51d18492541d2e3614ca2a80' , value: '51d18492541d2e3614ca2a80'
					} ,
					{
						type: 'multiLinkProperty' , isCollection: true , isDocument: false , identifier: 'friends' , value: '~~friends'
					}
				]
			}
		} ) ;
	} ) ;

	it( "hash present but empty should be like no hash at all" , () => {
		//console.log( fullPathParse( '/Users#' ) ) ;
		expect( fullPathParse( '/Users#' ) ).to.equal( {
			path: [
				{
					value: 'Users' , isDocument: false , isCollection: true , type: 'collection' , identifier: 'users'
				}
			]
		} ) ;
	} ) ;
} ) ;



describe( "Full path pattern matching" , () => {

	var fullPathMatch = restQuery.path.fullPathMatch ;
	var fullPathParse = restQuery.path.fullPathParse ;

	it( "Basic pattern matching" , () => {
		var matches ;

		expect( fullPathMatch( '/' , '/' ) ).to.be.ok() ;
		expect( fullPathMatch( '/#edit' , '/' ) ).not.to.be.ok() ;
		expect( fullPathMatch( '/' , '/#edit' ) ).to.be.ok() ;
		expect( fullPathMatch( '/#edit' , '/#edit' ) ).to.be.ok() ;
		expect( fullPathMatch( '/#edit' , '/#ed' ) ).not.to.be.ok() ;
		expect( fullPathMatch( '/#ed' , '/#edit' ) ).not.to.be.ok() ;

		expect( fullPathMatch( '/Users' , '/' ) ).not.to.be.ok() ;
		expect( fullPathMatch( '/Users#edit' , '/#edit' ) ).not.to.be.ok() ;
		expect( fullPathMatch( '/' , '/Users' ) ).not.to.be.ok() ;
		expect( fullPathMatch( '/#edit' , '/Users#edit' ) ).not.to.be.ok() ;

		expect( fullPathMatch( '/Users' , '/Users' ) ).to.be.ok() ;
		expect( fullPathMatch( '/Users#edit' , '/Users#edit' ) ).to.be.ok() ;
		expect( fullPathMatch( '/Users#ed' , '/Users#edit' ) ).not.to.be.ok() ;
		expect( fullPathMatch( '/Users#edit' , '/Users#ed' ) ).not.to.be.ok() ;
		expect( fullPathMatch( '/Users#edit' , '/Users' ) ).not.to.be.ok() ;
		expect( fullPathMatch( '/Users' , '/Users#edit' ) ).to.be.ok() ;

		matches = fullPathMatch( '/Users/123456789012345678901234' , '/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.equal( { "full": [ {
			"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
		} , {
			"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
		} ] ,
		"users": {
			"match": [ {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} ] ,
			"before": [] ,
			"after": [ {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"upto": [ {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} ] ,
			"onward": [ {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ]
		} ,
		"usersDocument": {
			"match": [ {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"before": [ {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} ] ,
			"after": [] ,
			"upto": [ {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"onward": [ {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ]
		} } ) ;

		matches = fullPathMatch( '/Users/123456789012345678901234#edit' , '/Users/123456789012345678901234#edit' ) ;
		//console.log( JSON.stringify( matches , null , '  ' ) ) ;
		//console.log( JSON.stringify( matches.hash , null , '  ' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"users": {
				"match": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"onward": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"usersDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"hash": { "action": "edit" }
		} ) ;
		expect( matches.hash ).to.equal( { action: 'edit' } ) ;

		expect( fullPathMatch( '/Users/123456789012345678901234#edit' , '/Users/123456789012345678901234' ) ).not.to.be.ok() ;
		expect( fullPathMatch( '/Users/123456789012345678901234' , '/Users/123456789012345678901234#edit' ) ).to.be.ok() ;
	} ) ;

	it( "Complex pattern matching" , () => {
		var matches ;

		matches = fullPathMatch( '/Boards/123456789012345678901234/{collection}/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} , {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"boards": {
				"match": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"onward": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"boardsDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"wildCollection": {
				"match": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"onward": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"wildCollectionDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			}
		} ) ;

		matches = fullPathMatch( '/Boards/123456789012345678901234/{collection}/123456789012345678901234#edit' , '/Boards/123456789012345678901234/Users/123456789012345678901234#edit' ) ;
		//console.log( JSON.stringify( matches , null , '  ' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} , {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"boards": {
				"match": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"onward": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"boardsDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} ] ,
				"after": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"wildCollection": {
				"match": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"onward": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"wildCollectionDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Boards" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "boards"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} , {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"hash": { "action": "edit" }
		} ) ;
		expect( matches.hash ).to.equal( { action: 'edit' } ) ;

		expect( fullPathMatch( '/Boards/123456789012345678901234/{collection}/123456789012345678901234#edit' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
		expect( fullPathMatch( '/Boards/123456789012345678901234/{collection}/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234#edit' ) ).to.be.ok() ;

		expect( fullPathMatch( '/Boards/{$boardId}/#edit' , '/Boards/123456789012345678901234/#edit' , { boardId: '123456789012345678901234' } ) ).to.be.ok() ;
		expect( fullPathMatch( '/Boards/{$boardId}/#edit' , '/Boards/12345678901234567890123f/#edit' , { boardId: '123456789012345678901234' } ) ).not.to.be.ok() ;
		expect( fullPathMatch( '/Boards/{$unexistant}/#edit' , '/Boards/12345678901234567890123f/#edit' , {} ) ).not.to.be.ok() ;

		// Verify that the slash is optional between the path and the hash
		expect( fullPathMatch( '/Boards/{$boardId}/#edit' , '/Boards/123456789012345678901234/#edit' , { boardId: '123456789012345678901234' } ) ).to.be.ok() ;
		expect( fullPathMatch( '/Boards/{$boardId}#edit' , '/Boards/123456789012345678901234/#edit' , { boardId: '123456789012345678901234' } ) ).to.be.ok() ;
		expect( fullPathMatch( '/Boards/{$boardId}/#edit' , '/Boards/123456789012345678901234#edit' , { boardId: '123456789012345678901234' } ) ).to.be.ok() ;
		expect( fullPathMatch( '/Boards/{$boardId}#edit' , '/Boards/123456789012345678901234#edit' , { boardId: '123456789012345678901234' } ) ).to.be.ok() ;

		expect( fullPathMatch( '/{$parent.primaryPath}#add' , '/Organizations/sodip/Partners#add' , { parent: { primaryPath: '/Organizations/sodip/Partners' } } ) ).to.be.ok() ;

		// /!\ more test are needed, but no time for that now /!\
	} ) ;

	it( "Hash with path" , () => {
		var matches ;

		matches = fullPathMatch( '/Users/123456789012345678901234#edit:/Friends/123456789012345678901234' , '/Users/123456789012345678901234#edit:/Friends/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '  ' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"users": {
				"match": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"onward": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"usersDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"hash": { "action": "edit" ,
				"path": { "full": [ {
					"value": "Friends" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "friends"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"friends": {
					"match": [ {
						"value": "Friends" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "friends"
					} ] ,
					"before": [] ,
					"after": [ {
						"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
					} ] ,
					"upto": [ {
						"value": "Friends" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "friends"
					} ] ,
					"onward": [ {
						"value": "Friends" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "friends"
					} , {
						"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
					} ]
				} ,
				"friendsDocument": {
					"match": [ {
						"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
					} ] ,
					"before": [ {
						"value": "Friends" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "friends"
					} ] ,
					"after": [] ,
					"upto": [ {
						"value": "Friends" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "friends"
					} , {
						"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
					} ] ,
					"onward": [ {
						"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
					} ]
				} } }
		} ) ;

		matches = fullPathMatch( '/Users/123456789012345678901234#edit:/Friends/{id}' , '/Users/123456789012345678901234#edit:/Friends/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '  ' ) ) ;
		expect( matches ).to.equal( {
			"full": [ {
				"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
			} , {
				"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
			} ] ,
			"users": {
				"match": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"before": [] ,
				"after": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"upto": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"onward": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"usersDocument": {
				"match": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"before": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} ] ,
				"after": [] ,
				"upto": [ {
					"value": "Users" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "users"
				} , {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ] ,
				"onward": [ {
					"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
				} ]
			} ,
			"hash": { "action": "edit" ,
				"path": {
					"full": [ {
						"value": "Friends" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "friends"
					} , {
						"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
					} ] ,
					"friends": {
						"match": [ {
							"value": "Friends" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "friends"
						} ] ,
						"before": [] ,
						"after": [ {
							"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
						} ] ,
						"upto": [ {
							"value": "Friends" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "friends"
						} ] ,
						"onward": [ {
							"value": "Friends" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "friends"
						} , {
							"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
						} ]
					} ,
					"wildId": {
						"match": [ {
							"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
						} ] ,
						"before": [ {
							"value": "Friends" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "friends"
						} ] ,
						"after": [] ,
						"upto": [ {
							"value": "Friends" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "friends"
						} , {
							"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
						} ] ,
						"onward": [ {
							"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
						} ]
					} ,
					"friendsDocument": {
						"match": [ {
							"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
						} ] ,
						"before": [ {
							"value": "Friends" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "friends"
						} ] ,
						"after": [] ,
						"upto": [ {
							"value": "Friends" , "isDocument": false , "isCollection": true , "type": "collection" , "identifier": "friends"
						} , {
							"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
						} ] ,
						"onward": [ {
							"value": "123456789012345678901234" , "isDocument": true , "isCollection": false , "type": "id" , "identifier": "123456789012345678901234"
						} ]
					}
				} }
		} ) ;
		expect( matches.hashPrimaryPath.toString() ).to.be( '/Friends/123456789012345678901234' ) ;
	} ) ;

	it( "Contextified patterns referencing an unexistant key should not match, returning undefined instead of false (help debugging)" , () => {
		expect( fullPathMatch( '/Users/{$unexistant}/Friends/' , '/Users/123456789012345678901234/Friends' , {} ) ).to.be( undefined ) ;
	} ) ;

	it( "Historical bugs" , () => {
		expect( fullPathMatch( '/{$parent.primaryPath}#add' , '/Organizations/sodip/Partners#add' , { parent: { primaryPath: '/Organizations/sodip/Partners' } } ) ).to.be.ok() ;

		var parsed = fullPathParse( '/{$parent.primaryPath}#add' , true ) ;
		var ppp = restQuery.path.parse( '/Organizations/sodip/Partners' ) ;
		expect( parsed.toString() ).to.be( '/{$parent.primaryPath}#add' ) ;
		expect( fullPathMatch( parsed , '/Organizations/sodip/Partners#add' , { parent: { primaryPath: ppp.toString() } } ) ).to.be.ok() ;
		expect( fullPathMatch( parsed , '/Organizations/sodip/Partners#add' , { parent: { primaryPath: ppp } } ) ).to.be.ok() ;
	} ) ;
} ) ;

