(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.restQueryShared = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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



module.exports = {
	path: require( './path.js' )
} ;


},{"./path.js":3}],2:[function(require,module,exports){
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



// Charmap for string validation

const charmap = {
	lowerCaseArray: [ 'a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' , 'i' , 'j' , 'k' , 'l' , 'm' , 'n' , 'o' , 'p' , 'q' , 'r' , 's' , 't' , 'u' , 'v' , 'w' , 'x' , 'y' , 'z' ] ,
	upperCaseArray: [ 'A' , 'B' , 'C' , 'D' , 'E' , 'F' , 'G' , 'H' , 'I' , 'J' , 'K' , 'L' , 'M' , 'N' , 'O' , 'P' , 'Q' , 'R' , 'S' , 'T' , 'U' , 'V' , 'W' , 'X' , 'Y' , 'Z' ] ,
	digitArray: [ '0' , '1' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9' ] ,
	lowerCaseAndDigitArray: [ 'a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' , 'i' , 'j' , 'k' , 'l' , 'm' , 'n' , 'o' , 'p' , 'q' , 'r' , 's' , 't' , 'u' , 'v' , 'w' , 'x' , 'y' , 'z' , '0' , '1' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9' ] ,
	collectionRegExp: /^[A-Z][a-zA-Z0-9]*$/ ,
	methodRegExp: /^[A-Z][A-Z0-9-]*$/ ,
	propertyRegExp: /^(\.[a-zA-Z0-9_-]+)+$/ ,
	linkPropertyRegExp: /^~[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*$/ ,
	multiLinkPropertyRegExp: /^~~[a-zA-Z0-9_-]+$/ ,
	idRegExp: /^[0-9a-f]{24}$/ ,
	rangeRegExp: /^([0-9]+)(?:-([0-9]+))?$/ ,
	slugIdRegExp: /^[a-z0-9-]{1,72}$/ ,

	// Unicode slugs, allowing: lowercase/modifier/other letter (excluding uppercase and titlecase), numbers, marks (accent, needed for arabic).
	// Currency symbols must be excluded because $ is considered unsafe in URLs
	unicodeSlugIdRegExp: /^[\p{Ll}\p{Lm}\p{Lo}\p{N}\p{M}-]{1,72}$/u ,

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
	if ( charmap.lowerCaseAndDigitArray.includes( str[ 0 ] ) && str.length >= 2 && str.match( charmap.slugIdRegExp ) ) {
		// This is a restricted a-z 0-9 and - slug
		parsed.type = 'slugId' ;
		parsed.unicode = false ;
		parsed.identifier = str ;
		parsed.isDocument = true ;
		return parsed ;
	}

	if ( str.length >= 2 && str.match( charmap.unicodeSlugIdRegExp ) ) {
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


},{"./charmap.js":2,"string-kit/lib/camel.js":4,"string-kit/lib/unicode.js":6,"tree-kit/lib/path.js":7}],4:[function(require,module,exports){
/*
	String Kit

	Copyright (c) 2014 - 2021 Cédric Ronvel

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
camel.toCamelCase = function( str , preserveUpperCase = false , initialUpperCase = false ) {
	if ( ! str || typeof str !== 'string' ) { return '' ; }

	return str.replace(
		/(?:^[\s_-]*|([\s_-]+))(([^\s_-]?)([^\s_-]*))/g ,
		( match , isNotFirstWord , word , firstLetter , endOfWord ) => {
			if ( preserveUpperCase ) {
				if ( ! isNotFirstWord && ! initialUpperCase ) { return word ; }
				if ( ! firstLetter ) { return '' ; }
				return firstLetter.toUpperCase() + endOfWord ;
			}

			if ( ! isNotFirstWord && ! initialUpperCase ) { return word.toLowerCase() ; }
			if ( ! firstLetter ) { return '' ; }
			return firstLetter.toUpperCase() + endOfWord.toLowerCase() ;
		}
	) ;
} ;



camel.camelCaseToSeparated = function( str , separator = ' ' , acronym = true ) {
	if ( ! str || typeof str !== 'string' ) { return '' ; }

	if ( ! acronym ) {
		return str.replace( /^([A-Z])|([A-Z])/g , ( match , firstLetter , letter ) => {
			if ( firstLetter ) { return firstLetter.toLowerCase() ; }
			return separator + letter.toLowerCase() ;
		} ) ;
	}

	// (^)? and (^)? does not work, so we have to use (?:(^)|)) and (?:($)|)) to capture end or not
	return str.replace( /(?:(^)|)([A-Z]+)(?:($)|(?=[a-z]))/g , ( match , isStart , letters , isEnd ) => {
		isStart = isStart === '' ;
		isEnd = isEnd === '' ;

		var prefix = isStart ? '' : separator ;

		return letters.length === 1 ? prefix + letters.toLowerCase() :
			isEnd ? prefix + letters :
			letters.length === 2 ? prefix + letters[ 0 ].toLowerCase() + separator + letters[ 1 ].toLowerCase() :
			prefix + letters.slice( 0 , -1 ) + separator + letters.slice( -1 ).toLowerCase() ;
	} ) ;
} ;



// Transform camel case to alphanum separated by minus
camel.camelCaseToDash =
camel.camelCaseToDashed = ( str ) => camel.camelCaseToSeparated( str , '-' , false ) ;


},{}],5:[function(require,module,exports){
module.exports=[{"s":9728,"e":9747,"w":1},{"s":9748,"e":9749,"w":2},{"s":9750,"e":9799,"w":1},{"s":9800,"e":9811,"w":2},{"s":9812,"e":9854,"w":1},{"s":9855,"e":9855,"w":2},{"s":9856,"e":9874,"w":1},{"s":9875,"e":9875,"w":2},{"s":9876,"e":9888,"w":1},{"s":9889,"e":9889,"w":2},{"s":9890,"e":9897,"w":1},{"s":9898,"e":9899,"w":2},{"s":9900,"e":9916,"w":1},{"s":9917,"e":9918,"w":2},{"s":9919,"e":9923,"w":1},{"s":9924,"e":9925,"w":2},{"s":9926,"e":9933,"w":1},{"s":9934,"e":9934,"w":2},{"s":9935,"e":9939,"w":1},{"s":9940,"e":9940,"w":2},{"s":9941,"e":9961,"w":1},{"s":9962,"e":9962,"w":2},{"s":9963,"e":9969,"w":1},{"s":9970,"e":9971,"w":2},{"s":9972,"e":9972,"w":1},{"s":9973,"e":9973,"w":2},{"s":9974,"e":9977,"w":1},{"s":9978,"e":9978,"w":2},{"s":9979,"e":9980,"w":1},{"s":9981,"e":9981,"w":2},{"s":9982,"e":9983,"w":1},{"s":9984,"e":9988,"w":1},{"s":9989,"e":9989,"w":2},{"s":9990,"e":9993,"w":1},{"s":9994,"e":9995,"w":2},{"s":9996,"e":10023,"w":1},{"s":10024,"e":10024,"w":2},{"s":10025,"e":10059,"w":1},{"s":10060,"e":10060,"w":2},{"s":10061,"e":10061,"w":1},{"s":10062,"e":10062,"w":2},{"s":10063,"e":10066,"w":1},{"s":10067,"e":10069,"w":2},{"s":10070,"e":10070,"w":1},{"s":10071,"e":10071,"w":2},{"s":10072,"e":10132,"w":1},{"s":10133,"e":10135,"w":2},{"s":10136,"e":10159,"w":1},{"s":10160,"e":10160,"w":2},{"s":10161,"e":10174,"w":1},{"s":10175,"e":10175,"w":2},{"s":126976,"e":126979,"w":1},{"s":126980,"e":126980,"w":2},{"s":126981,"e":127182,"w":1},{"s":127183,"e":127183,"w":2},{"s":127184,"e":127373,"w":1},{"s":127374,"e":127374,"w":2},{"s":127375,"e":127376,"w":1},{"s":127377,"e":127386,"w":2},{"s":127387,"e":127487,"w":1},{"s":127744,"e":127776,"w":2},{"s":127777,"e":127788,"w":1},{"s":127789,"e":127797,"w":2},{"s":127798,"e":127798,"w":1},{"s":127799,"e":127868,"w":2},{"s":127869,"e":127869,"w":1},{"s":127870,"e":127891,"w":2},{"s":127892,"e":127903,"w":1},{"s":127904,"e":127946,"w":2},{"s":127947,"e":127950,"w":1},{"s":127951,"e":127955,"w":2},{"s":127956,"e":127967,"w":1},{"s":127968,"e":127984,"w":2},{"s":127985,"e":127987,"w":1},{"s":127988,"e":127988,"w":2},{"s":127989,"e":127991,"w":1},{"s":127992,"e":127994,"w":2},{"s":128000,"e":128062,"w":2},{"s":128063,"e":128063,"w":1},{"s":128064,"e":128064,"w":2},{"s":128065,"e":128065,"w":1},{"s":128066,"e":128252,"w":2},{"s":128253,"e":128254,"w":1},{"s":128255,"e":128317,"w":2},{"s":128318,"e":128330,"w":1},{"s":128331,"e":128334,"w":2},{"s":128335,"e":128335,"w":1},{"s":128336,"e":128359,"w":2},{"s":128360,"e":128377,"w":1},{"s":128378,"e":128378,"w":2},{"s":128379,"e":128404,"w":1},{"s":128405,"e":128406,"w":2},{"s":128407,"e":128419,"w":1},{"s":128420,"e":128420,"w":2},{"s":128421,"e":128506,"w":1},{"s":128507,"e":128591,"w":2},{"s":128592,"e":128639,"w":1},{"s":128640,"e":128709,"w":2},{"s":128710,"e":128715,"w":1},{"s":128716,"e":128716,"w":2},{"s":128717,"e":128719,"w":1},{"s":128720,"e":128722,"w":2},{"s":128723,"e":128724,"w":1},{"s":128725,"e":128727,"w":2},{"s":128728,"e":128746,"w":1},{"s":128747,"e":128748,"w":2},{"s":128749,"e":128755,"w":1},{"s":128756,"e":128764,"w":2},{"s":128765,"e":128991,"w":1},{"s":128992,"e":129003,"w":2},{"s":129004,"e":129291,"w":1},{"s":129292,"e":129338,"w":2},{"s":129339,"e":129339,"w":1},{"s":129340,"e":129349,"w":2},{"s":129350,"e":129350,"w":1},{"s":129351,"e":129400,"w":2},{"s":129401,"e":129401,"w":1},{"s":129402,"e":129483,"w":2},{"s":129484,"e":129484,"w":1},{"s":129485,"e":129535,"w":2},{"s":129536,"e":129647,"w":1},{"s":129648,"e":129652,"w":2},{"s":129653,"e":129655,"w":1},{"s":129656,"e":129658,"w":2},{"s":129659,"e":129663,"w":1},{"s":129664,"e":129670,"w":2},{"s":129671,"e":129679,"w":1},{"s":129680,"e":129704,"w":2},{"s":129705,"e":129711,"w":1},{"s":129712,"e":129718,"w":2},{"s":129719,"e":129727,"w":1},{"s":129728,"e":129730,"w":2},{"s":129731,"e":129743,"w":1},{"s":129744,"e":129750,"w":2},{"s":129751,"e":129791,"w":1}]

},{}],6:[function(require,module,exports){
/*
	String Kit

	Copyright (c) 2014 - 2021 Cédric Ronvel

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



/*
	Javascript does not use UTF-8 but UCS-2.
	The purpose of this module is to process correctly strings containing UTF-8 characters that take more than 2 bytes.

	Since the punycode module is deprecated in Node.js v8.x, this is an adaptation of punycode.ucs2.x
	as found on Aug 16th 2017 at: https://github.com/bestiejs/punycode.js/blob/master/punycode.js.

	2021 note -- Modern Javascript is way more unicode friendly since many years, e.g. `Array.from( string )` and `for ( char of string )` are unicode aware.
	Some methods here are now useless, but have been modernized to use the correct ES features.
*/



// Create the module and export it
const unicode = {} ;
module.exports = unicode ;



unicode.encode = array => String.fromCodePoint( ... array ) ;

// Decode a string into an array of unicode codepoints.
// The 2nd argument of Array.from() is a map function, it avoids creating intermediate array.
unicode.decode = str => Array.from( str , c => c.codePointAt( 0 ) ) ;

// DEPRECATED: This function is totally useless now, with modern JS.
unicode.firstCodePoint = str => str.codePointAt( 0 ) ;

// Extract only the first char.
unicode.firstChar = str => str.length ? String.fromCodePoint( str.codePointAt( 0 ) ) : undefined ;

// DEPRECATED: This function is totally useless now, with modern JS.
unicode.toArray = str => Array.from( str ) ;



// Decode a string into an array of Cell (used by Terminal-kit).
// Wide chars have an additionnal filler cell, so position is correct
unicode.toCells = ( Cell , str , tabWidth = 4 , linePosition = 0 , ... extraCellArgs ) => {
	var char , code , fillSize , width ,
		output = [] ;

	for ( char of str ) {
		code = char.codePointAt( 0 ) ;

		if ( code === 0x0a ) {	// New line
			linePosition = 0 ;
		}
		else if ( code === 0x09 ) {	// Tab
			// Depends upon the next tab-stop
			fillSize = tabWidth - ( linePosition % tabWidth ) - 1 ;
			//output.push( new Cell( '\t' , ... extraCellArgs ) ) ;
			output.push( new Cell( '\t' , 1 , ... extraCellArgs ) ) ;
			linePosition += 1 + fillSize ;

			// Add a filler cell
			while ( fillSize -- ) { output.push( new Cell( ' ' , -2 , ... extraCellArgs ) ) ; }
		}
		else {
			width = unicode.codePointWidth( code ) ,
			output.push( new Cell( char , width , ... extraCellArgs ) ) ;
			linePosition += width ;

			// Add an anti-filler cell (a cell with 0 width, following a wide char)
			while ( -- width > 0 ) { output.push( new Cell( ' ' , -1 , ... extraCellArgs ) ) ; }
		}
	}

	return output ;
} ;



unicode.fromCells = ( cells ) => {
	var cell , str = '' ;

	for ( cell of cells ) {
		if ( ! cell.filler ) { str += cell.char ; }
	}

	return str ;
} ;



// Get the length of an unicode string
// Mostly an adaptation of .decode(), not factorized for performance's sake (used by Terminal-kit)
// /!\ Use Array.from().length instead??? Not using it is potentially faster, but it needs benchmark to be sure.
unicode.length = str => {
	// for ... of is unicode-aware
	var char , length = 0 ;
	for ( char of str ) { length ++ ; }		/* eslint-disable-line no-unused-vars */
	return length ;
} ;



// Return the width of a string in a terminal/monospace font
unicode.width = str => {
	// for ... of is unicode-aware
	var char , count = 0 ;
	for ( char of str ) { count += unicode.codePointWidth( char.codePointAt( 0 ) ) ; }
	return count ;
} ;



// Return the width of an array of string in a terminal/monospace font
unicode.arrayWidth = ( array , limit ) => {
	var index , count = 0 ;

	if ( limit === undefined ) { limit = array.length ; }

	for ( index = 0 ; index < limit ; index ++ ) {
		count += unicode.isFullWidth( array[ index ] ) ? 2 : 1 ;
	}

	return count ;
} ;



// Userland may use this, it is more efficient than .truncateWidth() + .width(),
// and BTW even more than testing .width() then .truncateWidth() + .width()
var lastTruncateWidth = 0 ;
unicode.getLastTruncateWidth = () => lastTruncateWidth ;



// Return a string that does not exceed the limit.
unicode.widthLimit =	// DEPRECATED
unicode.truncateWidth = ( str , limit ) => {
	var char , charWidth , position = 0 ;

	// Module global:
	lastTruncateWidth = 0 ;

	for ( char of str ) {
		charWidth = unicode.codePointWidth( char.codePointAt( 0 ) ) ;

		if ( lastTruncateWidth + charWidth > limit ) {
			return str.slice( 0 , position ) ;
		}

		lastTruncateWidth += charWidth ;
		position += char.length ;
	}

	// The string remains unchanged
	return str ;
} ;



/*
	** PROBABLY DEPRECATED **

	Check if a UCS2 char is a surrogate pair.

	Returns:
		0: single char
		1: leading surrogate
		-1: trailing surrogate

	Note: it does not check input, to gain perfs.
*/
unicode.surrogatePair = char => {
	var code = char.charCodeAt( 0 ) ;

	if ( code < 0xd800 || code >= 0xe000 ) { return 0 ; }
	else if ( code < 0xdc00 ) { return 1 ; }
	return -1 ;
} ;



// Check if a character is a full-width char or not
unicode.isFullWidth = char => unicode.isFullWidthCodePoint( char.codePointAt( 0 ) ) ;

// Return the width of a char, leaner than .width() for one char
unicode.charWidth = char => unicode.codePointWidth( char.codePointAt( 0 ) ) ;



/*
	Build the Emoji width lookup.
	The ranges file (./lib/unicode-emoji-width-ranges.json) is produced by a Terminal-Kit script ([terminal-kit]/utilities/build-emoji-width-lookup.js),
	that writes each emoji and check the cursor location.
*/
const emojiWidthLookup = new Map() ;

( function() {
	var ranges = require( './unicode-emoji-width-ranges.json' ) ;
	for ( let range of ranges ) {
		for ( let i = range.s ; i <= range.e ; i ++ ) {
			emojiWidthLookup.set( i , range.w ) ;
		}
	}
} )() ;

/*
	Check if a codepoint represent a full-width char or not.
*/
unicode.codePointWidth = code => {
	// Assuming all emoji are wide here
	if ( unicode.isEmojiCodePoint( code ) ) {
		return emojiWidthLookup.get( code ) ?? 2 ;
	}

	// Code points are derived from:
	// http://www.unicode.org/Public/UNIDATA/EastAsianWidth.txt
	if ( code >= 0x1100 && (
		code <= 0x115f ||	// Hangul Jamo
		code === 0x2329 || // LEFT-POINTING ANGLE BRACKET
		code === 0x232a || // RIGHT-POINTING ANGLE BRACKET
		// CJK Radicals Supplement .. Enclosed CJK Letters and Months
		( 0x2e80 <= code && code <= 0x3247 && code !== 0x303f ) ||
		// Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
		( 0x3250 <= code && code <= 0x4dbf ) ||
		// CJK Unified Ideographs .. Yi Radicals
		( 0x4e00 <= code && code <= 0xa4c6 ) ||
		// Hangul Jamo Extended-A
		( 0xa960 <= code && code <= 0xa97c ) ||
		// Hangul Syllables
		( 0xac00 <= code && code <= 0xd7a3 ) ||
		// CJK Compatibility Ideographs
		( 0xf900 <= code && code <= 0xfaff ) ||
		// Vertical Forms
		( 0xfe10 <= code && code <= 0xfe19 ) ||
		// CJK Compatibility Forms .. Small Form Variants
		( 0xfe30 <= code && code <= 0xfe6b ) ||
		// Halfwidth and Fullwidth Forms
		( 0xff01 <= code && code <= 0xff60 ) ||
		( 0xffe0 <= code && code <= 0xffe6 ) ||
		// Kana Supplement
		( 0x1b000 <= code && code <= 0x1b001 ) ||
		// Enclosed Ideographic Supplement
		( 0x1f200 <= code && code <= 0x1f251 ) ||
		// CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
		( 0x20000 <= code && code <= 0x3fffd )
	) ) {
		return 2 ;
	}

	if (
		unicode.isEmojiModifierCodePoint( code ) ||
		unicode.isZeroWidthDiacriticCodePoint( code )
	) {
		return 0 ;
	}

	return 1 ;
} ;

// For a true/false type of result
unicode.isFullWidthCodePoint = code => unicode.codePointWidth( code ) === 2 ;



// Convert normal ASCII chars to their full-width counterpart
unicode.toFullWidth = str => {
	return String.fromCodePoint( ... Array.from( str , char => {
		var code = char.codePointAt( 0 ) ;
		return code >= 33 && code <= 126  ?  0xff00 + code - 0x20  :  code ;
	} ) ) ;
} ;



// Check if a character is a diacritic with zero-width or not
unicode.isZeroWidthDiacritic = char => unicode.isZeroWidthDiacriticCodePoint( char.codePointAt( 0 ) ) ;

// Some doc found here: https://en.wikipedia.org/wiki/Combining_character
// Diacritics and other characters that combines with previous one (zero-width)
unicode.isZeroWidthDiacriticCodePoint = code =>
	// Combining Diacritical Marks
	( 0x300 <= code && code <= 0x36f ) ||
	// Combining Diacritical Marks Extended
	( 0x1ab0 <= code && code <= 0x1aff ) ||
	// Combining Diacritical Marks Supplement
	( 0x1dc0 <= code && code <= 0x1dff ) ||
	// Combining Diacritical Marks for Symbols
	( 0x20d0 <= code && code <= 0x20ff ) ||
	// Combining Half Marks
	( 0xfe20 <= code && code <= 0xfe2f ) ||
	// Dakuten and handakuten (japanese)
	code === 0x3099 || code === 0x309a ||
	// Devanagari
	( 0x900 <= code && code <= 0x903 ) ||
	( 0x93a <= code && code <= 0x957 && code !== 0x93d && code !== 0x950 ) ||
	code === 0x962 || code === 0x963 ||
	// Thai
	code === 0xe31 ||
	( 0xe34 <= code && code <= 0xe3a ) ||
	( 0xe47 <= code && code <= 0xe4e ) ;

// Check if a character is an emoji or not
unicode.isEmoji = char => unicode.isEmojiCodePoint( char.codePointAt( 0 ) ) ;

// Some doc found here: https://stackoverflow.com/questions/30470079/emoji-value-range
unicode.isEmojiCodePoint = code =>
	// Miscellaneous symbols
	( 0x2600 <= code && code <= 0x26ff ) ||
	// Dingbats
	( 0x2700 <= code && code <= 0x27bf ) ||
	// Emoji
	( 0x1f000 <= code && code <= 0x1f1ff ) ||
	( 0x1f300 <= code && code <= 0x1f3fa ) ||
	( 0x1f400 <= code && code <= 0x1faff ) ;

// Emoji modifier
unicode.isEmojiModifier = char => unicode.isEmojiModifierCodePoint( char.codePointAt( 0 ) ) ;
unicode.isEmojiModifierCodePoint = code =>
	( 0x1f3fb <= code && code <= 0x1f3ff ) ||	// (Fitzpatrick): https://en.wikipedia.org/wiki/Miscellaneous_Symbols_and_Pictographs#Emoji_modifiers
	code === 0xfe0f ;	// VARIATION SELECTOR-16 [VS16] {emoji variation selector}


},{"./unicode-emoji-width-ranges.json":5}],7:[function(require,module,exports){
/*
	Tree Kit

	Copyright (c) 2014 - 2021 Cédric Ronvel

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



const treePath = {} ;
module.exports = treePath ;



const PROTO_POLLUTION_MESSAGE = 'This would cause prototype pollution' ;



treePath.op = function( type , object , path , value ) {
	var i , parts , last , pointer , key , isArray = false , pathArrayMode = false , isGenericSet , canBeEmpty = true ;

	if ( ! object || typeof object !== 'object' ) { return ; }

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
		/*
		for ( i = 0 ; i < parts.length ; i ++ ) {
			if ( typeof parts[ i ] !== 'string' || typeof parts[ i ] !== 'number' ) { parts[ i ] = '' + parts[ i ] ; }
		}
		//*/
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
				if ( typeof key === 'object' || key === '__proto__' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }
				continue ;
			}

			if ( typeof pointer[ key ] === 'function' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }
			if ( ! pointer[ key ] || typeof pointer[ key ] !== 'object' ) {
				if ( ! isGenericSet ) { return undefined ; }
				pointer[ key ] = {} ;
			}

			pointer = pointer[ key ] ;
			key = parts[ i ] ;
			if ( typeof key === 'object' || key === '__proto__' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }
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

			if ( typeof pointer[ key ] === 'function' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }
			if ( ! pointer[ key ] || typeof pointer[ key ] !== 'object' ) {
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

			if ( typeof pointer[ key ] === 'function' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }
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

		if ( ! isArray ) {
			key = parts[ i ] ;
			if ( typeof key === 'object' || key === '__proto__' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }
			continue ;
		}

		switch ( parts[ i ] ) {
			case 'length' :
				key = 'length' ;
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
			else if ( ! pointer[ key ] || typeof pointer[ key ] !== 'object' ) { pointer[ key ] = - 1 ; }
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
treePath.upgrade = function( object ) {
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
