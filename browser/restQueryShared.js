(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.restQueryShared = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*
	Rest Query (shared lib)

	Copyright (c) 2014 - 2019 Cédric Ronvel

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



module.exports = {
	path: require( './path.js' )
} ;


},{"./path.js":3}],2:[function(require,module,exports){
/*
	Rest Query (shared lib)

	Copyright (c) 2014 - 2019 Cédric Ronvel

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

const charmap = {
	lowerCaseArray: [ 'a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' , 'i' , 'j' , 'k' , 'l' , 'm' , 'n' , 'o' , 'p' , 'q' , 'r' , 's' , 't' , 'u' , 'v' , 'w' , 'x' , 'y' , 'z' ] ,
	upperCaseArray: [ 'A' , 'B' , 'C' , 'D' , 'E' , 'F' , 'G' , 'H' , 'I' , 'J' , 'K' , 'L' , 'M' , 'N' , 'O' , 'P' , 'Q' , 'R' , 'S' , 'T' , 'U' , 'V' , 'W' , 'X' , 'Y' , 'Z' ] ,
	digitArray: [ '0' , '1' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9' ] ,
	lowerCaseAndDigitArray: [ 'a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' , 'i' , 'j' , 'k' , 'l' , 'm' , 'n' , 'o' , 'p' , 'q' , 'r' , 's' , 't' , 'u' , 'v' , 'w' , 'x' , 'y' , 'z' , '0' , '1' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9' ] ,
	collectionRegExp: '^[A-Z][a-zA-Z0-9]*$' ,
	methodRegExp: '^[A-Z][A-Z0-9-]*$' ,
	propertyRegExp: '^(\\.[a-zA-Z0-9_-]+)+$' ,
	linkPropertyRegExp: '^~[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)*$' ,
	multiLinkPropertyRegExp: '^~~[a-zA-Z0-9_-]+$' ,
	idRegExp: '^[0-9a-f]{24}$' ,
	rangeRegExp: '^([0-9]+)(?:-([0-9]+))?$' ,
	slugIdRegExp: '^[a-z0-9-]{1,72}$' ,

	// Slugify map
	// From Django urlify.js
	// Arabic from https://github.com/sindresorhus/slugify/blob/master/replacements.js
	asciiMapCommon: {
		// latin
		'À': 'A' ,
		'Á': 'A' ,
		'Â': 'A' ,
		'Ã': 'A' ,
		'Ä': 'A' ,
		'Å': 'A' ,
		'Æ': 'AE' ,
		'Ç': 'C' ,
		'È': 'E' ,
		'É': 'E' ,
		'Ê': 'E' ,
		'Ë': 'E' ,
		'Ì': 'I' ,
		'Í': 'I' ,
		'Î': 'I' ,
		'Ï': 'I' ,
		'Ð': 'D' ,
		'Ñ': 'N' ,
		'Ò': 'O' ,
		'Ó': 'O' ,
		'Ô': 'O' ,
		'Õ': 'O' ,
		'Ö': 'O' ,
		'Ő': 'O' ,
		'Ø': 'O' ,
		'Ù': 'U' ,
		'Ú': 'U' ,
		'Û': 'U' ,
		'Ü': 'U' ,
		'Ű': 'U' ,
		'Ý': 'Y' ,
		'Þ': 'TH' ,
		'ß': 'ss' ,
		'à': 'a' ,
		'á': 'a' ,
		'â': 'a' ,
		'ã': 'a' ,
		'ä': 'a' ,
		'å': 'a' ,
		'æ': 'ae' ,
		'ç': 'c' ,
		'è': 'e' ,
		'é': 'e' ,
		'ê': 'e' ,
		'ë': 'e' ,
		'ì': 'i' ,
		'í': 'i' ,
		'î': 'i' ,
		'ï': 'i' ,
		'ð': 'd' ,
		'ñ': 'n' ,
		'ò': 'o' ,
		'ó': 'o' ,
		'ô': 'o' ,
		'õ': 'o' ,
		'ö': 'o' ,
		'ő': 'o' ,
		'ø': 'o' ,
		'ù': 'u' ,
		'ú': 'u' ,
		'û': 'u' ,
		'ü': 'u' ,
		'ű': 'u' ,
		'ý': 'y' ,
		'þ': 'th' ,
		'ÿ': 'y' ,
		'ẞ': 'ss' ,
		'œ': 'oe' ,
		'Œ': 'OE' ,	// <-- moved from symbols to common
		// common
		'“': '"' ,
		'”': '"' ,
		'‘': "'" ,
		'’': "'" ,
		'…': '...'
	} ,
	// From Django urlify.js
	asciiMapWorldAlpha: {
		// greek
		'α': 'a' ,
		'β': 'b' ,
		'γ': 'g' ,
		'δ': 'd' ,
		'ε': 'e' ,
		'ζ': 'z' ,
		'η': 'h' ,
		'θ': '8' ,
		'ι': 'i' ,
		'κ': 'k' ,
		'λ': 'l' ,
		'μ': 'm' ,
		'ν': 'n' ,
		'ξ': '3' ,
		'ο': 'o' ,
		'π': 'p' ,
		'ρ': 'r' ,
		'σ': 's' ,
		'τ': 't' ,
		'υ': 'y' ,
		'φ': 'f' ,
		'χ': 'x' ,
		'ψ': 'ps' ,
		'ω': 'w' ,
		'ά': 'a' ,
		'έ': 'e' ,
		'ί': 'i' ,
		'ό': 'o' ,
		'ύ': 'y' ,
		'ή': 'h' ,
		'ώ': 'w' ,
		'ς': 's' ,
		'ϊ': 'i' ,
		'ΰ': 'y' ,
		'ϋ': 'y' ,
		'ΐ': 'i' ,
		'Α': 'A' ,
		'Β': 'B' ,
		'Γ': 'G' ,
		'Δ': 'D' ,
		'Ε': 'E' ,
		'Ζ': 'Z' ,
		'Η': 'H' ,
		'Θ': '8' ,
		'Ι': 'I' ,
		'Κ': 'K' ,
		'Λ': 'L' ,
		'Μ': 'M' ,
		'Ν': 'N' ,
		'Ξ': '3' ,
		'Ο': 'O' ,
		'Π': 'P' ,
		'Ρ': 'R' ,
		'Σ': 'S' ,
		'Τ': 'T' ,
		'Υ': 'Y' ,
		'Φ': 'F' ,
		'Χ': 'X' ,
		'Ψ': 'PS' ,
		'Ω': 'W' ,
		'Ά': 'A' ,
		'Έ': 'E' ,
		'Ί': 'I' ,
		'Ό': 'O' ,
		'Ύ': 'Y' ,
		'Ή': 'H' ,
		'Ώ': 'W' ,
		'Ϊ': 'I' ,
		'Ϋ': 'Y' ,
		// turkish
		'ş': 's' ,
		'Ş': 'S' ,
		'ı': 'i' ,
		'İ': 'I' ,
		'ğ': 'g' ,
		'Ğ': 'G' ,
		//  russian
		'а': 'a' ,
		'б': 'b' ,
		'в': 'v' ,
		'г': 'g' ,
		'д': 'd' ,
		'е': 'e' ,
		'ё': 'yo' ,
		'ж': 'zh' ,
		'з': 'z' ,
		'и': 'i' ,
		'й': 'j' ,
		'к': 'k' ,
		'л': 'l' ,
		'м': 'm' ,
		'н': 'n' ,
		'о': 'o' ,
		'п': 'p' ,
		'р': 'r' ,
		'с': 's' ,
		'т': 't' ,
		'у': 'u' ,
		'ф': 'f' ,
		'х': 'h' ,
		'ц': 'c' ,
		'ч': 'ch' ,
		'ш': 'sh' ,
		'щ': 'sh' ,
		'ъ': 'u' ,
		'ы': 'y' ,
		'ь': '' ,
		'э': 'e' ,
		'ю': 'yu' ,
		'я': 'ya' ,
		'А': 'A' ,
		'Б': 'B' ,
		'В': 'V' ,
		'Г': 'G' ,
		'Д': 'D' ,
		'Е': 'E' ,
		'Ё': 'Yo' ,
		'Ж': 'Zh' ,
		'З': 'Z' ,
		'И': 'I' ,
		'Й': 'J' ,
		'К': 'K' ,
		'Л': 'L' ,
		'М': 'M' ,
		'Н': 'N' ,
		'О': 'O' ,
		'П': 'P' ,
		'Р': 'R' ,
		'С': 'S' ,
		'Т': 'T' ,
		'У': 'U' ,
		'Ф': 'F' ,
		'Х': 'H' ,
		'Ц': 'C' ,
		'Ч': 'Ch' ,
		'Ш': 'Sh' ,
		'Щ': 'Sh' ,
		'Ъ': 'U' ,
		'Ы': 'Y' ,
		'Ь': '' ,
		'Э': 'E' ,
		'Ю': 'Yu' ,
		'Я': 'Ya' ,
		// ukranian
		'Є': 'Ye' ,
		'І': 'I' ,
		'Ї': 'Yi' ,
		'Ґ': 'G' ,
		'є': 'ye' ,
		'і': 'i' ,
		'ї': 'yi' ,
		'ґ': 'g' ,
		// czech
		'č': 'c' ,
		'ď': 'd' ,
		'ě': 'e' ,
		'ň': 'n' ,
		'ř': 'r' ,
		'š': 's' ,
		'ť': 't' ,
		'ů': 'u' ,
		'ž': 'z' ,
		'Č': 'C' ,
		'Ď': 'D' ,
		'Ě': 'E' ,
		'Ň': 'N' ,
		'Ř': 'R' ,
		'Š': 'S' ,
		'Ť': 'T' ,
		'Ů': 'U' ,
		'Ž': 'Z' ,
		// polish
		'ą': 'a' ,
		'ć': 'c' ,
		'ę': 'e' ,
		'ł': 'l' ,
		'ń': 'n' ,
		'ś': 's' ,
		'ź': 'z' ,
		'ż': 'z' ,
		'Ą': 'A' ,
		'Ć': 'C' ,
		'Ę': 'e' ,
		'Ł': 'L' ,
		'Ń': 'N' ,
		'Ś': 'S' ,
		'Ź': 'Z' ,
		'Ż': 'Z' ,
		// latvian
		'ā': 'a' ,
		'ē': 'e' ,
		'ģ': 'g' ,
		'ī': 'i' ,
		'ķ': 'k' ,
		'ļ': 'l' ,
		'ņ': 'n' ,
		'ū': 'u' ,
		'Ā': 'A' ,
		'Ē': 'E' ,
		'Ģ': 'G' ,
		'Ī': 'i' ,
		'Ķ': 'k' ,
		'Ļ': 'L' ,
		'Ņ': 'N' ,
		'Ū': 'u' ,

		// from https://github.com/sindresorhus/slugify/blob/master/replacements.js
		// arabic
		'ء': 'e' ,
		'آ': 'a' ,
		'أ': 'a' ,
		'ؤ': 'w' ,
		'إ': 'i' ,
		'ئ': 'y' ,
		'ا': 'a' ,
		'ب': 'b' ,
		'ة': 't' ,
		'ت': 't' ,
		'ث': 'th' ,
		'ج': 'j' ,
		'ح': 'h' ,
		'خ': 'kh' ,
		'د': 'd' ,
		'ذ': 'dh' ,
		'ر': 'r' ,
		'ز': 'z' ,
		'س': 's' ,
		'ش': 'sh' ,
		'ص': 's' ,
		'ض': 'd' ,
		'ط': 't' ,
		'ظ': 'z' ,
		'ع': 'e' ,
		'غ': 'gh' ,
		'ـ': '_' ,
		'ف': 'f' ,
		'ق': 'q' ,
		'ك': 'k' ,
		'ل': 'l' ,
		'م': 'm' ,
		'ن': 'n' ,
		'ه': 'h' ,
		'و': 'w' ,
		'ى': 'a' ,
		'ي': 'y' ,
		'َ‎': 'a' ,
		'ُ': 'u' ,
		'ِ‎': 'i' ,
		'٠': '0' ,
		'١': '1' ,
		'٢': '2' ,
		'٣': '3' ,
		'٤': '4' ,
		'٥': '5' ,
		'٦': '6' ,
		'٧': '7' ,
		'٨': '8' ,
		'٩': '9' ,

		// Persian / Farsi
		'چ': 'ch' ,
		'ک': 'k' ,
		'گ': 'g' ,
		'پ': 'p' ,
		'ژ': 'zh' ,
		'ی': 'y' ,
		'۰': '0' ,
		'۱': '1' ,
		'۲': '2' ,
		'۳': '3' ,
		'۴': '4' ,
		'۵': '5' ,
		'۶': '6' ,
		'۷': '7' ,
		'۸': '8' ,
		'۹': '9' ,

		// Pashto
		'ټ': 'p' ,
		'ځ': 'z' ,
		'څ': 'c' ,
		'ډ': 'd' ,
		'ﺫ': 'd' ,
		'ﺭ': 'r' ,
		'ړ': 'r' ,
		'ﺯ': 'z' ,
		'ږ': 'g' ,
		'ښ': 'x' ,
		'ګ': 'g' ,
		'ڼ': 'n' ,
		'ۀ': 'e' ,
		'ې': 'e' ,
		'ۍ': 'ai' ,

		// Urdu
		'ٹ': 't' ,
		'ڈ': 'd' ,
		'ڑ': 'r' ,
		'ں': 'n' ,
		'ہ': 'h' ,
		'ھ': 'h' ,
		'ے': 'e'
	} ,
	asciiMapSymbolsEn: {
		// currency
		'€': ' euro' ,
		'₢': ' cruzeiro' ,
		'₣': ' french franc' ,
		'£': ' pound' ,
		'₤': ' lira' ,
		'₥': ' mill' ,
		'₦': ' naira' ,
		'₧': ' peseta' ,
		'₨': ' rupee' ,
		'₩': ' won' ,
		'₪': ' new shequel' ,
		'₫': ' dong' ,
		'₭': ' kip' ,
		'₮': ' tugrik' ,
		'₯': ' drachma' ,
		'₰': ' penny' ,
		'₱': ' peso' ,
		'₲': ' guarani' ,
		'₳': ' austral' ,
		'₴': ' hryvnia' ,
		'₵': ' cedi' ,
		'¢': ' cent' ,
		'¥': ' yen' ,
		'元': ' yuan' ,
		'円': ' yen' ,
		'﷼': ' rial' ,
		'₠': ' ecu' ,
		'¤': ' currency' ,
		'฿': ' baht' ,
		"\\$": ' dollar' ,
		// symbols
		'©': ' (c)' ,
		'∑': ' sum' ,
		'®': ' (r)' ,
		'†': ' +' ,
		'∂': ' d' ,
		'ƒ': ' f' ,
		'™': ' tm' ,
		'℠': ' sm' ,
		'˚': ' o' ,
		'º': ' o' ,
		'ª': ' a' ,
		'•': ' *' ,
		'∆': ' delta' ,
		'∞': ' infinity' ,
		'♥': ' love' ,
		'&': ' and' ,
		'\\|': ' or' ,
		'<': ' less' ,
		'>': ' greater'
	} ,
	asciiMapSymbolsFr: {
		// currency
		'€': ' euro' ,
		'₢': ' cruzeiro' ,
		'₣': ' franc' ,
		'£': ' livre' ,
		'₤': ' lire' ,
		'₥': ' mill' ,
		'₦': ' naira' ,
		'₧': ' peseta' ,
		'₨': ' rupee' ,
		'₩': ' won' ,
		'₪': ' new shequel' ,
		'₫': ' dong' ,
		'₭': ' kip' ,
		'₮': ' tugrik' ,
		'₯': ' drachma' ,
		'₰': ' penny' ,
		'₱': ' peso' ,
		'₲': ' guarani' ,
		'₳': ' austral' ,
		'₴': ' hryvnia' ,
		'₵': ' cedi' ,
		'¢': ' cent' ,
		'¥': ' yen' ,
		'元': ' yuan' ,
		'円': ' yen' ,
		'﷼': ' rial' ,
		'₠': ' ecu' ,
		'¤': ' monnaie' ,
		'฿': ' baht' ,
		"\\$": ' dollar' ,
		// symbols
		'©': ' (c)' ,
		'∑': ' sum' ,
		'®': ' (r)' ,
		'†': ' +' ,
		'∂': ' d' ,
		'ƒ': ' f' ,
		'™': ' tm' ,
		'℠': ' sm' ,
		'˚': ' o' ,
		'º': ' o' ,
		'ª': ' a' ,
		'•': ' *' ,
		'∆': ' delta' ,
		'∞': ' infini' ,
		'♥': ' aime' ,
		'&': ' et' ,
		'\\|': ' ou' ,
		'<': ' moins' ,
		'>': ' plus'
	}
} ;

module.exports = charmap ;


},{}],3:[function(require,module,exports){
/*
	Rest Query (shared lib)

	Copyright (c) 2014 - 2019 Cédric Ronvel

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
	if ( str.length > 72 ) { throw new Error( '[restQuery] parseNode() : argument #0 length should be <= 72' ) ; }

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
	if ( charmap.upperCaseArray.indexOf( str[ 0 ] ) !== -1 ) {
		if ( str.length === 1 ) {
			parsed.type = 'collection' ;
			parsed.identifier = str[ 0 ].toLowerCase() + str.slice( 1 ) ;
			parsed.isCollection = true ;
			return parsed ;
		}

		if ( charmap.lowerCaseArray.indexOf( str[ 1 ] ) !== -1 ) {
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
	// Should come before slugId be after id
	if ( charmap.digitArray.indexOf( str[ 0 ] ) !== -1 && ( match = str.match( charmap.rangeRegExp ) ) ) {
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
	if ( charmap.lowerCaseAndDigitArray.indexOf( str[ 0 ] ) !== -1 && str.match( charmap.slugIdRegExp ) ) {
		parsed.type = 'slugId' ;
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


},{"./charmap.js":2,"string-kit/lib/camel.js":4,"tree-kit/lib/path.js":5}],4:[function(require,module,exports){
/*
	String Kit

	Copyright (c) 2014 - 2019 Cédric Ronvel

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
camel.toCamelCase = function toCamelCase( str , preserveUpperCase = false ) {
	if ( ! str || typeof str !== 'string' ) { return '' ; }

	return str.replace( /^[\s_-]*([^\s_-]+)|[\s_-]+([^\s_-]?)([^\s_-]*)/g , ( match , firstWord , firstLetter , endOfWord ) => {

		if ( preserveUpperCase ) {
			if ( firstWord ) { return firstWord ; }
			if ( ! firstLetter ) { return '' ; }
			return firstLetter.toUpperCase() + endOfWord ;
		}

		if ( firstWord ) { return firstWord.toLowerCase() ; }
		if ( ! firstLetter ) { return '' ; }
		return firstLetter.toUpperCase() + endOfWord.toLowerCase() ;

	} ) ;
} ;



// Transform camel case to alphanum separated by minus
camel.camelCaseToDash =
camel.camelCaseToDashed = function camelCaseToDash( str ) {
	if ( ! str || typeof str !== 'string' ) { return '' ; }

	return str.replace( /^([A-Z])|([A-Z])/g , ( match , firstLetter , letter ) => {

		if ( firstLetter ) { return firstLetter.toLowerCase() ; }
		return '-' + letter.toLowerCase() ;
	} ) ;
} ;



},{}],5:[function(require,module,exports){
/*
	Tree Kit

	Copyright (c) 2014 - 2018 Cédric Ronvel

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



treePath.op = function op( type , object , path , value ) {
	var i , parts , last , pointer , key , isArray = false , pathArrayMode = false , isGenericSet , canBeEmpty = true ;

	if ( ! object || ( typeof object !== 'object' && typeof object !== 'function' ) ) {
		return ;
	}

	if ( typeof path === 'string' ) {
		// Split the path into parts
		if ( path ) { parts = path.match( /([.#[\]]|[^.#[\]]+)/g ) ; }
		else { parts = [ '' ] ; }

		if ( parts[ 0 ] === '.' ) { parts.unshift( '' ) ; }
		if ( parts[ parts.length - 1 ] === '.' ) { parts.push( '' ) ; }
	}
	else if ( Array.isArray( path ) ) {
		parts = path ;
		pathArrayMode = true ;
	}
	else {
		throw new TypeError( '[tree.path] .' + type + '(): the path argument should be a string or an array' ) ;
	}

	switch ( type ) {
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
		case 'concat' :
		case 'insert' :
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

	for ( i = 0 ; i <= last ; i ++ ) {
		if ( pathArrayMode ) {
			if ( key === undefined ) {
				key = parts[ i ] ;
				continue ;
			}

			if ( ! pointer[ key ] || ( typeof pointer[ key ] !== 'object' && typeof pointer[ key ] !== 'function' ) ) {
				if ( ! isGenericSet ) { return undefined ; }
				pointer[ key ] = {} ;
			}

			pointer = pointer[ key ] ;
			key = parts[ i ] ;

			continue ;
		}
		else if ( parts[ i ] === '.' ) {
			isArray = false ;

			if ( key === undefined ) {
				if ( ! canBeEmpty ) {
					canBeEmpty = true ;
					continue ;
				}

				key = '' ;
			}

			if ( ! pointer[ key ] || ( typeof pointer[ key ] !== 'object' && typeof pointer[ key ] !== 'function' ) ) {
				if ( ! isGenericSet ) { return undefined ; }
				pointer[ key ] = {} ;
			}

			pointer = pointer[ key ] ;
			canBeEmpty = true ;

			continue ;
		}
		else if ( parts[ i ] === '#' || parts[ i ] === '[' ) {
			isArray = true ;
			canBeEmpty = false ;

			if ( key === undefined ) {
				// The root element cannot be altered, we are in trouble if an array is expected but we have only a regular object.
				if ( ! Array.isArray( pointer ) ) { return undefined ; }
				continue ;
			}

			if ( ! pointer[ key ] || ! Array.isArray( pointer[ key ] ) ) {
				if ( ! isGenericSet ) { return undefined ; }
				pointer[ key ] = [] ;
			}

			pointer = pointer[ key ] ;

			continue ;
		}
		else if ( parts[ i ] === ']' ) {
			// Closing bracket: do nothing
			canBeEmpty = false ;
			continue ;
		}

		canBeEmpty = false ;

		if ( ! isArray ) { key = parts[ i ] ; continue ; }

		switch ( parts[ i ] ) {
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
			default :
				// Convert the string key to a numerical index
				key = parseInt( parts[ i ] , 10 ) ;
		}
	}

	switch ( type ) {
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
		case 'concat' :
			if ( ! pointer[ key ] ) { pointer[ key ] = value ; }
			else if ( Array.isArray( pointer[ key ] ) && Array.isArray( value ) ) {
				pointer[ key ] = pointer[ key ].concat( value ) ;
			}
			//else ? do nothing???
			return pointer[ key ] ;
		case 'insert' :
			if ( ! pointer[ key ] ) { pointer[ key ] = value ; }
			else if ( Array.isArray( pointer[ key ] ) && Array.isArray( value ) ) {
				pointer[ key ] = value.concat( pointer[ key ] ) ;
			}
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
treePath.concat = treePath.op.bind( undefined , 'concat' ) ;
treePath.insert = treePath.op.bind( undefined , 'insert' ) ;
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
	concat: function( path , value ) { return treePath.concat( this , path , value ) ; } ,
	insert: function( path , value ) { return treePath.insert( this , path , value ) ; } ,
	autoPush: function( path , value ) { return treePath.autoPush( this , path , value ) ; }
} ;



// Upgrade an object so it can support get, set and delete at its root
treePath.upgrade = function upgrade( object ) {
	Object.defineProperties( object , {
		get: { value: treePath.op.bind( undefined , 'get' , object ) } ,
		delete: { value: treePath.op.bind( undefined , 'delete' , object ) } ,
		set: { value: treePath.op.bind( undefined , 'set' , object ) } ,
		define: { value: treePath.op.bind( undefined , 'define' , object ) } ,
		inc: { value: treePath.op.bind( undefined , 'inc' , object ) } ,
		dec: { value: treePath.op.bind( undefined , 'dec' , object ) } ,
		append: { value: treePath.op.bind( undefined , 'append' , object ) } ,
		prepend: { value: treePath.op.bind( undefined , 'prepend' , object ) } ,
		concat: { value: treePath.op.bind( undefined , 'concat' , object ) } ,
		insert: { value: treePath.op.bind( undefined , 'insert' , object ) } ,
		autoPush: { value: treePath.op.bind( undefined , 'autoPush' , object ) }
	} ) ;
} ;


},{}]},{},[1])(1)
});
