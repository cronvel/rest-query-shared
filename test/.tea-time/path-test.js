(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
	Rest Query (shared lib)
	
	Copyright (c) 2014 - 2016 Cédric Ronvel
	
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



// Charmap for string validation

var charmap = {
	lowerCaseArray: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'] ,
	upperCaseArray: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'] ,
	digitArray: ['0','1','2','3','4','5','6','7','8','9'] ,
	lowerCaseAndDigitArray: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9'] ,
	collectionRegExp: '^[A-Z][a-zA-Z0-9]*$' ,
	methodRegExp: '^[A-Z][A-Z0-9-]*$' ,
	propertyRegExp: '^(\.[a-zA-Z0-9_-]+)+$' ,
	linkPropertyRegExp: '^~[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*$' ,
	multiLinkPropertyRegExp: '^~~[a-zA-Z0-9_-]+$' ,
	idRegExp: '^[0-9a-f]{24}$' ,
	rangeRegExp: '^([0-9]+)(?:-([0-9]+))?$' ,
	slugIdRegExp: '^[a-z0-9-]{1,72}$' ,
	
	// Slugify map
	// From Django urlify.js
	/* jshint -W015 */
	asciiMapCommon: {
		// latin
		'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'AE', 'Ç': 'C', 'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I',
		'Î': 'I', 'Ï': 'I', 'Ð': 'D', 'Ñ': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O', 'Ő': 'O', 'Ø': 'O', 'Ù': 'U', 'Ú': 'U', 'Û': 'U',
		'Ü': 'U', 'Ű': 'U', 'Ý': 'Y', 'Þ': 'TH', 'ß': 'ss', 'à':'a', 'á':'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'ae', 'ç': 'c', 'è': 'e',
		'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i', 'ð': 'd', 'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
		'ő': 'o', 'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ű': 'u', 'ý': 'y', 'þ': 'th', 'ÿ': 'y', 'ẞ': 'ss',
		'œ': 'oe', 'Œ': 'OE',	// <-- moved from symbols to common
		// common
		'“': '"', '”': '"', '‘': "'", '’': "'", '…': '...'
	} ,
	asciiMapWorldAlpha: {
		// greek
		'α':'a', 'β':'b', 'γ':'g', 'δ':'d', 'ε':'e', 'ζ':'z', 'η':'h', 'θ':'8', 'ι':'i', 'κ':'k', 'λ':'l', 'μ':'m', 'ν':'n', 'ξ':'3', 'ο':'o', 'π':'p',
		'ρ':'r', 'σ':'s', 'τ':'t', 'υ':'y', 'φ':'f', 'χ':'x', 'ψ':'ps', 'ω':'w', 'ά':'a', 'έ':'e', 'ί':'i', 'ό':'o', 'ύ':'y', 'ή':'h', 'ώ':'w', 'ς':'s',
		'ϊ':'i', 'ΰ':'y', 'ϋ':'y', 'ΐ':'i', 'Α':'A', 'Β':'B', 'Γ':'G', 'Δ':'D', 'Ε':'E', 'Ζ':'Z', 'Η':'H', 'Θ':'8',
		'Ι':'I', 'Κ':'K', 'Λ':'L', 'Μ':'M', 'Ν':'N', 'Ξ':'3', 'Ο':'O', 'Π':'P', 'Ρ':'R', 'Σ':'S', 'Τ':'T', 'Υ':'Y', 'Φ':'F', 'Χ':'X', 'Ψ':'PS', 'Ω':'W',
		'Ά':'A', 'Έ':'E', 'Ί':'I', 'Ό':'O', 'Ύ':'Y', 'Ή':'H', 'Ώ':'W', 'Ϊ':'I', 'Ϋ':'Y',
		// turkish
		'ş':'s', 'Ş':'S', 'ı':'i', 'İ':'I', 'ğ':'g', 'Ğ':'G',
		//  russian
		'а':'a', 'б':'b', 'в':'v', 'г':'g', 'д':'d', 'е':'e', 'ё':'yo', 'ж':'zh', 'з':'z', 'и':'i', 'й':'j', 'к':'k', 'л':'l', 'м':'m', 'н':'n', 'о':'o',
		'п':'p', 'р':'r', 'с':'s', 'т':'t', 'у':'u', 'ф':'f', 'х':'h', 'ц':'c', 'ч':'ch', 'ш':'sh', 'щ':'sh', 'ъ':'u', 'ы':'y', 'ь':'', 'э':'e', 'ю':'yu',
		'я':'ya', 'А':'A', 'Б':'B', 'В':'V', 'Г':'G', 'Д':'D', 'Е':'E', 'Ё':'Yo', 'Ж':'Zh',
		'З':'Z', 'И':'I', 'Й':'J', 'К':'K', 'Л':'L', 'М':'M', 'Н':'N', 'О':'O', 'П':'P', 'Р':'R', 'С':'S', 'Т':'T', 'У':'U', 'Ф':'F', 'Х':'H', 'Ц':'C',
		'Ч':'Ch', 'Ш':'Sh', 'Щ':'Sh', 'Ъ':'U', 'Ы':'Y', 'Ь':'', 'Э':'E', 'Ю':'Yu', 'Я':'Ya',
		// ukranian
		'Є':'Ye', 'І':'I', 'Ї':'Yi', 'Ґ':'G', 'є':'ye', 'і':'i', 'ї':'yi', 'ґ':'g',
		// czech
		'č':'c', 'ď':'d', 'ě':'e', 'ň': 'n', 'ř':'r', 'š':'s', 'ť':'t', 'ů':'u', 'ž':'z', 'Č':'C', 'Ď':'D', 'Ě':'E', 'Ň': 'N', 'Ř':'R', 'Š':'S', 'Ť':'T',
		'Ů':'U', 'Ž':'Z',
		// polish
		'ą':'a', 'ć':'c', 'ę':'e', 'ł':'l', 'ń':'n', 'ś':'s', 'ź':'z', 'ż':'z', 'Ą':'A', 'Ć':'C', 'Ę':'e', 'Ł':'L', 'Ń':'N', 'Ś':'S',
		'Ź':'Z', 'Ż':'Z',
		// latvian
		'ā':'a', 'ē':'e', 'ģ':'g', 'ī':'i', 'ķ':'k', 'ļ':'l', 'ņ':'n', 'ū':'u', 'Ā':'A', 'Ē':'E', 'Ģ':'G', 'Ī':'i',
		'Ķ':'k', 'Ļ':'L', 'Ņ':'N', 'Ū':'u'
	} ,
	asciiMapSymbolsEn: {
		// currency
		'€': ' euro', '₢': ' cruzeiro', '₣': ' french franc', '£': ' pound', '₤': ' lira', '₥': ' mill', '₦': ' naira', '₧': ' peseta', '₨': ' rupee',
		'₩': ' won', '₪': ' new shequel', '₫': ' dong', '₭': ' kip', '₮': ' tugrik', '₯': ' drachma', '₰': ' penny', '₱': ' peso', '₲': ' guarani', '₳': ' austral',
		'₴': ' hryvnia', '₵': ' cedi', '¢': ' cent', '¥': ' yen', '元': ' yuan', '円': ' yen', '﷼': ' rial', '₠': ' ecu', '¤': ' currency', '฿': ' baht',
		"\\$": ' dollar',
		// symbols
		'©': ' (c)', '∑': ' sum', '®': ' (r)', '†': ' +', '∂': ' d', 'ƒ': ' f', '™': ' tm',
		'℠': ' sm', '˚': ' o', 'º': ' o', 'ª': ' a', '•': ' *', '∆': ' delta', '∞': ' infinity', '♥': ' love', '&': ' and', '\\|': ' or',
		'<': ' less', '>': ' greater'
	} ,
	asciiMapSymbolsFr: {
		// currency
		'€': ' euro', '₢': ' cruzeiro', '₣': ' franc', '£': ' livre', '₤': ' lire', '₥': ' mill', '₦': ' naira', '₧': ' peseta', '₨': ' rupee',
		'₩': ' won', '₪': ' new shequel', '₫': ' dong', '₭': ' kip', '₮': ' tugrik', '₯': ' drachma', '₰': ' penny', '₱': ' peso', '₲': ' guarani', '₳': ' austral',
		'₴': ' hryvnia', '₵': ' cedi', '¢': ' cent', '¥': ' yen', '元': ' yuan', '円': ' yen', '﷼': ' rial', '₠': ' ecu', '¤': ' monnaie', '฿': ' baht',
		"\\$": ' dollar',
		// symbols
		'©': ' (c)', '∑': ' sum', '®': ' (r)', '†': ' +', '∂': ' d', 'ƒ': ' f', '™': ' tm',
		'℠': ' sm', '˚': ' o', 'º': ' o', 'ª': ' a', '•': ' *', '∆': ' delta', '∞': ' infini', '♥': ' aime', '&': ' et', '\\|': ' ou',
		'<': ' moins', '>': ' plus'
	}
	/* jshint +W015 */
	
} ;

//restQuery.stringValidator.asciiMapKeys = Object.keys( restQuery.stringValidator.asciiMap ) ;



module.exports = charmap ;



},{}],2:[function(require,module,exports){
/*
	Rest Query (shared lib)
	
	Copyright (c) 2014 - 2016 Cédric Ronvel
	
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
var treePath = require( 'tree-kit/lib/path.js' ) ;



var pathModule = {} ;
module.exports = pathModule ;



// Callbacks for .map() that returns the .value property
function mapValue( e ) { return e.value ; }
//function mapMatchValue( e ) { return e.match.value ; }



//
function nodeToString() { return this.value ; }	// jshint ignore:line
function matchToString() { return this.match.toString() ; }	// jshint ignore:line



// arrayToString( [sliceFrom] , [sliceTo] )
function arrayToString()
{
	if ( ! arguments.length ) { return '/' + this.map( mapValue ).join( '/' ) ; } // jshint ignore:line
	else { return '/' +  Array.prototype.slice.apply( this , arguments ).map( mapValue ).join( '/' ) ; } // jshint ignore:line
}



function arraySlice()
{
	return createPathArray( Array.prototype.slice.apply( this , arguments ) ) ; // jshint ignore:line
}



function arrayGetLastItem() { return this[ this.length - 1 ] ; } ; // jshint ignore:line



function fullPathObjectToString()
{
	return this.path.toString() + ( this.query || '' ) + ( this.fragment ? '#' + this.fragment : '' ) ; // jshint ignore:line
}



function createPathArray( array )
{
	array = array || [] ;
	
	// Replace the .toString() method, make it non-enumerable
	Object.defineProperties( array , {
		toString: { value: arrayToString } ,
		slice: { value: arraySlice } ,
		last: { get: arrayGetLastItem }
	} ) ;
	
	return array ;
}



function createFullPathObject( object )
{
	object = object || {} ;
	
	// Replace the .toString() method, make it non-enumerable
	Object.defineProperties( object , {
		toString: { value: fullPathObjectToString }
	} ) ;
	
	return object ;
}



function createMatchesObject( matches )
{
	matches = matches || {} ;
	
	// Replace the .toString() method, make it non-enumerable
	Object.defineProperties( matches , {
		primaryPath: { get: function() {
			if ( this.subPath ) { return this.subPath.before ; }
			else { return this.full ; }
		} }
	} ) ;
	
	return matches ;
}



pathModule.parse = function parse( path , isPattern )
{
	var i , iMax , j , splitted , parsed , parsedNode , error ;
	
	if ( Array.isArray( path ) ) { return path ; }	// Already parsed
	else if ( typeof path !== 'string' ) { throw new Error( "[restQuery] .parse() 'path' should be a string" ) ; }
	
	parsed = createPathArray() ;
	path = path.replace( /\/+/ , '/' ) ;	// remove extra slashes
	splitted = path.split( '/' ) ;
	
	try {
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
	var match , splitted ;
	
	if ( str.length < 1 ) { throw new Error( '[restQuery] parseNode() : argument #0 length should be >= 1' ) ; }
	if ( str.length > 72 ) { throw new Error( '[restQuery] parseNode() : argument #0 length should be <= 72' ) ; }
	
	var parsed = { value: str , isDocument: false , isCollection: false } ;
	
	Object.defineProperties( parsed , {
		toString: { value: nodeToString }
	} ) ;
	
	// Firstly, check wildcard if isPattern
	if ( isPattern )
	{
		if ( str[ 0 ] === '{' && str[ str.length -1 ] === '}' )
		{
			splitted = str.slice( 1 , -1 ).split( ':' ) ;
			if ( splitted[ 1 ] ) { parsed.matchName = splitted[ 1 ] ; }
			str = splitted[ 0 ] ;
			
			if ( str[ 0 ] === '$' )
			{
				parsed.type = 'context' ;
				parsed.contextPath = str = str.slice( 1 ) ;
				return parsed ;
			}
			
			switch ( str )
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
		
		
		splitted = str.split( ':' ) ;
		if ( splitted[ 1 ] ) { parsed.matchName = splitted[ 1 ] ; }
		str = splitted[ 0 ] ;
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



function createMatchElementFromNode( node )
{
	var key , match = {} ;
	
	for ( key in node ) { match[ key ] = node[ key ] ; }
	
	Object.defineProperties( match , {
		toString: { value: nodeToString }
	} ) ;
	
	return match ;
}



function matchName( matches , nameOccurencies , name )
{
	// First, fix the name
	if ( ! nameOccurencies[ name ] )
	{
		nameOccurencies[ name ] = 1 ;
	}
	else if ( nameOccurencies[ name ] === 1 )
	{
		// We have to rename the first one by appending '1' to its name
		matches[ name + '1' ] = matches[ name ] ;
		delete matches[ name ] ;
		nameOccurencies[ name ] = 2 ;
		name += '2' ;
	}
	else
	{
		name += ++ nameOccurencies[ name ] ;
	}
	
	return name ;
}



function copyMatch( matches , match , nameOccurencies , name )
{
	name = matchName( matches , nameOccurencies , name ) ;
	matches[ name ] = match ;
	return match ;
}



function addMatch( matches , matchElements , min , max , nameOccurencies , name )
{
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
pathModule.applyContext = function applyContext( path , context )
{
	var i , iMax , contextValue , contextifiedPath = [] ;
	
	// Let it crash if path is not a valid path
	if ( ! Array.isArray( path ) ) { path = pathModule.parse( path , true ) ; }
	
	for ( i = 0 , iMax = path.length ; i < iMax ; i ++ )
	{
		if ( path[ i ].contextPath )
		{
			contextValue = treePath.get( context , path[ i ].contextPath ) ;
			
			// This is an array: concat it
			if ( Array.isArray( contextValue ) )
			{
				contextifiedPath = contextifiedPath.concat( contextValue ) ;
				continue ;
			}
			
			if ( typeof contextValue !== 'string' )
			{
				if ( contextValue && typeof contextValue === 'object' && contextValue.toString )
				{
					contextValue = contextValue.toString() ;
				}
				else
				{
					return false ;
				}
			}
			
			// This is a string: parse it then concat it
			contextValue = pathModule.parse( contextValue ) ;
			if ( ! contextValue ) { return false ; }
			contextifiedPath = contextifiedPath.concat( contextValue ) ;
		}
		else
		{
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
pathModule.match = function match( pathPattern , path , context )
{
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
	
	if ( context )
	{
		pathPattern = pathModule.applyContext( pathPattern , context , true ) ;
		if ( ! pathPattern ) { return undefined ; }
	}
	
	for ( i = 0 , iMax = pathPattern.length ; i < iMax ; i ++ )
	{
		if ( pathPattern[ i ].contextPath ) { throw new Error( "[restQuery] .match() this pattern needs a context." ) ; }
		if ( pathPattern[ i ].wildcard === 'anySubPath' ) { anySubPathCount ++ ; }
	}
	
	for ( i = 0 , iMax = path.length ; i < iMax ; i ++ )
	{
		matchElements[ i ] = createMatchElementFromNode( path[ i ] ) ;
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
		refMatch = null ;
		
		switch ( pathPattern[ i ].wildcard )
		{
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
				if ( pathPattern[ i ].type !== path[ j ].type || pathPattern[ i ].identifier !== path[ j ].identifier )
				{
					return false ;
				}
				
				if ( pathPattern[ i ].isCollection )
				{
					lastCollectionMatchName = pathPattern[ i ].matchName || pathPattern[ i ].identifier ;
					addMatch( matches , matchElements , j , j , nameOccurencies , lastCollectionMatchName ) ;
				}
		}
		
		if ( pathPattern[ i ].isDocument && lastCollectionMatchName && path[ j ] )
		{
			// If refMatch is already set, avoid recreating a match from scratch, reference the existant match
			if ( refMatch ) { copyMatch( matches , refMatch , nameOccurencies , lastCollectionMatchName + 'Document' ) ; }
			else { addMatch( matches , matchElements , j , j , nameOccurencies , lastCollectionMatchName + 'Document' ) ; }
		}
		
		// Finally, nullify any collection identifier for the next round trip, if it has not been set in this one...
		if ( ! pathPattern[ i ].isCollection ) { lastCollectionMatchName = null ; }
	}
	
	return matches ;
} ;



// Same than parse(), but for full path (path + query + fragment)
pathModule.fullPathParse = function fullPathParse( fullPath , isPattern )
{
	if ( fullPath && typeof fullPath === 'object'  ) { return fullPath ; }	// already parsed
	
	var matches , parsed = createFullPathObject() ;
	
	matches = fullPath.match( /^(\/[^#?]*)(?:\?([^#]+))?(?:#([^]+))?$/ ) ;
	if ( ! matches ) { throw new Error( "[restQuery] .fullPathParse() 'fullPath' should be a valid path" ) ; }
	
	parsed.path = pathModule.parse( matches[ 1 ] , isPattern ) ;
	
	// /!\ Query string is not parsed much ATM /!\
	if ( matches[ 2 ] !== undefined ) { parsed.query = matches[ 2 ] ; }
	
	if ( matches[ 3 ] !== undefined ) { parsed.fragment = matches[ 3 ] ; }
	
	return parsed ;
} ;



// Same than match(), but for a full path (path + query + fragment)
pathModule.fullPathMatch = function fullPathMatch( fullPathPattern , fullPath , context )
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
	
	matches = pathModule.match( fullPathPattern.path , fullPath.path , context ) ;
	if ( ! matches ) { return matches ; }
	
	// Add the fragment
	if ( fullPath.fragment ) { matches.fragment = fullPath.fragment ; }
	
	return matches ;
} ;



},{"./charmap.js":1,"string-kit/lib/camel.js":6,"tree-kit/lib/path.js":7}],3:[function(require,module,exports){
/*
	Rest Query (shared lib)
	
	Copyright (c) 2014 - 2016 Cédric Ronvel
	
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



var restQueryShared = {} ;
module.exports = restQueryShared ;



restQueryShared.path = require( './path.js' ) ;
restQueryShared.charmap = require( './charmap.js' ) ;
restQueryShared.slugify = require( './slugify.js' ) ;



},{"./charmap.js":1,"./path.js":2,"./slugify.js":4}],4:[function(require,module,exports){
/*
	Rest Query (shared lib)
	
	Copyright (c) 2014 - 2016 Cédric Ronvel
	
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



// Load the master file
var charmap = require( './charmap.js' ) ;
var path = require( './path.js' ) ;





function slugify( str , options )
{
	if ( typeof str !== 'string' ) { return new TypeError( 'slugify() : argument #0 should be a string' ) ; }
	
	if ( str.length < 1 ) { return new Error( 'slugify() : argument #0 length should be > 1' ) ; }
	if ( str.length > 72 ) { str = str.slice( 0 , 72 ) ; }
	
	if ( ! options ) { options = {} ; }
	
	str = mapReplace( str , charmap.asciiMapCommon ) ;
	
	if ( options.worldApha ) { str = mapReplace( str , charmap.asciiMapWorldAlpha ) ; }
	
	if ( options.symbols )
	{
		switch ( options.symbols )
		{
			case 'fr' :
				str = mapReplace( str , charmap.asciiMapSymbolsFr ) ;
				break ;
			//case 'en' :
			default :
				str = mapReplace( str , charmap.asciiMapSymbolsEn ) ;
		}
	}
	
	str = mapReplace( str , {
		// '\\.': '-', // should be deleted?
		'·': '-',
		'/': '-',
		'_': '-',
		',': '-',
		':': '-',
		';': '-'
	} ) ;
	
	str = str
		.toLowerCase()
		.replace( /[\s-]+/g , '-' ) // collapse whitespace and hyphen and replace by hyphen only
		.replace( /^-|-$/g , '' ) // remove the first and last hyphen
		.replace( /[^a-z0-9-]/g , '' ) ; // remove remaining invalid chars
	
	if ( path.parseNode( str ).type !== 'slugId' ) { str = str + '-' ; }
	
	return str;
}

module.exports = slugify ;



function mapReplace( str , map )
{
	var i , keys , length , from , to ;
	
	keys = Object.keys( map ) ;
	length = keys.length ;
	
	for ( i = 0 ; i < length ; i ++ )
	{
		from = keys[ i ] ;
		to = map[ from ] ;
		str = str.replace( new RegExp( from , 'g' ) , to ) ;
	}
	
	return str ;
}

},{"./charmap.js":1,"./path.js":2}],5:[function(require,module,exports){
(function (Buffer){
(function (global, module) {

  var exports = module.exports;

  /**
   * Exports.
   */

  module.exports = expect;
  expect.Assertion = Assertion;

  /**
   * Exports version.
   */

  expect.version = '0.3.1';

  /**
   * Possible assertion flags.
   */

  var flags = {
      not: ['to', 'be', 'have', 'include', 'only']
    , to: ['be', 'have', 'include', 'only', 'not']
    , only: ['have']
    , have: ['own']
    , be: ['an']
  };

  function expect (obj) {
    return new Assertion(obj);
  }

  /**
   * Constructor
   *
   * @api private
   */

  function Assertion (obj, flag, parent) {
    this.obj = obj;
    this.flags = {};

    if (undefined != parent) {
      this.flags[flag] = true;

      for (var i in parent.flags) {
        if (parent.flags.hasOwnProperty(i)) {
          this.flags[i] = true;
        }
      }
    }

    var $flags = flag ? flags[flag] : keys(flags)
      , self = this;

    if ($flags) {
      for (var i = 0, l = $flags.length; i < l; i++) {
        // avoid recursion
        if (this.flags[$flags[i]]) continue;

        var name = $flags[i]
          , assertion = new Assertion(this.obj, name, this)

        if ('function' == typeof Assertion.prototype[name]) {
          // clone the function, make sure we dont touch the prot reference
          var old = this[name];
          this[name] = function () {
            return old.apply(self, arguments);
          };

          for (var fn in Assertion.prototype) {
            if (Assertion.prototype.hasOwnProperty(fn) && fn != name) {
              this[name][fn] = bind(assertion[fn], assertion);
            }
          }
        } else {
          this[name] = assertion;
        }
      }
    }
  }

  /**
   * Performs an assertion
   *
   * @api private
   */

  Assertion.prototype.assert = function (truth, msg, error, expected) {
    var msg = this.flags.not ? error : msg
      , ok = this.flags.not ? !truth : truth
      , err;

    if (!ok) {
      err = new Error(msg.call(this));
      if (arguments.length > 3) {
        err.actual = this.obj;
        err.expected = expected;
        err.showDiff = true;
      }
      throw err;
    }

    this.and = new Assertion(this.obj);
  };

  /**
   * Check if the value is truthy
   *
   * @api public
   */

  Assertion.prototype.ok = function () {
    this.assert(
        !!this.obj
      , function(){ return 'expected ' + i(this.obj) + ' to be truthy' }
      , function(){ return 'expected ' + i(this.obj) + ' to be falsy' });
  };

  /**
   * Creates an anonymous function which calls fn with arguments.
   *
   * @api public
   */

  Assertion.prototype.withArgs = function() {
    expect(this.obj).to.be.a('function');
    var fn = this.obj;
    var args = Array.prototype.slice.call(arguments);
    return expect(function() { fn.apply(null, args); });
  };

  /**
   * Assert that the function throws.
   *
   * @param {Function|RegExp} callback, or regexp to match error string against
   * @api public
   */

  Assertion.prototype.throwError =
  Assertion.prototype.throwException = function (fn) {
    expect(this.obj).to.be.a('function');

    var thrown = false
      , not = this.flags.not;

    try {
      this.obj();
    } catch (e) {
      if (isRegExp(fn)) {
        var subject = 'string' == typeof e ? e : e.message;
        if (not) {
          expect(subject).to.not.match(fn);
        } else {
          expect(subject).to.match(fn);
        }
      } else if ('function' == typeof fn) {
        fn(e);
      }
      thrown = true;
    }

    if (isRegExp(fn) && not) {
      // in the presence of a matcher, ensure the `not` only applies to
      // the matching.
      this.flags.not = false;
    }

    var name = this.obj.name || 'fn';
    this.assert(
        thrown
      , function(){ return 'expected ' + name + ' to throw an exception' }
      , function(){ return 'expected ' + name + ' not to throw an exception' });
  };

  /**
   * Checks if the array is empty.
   *
   * @api public
   */

  Assertion.prototype.empty = function () {
    var expectation;

    if ('object' == typeof this.obj && null !== this.obj && !isArray(this.obj)) {
      if ('number' == typeof this.obj.length) {
        expectation = !this.obj.length;
      } else {
        expectation = !keys(this.obj).length;
      }
    } else {
      if ('string' != typeof this.obj) {
        expect(this.obj).to.be.an('object');
      }

      expect(this.obj).to.have.property('length');
      expectation = !this.obj.length;
    }

    this.assert(
        expectation
      , function(){ return 'expected ' + i(this.obj) + ' to be empty' }
      , function(){ return 'expected ' + i(this.obj) + ' to not be empty' });
    return this;
  };

  /**
   * Checks if the obj exactly equals another.
   *
   * @api public
   */

  Assertion.prototype.be =
  Assertion.prototype.equal = function (obj) {
    this.assert(
        obj === this.obj
      , function(){ return 'expected ' + i(this.obj) + ' to equal ' + i(obj) }
      , function(){ return 'expected ' + i(this.obj) + ' to not equal ' + i(obj) });
    return this;
  };

  /**
   * Checks if the obj sortof equals another.
   *
   * @api public
   */

  Assertion.prototype.eql = function (obj) {
    this.assert(
        expect.eql(this.obj, obj)
      , function(){ return 'expected ' + i(this.obj) + ' to sort of equal ' + i(obj) }
      , function(){ return 'expected ' + i(this.obj) + ' to sort of not equal ' + i(obj) }
      , obj);
    return this;
  };

  /**
   * Assert within start to finish (inclusive).
   *
   * @param {Number} start
   * @param {Number} finish
   * @api public
   */

  Assertion.prototype.within = function (start, finish) {
    var range = start + '..' + finish;
    this.assert(
        this.obj >= start && this.obj <= finish
      , function(){ return 'expected ' + i(this.obj) + ' to be within ' + range }
      , function(){ return 'expected ' + i(this.obj) + ' to not be within ' + range });
    return this;
  };

  /**
   * Assert typeof / instance of
   *
   * @api public
   */

  Assertion.prototype.a =
  Assertion.prototype.an = function (type) {
    if ('string' == typeof type) {
      // proper english in error msg
      var n = /^[aeiou]/.test(type) ? 'n' : '';

      // typeof with support for 'array'
      this.assert(
          'array' == type ? isArray(this.obj) :
            'regexp' == type ? isRegExp(this.obj) :
              'object' == type
                ? 'object' == typeof this.obj && null !== this.obj
                : type == typeof this.obj
        , function(){ return 'expected ' + i(this.obj) + ' to be a' + n + ' ' + type }
        , function(){ return 'expected ' + i(this.obj) + ' not to be a' + n + ' ' + type });
    } else {
      // instanceof
      var name = type.name || 'supplied constructor';
      this.assert(
          this.obj instanceof type
        , function(){ return 'expected ' + i(this.obj) + ' to be an instance of ' + name }
        , function(){ return 'expected ' + i(this.obj) + ' not to be an instance of ' + name });
    }

    return this;
  };

  /**
   * Assert numeric value above _n_.
   *
   * @param {Number} n
   * @api public
   */

  Assertion.prototype.greaterThan =
  Assertion.prototype.above = function (n) {
    this.assert(
        this.obj > n
      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n }
      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n });
    return this;
  };

  /**
   * Assert numeric value below _n_.
   *
   * @param {Number} n
   * @api public
   */

  Assertion.prototype.lessThan =
  Assertion.prototype.below = function (n) {
    this.assert(
        this.obj < n
      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n }
      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n });
    return this;
  };

  /**
   * Assert string value matches _regexp_.
   *
   * @param {RegExp} regexp
   * @api public
   */

  Assertion.prototype.match = function (regexp) {
    this.assert(
        regexp.exec(this.obj)
      , function(){ return 'expected ' + i(this.obj) + ' to match ' + regexp }
      , function(){ return 'expected ' + i(this.obj) + ' not to match ' + regexp });
    return this;
  };

  /**
   * Assert property "length" exists and has value of _n_.
   *
   * @param {Number} n
   * @api public
   */

  Assertion.prototype.length = function (n) {
    expect(this.obj).to.have.property('length');
    var len = this.obj.length;
    this.assert(
        n == len
      , function(){ return 'expected ' + i(this.obj) + ' to have a length of ' + n + ' but got ' + len }
      , function(){ return 'expected ' + i(this.obj) + ' to not have a length of ' + len });
    return this;
  };

  /**
   * Assert property _name_ exists, with optional _val_.
   *
   * @param {String} name
   * @param {Mixed} val
   * @api public
   */

  Assertion.prototype.property = function (name, val) {
    if (this.flags.own) {
      this.assert(
          Object.prototype.hasOwnProperty.call(this.obj, name)
        , function(){ return 'expected ' + i(this.obj) + ' to have own property ' + i(name) }
        , function(){ return 'expected ' + i(this.obj) + ' to not have own property ' + i(name) });
      return this;
    }

    if (this.flags.not && undefined !== val) {
      if (undefined === this.obj[name]) {
        throw new Error(i(this.obj) + ' has no property ' + i(name));
      }
    } else {
      var hasProp;
      try {
        hasProp = name in this.obj
      } catch (e) {
        hasProp = undefined !== this.obj[name]
      }

      this.assert(
          hasProp
        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name) }
        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name) });
    }

    if (undefined !== val) {
      this.assert(
          val === this.obj[name]
        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name)
          + ' of ' + i(val) + ', but got ' + i(this.obj[name]) }
        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name)
          + ' of ' + i(val) });
    }

    this.obj = this.obj[name];
    return this;
  };

  /**
   * Assert that the array contains _obj_ or string contains _obj_.
   *
   * @param {Mixed} obj|string
   * @api public
   */

  Assertion.prototype.string =
  Assertion.prototype.contain = function (obj) {
    if ('string' == typeof this.obj) {
      this.assert(
          ~this.obj.indexOf(obj)
        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }
        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });
    } else {
      this.assert(
          ~indexOf(this.obj, obj)
        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }
        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });
    }
    return this;
  };

  /**
   * Assert exact keys or inclusion of keys by using
   * the `.own` modifier.
   *
   * @param {Array|String ...} keys
   * @api public
   */

  Assertion.prototype.key =
  Assertion.prototype.keys = function ($keys) {
    var str
      , ok = true;

    $keys = isArray($keys)
      ? $keys
      : Array.prototype.slice.call(arguments);

    if (!$keys.length) throw new Error('keys required');

    var actual = keys(this.obj)
      , len = $keys.length;

    // Inclusion
    ok = every($keys, function (key) {
      return ~indexOf(actual, key);
    });

    // Strict
    if (!this.flags.not && this.flags.only) {
      ok = ok && $keys.length == actual.length;
    }

    // Key string
    if (len > 1) {
      $keys = map($keys, function (key) {
        return i(key);
      });
      var last = $keys.pop();
      str = $keys.join(', ') + ', and ' + last;
    } else {
      str = i($keys[0]);
    }

    // Form
    str = (len > 1 ? 'keys ' : 'key ') + str;

    // Have / include
    str = (!this.flags.only ? 'include ' : 'only have ') + str;

    // Assertion
    this.assert(
        ok
      , function(){ return 'expected ' + i(this.obj) + ' to ' + str }
      , function(){ return 'expected ' + i(this.obj) + ' to not ' + str });

    return this;
  };

  /**
   * Assert a failure.
   *
   * @param {String ...} custom message
   * @api public
   */
  Assertion.prototype.fail = function (msg) {
    var error = function() { return msg || "explicit failure"; }
    this.assert(false, error, error);
    return this;
  };

  /**
   * Function bind implementation.
   */

  function bind (fn, scope) {
    return function () {
      return fn.apply(scope, arguments);
    }
  }

  /**
   * Array every compatibility
   *
   * @see bit.ly/5Fq1N2
   * @api public
   */

  function every (arr, fn, thisObj) {
    var scope = thisObj || global;
    for (var i = 0, j = arr.length; i < j; ++i) {
      if (!fn.call(scope, arr[i], i, arr)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Array indexOf compatibility.
   *
   * @see bit.ly/a5Dxa2
   * @api public
   */

  function indexOf (arr, o, i) {
    if (Array.prototype.indexOf) {
      return Array.prototype.indexOf.call(arr, o, i);
    }

    if (arr.length === undefined) {
      return -1;
    }

    for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0
        ; i < j && arr[i] !== o; i++);

    return j <= i ? -1 : i;
  }

  // https://gist.github.com/1044128/
  var getOuterHTML = function(element) {
    if ('outerHTML' in element) return element.outerHTML;
    var ns = "http://www.w3.org/1999/xhtml";
    var container = document.createElementNS(ns, '_');
    var xmlSerializer = new XMLSerializer();
    var html;
    if (document.xmlVersion) {
      return xmlSerializer.serializeToString(element);
    } else {
      container.appendChild(element.cloneNode(false));
      html = container.innerHTML.replace('><', '>' + element.innerHTML + '<');
      container.innerHTML = '';
      return html;
    }
  };

  // Returns true if object is a DOM element.
  var isDOMElement = function (object) {
    if (typeof HTMLElement === 'object') {
      return object instanceof HTMLElement;
    } else {
      return object &&
        typeof object === 'object' &&
        object.nodeType === 1 &&
        typeof object.nodeName === 'string';
    }
  };

  /**
   * Inspects an object.
   *
   * @see taken from node.js `util` module (copyright Joyent, MIT license)
   * @api private
   */

  function i (obj, showHidden, depth) {
    var seen = [];

    function stylize (str) {
      return str;
    }

    function format (value, recurseTimes) {
      // Provide a hook for user-specified inspect functions.
      // Check that value is an object with an inspect function on it
      if (value && typeof value.inspect === 'function' &&
          // Filter out the util module, it's inspect function is special
          value !== exports &&
          // Also filter out any prototype objects using the circular check.
          !(value.constructor && value.constructor.prototype === value)) {
        return value.inspect(recurseTimes);
      }

      // Primitive types cannot have properties
      switch (typeof value) {
        case 'undefined':
          return stylize('undefined', 'undefined');

        case 'string':
          var simple = '\'' + json.stringify(value).replace(/^"|"$/g, '')
                                                   .replace(/'/g, "\\'")
                                                   .replace(/\\"/g, '"') + '\'';
          return stylize(simple, 'string');

        case 'number':
          return stylize('' + value, 'number');

        case 'boolean':
          return stylize('' + value, 'boolean');
      }
      // For some reason typeof null is "object", so special case here.
      if (value === null) {
        return stylize('null', 'null');
      }

      if (isDOMElement(value)) {
        return getOuterHTML(value);
      }

      // Look up the keys of the object.
      var visible_keys = keys(value);
      var $keys = showHidden ? Object.getOwnPropertyNames(value) : visible_keys;

      // Functions without properties can be shortcutted.
      if (typeof value === 'function' && $keys.length === 0) {
        if (isRegExp(value)) {
          return stylize('' + value, 'regexp');
        } else {
          var name = value.name ? ': ' + value.name : '';
          return stylize('[Function' + name + ']', 'special');
        }
      }

      // Dates without properties can be shortcutted
      if (isDate(value) && $keys.length === 0) {
        return stylize(value.toUTCString(), 'date');
      }
      
      // Error objects can be shortcutted
      if (value instanceof Error) {
        return stylize("["+value.toString()+"]", 'Error');
      }

      var base, type, braces;
      // Determine the object type
      if (isArray(value)) {
        type = 'Array';
        braces = ['[', ']'];
      } else {
        type = 'Object';
        braces = ['{', '}'];
      }

      // Make functions say that they are functions
      if (typeof value === 'function') {
        var n = value.name ? ': ' + value.name : '';
        base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
      } else {
        base = '';
      }

      // Make dates with properties first say the date
      if (isDate(value)) {
        base = ' ' + value.toUTCString();
      }

      if ($keys.length === 0) {
        return braces[0] + base + braces[1];
      }

      if (recurseTimes < 0) {
        if (isRegExp(value)) {
          return stylize('' + value, 'regexp');
        } else {
          return stylize('[Object]', 'special');
        }
      }

      seen.push(value);

      var output = map($keys, function (key) {
        var name, str;
        if (value.__lookupGetter__) {
          if (value.__lookupGetter__(key)) {
            if (value.__lookupSetter__(key)) {
              str = stylize('[Getter/Setter]', 'special');
            } else {
              str = stylize('[Getter]', 'special');
            }
          } else {
            if (value.__lookupSetter__(key)) {
              str = stylize('[Setter]', 'special');
            }
          }
        }
        if (indexOf(visible_keys, key) < 0) {
          name = '[' + key + ']';
        }
        if (!str) {
          if (indexOf(seen, value[key]) < 0) {
            if (recurseTimes === null) {
              str = format(value[key]);
            } else {
              str = format(value[key], recurseTimes - 1);
            }
            if (str.indexOf('\n') > -1) {
              if (isArray(value)) {
                str = map(str.split('\n'), function (line) {
                  return '  ' + line;
                }).join('\n').substr(2);
              } else {
                str = '\n' + map(str.split('\n'), function (line) {
                  return '   ' + line;
                }).join('\n');
              }
            }
          } else {
            str = stylize('[Circular]', 'special');
          }
        }
        if (typeof name === 'undefined') {
          if (type === 'Array' && key.match(/^\d+$/)) {
            return str;
          }
          name = json.stringify('' + key);
          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
            name = name.substr(1, name.length - 2);
            name = stylize(name, 'name');
          } else {
            name = name.replace(/'/g, "\\'")
                       .replace(/\\"/g, '"')
                       .replace(/(^"|"$)/g, "'");
            name = stylize(name, 'string');
          }
        }

        return name + ': ' + str;
      });

      seen.pop();

      var numLinesEst = 0;
      var length = reduce(output, function (prev, cur) {
        numLinesEst++;
        if (indexOf(cur, '\n') >= 0) numLinesEst++;
        return prev + cur.length + 1;
      }, 0);

      if (length > 50) {
        output = braces[0] +
                 (base === '' ? '' : base + '\n ') +
                 ' ' +
                 output.join(',\n  ') +
                 ' ' +
                 braces[1];

      } else {
        output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
      }

      return output;
    }
    return format(obj, (typeof depth === 'undefined' ? 2 : depth));
  }

  expect.stringify = i;

  function isArray (ar) {
    return Object.prototype.toString.call(ar) === '[object Array]';
  }

  function isRegExp(re) {
    var s;
    try {
      s = '' + re;
    } catch (e) {
      return false;
    }

    return re instanceof RegExp || // easy case
           // duck-type for context-switching evalcx case
           typeof(re) === 'function' &&
           re.constructor.name === 'RegExp' &&
           re.compile &&
           re.test &&
           re.exec &&
           s.match(/^\/.*\/[gim]{0,3}$/);
  }

  function isDate(d) {
    return d instanceof Date;
  }

  function keys (obj) {
    if (Object.keys) {
      return Object.keys(obj);
    }

    var keys = [];

    for (var i in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, i)) {
        keys.push(i);
      }
    }

    return keys;
  }

  function map (arr, mapper, that) {
    if (Array.prototype.map) {
      return Array.prototype.map.call(arr, mapper, that);
    }

    var other= new Array(arr.length);

    for (var i= 0, n = arr.length; i<n; i++)
      if (i in arr)
        other[i] = mapper.call(that, arr[i], i, arr);

    return other;
  }

  function reduce (arr, fun) {
    if (Array.prototype.reduce) {
      return Array.prototype.reduce.apply(
          arr
        , Array.prototype.slice.call(arguments, 1)
      );
    }

    var len = +this.length;

    if (typeof fun !== "function")
      throw new TypeError();

    // no value to return if no initial value and an empty array
    if (len === 0 && arguments.length === 1)
      throw new TypeError();

    var i = 0;
    if (arguments.length >= 2) {
      var rv = arguments[1];
    } else {
      do {
        if (i in this) {
          rv = this[i++];
          break;
        }

        // if array contains no values, no initial value to return
        if (++i >= len)
          throw new TypeError();
      } while (true);
    }

    for (; i < len; i++) {
      if (i in this)
        rv = fun.call(null, rv, this[i], i, this);
    }

    return rv;
  }

  /**
   * Asserts deep equality
   *
   * @see taken from node.js `assert` module (copyright Joyent, MIT license)
   * @api private
   */

  expect.eql = function eql(actual, expected) {
    // 7.1. All identical values are equivalent, as determined by ===.
    if (actual === expected) {
      return true;
    } else if ('undefined' != typeof Buffer
      && Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
      if (actual.length != expected.length) return false;

      for (var i = 0; i < actual.length; i++) {
        if (actual[i] !== expected[i]) return false;
      }

      return true;

      // 7.2. If the expected value is a Date object, the actual value is
      // equivalent if it is also a Date object that refers to the same time.
    } else if (actual instanceof Date && expected instanceof Date) {
      return actual.getTime() === expected.getTime();

      // 7.3. Other pairs that do not both pass typeof value == "object",
      // equivalence is determined by ==.
    } else if (typeof actual != 'object' && typeof expected != 'object') {
      return actual == expected;
    // If both are regular expression use the special `regExpEquiv` method
    // to determine equivalence.
    } else if (isRegExp(actual) && isRegExp(expected)) {
      return regExpEquiv(actual, expected);
    // 7.4. For all other Object pairs, including Array objects, equivalence is
    // determined by having the same number of owned properties (as verified
    // with Object.prototype.hasOwnProperty.call), the same set of keys
    // (although not necessarily the same order), equivalent values for every
    // corresponding key, and an identical "prototype" property. Note: this
    // accounts for both named and indexed properties on Arrays.
    } else {
      return objEquiv(actual, expected);
    }
  };

  function isUndefinedOrNull (value) {
    return value === null || value === undefined;
  }

  function isArguments (object) {
    return Object.prototype.toString.call(object) == '[object Arguments]';
  }

  function regExpEquiv (a, b) {
    return a.source === b.source && a.global === b.global &&
           a.ignoreCase === b.ignoreCase && a.multiline === b.multiline;
  }

  function objEquiv (a, b) {
    if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
      return false;
    // an identical "prototype" property.
    if (a.prototype !== b.prototype) return false;
    //~~~I've managed to break Object.keys through screwy arguments passing.
    //   Converting to array solves the problem.
    if (isArguments(a)) {
      if (!isArguments(b)) {
        return false;
      }
      a = pSlice.call(a);
      b = pSlice.call(b);
      return expect.eql(a, b);
    }
    try{
      var ka = keys(a),
        kb = keys(b),
        key, i;
    } catch (e) {//happens when one is a string literal and the other isn't
      return false;
    }
    // having the same number of owned properties (keys incorporates hasOwnProperty)
    if (ka.length != kb.length)
      return false;
    //the same set of keys (although not necessarily the same order),
    ka.sort();
    kb.sort();
    //~~~cheap key test
    for (i = ka.length - 1; i >= 0; i--) {
      if (ka[i] != kb[i])
        return false;
    }
    //equivalent values for every corresponding key, and
    //~~~possibly expensive deep test
    for (i = ka.length - 1; i >= 0; i--) {
      key = ka[i];
      if (!expect.eql(a[key], b[key]))
         return false;
    }
    return true;
  }

  var json = (function () {
    "use strict";

    if ('object' == typeof JSON && JSON.parse && JSON.stringify) {
      return {
          parse: nativeJSON.parse
        , stringify: nativeJSON.stringify
      }
    }

    var JSON = {};

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    function date(d, key) {
      return isFinite(d.valueOf()) ?
          d.getUTCFullYear()     + '-' +
          f(d.getUTCMonth() + 1) + '-' +
          f(d.getUTCDate())      + 'T' +
          f(d.getUTCHours())     + ':' +
          f(d.getUTCMinutes())   + ':' +
          f(d.getUTCSeconds())   + 'Z' : null;
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

  // If the string contains no control characters, no quote characters, and no
  // backslash characters, then we can safely slap some quotes around it.
  // Otherwise we must also replace the offending characters with safe escape
  // sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

  // Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

  // If the value has a toJSON method, call it to obtain a replacement value.

        if (value instanceof Date) {
            value = date(key);
        }

  // If we were called with a replacer function, then call the replacer to
  // obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

  // What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

  // JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

  // If the value is a boolean or null, convert it to a string. Note:
  // typeof null does not produce 'null'. The case is included here in
  // the remote chance that this gets fixed someday.

            return String(value);

  // If the type is 'object', we might be dealing with an object or an array or
  // null.

        case 'object':

  // Due to a specification blunder in ECMAScript, typeof null is 'object',
  // so watch out for that case.

            if (!value) {
                return 'null';
            }

  // Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

  // Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

  // The value is an array. Stringify every element. Use null as a placeholder
  // for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

  // Join all of the elements together, separated with commas, and wrap them in
  // brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

  // If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

  // Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

  // Join all of the member texts together, separated with commas,
  // and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

  // If the JSON object does not yet have a stringify method, give it one.

    JSON.stringify = function (value, replacer, space) {

  // The stringify method takes a value and an optional replacer, and an optional
  // space parameter, and returns a JSON text. The replacer can be a function
  // that can replace values, or an array of strings that will select the keys.
  // A default replacer method can be provided. Use of the space parameter can
  // produce text that is more easily readable.

        var i;
        gap = '';
        indent = '';

  // If the space parameter is a number, make an indent string containing that
  // many spaces.

        if (typeof space === 'number') {
            for (i = 0; i < space; i += 1) {
                indent += ' ';
            }

  // If the space parameter is a string, it will be used as the indent string.

        } else if (typeof space === 'string') {
            indent = space;
        }

  // If there is a replacer, it must be a function or an array.
  // Otherwise, throw an error.

        rep = replacer;
        if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                typeof replacer.length !== 'number')) {
            throw new Error('JSON.stringify');
        }

  // Make a fake root object containing our value under the key of ''.
  // Return the result of stringifying the value.

        return str('', {'': value});
    };

  // If the JSON object does not yet have a parse method, give it one.

    JSON.parse = function (text, reviver) {
    // The parse method takes a text and an optional reviver function, and returns
    // a JavaScript value if the text is a valid JSON text.

        var j;

        function walk(holder, key) {

    // The walk method is used to recursively walk the resulting structure so
    // that modifications can be made.

            var k, v, value = holder[key];
            if (value && typeof value === 'object') {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = walk(value, k);
                        if (v !== undefined) {
                            value[k] = v;
                        } else {
                            delete value[k];
                        }
                    }
                }
            }
            return reviver.call(holder, key, value);
        }


    // Parsing happens in four stages. In the first stage, we replace certain
    // Unicode characters with escape sequences. JavaScript handles many characters
    // incorrectly, either silently deleting them, or treating them as line endings.

        text = String(text);
        cx.lastIndex = 0;
        if (cx.test(text)) {
            text = text.replace(cx, function (a) {
                return '\\u' +
                    ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            });
        }

    // In the second stage, we run the text against regular expressions that look
    // for non-JSON patterns. We are especially concerned with '()' and 'new'
    // because they can cause invocation, and '=' because it can cause mutation.
    // But just to be safe, we want to reject all unexpected forms.

    // We split the second stage into 4 regexp operations in order to work around
    // crippling inefficiencies in IE's and Safari's regexp engines. First we
    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
    // replace all simple value tokens with ']' characters. Third, we delete all
    // open brackets that follow a colon or comma or that begin the text. Finally,
    // we look to see that the remaining characters are only whitespace or ']' or
    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

        if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

    // In the third stage we use the eval function to compile the text into a
    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
    // in JavaScript: it can begin a block or an object literal. We wrap the text
    // in parens to eliminate the ambiguity.

            j = eval('(' + text + ')');

    // In the optional fourth stage, we recursively walk the new structure, passing
    // each name/value pair to a reviver function for possible transformation.

            return typeof reviver === 'function' ?
                walk({'': j}, '') : j;
        }

    // If the text is not JSON parseable, then a SyntaxError is thrown.

        throw new SyntaxError('JSON.parse');
    };

    return JSON;
  })();

  if ('undefined' != typeof window) {
    window.expect = module.exports;
  }

})(
    this
  , 'undefined' != typeof module ? module : {exports: {}}
);

}).call(this,require("buffer").Buffer)
},{"buffer":10}],6:[function(require,module,exports){
/*
	String Kit
	
	Copyright (c) 2014 - 2016 Cédric Ronvel
	
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



var camel = {} ;
module.exports = camel ;



// Transform alphanum separated by underscore or minus to camel case
camel.toCamelCase = function toCamelCase( str )
{
	if ( ! str || typeof str !== 'string' ) { return '' ; }
	
	return str.replace( /^[\s_-]*([^\s_-]+)|[\s_-]+([^\s_-]?)([^\s_-]*)/g , function( match , firstWord , firstLetter , endOfWord ) {
		
		if ( firstWord ) { return firstWord.toLowerCase() ; }
		if ( ! firstLetter ) { return '' ; }
		return firstLetter.toUpperCase() + endOfWord.toLowerCase() ;
	} ) ;
} ;



// Transform camel case to alphanum separated by minus
camel.camelCaseToDashed = function camelCaseToDashed( str )
{
	if ( ! str || typeof str !== 'string' ) { return '' ; }
	
	return str.replace( /^([A-Z])|([A-Z])/g , function( match , firstLetter , letter ) {
		
		if ( firstLetter ) { return firstLetter.toLowerCase() ; }
		return '-' + letter.toLowerCase() ;
	} ) ;
} ;



},{}],7:[function(require,module,exports){
/*
	The Cedric's Swiss Knife (CSK) - CSK object tree toolbox

	Copyright (c) 2014, 2015 Cédric Ronvel 
	
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



var treePath = {} ;
module.exports = treePath ;



treePath.op = function op( type , object , path , value )
{
	var i , parts , last , pointer , key , isArray = false , pathArrayMode = false , isGenericSet ;
	
	if ( typeof path === 'string' )
	{
		// Split the path into parts
		parts = path.match( /([.#\[\]]|[^.#\[\]]+)/g ) ;
		//parts = path.match( /([.#](?!$)|[^.#]+)/g ) ;
	}
	else if ( Array.isArray( path ) )
	{
		parts = path ;
		pathArrayMode = true ;
	}
	else
	{
		throw new TypeError( '[tree.path] .' + type + '(): the path argument should be a string or an array' ) ;
	}
	
	switch ( type )
	{
		case 'get' :
		case 'delete' :
			isGenericSet = false ;
			break ;
		case 'set' :
		case 'define' :
		case 'inc' :
		case 'dec' :
		case 'append' :
		case 'prepend' :
		case 'autoPush' :
			isGenericSet = true ;
			break ;
		default :
			throw new TypeError( "[tree.path] .op(): wrong type of operation '" + type + "'" ) ;
	}
	
	
	//console.log( parts ) ;
	// The pointer start at the object's root
	pointer = object ;
	
	last = parts.length - 1 ;
	
	for ( i = 0 ; i <= last ; i ++ )
	{
		if ( pathArrayMode )
		{
			if ( key === undefined )
			{
				key = parts[ i ] ;
				continue ;
			}
			
			if ( ! pointer[ key ] || ( typeof pointer[ key ] !== 'object' && typeof pointer[ key ] !== 'function' ) )
			{
				if ( ! isGenericSet ) { return undefined ; }
				pointer[ key ] = {} ;
			}
			
			pointer = pointer[ key ] ;
			key = parts[ i ] ;
			
			continue ;
		}
		else if ( parts[ i ] === '.' )
		{
			isArray = false ;
			
			if ( key === undefined ) { continue ; }
			
			if ( ! pointer[ key ] || ( typeof pointer[ key ] !== 'object' && typeof pointer[ key ] !== 'function' ) )
			{
				if ( ! isGenericSet ) { return undefined ; }
				pointer[ key ] = {} ;
			}
			
			pointer = pointer[ key ] ;
			
			continue ;
		}
		else if ( parts[ i ] === '#' || parts[ i ] === '[' )
		{
			isArray = true ;
			
			if ( key === undefined )
			{
				// The root element cannot be altered, we are in trouble if an array is expected but we have only a regular object.
				if ( ! Array.isArray( pointer ) ) { return undefined ; }
				continue ;
			}
			
			if ( ! pointer[ key ] || ! Array.isArray( pointer[ key ] ) )
			{
				if ( ! isGenericSet ) { return undefined ; }
				pointer[ key ] = [] ;
			}
			
			pointer = pointer[ key ] ;
			
			continue ;
		}
		else if ( parts[ i ] === ']' )
		{
			// Closing bracket: do nothing
			continue ;
		}
		
		if ( ! isArray ) { key = parts[ i ] ; continue ; }
		
		switch ( parts[ i ] )
		{
			case 'length' :
				key = parts[ i ] ;
				break ;
			
			// Pseudo-key
			case 'first' :
				key = 0 ;
				break ;
			case 'last' :
				key = pointer.length - 1 ;
				if ( key < 0 ) { key = 0 ; }
				break ;
			case 'next' :
				if ( ! isGenericSet ) { return undefined ; }
				key = pointer.length ;
				break ;
			case 'insert' :
				if ( ! isGenericSet ) { return undefined ; }
				pointer.unshift( undefined ) ;
				key = 0 ;
				break ;
			
			// default = number
			default:
				// Convert the string key to a numerical index
				key = parseInt( parts[ i ] , 10 ) ;
		}
	}
	
	switch ( type )
	{
		case 'get' :
			return pointer[ key ] ;
		case 'delete' :
			if ( isArray && typeof key === 'number' ) { pointer.splice( key , 1 ) ; }
			else { delete pointer[ key ] ; }
			return ;
		case 'set' :
			pointer[ key ] = value ;
			return pointer[ key ] ;
		case 'define' :
			// define: set only if it doesn't exist
			if ( ! ( key in pointer ) ) { pointer[ key ] = value ; }
			return pointer[ key ] ;
		case 'inc' :
			if ( typeof pointer[ key ] === 'number' ) { pointer[ key ] ++ ; }
			else if ( ! pointer[ key ] || typeof pointer[ key ] !== 'object' ) { pointer[ key ] = 1 ; }
			return pointer[ key ] ;
		case 'dec' :
			if ( typeof pointer[ key ] === 'number' ) { pointer[ key ] -- ; }
			else if ( ! pointer[ key ] || typeof pointer[ key ] !== 'object' ) { pointer[ key ] = -1 ; }
			return pointer[ key ] ;
		case 'append' :
			if ( ! pointer[ key ] ) { pointer[ key ] = [ value ] ; }
			else if ( Array.isArray( pointer[ key ] ) ) { pointer[ key ].push( value ) ; }
			//else ? do nothing???
			return pointer[ key ] ;
		case 'prepend' :
			if ( ! pointer[ key ] ) { pointer[ key ] = [ value ] ; }
			else if ( Array.isArray( pointer[ key ] ) ) { pointer[ key ].unshift( value ) ; }
			//else ? do nothing???
			return pointer[ key ] ;
		case 'autoPush' :
			if ( pointer[ key ] === undefined ) { pointer[ key ] = value ; }
			else if ( Array.isArray( pointer[ key ] ) ) { pointer[ key ].push( value ) ; }
			else { pointer[ key ] = [ pointer[ key ] , value ] ; }
			return pointer[ key ] ;
	}
} ;



// get, set and delete use the same op() function
treePath.get = treePath.op.bind( undefined , 'get' ) ;
treePath.delete = treePath.op.bind( undefined , 'delete' ) ;
treePath.set = treePath.op.bind( undefined , 'set' ) ;
treePath.define = treePath.op.bind( undefined , 'define' ) ;
treePath.inc = treePath.op.bind( undefined , 'inc' ) ;
treePath.dec = treePath.op.bind( undefined , 'dec' ) ;
treePath.append = treePath.op.bind( undefined , 'append' ) ;
treePath.prepend = treePath.op.bind( undefined , 'prepend' ) ;
treePath.autoPush = treePath.op.bind( undefined , 'autoPush' ) ;



// Prototype used for object creation, so they can be created with Object.create( tree.path.prototype )
treePath.prototype = {
	get: function( path ) { return treePath.get( this , path ) ; } ,
	delete: function( path ) { return treePath.delete( this , path ) ; } ,
	set: function( path , value ) { return treePath.set( this , path , value ) ; } ,
	define: function( path , value ) { return treePath.define( this , path , value ) ; } ,
	inc: function( path , value ) { return treePath.inc( this , path , value ) ; } ,
	dec: function( path , value ) { return treePath.dec( this , path , value ) ; } ,
	append: function( path , value ) { return treePath.append( this , path , value ) ; } ,
	prepend: function( path , value ) { return treePath.prepend( this , path , value ) ; } ,
	autoPush: function( path , value ) { return treePath.autoPush( this , path , value ) ; }
} ;



// Upgrade an object so it can support get, set and delete at its root
treePath.upgrade = function upgrade( object )
{
	Object.defineProperties( object , {
		get: { value: treePath.op.bind( undefined , 'get' , object ) } ,
		delete: { value: treePath.op.bind( undefined , 'delete' , object ) } ,
		set: { value: treePath.op.bind( undefined , 'set' , object ) } ,
		define: { value: treePath.op.bind( undefined , 'define' , object ) } ,
		inc: { value: treePath.op.bind( undefined , 'inc' , object ) } ,
		dec: { value: treePath.op.bind( undefined , 'dec' , object ) } ,
		append: { value: treePath.op.bind( undefined , 'append' , object ) } ,
		prepend: { value: treePath.op.bind( undefined , 'prepend' , object ) } ,
		autoPush: { value: treePath.op.bind( undefined , 'autoPush' , object ) }
	} ) ;
} ;




},{}],8:[function(require,module,exports){
/*
	Rest Query (shared lib)
	
	Copyright (c) 2014 - 2016 Cédric Ronvel
	
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



describe( "Path pattern matching" , function() {
	
	var pathMatch = restQuery.path.match ;
	
	it( "Basic pattern matching" , function() {
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
		expect( matches.primaryPath ).to.be( matches.full ) ;
		expect( matches.users.upto.toString() ).to.be( '/Users' ) ;
		expect( matches.usersDocument.upto.toString() ).to.be( '/Users/123456789012345678901234' ) ;
		expect( matches.usersDocument.match.toString() ).to.be( '/123456789012345678901234' ) ;
		expect( matches.usersDocument.match[ 0 ].value ).to.be( '123456789012345678901234' ) ;
		
		expect( pathMatch( '/Users/12345678901234567890123a' , '/Users/123456789012345678901234' ) ).not.to.be.ok() ;
		
		matches = pathMatch( '/Boards/123456789012345678901234/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"boardsDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"usersDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		expect( matches.primaryPath ).to.be( matches.full ) ;
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
		expect( matches.primaryPath ).to.be( matches.full ) ;
		expect( matches.wildId.toString() ).to.be( '/123456789012345678901234' ) ;
		expect( matches.wildId.match.toString() ).to.be( '/123456789012345678901234' ) ;
		expect( matches.wildId.upto.toString() ).to.be( '/Boards/123456789012345678901234' ) ;
		expect( matches.wildId ).to.eql( matches.boardsDocument ) ;
		
		expect( pathMatch( '/Boards/{id}' , '/Boards/slug' ) ).not.to.be.ok() ;
		
		matches = pathMatch( '/Boards/{id}/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildId":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"boardsDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"usersDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		expect( matches.primaryPath ).to.be( matches.full ) ;
		
		
		matches = pathMatch( '/Boards/{id}/Users/{id}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"boardsDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildId1":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildId2":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"usersDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		expect( matches.primaryPath ).to.be( matches.full ) ;
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
		expect( matches.primaryPath ).to.be( matches.full ) ;
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
		expect( matches.primaryPath ).to.be( matches.full ) ;
		expect( matches.wild1.upto.toString() ).to.be( '/Boards/123456789012345678901234' ) ;
		expect( matches.wild2.upto.toString() ).to.be( '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		
		matches = pathMatch( '/Boards/123456789012345678901234/{*}/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"boardsDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wild":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		
		matches = pathMatch( '/{*}/123456789012345678901234/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '  ' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"wild":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"usersDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
	} ) ;
	
	it( "Pattern matching with the '{id}' wildcard" , function() {
		var matches ;
		
		matches = pathMatch( '/Boards/{id}' , '/Boards/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildId":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"boardsDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		expect( matches.primaryPath ).to.be( matches.full ) ;
		expect( matches.wildId.toString() ).to.be( '/123456789012345678901234' ) ;
		expect( matches.wildId.match.toString() ).to.be( '/123456789012345678901234' ) ;
		expect( matches.wildId.upto.toString() ).to.be( '/Boards/123456789012345678901234' ) ;
		
		expect( pathMatch( '/Boards/{id}' , '/Boards/slug' ) ).not.to.be.ok() ;
		
		matches = pathMatch( '/Boards/{id}/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildId":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"boardsDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"usersDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		
		
		matches = pathMatch( '/Boards/{id}/Users/{id}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"boardsDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildId1":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildId2":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"usersDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		expect( matches.wildId1.upto.toString() ).to.be( '/Boards/123456789012345678901234' ) ;
		expect( matches.wildId2.upto.toString() ).to.be( '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		
		expect( pathMatch( '/Boards/123456789012345678901234/{id}/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
		expect( pathMatch( '/{id}/123456789012345678901234/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
	} ) ;
	
	it( "Pattern matching with the '{slugId}' wildcard" , function() {
		var matches ;
		
		expect( pathMatch( '/Boards/{slugId}' , '/Boards/123456789012345678901234' ) ).not.to.be.ok() ;
		
		matches = pathMatch( '/Boards/{slugId}' , '/Boards/slug' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]},"wildSlugId":{"match":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"onward":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]},"boardsDocument":{"match":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"onward":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]}} ) ;
		expect( matches.primaryPath ).to.be( matches.full ) ;
		expect( matches.wildSlugId.toString() ).to.be( '/slug' ) ;
		expect( matches.wildSlugId.match.toString() ).to.be( '/slug' ) ;
		expect( matches.wildSlugId.upto.toString() ).to.be( '/Boards/slug' ) ;
		
		matches = pathMatch( '/Boards/{slugId}/Users/slug' , '/Boards/slug/Users/slug' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]},"wildSlugId":{"match":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"onward":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]},"boardsDocument":{"match":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"onward":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]},"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"after":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]},"usersDocument":{"match":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"onward":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]}} ) ;
		
		
		matches = pathMatch( '/Boards/{slugId}/Users/{slugId}' , '/Boards/slug/Users/slug' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]},"boardsDocument":{"match":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"onward":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]},"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"after":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]},"wildSlugId1":{"match":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"onward":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]},"wildSlugId2":{"match":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"onward":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]},"usersDocument":{"match":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"onward":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]}} ) ;
		expect( matches.wildSlugId1.upto.toString() ).to.be( '/Boards/slug' ) ;
		expect( matches.wildSlugId2.upto.toString() ).to.be( '/Boards/slug/Users/slug' ) ;
		
		expect( pathMatch( '/Boards/123456789012345678901234/{slugId}/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
		expect( pathMatch( '/{slugId}/123456789012345678901234/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
	} ) ;
	
	it( "Pattern matching with the '{document}' wildcard" , function() {
		var matches ;
		
		matches = pathMatch( '/Boards/{document}' , '/Boards/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"boardsDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		expect( matches.primaryPath ).to.be( matches.full ) ;
		expect( matches.wildDocument.toString() ).to.be( '/123456789012345678901234' ) ;
		expect( matches.wildDocument.match.toString() ).to.be( '/123456789012345678901234' ) ;
		expect( matches.wildDocument.upto.toString() ).to.be( '/Boards/123456789012345678901234' ) ;
		
		matches = pathMatch( '/Boards/{document}' , '/Boards/slug' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]},"wildDocument":{"match":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"onward":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]},"boardsDocument":{"match":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"onward":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]}} ) ;
		expect( matches.wildDocument.toString() ).to.be( '/slug' ) ;
		expect( matches.wildDocument.match.toString() ).to.be( '/slug' ) ;
		expect( matches.wildDocument.upto.toString() ).to.be( '/Boards/slug' ) ;
		
		matches = pathMatch( '/Boards/{document}/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"boardsDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"usersDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		
		matches = pathMatch( '/Boards/{document}/Users/slug' , '/Boards/slug/Users/slug' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]},"wildDocument":{"match":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"onward":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]},"boardsDocument":{"match":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"onward":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]},"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"after":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]},"usersDocument":{"match":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"onward":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]}} ) ;
		
		
		matches = pathMatch( '/Boards/{document}/Users/{document}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"boardsDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildDocument1":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildDocument2":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"usersDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		expect( matches.wildDocument1.upto.toString() ).to.be( '/Boards/123456789012345678901234' ) ;
		expect( matches.wildDocument2.upto.toString() ).to.be( '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		
		matches = pathMatch( '/Boards/{document}/Users/{document}' , '/Boards/slug/Users/slug' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]},"boardsDocument":{"match":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"onward":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]},"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"after":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]},"wildDocument1":{"match":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"onward":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]},"wildDocument2":{"match":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"onward":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]},"usersDocument":{"match":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}],"onward":[{"value":"slug","isDocument":true,"isCollection":false,"type":"slugId","identifier":"slug"}]}} ) ;
		expect( matches.wildDocument1.upto.toString() ).to.be( '/Boards/slug' ) ;
		expect( matches.wildDocument2.upto.toString() ).to.be( '/Boards/slug/Users/slug' ) ;
		
		expect( pathMatch( '/Boards/123456789012345678901234/{document}/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
		expect( pathMatch( '/{document}/123456789012345678901234/Users/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ).not.to.be.ok() ;
	} ) ;
	
	it( "Pattern matching with the '{collection}' wildcard" , function() {
		var matches ;
		
		expect( pathMatch( '/Boards/{collection}' , '/Boards/123456789012345678901234' ) ).not.to.be.ok() ;
		
		matches = pathMatch( '/{collection}/123456789012345678901234' , '/Boards/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"wildCollection":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildCollectionDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		expect( matches.primaryPath ).to.be( matches.full ) ;
	} ) ;
	
	it( "Pattern matching with the '{...}' wildcard at the end of the pattern" , function() {
		var matches ;
		
		matches = pathMatch( '/Boards/{...}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"subPath":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		expect( matches.primaryPath ).to.be( matches.subPath.before ) ;
		expect( matches.subPath.toString() ).to.be( '/123456789012345678901234/Users/123456789012345678901234' ) ;
		expect( matches.subPath.before.toString() ).to.be( '/Boards' ) ;
		expect( matches.boards.toString() ).to.be( '/Boards' ) ;
		expect( matches.subPath.match[0].toString() ).to.be( '123456789012345678901234' ) ;
	} ) ;
	
	it( "Pattern matching with the '{...}' wildcard at the begining of the pattern" , function() {
		var matches ;
		
		matches = pathMatch( '/{...}/Users/{document}' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"subPath":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"usersDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
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
	
	it( "Pattern matching with the '{...}' wildcard at the middle of the pattern" , function() {
		var matches ;
		
		matches = pathMatch( '/Blogs/{id}/{...}/Comments/{id}' , '/Blogs/123456789012345678901234/Articles/123456789012345678901234/Comments/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Blogs","isDocument":false,"isCollection":true,"type":"collection","identifier":"blogs"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Articles","isDocument":false,"isCollection":true,"type":"collection","identifier":"articles"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Comments","isDocument":false,"isCollection":true,"type":"collection","identifier":"comments"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"blogs":{"match":[{"value":"Blogs","isDocument":false,"isCollection":true,"type":"collection","identifier":"blogs"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Articles","isDocument":false,"isCollection":true,"type":"collection","identifier":"articles"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Comments","isDocument":false,"isCollection":true,"type":"collection","identifier":"comments"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Blogs","isDocument":false,"isCollection":true,"type":"collection","identifier":"blogs"}],"onward":[{"value":"Blogs","isDocument":false,"isCollection":true,"type":"collection","identifier":"blogs"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Articles","isDocument":false,"isCollection":true,"type":"collection","identifier":"articles"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Comments","isDocument":false,"isCollection":true,"type":"collection","identifier":"comments"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"blogsDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Blogs","isDocument":false,"isCollection":true,"type":"collection","identifier":"blogs"}],"after":[{"value":"Articles","isDocument":false,"isCollection":true,"type":"collection","identifier":"articles"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Comments","isDocument":false,"isCollection":true,"type":"collection","identifier":"comments"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Blogs","isDocument":false,"isCollection":true,"type":"collection","identifier":"blogs"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Articles","isDocument":false,"isCollection":true,"type":"collection","identifier":"articles"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Comments","isDocument":false,"isCollection":true,"type":"collection","identifier":"comments"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"subPath":{"match":[{"value":"Articles","isDocument":false,"isCollection":true,"type":"collection","identifier":"articles"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Blogs","isDocument":false,"isCollection":true,"type":"collection","identifier":"blogs"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"after":[{"value":"Comments","isDocument":false,"isCollection":true,"type":"collection","identifier":"comments"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Blogs","isDocument":false,"isCollection":true,"type":"collection","identifier":"blogs"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Articles","isDocument":false,"isCollection":true,"type":"collection","identifier":"articles"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"Articles","isDocument":false,"isCollection":true,"type":"collection","identifier":"articles"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Comments","isDocument":false,"isCollection":true,"type":"collection","identifier":"comments"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"comments":{"match":[{"value":"Comments","isDocument":false,"isCollection":true,"type":"collection","identifier":"comments"}],"before":[{"value":"Blogs","isDocument":false,"isCollection":true,"type":"collection","identifier":"blogs"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Articles","isDocument":false,"isCollection":true,"type":"collection","identifier":"articles"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Blogs","isDocument":false,"isCollection":true,"type":"collection","identifier":"blogs"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Articles","isDocument":false,"isCollection":true,"type":"collection","identifier":"articles"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Comments","isDocument":false,"isCollection":true,"type":"collection","identifier":"comments"}],"onward":[{"value":"Comments","isDocument":false,"isCollection":true,"type":"collection","identifier":"comments"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildId1":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Blogs","isDocument":false,"isCollection":true,"type":"collection","identifier":"blogs"}],"after":[{"value":"Articles","isDocument":false,"isCollection":true,"type":"collection","identifier":"articles"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Comments","isDocument":false,"isCollection":true,"type":"collection","identifier":"comments"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Blogs","isDocument":false,"isCollection":true,"type":"collection","identifier":"blogs"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Articles","isDocument":false,"isCollection":true,"type":"collection","identifier":"articles"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Comments","isDocument":false,"isCollection":true,"type":"collection","identifier":"comments"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildId2":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Blogs","isDocument":false,"isCollection":true,"type":"collection","identifier":"blogs"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Articles","isDocument":false,"isCollection":true,"type":"collection","identifier":"articles"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Comments","isDocument":false,"isCollection":true,"type":"collection","identifier":"comments"}],"after":[],"upto":[{"value":"Blogs","isDocument":false,"isCollection":true,"type":"collection","identifier":"blogs"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Articles","isDocument":false,"isCollection":true,"type":"collection","identifier":"articles"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Comments","isDocument":false,"isCollection":true,"type":"collection","identifier":"comments"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"commentsDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Blogs","isDocument":false,"isCollection":true,"type":"collection","identifier":"blogs"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Articles","isDocument":false,"isCollection":true,"type":"collection","identifier":"articles"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Comments","isDocument":false,"isCollection":true,"type":"collection","identifier":"comments"}],"after":[],"upto":[{"value":"Blogs","isDocument":false,"isCollection":true,"type":"collection","identifier":"blogs"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Articles","isDocument":false,"isCollection":true,"type":"collection","identifier":"articles"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Comments","isDocument":false,"isCollection":true,"type":"collection","identifier":"comments"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		expect( matches.primaryPath ).to.be( matches.subPath.before ) ;
		expect( matches.subPath.toString() ).to.be( '/Articles/123456789012345678901234' ) ;
		expect( matches.subPath.upto.toString() ).to.be( '/Blogs/123456789012345678901234/Articles/123456789012345678901234' ) ;
		expect( matches.subPath.onward.toString() ).to.be( '/Articles/123456789012345678901234/Comments/123456789012345678901234' ) ;
		expect( matches.wildId1.upto.toString() ).to.be( '/Blogs/123456789012345678901234' ) ;
		expect( matches.wildId2.upto.toString() ).to.be( '/Blogs/123456789012345678901234/Articles/123456789012345678901234/Comments/123456789012345678901234' ) ;
	} ) ;
	
	it( "Giving custom names to matches" , function() {
		var matches ;
		
		matches = pathMatch( '/Users:people/123456789012345678901234' , '/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"people":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"peopleDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		expect( matches.users ).not.to.be.ok() ;
		expect( matches.people.onward.toString() ).to.be( '/Users/123456789012345678901234' ) ;
		expect( matches.peopleDocument.onward.toString() ).to.be( '/123456789012345678901234' ) ;
		
		matches = pathMatch( '/Users:people/{document:connectedUser}' , '/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '  ' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"people":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"connectedUser":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"peopleDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		expect( matches.users ).not.to.be.ok() ;
		expect( matches.people.onward.toString() ).to.be( '/Users/123456789012345678901234' ) ;
		expect( matches.wildDocument ).not.to.be.ok() ;
		expect( matches.connectedUser.onward.toString() ).to.be( '/123456789012345678901234' ) ;
	} ) ;
	
	it( "Contextified patterns" , function() {
		var matches , context ;
		
		//console.log( restQuery.path.parse( '/Users/{$connectedUser}/Friends/' , true ) ) ;
		expect( pathMatch( '/Users/{$connectedUser}/Friends/' , '/Users/123456789012345678901234/Friends' , { connectedUser: '123456789012345678901237' } ) ).not.to.be.ok() ;
		
		matches = pathMatch( '/Users/{$connectedUser}/Friends/' , '/Users/123456789012345678901234/Friends' , { connectedUser: '123456789012345678901234' } ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Friends","isDocument":false,"isCollection":true,"type":"collection","identifier":"friends"}],"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Friends","isDocument":false,"isCollection":true,"type":"collection","identifier":"friends"}],"upto":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Friends","isDocument":false,"isCollection":true,"type":"collection","identifier":"friends"}]},"usersDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[{"value":"Friends","isDocument":false,"isCollection":true,"type":"collection","identifier":"friends"}],"upto":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Friends","isDocument":false,"isCollection":true,"type":"collection","identifier":"friends"}]},"friends":{"match":[{"value":"Friends","isDocument":false,"isCollection":true,"type":"collection","identifier":"friends"}],"before":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"after":[],"upto":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Friends","isDocument":false,"isCollection":true,"type":"collection","identifier":"friends"}],"onward":[{"value":"Friends","isDocument":false,"isCollection":true,"type":"collection","identifier":"friends"}]}} ) ;
		
		context = pathMatch( '/Users:people/{document:connectedUser}' , '/Users/123456789012345678901234' ) ;
		expect( pathMatch( '/Users/{$connectedUser.match}/Friends/' , '/Users/123456789012345678901234/Friends' , context ) ).to.be.ok() ;
		expect( pathMatch( '/Users/{$connectedUser.match}/Friends/' , '/Users/123456789012345678901237/Friends' , context ) ).not.to.be.ok() ;
		
		context = pathMatch( '/Users:people/{document:connectedUser}' , '/Users/123456789012345678901234' ) ;
		expect( pathMatch( '/{$connectedUser.upto}/Friends/' , '/Users/123456789012345678901234/Friends' , context ) ).to.be.ok() ;
		expect( pathMatch( '/{$connectedUser.upto}/Friends/' , '/Users/123456789012345678901237/Friends' , context ) ).not.to.be.ok() ;
	} ) ;
	
	it( "Contextified patterns without the context object should throw " , function() {
		expect( function() { pathMatch( '/Users/{$connectedUser}/Friends/' , '/Users/123456789012345678901234/Friends' ) ; } ).to.throwException() ;
	} ) ;
	
	it( "Contextified patterns referencing an unexistant key should not match, returning undefined instead of false (help debugging)" , function() {
		expect( pathMatch( '/Users/{$unexistant}/Friends/' , '/Users/123456789012345678901234/Friends' , {} ) ).to.be( undefined ) ;
	} ) ;
} ) ;



describe( "Apply context" , function() {
	
	var applyContext = restQuery.path.applyContext ;
	
	it( "Contextified path referencing an unexistant key should return false" , function() {
		expect( applyContext( '/Users/{$unexistant}/Friends' , {} ) ).to.be( false ) ;
	} ) ;
	
	it( "Contextified path referencing an existant key should replace it" , function() {
		expect( applyContext( '/Users/{$connectedUser}/Friends' , { connectedUser: "123456789012345678901234" } ).toString() )
			.to.be( '/Users/123456789012345678901234/Friends' ) ;
	} ) ;
	
	it( "Contextified path referencing a path (array) should replace it" , function() {
		expect( applyContext( '/{$connectedUser}/Friends' , { connectedUser: "/Users/123456789012345678901234" } ).toString() )
			.to.be( '/Users/123456789012345678901234/Friends' ) ;
		
		expect( applyContext( '/{$connectedUser}/Friends' , { connectedUser: "/Users/123456789012345678901234" } ).toString() )
			.to.be( '/Users/123456789012345678901234/Friends' ) ;
		
		expect( applyContext( '/{$connectedUser}/Friends' , { connectedUser: "/Users/123456789012345678901234" } ) )
			.to.eql( [{value:'Users',isDocument:false,isCollection:true,type:'collection',identifier:'users'},{value:'123456789012345678901234',isDocument:true,isCollection:false,type:'id',identifier:'123456789012345678901234'},{value:'Friends',isDocument:false,isCollection:true,type:'collection',identifier:'friends'}] );
		
		expect( applyContext( '/{$connectedUser}/Friends' , { connectedUser: restQuery.path.parse( "/Users/123456789012345678901234" ) } ) )
			.to.eql( [{value:'Users',isDocument:false,isCollection:true,type:'collection',identifier:'users'},{value:'123456789012345678901234',isDocument:true,isCollection:false,type:'id',identifier:'123456789012345678901234'},{value:'Friends',isDocument:false,isCollection:true,type:'collection',identifier:'friends'}] );
	} ) ;
} ) ;
	

	
describe( "Full path parsing" , function() {
	
	var fullPathParse = restQuery.path.fullPathParse ;
	
	it( "should parse a full URL path, returning an array of node" , function() {
		expect( fullPathParse( '/' ) ).to.eql( { path: [] } ) ;
		expect( fullPathParse( '/Users' ) ).to.eql( { path: [ { type: 'collection' , isCollection: true , isDocument: false , identifier: 'users' , value: 'Users' } ] } ) ;
		expect( fullPathParse( '/Users/51d18492541d2e3614ca2a80' ) ).to.eql( {
			path: [
				{ type: 'collection' , isCollection: true , isDocument: false , identifier: 'users' , value: 'Users' } ,
				{ type: 'id' , isCollection: false , isDocument: true , identifier: '51d18492541d2e3614ca2a80' , value: '51d18492541d2e3614ca2a80' }
			]
		} ) ;
		expect( fullPathParse( '/Users/51d18492541d2e3614ca2a80#edit' ) ).to.eql( {
			path: [
				{ type: 'collection' , isCollection: true , isDocument: false , identifier: 'users' , value: 'Users' } ,
				{ type: 'id' , isCollection: false , isDocument: true , identifier: '51d18492541d2e3614ca2a80' , value: '51d18492541d2e3614ca2a80' }
			] ,
			fragment: 'edit'
		} ) ;
		expect( fullPathParse( '/Users/51d18492541d2e3614ca2a80?filter=name' ) ).to.eql( {
			path: [
				{ type: 'collection' , isCollection: true , isDocument: false , identifier: 'users' , value: 'Users' } ,
				{ type: 'id' , isCollection: false , isDocument: true , identifier: '51d18492541d2e3614ca2a80' , value: '51d18492541d2e3614ca2a80' }
			] ,
			query: 'filter=name'
		} ) ;
		expect( fullPathParse( '/Users/51d18492541d2e3614ca2a80?filter=name#edit' ) ).to.eql( {
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
	
	var fullPathMatch = restQuery.path.fullPathMatch ;
	var fullPathParse = restQuery.path.fullPathParse ;
	
	it( "Basic pattern matching" , function() {
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
		expect( matches ).to.eql( {"full":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"usersDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		
		matches = fullPathMatch( '/Users/123456789012345678901234#edit' , '/Users/123456789012345678901234#edit' ) ;
		//console.log( JSON.stringify( matches , null , '  ' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"users":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"usersDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"fragment":"edit"} ) ;
		expect( matches.fragment ).to.be( 'edit' ) ;
		
		expect( fullPathMatch( '/Users/123456789012345678901234#edit' , '/Users/123456789012345678901234' ) ).not.to.be.ok() ;
		expect( fullPathMatch( '/Users/123456789012345678901234' , '/Users/123456789012345678901234#edit' ) ).to.be.ok() ;
	} ) ;
	
	it( "Complex pattern matching" , function() {
		var matches ;
		
		matches = fullPathMatch( '/Boards/123456789012345678901234/{collection}/123456789012345678901234' , '/Boards/123456789012345678901234/Users/123456789012345678901234' ) ;
		//console.log( JSON.stringify( matches , null , '' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"boardsDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildCollection":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildCollectionDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]}} ) ;
		
		matches = fullPathMatch( '/Boards/123456789012345678901234/{collection}/123456789012345678901234#edit' , '/Boards/123456789012345678901234/Users/123456789012345678901234#edit' ) ;
		//console.log( JSON.stringify( matches , null , '  ' ) ) ;
		expect( matches ).to.eql( {"full":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"boards":{"match":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"before":[],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"onward":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"boardsDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"}],"after":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildCollection":{"match":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"after":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"onward":[{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"wildCollectionDocument":{"match":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"before":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"}],"after":[],"upto":[{"value":"Boards","isDocument":false,"isCollection":true,"type":"collection","identifier":"boards"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"},{"value":"Users","isDocument":false,"isCollection":true,"type":"collection","identifier":"users"},{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}],"onward":[{"value":"123456789012345678901234","isDocument":true,"isCollection":false,"type":"id","identifier":"123456789012345678901234"}]},"fragment":"edit"} ) ;
		expect( matches.fragment ).to.be( 'edit' ) ;
		
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
	
	it( "Contextified patterns referencing an unexistant key should not match, returning undefined instead of false (help debugging)" , function() {
		expect( fullPathMatch( '/Users/{$unexistant}/Friends/' , '/Users/123456789012345678901234/Friends' , {} ) ).to.be( undefined ) ;
	} ) ;
	
	it( "Historical bugs" , function() {
		expect( fullPathMatch( '/{$parent.primaryPath}#add' , '/Organizations/sodip/Partners#add' , { parent: { primaryPath: '/Organizations/sodip/Partners' } } ) ).to.be.ok() ;
		
		var parsed = fullPathParse( '/{$parent.primaryPath}#add' , true ) ;
		var ppp = restQuery.path.parse( '/Organizations/sodip/Partners' ) ;
		expect( parsed.toString() ).to.be( '/{$parent.primaryPath}#add' ) ;
		expect( fullPathMatch( parsed , '/Organizations/sodip/Partners#add' , { parent: { primaryPath: ppp.toString() } } ) ).to.be.ok() ;
		expect( fullPathMatch( parsed , '/Organizations/sodip/Partners#add' , { parent: { primaryPath: ppp } } ) ).to.be.ok() ;
	} ) ;
} ) ;



},{"../lib/restQueryShared.js":3,"expect.js":5,"stream":33}],9:[function(require,module,exports){

},{}],10:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; i++) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  that.write(string, encoding)
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

function arrayIndexOf (arr, val, byteOffset, encoding) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var foundIndex = -1
  for (var i = 0; byteOffset + i < arrLength; i++) {
    if (read(arr, byteOffset + i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
      if (foundIndex === -1) foundIndex = i
      if (i - foundIndex + 1 === valLength) return (byteOffset + foundIndex) * indexSize
    } else {
      if (foundIndex !== -1) i -= i - foundIndex
      foundIndex = -1
    }
  }
  return -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  if (Buffer.isBuffer(val)) {
    // special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(this, val, byteOffset, encoding)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset, encoding)
  }

  throw new TypeError('val must be string, number or Buffer')
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; i++) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; i++) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":11,"ieee754":12,"isarray":13}],11:[function(require,module,exports){
'use strict'

exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

function init () {
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i]
    revLookup[code.charCodeAt(i)] = i
  }

  revLookup['-'.charCodeAt(0)] = 62
  revLookup['_'.charCodeAt(0)] = 63
}

init()

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],12:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],13:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],14:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],15:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],16:[function(require,module,exports){
/**
 * Determine if an object is Buffer
 *
 * Author:   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * License:  MIT
 *
 * `npm install is-buffer`
 */

module.exports = function (obj) {
  return !!(obj != null &&
    (obj._isBuffer || // For Safari 5-7 (missing Object.prototype.constructor)
      (obj.constructor &&
      typeof obj.constructor.isBuffer === 'function' &&
      obj.constructor.isBuffer(obj))
    ))
}

},{}],17:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],18:[function(require,module,exports){
module.exports = require("./lib/_stream_duplex.js")

},{"./lib/_stream_duplex.js":19}],19:[function(require,module,exports){
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

'use strict';

/*<replacement>*/

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

var keys = objectKeys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  processNextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}
},{"./_stream_readable":21,"./_stream_writable":23,"core-util-is":25,"inherits":15,"process-nextick-args":27}],20:[function(require,module,exports){
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

'use strict';

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};
},{"./_stream_transform":22,"core-util-is":25,"inherits":15}],21:[function(require,module,exports){
(function (process){
'use strict';

module.exports = Readable;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = require('events').EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream;
(function () {
  try {
    Stream = require('st' + 'ream');
  } catch (_) {} finally {
    if (!Stream) Stream = require('events').EventEmitter;
  }
})();
/*</replacement>*/

var Buffer = require('buffer').Buffer;
/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var debugUtil = require('util');
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var StringDecoder;

util.inherits(Readable, Stream);

var hasPrependListener = typeof EE.prototype.prependListener === 'function';

function prependListener(emitter, event, fn) {
  if (hasPrependListener) return emitter.prependListener(event, fn);

  // This is a brutally ugly hack to make sure that our error handler
  // is attached before any userland ones.  NEVER DO THIS. This is here
  // only because this code needs to continue to work with older versions
  // of Node.js that do not include the prependListener() method. The goal
  // is to eventually remove this hack.
  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

var Duplex;
function ReadableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~ ~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

var Duplex;
function Readable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options && typeof options.read === 'function') this._read = options.read;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;

  if (!state.objectMode && typeof chunk === 'string') {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = bufferShim.from(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var _e = new Error('stream.unshift() after end event');
      stream.emit('error', _e);
    } else {
      var skipAdd;
      if (state.decoder && !addToFront && !encoding) {
        chunk = state.decoder.write(chunk);
        skipAdd = !state.objectMode && chunk.length === 0;
      }

      if (!addToFront) state.reading = false;

      // Don't add to the buffer if we've decoded to an empty string chunk and
      // we're not in object mode
      if (!skipAdd) {
        // if we want the data now, just emit it.
        if (state.flowing && state.length === 0 && !state.sync) {
          stream.emit('data', chunk);
          stream.read(0);
        } else {
          // update the buffer info.
          state.length += state.objectMode ? 1 : chunk.length;
          if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

          if (state.needReadable) emitReadable(stream);
        }
      }

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended) return 0;

  if (state.objectMode) return n === 0 ? 0 : 1;

  if (n === null || isNaN(n)) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length) return state.buffer[0].length;else return state.length;
  }

  if (n <= 0) return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else {
      return state.length;
    }
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  var state = this._readableState;
  var nOrig = n;

  if (typeof n !== 'number' || n > 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  }

  if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read pushed data synchronously, then `reading` will be false,
  // and we need to re-evaluate how much data we can return to the user.
  if (doRead && !state.reading) n = howMuchToRead(nOrig, state);

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended) state.needReadable = true;

  // If we tried to read() past the EOF, then emit end on the next tick.
  if (nOrig !== n && state.ended && state.length === 0) endReadable(this);

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    processNextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    debug('onunpipe');
    if (readable === src) {
      cleanup();
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    if (false === ret) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var _i = 0; _i < len; _i++) {
      dests[_i].emit('unpipe', this);
    }return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1) return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  // If listening to data, and it has not explicitly been paused,
  // then call resume to start the flow of data on the next tick.
  if (ev === 'data' && false !== this._readableState.flowing) {
    this.resume();
  }

  if (ev === 'readable' && !this._readableState.endEmitted) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        processNextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    processNextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  if (state.flowing) {
    do {
      var chunk = stream.read();
    } while (null !== chunk && state.flowing);
  }
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function (ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0) return null;

  if (length === 0) ret = null;else if (objectMode) ret = list.shift();else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode) ret = list.join('');else if (list.length === 1) ret = list[0];else ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode) ret = '';else ret = bufferShim.allocUnsafe(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var _buf = list[0];
        var cpy = Math.min(n - c, _buf.length);

        if (stringMode) ret += _buf.slice(0, cpy);else _buf.copy(ret, c, 0, cpy);

        if (cpy < _buf.length) list[0] = _buf.slice(cpy);else list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    processNextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
}).call(this,require('_process'))
},{"./_stream_duplex":19,"_process":17,"buffer":10,"buffer-shims":24,"core-util-is":25,"events":14,"inherits":15,"isarray":26,"process-nextick-args":27,"string_decoder/":34,"util":9}],22:[function(require,module,exports){
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

'use strict';

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);

function TransformState(stream) {
  this.afterTransform = function (er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined) stream.push(data);

  cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  this.once('prefinish', function () {
    if (typeof this._flush === 'function') this._flush(function (er) {
      done(stream, er);
    });else done(stream);
  });
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('Not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

function done(stream, er) {
  if (er) return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

  if (ts.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}
},{"./_stream_duplex":19,"core-util-is":25,"inherits":15}],23:[function(require,module,exports){
(function (process){
// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.

'use strict';

module.exports = Writable;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: require('util-deprecate')
};
/*</replacement>*/

/*<replacement>*/
var Stream;
(function () {
  try {
    Stream = require('st' + 'ream');
  } catch (_) {} finally {
    if (!Stream) Stream = require('events').EventEmitter;
  }
})();
/*</replacement>*/

var Buffer = require('buffer').Buffer;
/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/

util.inherits(Writable, Stream);

function nop() {}

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

var Duplex;
function WritableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~ ~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function writableStateGetBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
    });
  } catch (_) {}
})();

