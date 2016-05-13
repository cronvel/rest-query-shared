/*
	The Cedric's Swiss Knife (CSK) - CSK REST Query

	Copyright (c) 2015 - 2016 Cédric Ronvel 
	
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

"use strict" ;



// IMPORTANT: this file is shared with the client!
// We should only load the minimal stuff



// Load modules
var charmap = require( './charmap.js' ) ;
var camel = require( 'string-kit/lib/camel.js' ) ;



var pathModule = {} ;
module.exports = pathModule ;



pathModule.parse = function parse( path , isPattern )
{
	var i , iMax , j , splitted , parsed , parsedNode , error ;
	
	if ( Array.isArray( path ) ) { return path ; }	// Already parsed
	else if ( typeof path !== 'string' ) { throw new Error( "[restQuery] .parse() 'path' should be a string" ) ; }
	
	try {
		parsed = [] ;
		splitted = path.split( '/' ) ;
		
		for ( i = 0 , j = 0 , iMax = splitted.length ; i < iMax ; i ++ )
		{
			if ( splitted[ i ] === '' ) { continue ; }
			
			parsedNode = pathModule.parseNode( splitted[ i ] , isPattern ) ;
			
			if (
				j &&
				( parsedNode.type === 'property' || parsedNode.type === 'linkProperty' ) &&
				parsed[ j - 1 ].type === 'property'
			)
			{
				// Merge property node together
				parsed[ j - 1 ].identifier += '.' + parsedNode.identifier ;
				parsed[ j - 1 ].type = parsedNode.type ;
			}
			else
			{
				parsed[ j ] = parsedNode ;
				j ++ ;
			}
		}
	}
	catch ( error_ ) {
		error = new Error( "Bad URL: '" + splitted[ i ] + "' does not match any node type" ) ;
		error.type = 'badRequest' ;
		throw error ;
	}
	
	return parsed ;
} ;
                        


pathModule.parseNode = function parseNode( str , isPattern )
{
	var parsed = { node: str , isDocument: false , isCollection: false } , match , splitted ;
	
	if ( str.length < 1 ) { throw new Error( '[restQuery] parseNode() : argument #0 length should be >= 1' ) ; }
	if ( str.length > 72 ) { throw new Error( '[restQuery] parseNode() : argument #0 length should be <= 72' ) ; }
	
	// Firstly, check wildcard if isPattern
	if ( isPattern && str[ 0 ] === '{' && str[ str.length -1 ] === '}' )
	{
		if ( str[ 1 ] === '$' )
		{
			parsed.type = 'context' ;
			parsed.contextPath = str = str.slice( 2 , -1 ) ;
			return parsed ;
		}
		
		splitted = str.slice( 1 , -1 ).split( ':' ) ;
		
		switch ( splitted[ 0 ] )
		{
			case '*' :
				parsed.type = 'wildcard' ;
				parsed.wildcard = 'any' ;
				break ;
			case '...' :
				parsed.type = 'wildcard' ;
				parsed.wildcard = 'anySubPath' ;
				break ;
			case 'id' :
				parsed.type = 'wildcard' ;
				parsed.wildcard = 'anyId' ;
				parsed.isDocument = true ;
				break ;
			case 'slugId' :
				parsed.type = 'wildcard' ;
				parsed.wildcard = 'anySlugId' ;
				parsed.isDocument = true ;
				break ;
			case 'document' :
				parsed.type = 'wildcard' ;
				parsed.wildcard = 'anyDocument' ;
				parsed.isDocument = true ;
				break ;
			case 'collection' :
				parsed.type = 'wildcard' ;
				parsed.wildcard = 'anyCollection' ;
				parsed.isCollection = true ;
				break ;
			default :
				throw new Error( '[restQuery] parseNode() -- bad node special type: ' + str ) ;
		}
		
		return parsed ;
	}
	
	// Then, check if it is an object's collection or method: it starts with an uppercase ascii letter
	if ( charmap.upperCaseArray.indexOf( str[ 0 ] ) !== -1 )
	{
		if ( str.length === 1 )
		{
			parsed.type = 'collection' ;
			parsed.identifier = str[ 0 ].toLowerCase() + str.slice( 1 ) ;
			parsed.isCollection = true ;
			return parsed ;
		}
		
		if ( charmap.lowerCaseArray.indexOf( str[ 1 ] ) !== -1 )
		{
			if ( str.match( charmap.collectionRegExp ) )
			{
				parsed.type = 'collection' ;
				parsed.identifier = str[ 0 ].toLowerCase() + str.slice( 1 ) ;
				parsed.isCollection = true ;
				return parsed ;
			}
			
			throw new Error( '[restQuery] parseNode() : argument #0 start with an uppercase and then a lowercase letter but mismatch a collection type' ) ;
		}
		
		if ( str.match( charmap.methodRegExp ) )
		{
			parsed.type = 'method' ;
			parsed.identifier = camel.toCamelCase( str ) ;
			return parsed ;
		}
		
		if ( str.match( charmap.collectionRegExp ) )
		{
			parsed.type = 'collection' ;
			parsed.identifier = str[ 0 ].toLowerCase() + str.slice( 1 ) ;
			parsed.isCollection = true ;
			return parsed ;
		}
		
		throw new Error( '[restQuery] parseNode() : argument #0 start with an uppercase but mismatch collection or method type' ) ;
	}
	
	// Then, check if it is an ID: it is a 24 characters string containing only hexadecimal.
	// It should come before slugId and offset check.
	if ( str.length === 24 && str.match( charmap.idRegExp ) )
	{
		parsed.type = 'id' ;
		parsed.identifier = str ;
		parsed.isDocument = true ;
		return parsed ;
	}
	
	// Then, check if it is a property
	if ( str[ 0 ] === '.' )
	{
		if ( ! str.match( charmap.propertyRegExp ) ) { throw new Error( '[restQuery] parseNode() : argument #0 does not validate' ) ; }
		parsed.type = 'property' ;
		parsed.identifier = str.slice( 1 ) ;
		parsed.isDocument = true ;	// /!\ document or not?
		return parsed ;
	}
	
	// Then, check if it is a property link
	if ( str[ 0 ] === '~' )
	{
		if ( str[ 1 ] === '~' )
		{
			if ( ! str.match( charmap.multiLinkPropertyRegExp ) ) { throw new Error( '[restQuery] parseNode() : argument #0 does not validate' ) ; }
			parsed.type = 'multiLinkProperty' ;
			parsed.identifier = str.slice( 2 ) ;
			parsed.isCollection = true ;
			return parsed ;
		}
		else
		{
			if ( ! str.match( charmap.linkPropertyRegExp ) ) { throw new Error( '[restQuery] parseNode() : argument #0 does not validate' ) ; }
			parsed.type = 'linkProperty' ;
			parsed.identifier = str.slice( 1 ) ;
			parsed.isDocument = true ;
			return parsed ;
		}
	}
	
	// Then, check if it is an offset or a range
	// Should come before slugId be after id
	if ( charmap.digitArray.indexOf( str[ 0 ] ) !== -1 && ( match = str.match( charmap.rangeRegExp ) ) )
	{
		if ( match[ 2 ] )
		{
			parsed.type = 'range' ;
			parsed.min = parseInt( match[ 1 ] , 10 ) ;
			parsed.max = parseInt( match[ 2 ] , 10 ) ;
			parsed.isCollection = true ;
			return parsed ;
		}
		
		parsed.type = 'offset' ;
		parsed.identifier = parseInt( str , 10 ) ;
		parsed.isDocument = true ;
		return parsed ;
	}
	
	// Lastly, check if it is a slugId
	// Should come after id and range/offset
	if ( charmap.lowerCaseAndDigitArray.indexOf( str[ 0 ] ) !== -1 && str.match( charmap.slugIdRegExp ) )
	{
		parsed.type = 'slugId' ;
		parsed.identifier = str ;
		parsed.isDocument = true ;
		return parsed ;
	}
	
	// Nothing had matched... this is not a valid path node
	throw new Error( '[restQuery] parseNode() : argument #0 does not validate' ) ;
} ;



/*
	Wildcards:
		{*}				match any path node
		{...}			match any children node?
		{id}			match any ID node
		{slugId}		match any SlugId node
		{document}		match any ID and SlugId node
		{collection}	match any collection node
*/
pathModule.match = function match( pathPattern , path )
{
	var i , iMax , j , jLast = 0 , jLastCollection = 0 ,
		anySubPathCount = 0 , anySubPathMatchCount , jAfterSubPath ,
		matches = {} ;
	
	try {
		if ( ! Array.isArray( pathPattern ) ) { pathPattern = pathModule.parse( pathPattern , true ) ; }
		if ( ! Array.isArray( path ) ) { path = pathModule.parse( path ) ; }
	}
	catch ( error ) {
		return false ;
	}
	
	// If the parsed pattern is empty...
	if ( pathPattern.length === 0 ) { return path.length === 0 ? matches : false ; }
	
	for ( i = 0 , iMax = pathPattern.length ; i < iMax ; i ++ )
	{
		if ( pathPattern[ i ].wildcard === 'anySubPath' ) { anySubPathCount ++ ; }
	}
	
	if ( anySubPathCount )
	{
		// Fast exit: path length is too small
		if ( anySubPathCount > 1 )
		{
			console.log( "Warning: multiple 'anySubPath' wildcards in the same pattern are not supported ATM" ) ;
			return false ;
		}
		
		anySubPathMatchCount = path.length - pathPattern.length + 1 ;
		
		if ( anySubPathMatchCount < 0 ) { return false ; }
	}
	else if ( path.length !== pathPattern.length )
	{
		// Fast exit: different path and pathPattern length
		return false ;
	}
	
	// i	iterate the pattern
	// j	iterate the path
	for ( i = 0 , j = 0 , iMax = pathPattern.length ; i < iMax ; i ++ , j ++ )
	{
		if ( path[ j ] )
		{
			jLast = j ;
			if ( path[ j ].type === 'collection' && pathPattern[ i ].wildcard !== 'anySubPath' ) { jLastCollection = j ; }
		}
		
		switch ( pathPattern[ i ].wildcard )
		{
			case 'any' :
				// Always match
				break ;
				
			case 'anySubPath' :
				// Always match multiple path node
				
				
				if ( j > 0 )
				{
					matches.path = {
						type: path[ j - 1 ].type ,
						value: '/' + path.slice( 0 , j ).map( mapNode ).join( '/' ) ,
						node: path[ j - 1 ].node
					} ;
					
					matches.collectionPath = {
						type: path[ jLastCollection ].type ,
						value: '/' + path.slice( 0 , jLastCollection + 1 ).map( mapNode ).join( '/' ) ,
						node: path[ jLastCollection ].node
					} ;
				}
				else
				{
					matches.path = {
						type: null ,
						value: '/' ,
						node: null
					} ;
					
					matches.collectionPath = null ;
				}
				
				if ( j < path.length )
				{
					matches.path.selectedChild = {
						type: path[ j ].type ,
						node: path[ j ].node
					} ;
				}
				
				if ( anySubPathMatchCount )
				{
					//console.log( ">>>" , pathPattern.length , path.length , j , anySubPathMatchCount , j + anySubPathMatchCount - 1 ) ;
					matches.subPath = {
						type: path[ j + anySubPathMatchCount - 1 ].type ,
						value: '/' + path.slice( j , j + anySubPathMatchCount ).map( mapNode ).join( '/' ) ,
						node: path[ j + anySubPathMatchCount - 1 ].node
					} ;
					
				}
				
				//console.log( path.length , j , anySubPathMatchCount ) ;
				jAfterSubPath = j + anySubPathMatchCount ;
				j += anySubPathMatchCount - 1 ; // the loop already has its own j++
				
				//console.log( j , jAfterSubPath ) ;
				break ;
				
			case 'anyId' :
				// Match any id
				if ( path[ j ].type !== 'id' ) { return false ; }
				break ;
				
			case 'anySlugId' :
				// Match any slugId
				if ( path[ j ].type !== 'slugId' ) { return false ; }
				break ;
				
			case 'anyDocument' :
				// Match any id
				if ( path[ j ].type !== 'id' && path[ j ].type !== 'slugId' ) { return false ; }
				break ;
				
			case 'anyCollection' :
				// Match any collection
				if ( path[ j ].type !== 'collection' ) { return false ; }
				break ;
				
			default :
				if ( pathPattern[ i ].type !== path[ j ].type || pathPattern[ i ].identifier !== path[ j ].identifier )
				{
					return false ;
				}
		}
	}
	
	
	if ( ! ( 'path' in matches ) )
	{
		matches.path = {
			type: path[ jLast ].type ,
			value: '/' + path.map( mapNode ).join( '/' ) ,
			node: path[ jLast ].node
		} ;
	}
	
	if ( jAfterSubPath !== undefined && jAfterSubPath < path.length )
	{
		matches.endPath = {
			type: path[ jLast ].type ,
			value: '/' + path.slice( jAfterSubPath ).map( mapNode ).join( '/' ) ,
			node: path[ jLast ].node
		} ;
	}
	
	if ( ! ( 'collectionPath' in matches ) )
	{
		matches.collectionPath = {
			type: path[ jLastCollection ].type ,
			value: '/' + path.slice( 0 , jLastCollection + 1 ).map( mapNode ).join( '/' ) ,
			node: path[ jLastCollection ].node
		} ;
	}
	
	return matches ;
} ;



