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



const charmap = require( './charmap.js' ) ;
const path = require( './path.js' ) ;
const unicode = require( 'string-kit/lib/unicode.js' ) ;



function slugify( str , options = {} ) {
	if ( typeof str !== 'string' ) { return new TypeError( 'slugify() : argument #0 should be a string' ) ; }

	if ( ! str.length ) { return new Error( 'slugify() : argument #0 length should be at least 1' ) ; }

	// Just to go easy on CPU usage (will almost always be stripped anyway):
	if ( str.length > 200 ) { str = str.slice( 0 , 200 ) ; }

	if ( ! options.unicode ) {
		str = mapReplace( str , charmap.asciiMapCommon ) ;
	}		

	if ( options.worldAlpha ) {
		// It must be normalized for the map to produice correct matching
		str = str.normalize( 'NFKD' ) ;
		str = mapReplace( str , charmap.asciiMapWorldAlpha ) ;
	}

	if ( options.symbols ) {
		switch ( options.symbols ) {
			case 'fr' :
				str = mapReplace( str , charmap.asciiMapSymbolsFr ) ;
				break ;
			//case 'en' :
			default :
				str = mapReplace( str , charmap.asciiMapSymbolsEn ) ;
		}
	}

	str = str.toLowerCase() ;
	console.log( 'str #0' , str ) ;

	// transform/collapse whitespace \p{Z}, punctuation \p{P} (also contains: -_/), replace them by a unique hyphen
	str = str.replace( /[\p{Z}\p{P}-]+/ug , '-' ) ;
	console.log( 'str #1' , str ) ;

	if ( options.unicode ) {
		// remove remaining invalid chars, MUST BE DONE BEFORE removing first and last hyphen
		str = str.replace( /[^\p{Ll}\p{Lm}\p{Lo}\p{N}\p{M}-]/ug , '' ) ;
	}
	else {
		// remove remaining invalid chars, MUST BE DONE BEFORE removing first and last hyphen
		str = str.replace( /[^a-z0-9-]/ug , '' ) ;
	}
	console.log( 'str #2' , str ) ;
	
	// remove starting and ending hyphen and collapse multiple hyphen that may have been produced *again* by the previous step
	str = str.replace( /^-+|-+$|-+(?=-)/g , '' ) ;
	console.log( 'str #3' , str ) ;

	// Finally, truncate the string if it's still too big
	if ( options.unicode ) {
		if ( str.length > 144 || ( str.length > 72 && unicode.length( str ) > 72 ) ) {
			str = unicode.truncateWidth( str , 72 ) ;
		}
	}
	else if ( str.length > 72 ) {
		str = str.slice( 0 , 72 ) ;
	}
	console.log( 'str #4' , str ) ;

	if ( path.parseNode( str ).type !== 'slugId' ) { str = str + '-' ; }
	console.log( 'str #5' , str ) ;

	return str ;
}

module.exports = slugify ;



function mapReplace( str , map ) {
	var i , keys , length , from , to ;

	keys = Object.keys( map ) ;
	length = keys.length ;

	for ( i = 0 ; i < length ; i ++ ) {
		from = keys[ i ] ;
		to = map[ from ] ;
		str = str.replace( new RegExp( from , 'g' ) , to ) ;
	}

	return str ;
}

