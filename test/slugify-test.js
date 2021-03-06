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



describe( "Slugify" , () => {

	it( "should slugify ASCII string" , () => {
		expect( restQuery.slugify( 'My wonderful blog' ) ).to.be( 'my-wonderful-blog' ) ;
		expect( restQuery.slugify( 'My WoNdErful BloG' ) ).to.be( 'my-wonderful-blog' ) ;
		expect( restQuery.slugify( '  My   WoNdErful   BloG  ' ) ).to.be( 'my-wonderful-blog' ) ;
		expect( restQuery.slugify( '-My wonderful blog-' ) ).to.be( 'my-wonderful-blog' ) ;
	} ) ;

	it( 'edge cases: slugified string that are valid ID/offset should have an hyphen appended' , () => {
		expect( restQuery.slugify( '51d18492541d2e3614ca2a80' ) ).to.be( '51d18492541d2e3614ca2a80-' ) ;
		expect( restQuery.slugify( '51D18492541D2E3614CA2A80' ) ).to.be( '51d18492541d2e3614ca2a80-' ) ;
		expect( restQuery.slugify( '123' ) ).to.be( '123-' ) ;
	} ) ;

	it( 'edge cases: empty or too long strings' , () => {
		expect( restQuery.slugify( '' ) ).to.be.an( Error ) ;
		expect( restQuery.slugify( 'azekjsdlmfjqmsljdfmklqsdlmfjslmfvqsdmljfgqsdjgmklhsdmhqgfqsdlmghlmkdhfgaz' ) ).to.be( 'azekjsdlmfjqmsljdfmklqsdlmfjslmfvqsdmljfgqsdjgmklhsdmhqgfqsdlmghlmkdhfga' ) ;
	} ) ;

	it( "when using slugify with options.symbols, it should convert symbols into supported language (ATM: en, fr)" , () => {
		expect( restQuery.slugify( '10€ le livre' ) ).to.be( '10-le-livre' ) ;
		expect( restQuery.slugify( '10€ le livre' , { symbols: true } ) ).to.be( '10-euro-le-livre' ) ;
		expect( restQuery.slugify( 'I ♥ NY' , { symbols: 'en' } ) ).to.be( 'i-love-ny' ) ;
		expect( restQuery.slugify( "J'♥ Paris" , { symbols: 'fr' } ) ).to.be( 'j-aime-paris' ) ;
	} ) ;

	it( "unicode character behavior without the unicode option" , () => {
		expect( restQuery.slugify( '«french quote»' ) ).to.be( 'french-quote' ) ;
		expect( restQuery.slugify( "À l'école" ) ).to.be( 'a-l-ecole' ) ;
		expect( restQuery.slugify( 'ØMQ' ) ).to.be( 'omq' ) ;
		expect( restQuery.slugify( 'عرض' , { worldAlpha: true } ) ).to.be( 'erd' ) ;
	} ) ;

	it( "unicode character behavior with the unicode option turned on" , () => {
		expect( restQuery.slugify( '«french quote»' , { unicode: true } ) ).to.be( 'french-quote' ) ;
		expect( restQuery.slugify( "À l'école" , { unicode: true } ) ).to.be( 'à-l-école' ) ;
		expect( restQuery.slugify( 'ØMQ' , { unicode: true } ) ).to.be( 'ømq' ) ;

		expect( restQuery.slugify( 'عِنْدَمَا ذَهَبْتُ إِلَى ٱلْمَكْتَبَةِ' , { unicode: true } ) ).to.be( 'عِنْدَمَا-ذَهَبْتُ-إِلَى-ٱلْمَكْتَبَةِ' ) ;
		expect( restQuery.slugify( 'كنت أريد أن أقرأ كتابا عن تاريخ المرأة في فرنسا' , { unicode: true } ) ).to.be( 'كنت-أريد-أن-أقرأ-كتابا-عن-تاريخ-المرأة-في-فرنسا' ) ;
		expect( restQuery.slugify( 'كُنْتُ أُرِيدُ أَنْ أَقْرَأَ كِتَابًا عَنْ تَارِيخِ ٱلْمَرْأَةِ فِي فَرَنْسَا' , { unicode: true } ) ).to.be( 'كُنْتُ-أُرِيدُ-أَنْ-أَقْرَأَ-كِتَابًا-عَنْ-تَارِيخِ-ٱلْمَرْأَةِ-فِي-فَرَ' ) ;
	} ) ;

	describe( "Historical bugs" , () => {
		it( "hyphen at the begining or the end bug when an invalid char is removed" , () => {
			expect( restQuery.slugify( '« french quote' ) ).to.be( 'french-quote' ) ;
			expect( restQuery.slugify( 'french quote »' ) ).to.be( 'french-quote' ) ;
		} ) ;
	} ) ;
} ) ;

