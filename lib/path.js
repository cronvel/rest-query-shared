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

"use strict" ;



// IMPORTANT: this file is shared with the client!
// We should only load the minimal stuff

const charmap = require( './charmap.js' ) ;
const camel = require( 'string-kit/lib/camel.js' ) ;
const unicode = require( 'string-kit/lib/unicode.js' ) ;
const treePath = require( 'tree-kit/lib/path.js' ) ;



const pathModule = {} ;
module.exports = pathModule ;



// Callbacks for .map() that returns the .value property
function mapValue( e ) { return e.value ; }
//function mapMatchValue( e ) { return e.match.value ; }



function nodeToString() { return this.value ; }
function matchToString() { return this.match.toString() ; }



// arrayToString( [sliceFrom] , [sliceTo] )
function arrayToString( ... args ) {
	if ( ! args.length ) { return '/' + this.map( mapValue ).join( '/' ) ; }
	return '/' +  Array.prototype.slice.call( this , ... args ).map( mapValue )
		.join( '/' ) ;
}



function arraySlice( ... args ) {
	return createPathArray( Array.prototype.slice.call( this , ... args ) ) ;
}



function arrayGetLastItem() { return this[ this.length - 1 ] ; }



function fullPathObjectToString() {
	var str ;

	str = this.path.toString() + ( this.query || '' ) ;

	if ( this.hash ) {
		str += '#' + this.hash.action ;
		if( this.hash.path ) { str += ':' + this.hash.path.toString() ; }
	}

	return str ;
}



function createPathArray( array ) {
	array = array || [] ;

	// Replace the .toString() method, make it non-enumerable
	Object.defineProperties( array , {
		toString: { value: arrayToString } ,
		slice: { value: arraySlice } ,
		last: { get: arrayGetLastItem }
	} ) ;

	return array ;
}



function createFullPathObject( object ) {
	object = object || {} ;

	// Replace the .toString() method, make it non-enumerable
	Object.defineProperties( object , {
		toString: { value: fullPathObjectToString }
	} ) ;

	return object ;
}



function createMatchesObject( matches ) {
	matches = matches || {} ;

	// Replace the .toString() method, make it non-enumerable
	Object.defineProperties( matches , {
		primaryPath: { get: function() {
			if ( this.subPath ) { return this.subPath.before ; }
			return this.full ;
		} } ,
		hashPrimaryPath: { get: function() {
			if ( ! this.hash || ! this.hash.path ) { return null ; }
			else if ( this.hash.path.subPath ) { return this.hash.path.subPath.before ; }
			return this.hash.path.full ;
		} }
	} ) ;

	return matches ;
}



