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



// Load the master file
const charmap = require( './charmap.js' ) ;
const path = require( './path.js' ) ;





function slugify( str , options ) {
	if ( typeof str !== 'string' ) { return new TypeError( 'slugify() : argument #0 should be a string' ) ; }

	if ( ! str.length ) { return new Error( 'slugify() : argument #0 length should be at least 1' ) ; }

	// This strip unecessary characters before ascii mapping, avoid wasting CPU on huge string,
	// but it have to be done again after the mapping because the size may increase
	if ( str.length > 72 ) { str = str.slice( 0 , 72 ) ; }

	if ( ! options ) { options = {} ; }

	str = mapReplace( str , charmap.asciiMapCommon ) ;

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

	// The length can be bigger after mapping to ASCII, so check again
	if ( str.length > 72 ) { str = str.slice( 0 , 72 ) ; }

	str = mapReplace( str , {
		// '\\.': '-', // should be deleted?
		'·': '-' ,
		'/': '-' ,
		'_': '-' ,
		',': '-' ,
		':': '-' ,
		';': '-'
	} ) ;

	str = str
		.toLowerCase()
		.replace( /[\s-]+/g , '-' ) // collapse whitespace and hyphen and replace by hyphen only
		.replace( /[^a-z0-9-]/g , '' ) // remove remaining invalid chars, MUST BE DONE BEFORE removing first and last hyphen
		.replace( /^-|-$/g , '' ) ; // remove the first and last hyphen, this MUST COME LAST

	if ( path.parseNode( str ).type !== 'slugId' ) { str = str + '-' ; }

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