// a callback for .map() that returns the .node property
function mapNode( e ) { return e.node ; }



// Same than parse(), but for full path (path + query + fragment)
pathModule.fullPathParse = function fullPathParse( fullPath , isPattern )
{
	if ( fullPath && typeof fullPath === 'object'  ) { return fullPath ; }	// already parsed
	
	var matches , parsed = {} ;
	
	matches = fullPath.match( /^(\/[^#?]*)(?:\?([^#?]+))?(?:#([^#?]+))?$/ ) ;
	if ( ! matches ) { throw new Error( "[restQuery] .fullPathParse() 'fullPath' should be a valid path" ) ; }
	
	parsed.path = pathModule.parse( matches[ 1 ] , isPattern ) ;
	
	// /!\ Query string is not parsed much ATM /!\
	if ( matches[ 2 ] !== undefined ) { parsed.query = matches[ 2 ] ; }
	
	if ( matches[ 3 ] !== undefined ) { parsed.fragment = matches[ 3 ] ; }
	
	return parsed ;
} ;



// Same than match(), but for a full path (path + query + fragment)
pathModule.fullPathMatch = function fullPathMatch( fullPathPattern , fullPath )
{
	var matches ;
	
	try {
		if ( ! fullPathPattern || typeof fullPathPattern !== 'object' ) { fullPathPattern = pathModule.fullPathParse( fullPathPattern , true ) ; }
		if ( ! fullPath || fullPath !== 'object' ) { fullPath = pathModule.fullPathParse( fullPath ) ; }
	}
	catch ( error ) {
		return false ;
	}
	
	// /!\ Query string is not used for matching ATM /!\
	
	if ( typeof fullPathPattern.fragment === 'string' && fullPathPattern.fragment !== ( fullPath.fragment || '' ) ) { return false ; }
	
	matches = pathModule.match( fullPathPattern.path , fullPath.path ) ;
	if ( ! matches ) { return false ; }
	
	// Add the fragment
	if ( fullPath.fragment ) { matches.fragment = fullPath.fragment ; }
	
	return matches ;
} ;