var Duplex;
function Writable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Duplex)) return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  processNextTick(cb, er);
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;
  // Always throw error if a null is written
  // if we are not in object mode then throw
  // if it is not a buffer, string, or undefined.
  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    processNextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (Buffer.isBuffer(chunk)) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = bufferShim.from(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);

  if (Buffer.isBuffer(chunk)) encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;
  if (sync) processNextTick(cb, er);else cb(er);

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
        afterWrite(stream, state, finished, cb);
      }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    while (entry) {
      buffer[count] = entry;
      entry = entry.next;
      count += 1;
    }

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequestCount = 0;
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit('finish');
    } else {
      prefinish(stream, state);
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;

  this.finish = function (err) {
    var entry = _this.entry;
    _this.entry = null;
    while (entry) {
      var cb = entry.callback;
      state.pendingcb--;
      cb(err);
      entry = entry.next;
    }
    if (state.corkedRequestsFree) {
      state.corkedRequestsFree.next = _this;
    } else {
      state.corkedRequestsFree = _this;
    }
  };
}
}).call(this,require('_process'))
},{"./_stream_duplex":19,"_process":17,"buffer":10,"buffer-shims":24,"core-util-is":25,"events":14,"inherits":15,"process-nextick-args":27,"util-deprecate":28}],24:[function(require,module,exports){
(function (global){
'use strict';

var buffer = require('buffer');
var Buffer = buffer.Buffer;
var SlowBuffer = buffer.SlowBuffer;
var MAX_LEN = buffer.kMaxLength || 2147483647;
exports.alloc = function alloc(size, fill, encoding) {
  if (typeof Buffer.alloc === 'function') {
    return Buffer.alloc(size, fill, encoding);
  }
  if (typeof encoding === 'number') {
    throw new TypeError('encoding must not be number');
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size > MAX_LEN) {
    throw new RangeError('size is too large');
  }
  var enc = encoding;
  var _fill = fill;
  if (_fill === undefined) {
    enc = undefined;
    _fill = 0;
  }
  var buf = new Buffer(size);
  if (typeof _fill === 'string') {
    var fillBuf = new Buffer(_fill, enc);
    var flen = fillBuf.length;
    var i = -1;
    while (++i < size) {
      buf[i] = fillBuf[i % flen];
    }
  } else {
    buf.fill(_fill);
  }
  return buf;
}
exports.allocUnsafe = function allocUnsafe(size) {
  if (typeof Buffer.allocUnsafe === 'function') {
    return Buffer.allocUnsafe(size);
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size > MAX_LEN) {
    throw new RangeError('size is too large');
  }
  return new Buffer(size);
}
exports.from = function from(value, encodingOrOffset, length) {
  if (typeof Buffer.from === 'function' && (!global.Uint8Array || Uint8Array.from !== Buffer.from)) {
    return Buffer.from(value, encodingOrOffset, length);
  }
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number');
  }
  if (typeof value === 'string') {
    return new Buffer(value, encodingOrOffset);
  }
  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    var offset = encodingOrOffset;
    if (arguments.length === 1) {
      return new Buffer(value);
    }
    if (typeof offset === 'undefined') {
      offset = 0;
    }
    var len = length;
    if (typeof len === 'undefined') {
      len = value.byteLength - offset;
    }
    if (offset >= value.byteLength) {
      throw new RangeError('\'offset\' is out of bounds');
    }
    if (len > value.byteLength - offset) {
      throw new RangeError('\'length\' is out of bounds');
    }
    return new Buffer(value.slice(offset, offset + len));
  }
  if (Buffer.isBuffer(value)) {
    var out = new Buffer(value.length);
    value.copy(out, 0, 0, value.length);
    return out;
  }
  if (value) {
    if (Array.isArray(value) || (typeof ArrayBuffer !== 'undefined' && value.buffer instanceof ArrayBuffer) || 'length' in value) {
      return new Buffer(value);
    }
    if (value.type === 'Buffer' && Array.isArray(value.data)) {
      return new Buffer(value.data);
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ' + 'ArrayBuffer, Array, or array-like object.');
}
exports.allocUnsafeSlow = function allocUnsafeSlow(size) {
  if (typeof Buffer.allocUnsafeSlow === 'function') {
    return Buffer.allocUnsafeSlow(size);
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size >= MAX_LEN) {
    throw new RangeError('size is too large');
  }
  return new SlowBuffer(size);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"buffer":10}],25:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

}).call(this,{"isBuffer":require("../../../../insert-module-globals/node_modules/is-buffer/index.js")})
},{"../../../../insert-module-globals/node_modules/is-buffer/index.js":16}],26:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],27:[function(require,module,exports){
(function (process){
'use strict';

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = nextTick;
} else {
  module.exports = process.nextTick;
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}

}).call(this,require('_process'))
},{"_process":17}],28:[function(require,module,exports){
(function (global){

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],29:[function(require,module,exports){
module.exports = require("./lib/_stream_passthrough.js")

},{"./lib/_stream_passthrough.js":20}],30:[function(require,module,exports){
(function (process){
var Stream = (function (){
  try {
    return require('st' + 'ream'); // hack to fix a circular dependency issue when used with browserify
  } catch(_){}
}());
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = Stream || exports;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

if (!process.browser && process.env.READABLE_STREAM === 'disable' && Stream) {
  module.exports = Stream;
}

}).call(this,require('_process'))
},{"./lib/_stream_duplex.js":19,"./lib/_stream_passthrough.js":20,"./lib/_stream_readable.js":21,"./lib/_stream_transform.js":22,"./lib/_stream_writable.js":23,"_process":17}],31:[function(require,module,exports){
module.exports = require("./lib/_stream_transform.js")

},{"./lib/_stream_transform.js":22}],32:[function(require,module,exports){
module.exports = require("./lib/_stream_writable.js")

},{"./lib/_stream_writable.js":23}],33:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('readable-stream/readable.js');
Stream.Writable = require('readable-stream/writable.js');
Stream.Duplex = require('readable-stream/duplex.js');
Stream.Transform = require('readable-stream/transform.js');
Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":14,"inherits":15,"readable-stream/duplex.js":18,"readable-stream/passthrough.js":29,"readable-stream/readable.js":30,"readable-stream/transform.js":31,"readable-stream/writable.js":32}],34:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

},{"buffer":10}]},{},[8]);