pathModule.parse = function( path , isPattern ) {
	var i , iMax , j , splitted , parsed , parsedNode , error ;

	if ( Array.isArray( path ) ) { return path ; }	// Already parsed
	else if ( typeof path !== 'string' ) { throw new Error( "[restQuery] .parse() 'path' should be a string" ) ; }

	parsed = createPathArray() ;
	path = path.replace( /\/+/ , '/' ) ;	// remove extra slashes
	splitted = path.split( '/' ) ;

	try {
		for ( i = 0 , j = 0 , iMax = splitted.length ; i < iMax ; i ++ ) {
			if ( splitted[ i ] === '' ) { continue ; }

			parsedNode = pathModule.parseNode( splitted[ i ] , isPattern ) ;

			if (
				j &&
				( parsedNode.type === 'property' || parsedNode.type === 'linkProperty' ) &&
				parsed[ j - 1 ].type === 'property'
			) {
				// Merge property node together
				parsed[ j - 1 ].identifier += '.' + parsedNode.identifier ;
				parsed[ j - 1 ].type = parsedNode.type ;
			}
			else {
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



pathModule.parseNode = function( str , isPattern ) {
	var match , splitted ;

	if ( str.length < 1 ) { throw new Error( '[restQuery] parseNode() : argument #0 length should be >= 1' ) ; }

	// Because of unicode support, we need to check that the real number of characters does not exceed 72, not the byte length...
	// Still, we do not want to check the more costly unicode length if the byte length is lesser than 72 or greater than 144.
	if ( str.length > 144 || ( str.length > 72 && unicode.length( str ) > 72 ) ) {
		throw new Error( '[restQuery] parseNode() : argument #0 length should be <= 72' ) ;
	}

	var parsed = { value: str , isDocument: false , isCollection: false } ;

	Object.defineProperties( parsed , {
		toString: { value: nodeToString }
	} ) ;

	// Firstly, check wildcard if isPattern
	if ( isPattern ) {
		if ( str[ 0 ] === '{' && str[ str.length - 1 ] === '}' ) {
			splitted = str.slice( 1 , -1 ).split( ':' ) ;
			if ( splitted[ 1 ] ) { parsed.matchName = splitted[ 1 ] ; }
			str = splitted[ 0 ] ;

			if ( str[ 0 ] === '$' ) {
				parsed.type = 'context' ;
				parsed.contextPath = str = str.slice( 1 ) ;
				return parsed ;
			}

			switch ( str ) {
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


		splitted = str.split( ':' ) ;
		if ( splitted[ 1 ] ) { parsed.matchName = splitted[ 1 ] ; }
		str = splitted[ 0 ] ;
	}

	// Then, check if it is an object's collection or method: it starts with an uppercase ascii letter
	if ( charmap.upperCaseArray.includes( str[ 0 ] ) ) {
		if ( str.length === 1 ) {
			parsed.type = 'collection' ;
			parsed.identifier = str[ 0 ].toLowerCase() + str.slice( 1 ) ;
			parsed.isCollection = true ;
			return parsed ;
		}

		if ( charmap.lowerCaseArray.includes( str[ 1 ] ) ) {
			if ( str.match( charmap.collectionRegExp ) ) {
				parsed.type = 'collection' ;
				parsed.identifier = str[ 0 ].toLowerCase() + str.slice( 1 ) ;
				parsed.isCollection = true ;
				return parsed ;
			}

			throw new Error( '[restQuery] parseNode() : argument #0 start with an uppercase and then a lowercase letter but mismatch a collection type' ) ;
		}

		if ( str.match( charmap.methodRegExp ) ) {
			parsed.type = 'method' ;
			parsed.identifier = camel.toCamelCase( str ) ;
			return parsed ;
		}

		if ( str.match( charmap.collectionRegExp ) ) {
			parsed.type = 'collection' ;
			parsed.identifier = str[ 0 ].toLowerCase() + str.slice( 1 ) ;
			parsed.isCollection = true ;
			return parsed ;
		}

		throw new Error( '[restQuery] parseNode() : argument #0 start with an uppercase but mismatch collection or method type' ) ;
	}

	// Then, check if it is an ID: it is a 24 characters string containing only hexadecimal.
	// It should come before slugId and offset check.
	if ( str.length === 24 && str.match( charmap.idRegExp ) ) {
		parsed.type = 'id' ;
		parsed.identifier = str ;
		parsed.isDocument = true ;
		return parsed ;
	}

	// Then, check if it is a property
	if ( str[ 0 ] === '.' ) {
		if ( ! str.match( charmap.propertyRegExp ) ) { throw new Error( '[restQuery] parseNode() : argument #0 does not validate' ) ; }
		parsed.type = 'property' ;
		parsed.identifier = str.slice( 1 ) ;
		parsed.isDocument = true ;	// /!\ document or not?
		return parsed ;
	}

	// Then, check if it is a property link
	if ( str[ 0 ] === '~' ) {
		if ( str[ 1 ] === '~' ) {
			if ( ! str.match( charmap.multiLinkPropertyRegExp ) ) { throw new Error( '[restQuery] parseNode() : argument #0 does not validate' ) ; }
			parsed.type = 'multiLinkProperty' ;
			parsed.identifier = str.slice( 2 ) ;
			parsed.isCollection = true ;
			return parsed ;
		}

		if ( ! str.match( charmap.linkPropertyRegExp ) ) { throw new Error( '[restQuery] parseNode() : argument #0 does not validate' ) ; }
		parsed.type = 'linkProperty' ;
		parsed.identifier = str.slice( 1 ) ;
		parsed.isDocument = true ;
		return parsed ;

	}

	// Then, check if it is an offset or a range
	// Should come before slugId but after id
	if ( charmap.digitArray.includes( str[ 0 ] ) && ( match = str.match( charmap.rangeRegExp ) ) ) {
		if ( match[ 2 ] ) {
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
	if ( charmap.lowerCaseAndDigitArray.includes( str[ 0 ] ) && str.match( charmap.slugIdRegExp ) ) {
		// This is a restricted a-z 0-9 and - slug
		parsed.type = 'slugId' ;
		parsed.unicode = false ;
		parsed.identifier = str ;
		parsed.isDocument = true ;
		return parsed ;
	}

	if ( str.match( charmap.unicodeSlugIdRegExp ) ) {
		// This is an extended unicode slug, allowing non-uppercase letters, numbers and accents
		parsed.type = 'slugId' ;
		parsed.unicode = true ;
		parsed.identifier = str ;
		parsed.isDocument = true ;
		return parsed ;
	}

	// Nothing had matched... this is not a valid path node
	throw new Error( '[restQuery] parseNode() : argument #0 does not validate' ) ;
} ;



function createMatchElementFromNode( node ) {
	var key , match = {} ;

	for ( key in node ) { match[ key ] = node[ key ] ; }

	Object.defineProperties( match , {
		toString: { value: nodeToString }
	} ) ;

	return match ;
}



function matchName( matches , nameOccurencies , name ) {
	// First, fix the name
	if ( ! nameOccurencies[ name ] ) {
		nameOccurencies[ name ] = 1 ;
	}
	else if ( nameOccurencies[ name ] === 1 ) {
		// We have to rename the first one by appending '1' to its name
		matches[ name + '1' ] = matches[ name ] ;
		delete matches[ name ] ;
		nameOccurencies[ name ] = 2 ;
		name += '2' ;
	}
	else {
		name += ++ nameOccurencies[ name ] ;
	}

	return name ;
}



function copyMatch( matches , match , nameOccurencies , name ) {
	name = matchName( matches , nameOccurencies , name ) ;
	matches[ name ] = match ;
	return match ;
}



function addMatch( matches , matchElements , min , max , nameOccurencies , name ) {
	name = matchName( matches , nameOccurencies , name ) ;

	var match = Object.create( Object.prototype , {
		toString: { value: matchToString }
	} ) ;

	match.match = matchElements.slice( min , max + 1 ) ;
	match.before = matchElements.slice( 0 , min ) ;
	match.after = matchElements.slice( max + 1 ) ;
	match.upto = matchElements.slice( 0 , max + 1 ) ;
	match.onward = matchElements.slice( min ) ;

	matches[ name ] = match ;

	return match ;
}



// Apply a context to a path, applying all substitutions.
// Return the new path or false if a substitution was not found.
pathModule.applyContext = function( path , context ) {
	var i , iMax , contextValue , contextifiedPath = [] ;

	// Let it crash if path is not a valid path
	if ( ! Array.isArray( path ) ) { path = pathModule.parse( path , true ) ; }

	for ( i = 0 , iMax = path.length ; i < iMax ; i ++ ) {
		if ( path[ i ].contextPath ) {
			contextValue = treePath.get( context , path[ i ].contextPath ) ;

			// This is an array: concat it
			if ( Array.isArray( contextValue ) ) {
				contextifiedPath = contextifiedPath.concat( contextValue ) ;
				continue ;
			}

			if ( typeof contextValue !== 'string' ) {
				if ( contextValue && typeof contextValue === 'object' && contextValue.toString ) {
					contextValue = contextValue.toString() ;
				}
				else {
					return false ;
				}
			}

			// This is a string: parse it then concat it
			contextValue = pathModule.parse( contextValue ) ;
			if ( ! contextValue ) { return false ; }
			contextifiedPath = contextifiedPath.concat( contextValue ) ;
		}
		else {
			contextifiedPath.push( path[ i ] ) ;
		}
	}

	return createPathArray( contextifiedPath ) ;
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
pathModule.match = function( pathPattern , path , context ) {
	try {
		if ( ! Array.isArray( pathPattern ) ) { pathPattern = pathModule.parse( pathPattern , true ) ; }
		if ( ! Array.isArray( path ) ) { path = pathModule.parse( path ) ; }
	}
	catch ( error ) {
		return false ;
	}

	var i , iMax , j , lastCollectionMatchName = null ,
		anySubPathCount = 0 , anySubPathMatchCount ,
		refMatch = null ,
		matches = createMatchesObject() ,
		matchElements = createPathArray() ,
		nameOccurencies = {} ;

	matches.full = path ;

	// If the parsed pattern is empty...
	if ( pathPattern.length === 0 ) { return path.length === 0 ? matches : false ; }

	if ( context ) {
		pathPattern = pathModule.applyContext( pathPattern , context , true ) ;
		if ( ! pathPattern ) { return undefined ; }
	}

	for ( i = 0 , iMax = pathPattern.length ; i < iMax ; i ++ ) {
		if ( pathPattern[ i ].contextPath ) { throw new Error( "[restQuery] .match() this pattern needs a context." ) ; }
		if ( pathPattern[ i ].wildcard === 'anySubPath' ) { anySubPathCount ++ ; }
	}

	for ( i = 0 , iMax = path.length ; i < iMax ; i ++ ) {
		matchElements[ i ] = createMatchElementFromNode( path[ i ] ) ;
	}

	if ( anySubPathCount ) {
		// Fast exit: path length is too small
		if ( anySubPathCount > 1 ) {
			console.log( "Warning: multiple 'anySubPath' wildcards in the same pattern are not supported ATM" ) ;
			return false ;
		}

		anySubPathMatchCount = path.length - pathPattern.length + 1 ;

		if ( anySubPathMatchCount < 0 ) { return false ; }
	}
	else if ( path.length !== pathPattern.length ) {
		// Fast exit: different path and pathPattern length
		return false ;
	}

	// i	iterate the pattern
	// j	iterate the path
	for ( i = 0 , j = 0 , iMax = pathPattern.length ; i < iMax ; i ++ , j ++ ) {
		refMatch = null ;

		switch ( pathPattern[ i ].wildcard ) {
			case 'any' :
				// Always match
				lastCollectionMatchName = null ;
				addMatch( matches , matchElements , j , j , nameOccurencies , pathPattern[ i ].matchName || 'wild' ) ;
				break ;

			case 'anySubPath' :
				// Always match multiple path node
				lastCollectionMatchName = null ;
				addMatch( matches , matchElements , j , j + anySubPathMatchCount - 1 , nameOccurencies , pathPattern[ i ].matchName || 'subPath' ) ;
				j += anySubPathMatchCount - 1 ; // the loop already has its own j++
				break ;

			case 'anyId' :
				// Match any id
				if ( path[ j ].type !== 'id' ) { return false ; }
				refMatch = addMatch( matches , matchElements , j , j , nameOccurencies , pathPattern[ i ].matchName || 'wildId' ) ;
				break ;

			case 'anySlugId' :
				// Match any slugId
				if ( path[ j ].type !== 'slugId' ) { return false ; }
				refMatch = addMatch( matches , matchElements , j , j , nameOccurencies , pathPattern[ i ].matchName || 'wildSlugId' ) ;
				break ;

			case 'anyDocument' :
				// Match any id
				if ( path[ j ].type !== 'id' && path[ j ].type !== 'slugId' ) { return false ; }
				refMatch = addMatch( matches , matchElements , j , j , nameOccurencies , pathPattern[ i ].matchName || 'wildDocument' ) ;
				break ;

			case 'anyCollection' :
				// Match any collection
				if ( path[ j ].type !== 'collection' ) { return false ; }
				lastCollectionMatchName = pathPattern[ i ].matchName || 'wildCollection' ;
				refMatch = addMatch( matches , matchElements , j , j , nameOccurencies , lastCollectionMatchName ) ;
				break ;

			default :
				if ( pathPattern[ i ].type !== path[ j ].type || pathPattern[ i ].identifier !== path[ j ].identifier ) {
					return false ;
				}

				if ( pathPattern[ i ].isCollection ) {
					lastCollectionMatchName = pathPattern[ i ].matchName || pathPattern[ i ].identifier ;
					addMatch( matches , matchElements , j , j , nameOccurencies , lastCollectionMatchName ) ;
				}
		}

		if ( pathPattern[ i ].isDocument && lastCollectionMatchName && path[ j ] ) {
			// If refMatch is already set, avoid recreating a match from scratch, reference the existant match
			if ( refMatch ) { copyMatch( matches , refMatch , nameOccurencies , lastCollectionMatchName + 'Document' ) ; }
			else { addMatch( matches , matchElements , j , j , nameOccurencies , lastCollectionMatchName + 'Document' ) ; }
		}

		// Finally, nullify any collection identifier for the next round trip, if it has not been set in this one...
		if ( ! pathPattern[ i ].isCollection ) { lastCollectionMatchName = null ; }
	}

	return matches ;
} ;



// Same than parse(), but for full path (path + query + hash)
pathModule.fullPathParse = function( fullPath , isPattern ) {
	if ( fullPath && typeof fullPath === 'object'  ) { return fullPath ; }	// already parsed

	var matches , parsed = createFullPathObject() ;

	matches = fullPath.match( /^(\/[^#?]*)(?:\?([^#]+))?(?:#([^]+)?)?$/ ) ;
	if ( ! matches ) { throw new Error( "[restQuery] .fullPathParse() 'fullPath' should be a valid path" ) ; }

	parsed.path = pathModule.parse( matches[ 1 ] , isPattern ) ;

	// /!\ Query string is not parsed much ATM /!\
	if ( matches[ 2 ] !== undefined ) { parsed.query = matches[ 2 ] ; }

	if ( matches[ 3 ] !== undefined ) {
		parsed.hash = pathModule.hashParse( matches[ 3 ] , isPattern ) ;
	}

	return parsed ;
} ;



// Same than parse(), but for full path (path + query + hash)
pathModule.hashParse = function( hash , isPattern ) {
	var indexOf = hash.indexOf( ':' ) ;

	if ( indexOf === -1 ) {
		return { action: hash } ;
	}

	return {
		action: hash.slice( 0 , indexOf ) ,
		path: pathModule.parse( hash.slice( indexOf + 1 ) , isPattern )
	} ;

} ;



// Same than match(), but for a full path (path + query + hash)
pathModule.fullPathMatch = function( fullPathPattern , fullPath , context ) {
	var matches , hashMatches ;

	try {
		if ( ! fullPathPattern || typeof fullPathPattern !== 'object' ) { fullPathPattern = pathModule.fullPathParse( fullPathPattern , true ) ; }
		if ( ! fullPath || fullPath !== 'object' ) { fullPath = pathModule.fullPathParse( fullPath ) ; }
	}
	catch ( error ) {
		return false ;
	}

	// /!\ Query string is not used for matching ATM /!\

	// if no hash in the pattern, then it accept all hash
	//console.log( fullPathPattern.hash ) ;
	//console.log( fullPath.hash ) ;
	if ( fullPathPattern.hash ) {
		if (
			fullPathPattern.hash.action !== '*' &&
			( ! fullPath.hash || fullPathPattern.hash.action !== fullPath.hash.action )
		) {
			return false ;
		}

		if ( ! fullPathPattern.hash.path !== ! fullPath.hash.path ) { return false ; }

		if ( fullPath.hash ) { hashMatches = { action: fullPath.hash.action } ; }

		if ( fullPathPattern.hash.path ) {
			if ( ! fullPath.hash ) { return false ; }
			hashMatches.path = pathModule.match( fullPathPattern.hash.path , fullPath.hash.path , context ) ;
			if ( ! hashMatches ) { return hashMatches ; }
		}
	}

	matches = pathModule.match( fullPathPattern.path , fullPath.path , context ) ;
	if ( ! matches ) { return matches ; }

	// Add the hash
	//if ( fullPath.hash ) { matches.hash = fullPath.hash ; }
	if ( hashMatches ) { matches.hash = hashMatches ; }

	return matches ;
} ;

