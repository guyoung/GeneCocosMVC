/**
 * Combined redistributable GNU ease.js file.
 *
 * For the original, uncombined and unminifed source, please visit
 * <http://www.gnu.org/software/easejs/>.
 *
 *  @licstart The following is the entire license notice for the JavaScript
 *  code in this file.
 *
 *  Copyright (C) 2010, 2011, 2012, 2013, 2014 Free Software Foundation, Inc.
 *
 *  GNU ease.js is free software: you can redistribute it and/or modify it
 *  under the terms of the GNU General Public License (GNU GPL) as published
 *  by the Free Software Foundation, either version 3 of the License, or (at
 *  your option) any later version.  This library is distributed WITHOUT ANY
 *  WARRANTY; without even the implied warranty of MERCHANTABILITY or
 *  FITNESS FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 *  As additional permission under GNU GPL version 3 section 7, you may
 *  distribute non-source (e.g., minimized or compacted) forms of this
 *  library without the copy of the GNU GPL normally required by section 4,
 *  provided you include this license notice and a URL through which
 *  recipients can access the Corresponding Source.
 *
 *  @licend The following is the entire license notice for the JavaScript
 *  code in this file.
 */

/**
 * ease.js namespace
 *
 * All modules will be available via this namespace. In CommonJS format, they
 * were accessed via the require() function. For example:
 *
 *   var util = require( 'easejs' ).Class;
 *
 * In this file, the above would be written as:
 *
 *   var util = easejs.Class;
 *
 * @type  {Object}
 */
var easejs = {};

( function( ns_exports, __cwd )
{
    /**
     * CommonJS module exports
     *
     * Since this file contains all of the modules, this will be populated with
     * every module right off the bat.
     *
     * @type  {Object.<string,Object>}
     */
    var module = {};

    /**
     * Returns the requested module
     *
     * The require() function is likely unavailable client-side (within a web
     * browser). Therefore, we mock one. If it is available, this overwrites it.
     * Our modules are all preloaded in the exports object.
     *
     * @param  {string}  module_id  id of the module to load
     *
     * return tag intentionally omitted; too many potential return types and
     * setting return type of {*} will throw warnings for those attempting to
     * treat the return value as a function
     */
    var require = function( module_id )
    {
        // anything that is not an absolute require path will be prefixed
        // with __cwd, which is set by the combined module; this allows
        // including relative paths (but note that this also means that
        // modules that perform ad-hoc conditional requires after another
        // module has been processed may not work properly; we don't do
        // this, though)
        var id_norm = ( module_id.substr( 0, 1 ) === '/' )
            ? module_id
            : __cwd + '/' + module_id;

        // strip `../`, poorly strip `./` (for example, it would also strip
        // `foo./`, but we know that this won't ever be the case with our
        // files), and strip leading `/`
        var id_clean = id_norm.replace( /([^\/]+\/\.\.\/|\.\/|^\/)/g, '' );

        // attempt to retrieve the module
        var mod = module[ id_clean ];
        if ( mod === undefined )
        {
            throw "[ease.js] Undefined module: " + id_clean;
        }

        return mod.exports;
    };

/** util/symbol/FallbackSymbol **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = 'util/symbol';
/**
 * Forward-compatible subset of ES6 Symbol for pre-ES6 environments
 *
 *  Copyright (C) 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * This is *not* intended to be a complete implementation; it merely
 * performs what is needed for ease.js. In particular, this pre-ES6
 * implementation will simply generate a random string to be used as a key;
 * the caller is expected to add the key to the destination object as
 * non-enumerable, if supported by the environment.
 */

// ensures that, so long as these methods have not been overwritten by the
// time ease.js is loaded, we will maintain a proper reference
var _random = Math.random,
    _floor  = Math.floor;

// prefix used for all generated symbol strings (this string is highly
// unlikely to exist in practice); it will produce a string containing a
// non-printable ASCII character that is *not* the null byte
var _root = ' ' + String.fromCharCode(
    _floor( _random() * 10 ) % 31 + 1
) + '$';


/**
 * Generate a pseudo-random string (with a common prefix) to be used as an
 * object key
 *
 * The returned key is unique so long as Math.{random,floor} are reliable.
 * This will be true so long as (1) the runtime provides a reliable
 * implementation and (2) Math.{floor,random} have not been overwritten at
 * the time that this module is loaded. This module stores an internal
 * reference to this methods, so malicious code loaded after this module
 * will not be able to compromise the return value.
 *
 * Note that the returned string is not wholly random: a common prefix is
 * used to ensure that collisions with other keys on objects is highly
 * unlikely; you should not rely on this behavior, though, as it is an
 * implementation detail that may change in the future.
 *
 * @return  {string}  pseudo-random string with common prefix
 */
function FallbackSymbol()
{
    if ( !( this instanceof FallbackSymbol ) )
    {
        return new FallbackSymbol();
    }

    this.___$$id$$ = ( _root + _floor( _random() * 1e8 ) );
}


FallbackSymbol.prototype = {
    /**
     * Return random identifier
     *
     * This is convenient, as it allows us to both treat the symbol as an
     * object of type FallbackSymbol and use the symbol as a key (since
     * doing so will automatically call this method).
     *
     * @return  {string}  random identifier
     */
    toString: function()
    {
        return this.___$$id$$;
    }
};


module.exports = FallbackSymbol;

} )( module['util/symbol/FallbackSymbol'] = {}, '.' );
/** util/Global **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = 'util';
/**
 * Global scope handling
 *
 *  Copyright (C) 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// retrieve global scope; works with ES5 strict mode
(0,eval)( 'var _the_global=this' );

// prototype to allow us to augment the global scope for our own purposes
// without polluting the global scope
function _G() {}
_G.prototype = _the_global;


/**
 * Provides access to and augmentation of global variables
 *
 * This provides a static method to consistently provide access to the
 * object representing the global scope, regardless of environment. Through
 * instantiation, its API permits augmenting a local object whose prototype
 * is the global scope, providing alternatives to variables that do not
 * exist.
 */
function Global()
{
    // allows omitting `new` keyword, consistent with ease.js style
    if ( !( this instanceof Global ) )
    {
        return new Global();
    }

    // do not pollute the global scope (previously, _the_global was used as
    // the prototype for a new object to take advantage of native overrides,
    // but unfortunately IE<=8 did not support this and always returned
    // undefined values from the prototype).
    this._alt = {};
}


/**
 * Provides consistent access to the global scope through all ECMAScript
 * versions, for any root variable name, and works with ES5 strict mode.
 *
 * As an example, Node.js exposes the variable `root` to represent global
 * scope, but browsers expose `window`. Further, ES5 strict mode will
 * provide an error when checking whether `typeof SomeGlobalVar ===
 * 'undefined'`.
 *
 * @return  {Object}  global object
 */
Global.expose = function()
{
    return _the_global;
};


Global.prototype = {
    /**
     * Provide a value for the provided global variable name if it is not
     * defined
     *
     * A function returning the value to assign to NAME should be provided,
     * ensuring that the alternative is never even evaluated unless it is
     * needed.
     *
     * The global scope will not be polluted with this alternative;
     * consequently, you must access the value using the `get` method.
     *
     * @param  {string}      name  global variable name
     * @param  {function()}  f     function returning value to assign
     *
     * @return  {Global}  self
     */
    provideAlt: function( name, f )
    {
        if ( ( _the_global[ name ] !== undefined )
            || ( this._alt[ name ] !== undefined )
        )
        {
            return;
        }

        this._alt[ name ] = f();
        return this;
    },


    /**
     * Retrieve global value or provided alternative
     *
     * This will take into account values provided via `provideAlt`; if no
     * alternative was provided, the request will be deleagated to the
     * global variable NAME, which may or may not be undefined.
     *
     * No error will be thrown if NAME is not globally defined.
     *
     * @param  {string}  name  global variable name
     *
     * @return  {*}  value associated with global variable NAME or
     *               its provided alternative
     */
    get: function( name )
    {
        return ( this._alt[ name ] !== undefined )
            ? this._alt[ name ]
            : _the_global[ name ];
    }
};

module.exports = Global;

} )( module['util/Global'] = {}, '.' );
/** util/Symbol **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = 'util';
/**
 * Forward-compatible subset of ES6 Symbol
 *
 *  Copyright (C) 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * This is *not* intended to be a complete implementation; it merely
 * performs what is needed for ease.js, preferring the benefits of the ES6
 * Symbol implementation while falling back to sane ES5 and ES3 options.
 */

// to be used if there is no global Symbol available
var FallbackSymbol = require( './symbol/FallbackSymbol' );

var _root = require( './Global' ).expose();
module.exports = _root.Symbol || FallbackSymbol;

} )( module['util/Symbol'] = {}, '.' );
/** prop_parser **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
/**
 * Property keyword parser module
 *
 *  Copyright (C) 2010, 2011, 2012, 2013, 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Known (permitted) keywords
 * @type {Object.<string,boolean>}
 */
var _keywords = {
    'public':    1,
    'protected': 1<<1,
    'private':   1<<2,
    'static':    1<<3,
    'abstract':  1<<4,
    'const':     1<<5,
    'virtual':   1<<6,
    'override':  1<<7,
    'proxy':     1<<8,
    'weak':      1<<9
};

/**
 * Keyword masks for conveniently checking the keyword bitfield
 * @type {Object.<string,integer>}
 */
var _kmasks = {
    amods: _keywords[ 'public' ]
        | _keywords[ 'protected' ]
        | _keywords[ 'private' ],

    'virtual': _keywords[ 'abstract' ]
        | _keywords[ 'virtual' ]
};


// expose magic values
exports.kvals  = _keywords;
exports.kmasks = _kmasks;


/**
 * Parses property keywords
 *
 * @param  {string}  prop  property string, which may contain keywords
 *
 * @return  {{name: string, keywords: Object.<string, boolean>}}
 */
exports.parseKeywords = function ( prop )
{
    var name        = prop,
        keywords    = [],
        bitwords    = 0x00,
        keyword_obj = {};

    prop = ''+( prop );

    // the keywords are all words, except for the last, which is the
    // property name
    if ( ( keywords = prop.split( /\s+/ ) ).length !== 1 )
    {
        name = keywords.pop();

        var i = keywords.length;
        while ( i-- )
        {
            var keyword = keywords[ i ],
                kval    = _keywords[ keyword ];

            // ensure the keyword is recognized
            if ( !kval )
            {
                throw Error(
                    "Unexpected keyword for '" + name + "': " + keyword
                );
            }

            // ease-of-access
            keyword_obj[ keyword ] = true;

            // permits quick and concise checks
            bitwords |= kval;
        }
    }

    // members with an underscore prefix are implicitly private, unless an
    // access modifier is explicitly provided; double-underscore is ingored,
    // as they denote special members that do not become part of the
    // prototype and are reserved by ease.js
    if ( ( name.match( /^_[^_]/ ) && !( bitwords & _kmasks.amods ) ) )
    {
        keyword_obj[ 'private' ] = true;
        bitwords |= _keywords[ 'private' ];
    }

    return {
        name:     name,
        keywords: keyword_obj,
        bitwords: bitwords
    };
}
} )( module['prop_parser'] = {}, '.' );
/** util **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
/**
 * Contains utilities functions shared by modules
 *
 *  Copyright (C) 2010, 2011, 2012, 2013, 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var propParseKeywords = require( './prop_parser' ).parseKeywords;


/**
 * Whether we can actually define properties, or we need to fall back
 *
 * This check actually attempts to set a property and fails if there's an error.
 * This is needed because IE8 has a broken implementation, yet still defines
 * Object.defineProperty for use with DOM elements. Just another day in the life
 * of a web developer.
 *
 * This test is only performed once, when the module is first loaded. Don't
 * expect a performance hit from it.
 *
 * @type  {boolean}
 */
var can_define_prop = ( function()
{
    if ( typeof Object.defineProperty === 'function' )
    {
        try
        {
            // perform test, primarily for IE8
            Object.defineProperty( {}, 'x', {} );
            return true;
        }
        catch ( e ) {}
    }

    return false;
} )();


exports.Global = require( './util/Global' );


/**
 * Freezes an object if freezing is supported
 *
 * @param  {Object}  obj  object to freeze
 *
 * @return  {Object}  object passed to function
 */
exports.freeze = ( typeof Object.freeze === 'function' )
    ? Object.freeze
    : function( obj )
    {
        return;
    }
;


/**
 * Gets/sets whether the system needs to fall back to defining properties in a
 * normal manner when use of Object.defineProperty() is requested
 *
 * This will be set by default if the JS engine does not support the
 * Object.defineProperty method from ECMAScript 5.
 *
 * @param  {boolean=}  val  value, if used as setter
 *
 * @return  {boolean|Object}  current value if getter, self if setter
 */
exports.definePropertyFallback = function( val )
{
    if ( val === undefined )
    {
        return !can_define_prop;
    }

    can_define_prop = !val;
    exports.defineSecureProp = getDefineSecureProp();

    return exports;
};


/**
 * Attempts to define a non-enumerable, non-writable and non-configurable
 * property on the given object
 *
 * If the operation is unsupported, a normal property will be set.
 *
 * @param  {Object}  obj    object to set property on
 * @param  {string}  prop   name of property to set
 * @param  {*}       value  value to set
 *
 * @return  {undefined}
 */
exports.defineSecureProp = getDefineSecureProp();


/**
 * Clones an object
 *
 * @param  {*}         data  object to clone
 * @param  {boolean=}  deep  perform deep clone (defaults to shallow)
 *
 * @return  {*}  cloned object
 *
 * Closure Compiler ignores typeof checks and is thusly confused:
 * @suppress {checkTypes}
 */
exports.clone = function clone( data, deep )
{
    deep = !!deep;

    if ( data instanceof Array )
    {
        if ( !deep )
        {
            // return a copy of the array
            return data.slice( 0 );
        }

        // if we're performing a deep clone, we have to loop through each of the
        // elements of the array and clone them
        var ret = [];
        for ( var i = 0, len = data.length; i < len; i++ )
        {
            // clone this element
            ret.push( clone( data[ i ], deep ) );
        }

        return ret;
    }
    else if ( typeof data === 'function' )
    {
        // It is pointless to clone a function. Even if we did clone those that
        // support toSource(), they'd still do the same damn thing.
        return data;
    }
    // explicitly testing with instanceof will ensure we're actually testing an
    // object, not something that may be misinterpreted as one (e.g. null)
    else if ( data instanceof Object )
    {
        var newobj = {},
            hasOwn = Object.prototype.hasOwnProperty;

        // copy data to the new object
        for ( var prop in data )
        {
            if ( hasOwn.call( data, prop ) )
            {
                newobj[ prop ] = ( deep )
                    ? clone( data[ prop ] )
                    : data[ prop ]
                ;
            }
        }

        return newobj;
    }

    // primitive type; cloning unnecessary
    return data;
};


/**
 * Copies properties from one object to another
 *
 * This method is designed to support very basic object extensions. The
 * destination argument is first to allow extending an object without using the
 * full-blown class system.
 *
 * If a deep copy is not performed, all values will be copied by reference.
 *
 * @param  {Object}   dest  destination object
 * @param  {Object}   src   source object
 * @param  {boolean}  deep  perform deep copy (slower)
 *
 * @return  {Object}  dest
 */
exports.copyTo = function( dest, src, deep )
{
    deep = !!deep;

    var get, set, data;

    // sanity check
    if ( !( dest instanceof Object ) || !( src instanceof Object ) )
    {
        throw TypeError(
            "Must provide both source and destination objects"
        );
    }

    // slower; supports getters/setters
    if ( can_define_prop )
    {
        for ( var prop in src )
        {
            data = Object.getOwnPropertyDescriptor( src, prop );

            if ( data.get || data.set )
            {
                // Define the property the slower way (only needed for
                // getters/setters). We don't have to worry about cloning in
                // this case, since getters/setters are methods.
                Object.defineProperty( dest, prop, data );
            }
            else
            {
                // normal copy; cloned if deep, otherwise by reference
                dest[ prop ] = ( deep )
                    ? exports.clone( src[ prop ], true )
                    : src[ prop ]
                ;
            }
        }
    }
    // quick (keep if statement out of the loop)
    else
    {
        for ( var prop in src )
        {
            // normal copy; cloned if deep, otherwise by reference
            dest[ prop ] = ( deep )
                ? exports.clone( src[ prop ], true )
                : src[ prop ]
            ;
        }
    }

    // return dest for convenience (and to feel useful about ourselves)
    return dest;
};


/**
 * Throw an exception
 *
 * Yes, this function has purpose; see where it's used.
 *
 * @param  {Error}  e  exception to throw
 */
function _throw( e )
{
    throw e;
}


/**
 * Parses object properties to determine how they should be interpreted in an
 * Object Oriented manner
 *
 * @param  {!Object}  data     properties with names as the key
 *
 * @param  {!{each,property,method,getset,keywordParser}}  options
 *         parser options and callbacks
 *
 * @return undefined
 */
exports.propParse = function( data, options, context )
{
    // todo: profile; function calls are more expensive than if statements, so
    // it's probably a better idea not to use fvoid
    var fvoid          = function() {},
        callbackEach   = options.each          || undefined,
        callbackProp   = options.property      || fvoid,
        callbackMethod = options.method        || fvoid,
        callbackGetSet = options.getset        || fvoid,
        keywordParser  = options.keywordParser || propParseKeywords,

        throwf = options._throw || _throw,

        hasOwn = Object.prototype.hasOwnProperty,

        parse_data = {},
        name       = '',
        keywords   = {},
        value      = null,
        getter     = false,
        setter     = false;

    // for each of the given properties, determine what type of property we're
    // dealing with (in the classic OO sense)
    for ( var prop in data )
    {
        // ignore properties of instance prototypes
        if ( !( hasOwn.call( data, prop ) ) )
        {
            continue;
        }

        // retrieve getters/setters, if supported
        if ( can_define_prop )
        {
            var prop_desc = Object.getOwnPropertyDescriptor( data, prop );
            getter = prop_desc.get;
            setter = prop_desc.set;
        }

        // do not attempt to retrieve the value if a getter is defined (as that
        // would then call the getter)
        value = ( typeof getter === 'function' )
            ? undefined
            : data[ prop ];

        parse_data = keywordParser( prop ) || {};
        name       = parse_data.name || prop;
        keywords   = parse_data.keywords || {};

        // note the exception for abstract overrides
        if ( options.assumeAbstract
            || ( keywords[ 'abstract' ] && !( keywords[ 'override' ] ) )
        )
        {
            // may not be set if assumeAbstract is given
            keywords[ 'abstract' ] = true;

            if ( !( value instanceof Array ) )
            {
                throwf( TypeError(
                    "Missing parameter list for abstract method: " + name
                ) );
            }

            verifyAbstractNames( throwf, name, value );
            value = exports.createAbstractMethod.apply( this, value );
        }

        // if an 'each' callback was provided, pass the data before parsing it
        if ( callbackEach )
        {
            callbackEach.call( context, name, value, keywords );
        }

        // getter/setter
        if ( getter || setter )
        {
            callbackGetSet.call( context,
                name, getter, setter, keywords
            );
        }
        // method
        else if ( ( typeof value === 'function' ) || ( keywords[ 'proxy' ] ) )
        {
            callbackMethod.call(
                context,
                name,
                value,
                exports.isAbstractMethod( value ),
                keywords
            );
        }
        // simple property
        else
        {
            callbackProp.call( context, name, value, keywords );
        }
    }
};


/**
 * Only permit valid names for parameter list
 *
 * In the future, we may add additional functionality, so it's important to
 * restrict this as much as possible for the time being.
 *
 * @param  {function(Error)}  throwf  function to call with error
 *
 * @param  {string}  name    name of abstract member (for error)
 * @param  {Object}  params  parameter list to check
 *
 * @return {undefined}
 */
function verifyAbstractNames( throwf, name, params )
{
    var i = params.length;
    while ( i-- )
    {
        if ( params[ i ].match( /^[a-z_][a-z0-9_]*$/i ) === null )
        {
            throwf( SyntaxError(
                "Member " + name + " contains invalid parameter '" +
                params[ i ] + "'"
            ) );
        }
    }
}


/**
 * Creates an abstract method
 *
 * Abstract methods must be implemented by a subclass and cannot be called
 * directly. If a class contains a single abstract method, the class itself is
 * considered to be abstract and cannot be instantiated. It may only be
 * extended.
 *
 * @param  {...string}  def  function definition that concrete
 *                           implementations must follow
 *
 * @return  {function()}
 */
exports.createAbstractMethod = function( def )
{
    var dfn = [],
        i   = arguments.length;

    while ( i-- ) dfn[ i ] = arguments[ i ];

    var method = function()
    {
        throw new Error( "Cannot call abstract method" );
    };

    exports.defineSecureProp( method, 'abstractFlag', true );
    exports.defineSecureProp( method, 'definition', dfn );
    exports.defineSecureProp( method, '__length', arguments.length );

    return method;
};


/**
 * Determines if the given function is an abstract method
 *
 * @param  {function()}  func  function to inspect
 *
 * @return  {boolean}  true if function is an abstract method, otherwise false
 *
 * @suppress {checkTypes}
 */
exports.isAbstractMethod = function( func )
{
    return ( ( typeof func === 'function') && ( func.abstractFlag === true ) )
        ? true
        : false
    ;
};


/**
 * Shrinks an array, removing undefined elements
 *
 * Pushes all items onto a new array, removing undefined elements. This ensures
 * that the length of the array represents correctly the number of elements in
 * the array.
 *
 * @param  {Array}  items  array to shrink
 *
 * @return  {Array}  shrunken array
 */
exports.arrayShrink = function( items )
{
    // copy the methods into a new array by pushing them onto it, to ensure
    // the length property of the array will work properly
    var arr_new = [];
    for ( var i = 0, len = items.length; i < len; i++ )
    {
        var item = items[ i ];
        if ( item === undefined )
        {
            continue;
        }

        arr_new.push( item );
    }

    return arr_new;
};


/**
 * Uses Object.getOwnPropertyDescriptor if available, otherwise provides our own
 * implementation to fall back on
 */
exports.getOwnPropertyDescriptor =
    ( can_define_prop && Object.getOwnPropertyDescriptor ) ||
    /**
     * If the environment does not support retrieving property descriptors
     * (ES5), then the following will be true:
     *  - get/set will always be undefined
     *  - writable, enumerable and configurable will always be true
     *  - value will be the value of the requested property on the given object
     *
     * @param  {!Object}  obj   object to check property on
     * @param  {string}   prop  property to retrieve descriptor for
     *
     * @return  {Object|undefined}  descriptor for requested property, if found
     */
    function( obj, prop )
    {
        if ( !Object.prototype.hasOwnProperty.call( obj, prop ) )
        {
            return undefined;
        }

        // fallback response
        return {
            get: undefined,
            set: undefined,

            writable:     true,
            enumerable:   true,
            configurable: true,

            value: obj[ prop ]
        };
    };


/**
 * Returns prototype of object, or undefined if unsupported
 */
exports.getPrototypeOf = Object.getPrototypeOf || function()
{
    return undefined;
};


/**
 * Travels down the prototype chain of the given object in search of the
 * requested property and returns its descriptor
 *
 * This operates as Object.getOwnPropertyDescriptor(), except that it traverses
 * the prototype chain. For environments that do not support __proto__, it will
 * not traverse the prototype chain and essentially serve as an alias for
 * getOwnPropertyDescriptor().
 *
 * This method has the option to ignore the base prototype. This is useful to,
 * for example, not catch properties like Object.prototype.toString() when
 * searching for 'toString' on an object.
 *
 * @param  {Object}   obj     object to check property on
 * @param  {string}   prop    property to retrieve descriptor for
 * @param  {boolean}  nobase  whether to ignore the base prototype
 *
 * @return  {Object}  descriptor for requested property or undefined if not found
 */
exports.getPropertyDescriptor = function( obj, prop, nobase )
{
    // false by default
    nobase = !!nobase;

    // note that this uses util's function, not Object's
    var desc = exports.getOwnPropertyDescriptor( obj, prop ),
        next = exports.getPrototypeOf( obj );

    // if we didn't find a descriptor and a prototype is available, recurse down
    // the prototype chain, ensuring that the next prototype has a prototype if
    // the base is to be excluded
    if ( !desc && next && ( !nobase || exports.getPrototypeOf( next ) ) )
    {
        return exports.getPropertyDescriptor( next, prop, nobase );
    }

    // return the descriptor or undefined if no prototype is available
    return desc;
};


/**
 * Indicates whether or not the getPropertyDescriptor method is capable of
 * traversing the prototype chain
 */
exports.defineSecureProp( exports.getPropertyDescriptor, 'canTraverse',
    ( Object.getPrototypeOf ) ? true : false
);


/**
 * Appropriately returns defineSecureProp implementation to avoid check on
 * each invocation
 *
 * @return  {function( Object, string, * )}
 */
function getDefineSecureProp()
{
    // falls back to simply defining a normal property
    var fallback = function( obj, prop, value )
    {
        obj[ prop ] = value;
    };

    if ( !can_define_prop )
    {
        return fallback;
    }
    else
    {
        // uses ECMAScript 5's Object.defineProperty() method
        return function( obj, prop, value )
        {
            Object.defineProperty( obj, prop,
            {
                value: value,

                enumerable:   false,
                writable:     false,
                configurable: false
            } );
        };
    }
}

} )( module['util'] = {}, '.' );
/** warn/Warning **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = 'warn';
/**
 * Warning prototype
 *
 *  Copyright (C) 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * Permits wrapping an exception as a warning
 *
 * Warnings are handled differently by the system, depending on the warning
 * level that has been set.
 *
 * @param {Error} e exception (error) to wrap
 *
 * @return {Warning} new warning instance
 *
 * @constructor
 */
function Warning( e )
{
    // allow instantiation without use of 'new' keyword
    if ( !( this instanceof Warning ) )
    {
        return new Warning( e );
    }

    // ensure we're wrapping an exception
    if ( !( e instanceof Error ) )
    {
        throw TypeError( "Must provide exception to wrap" );
    }

    Error.prototype.constructor.call( this, e.message );

    // copy over the message for convenience
    this.message = e.message;
    this.name    = 'Warning';
    this._error  = e;

    this.stack = e.stack &&
        e.stack.replace( /^.*?\n+/,
            this.name + ': ' + this.message + "\n"
        );
};

// ensures the closest compatibility...just be careful not to modify Warning's
// prototype
Warning.prototype = Error();
Warning.prototype.constructor = Warning;
Warning.prototype.name = 'Warning';


/**
 * Return the error wrapped by the warning
 *
 * @return {Error} wrapped error
 */
Warning.prototype.getError = function()
{
    return this._error;
};


module.exports = Warning;

} )( module['warn/Warning'] = {}, '.' );
/** warn/DismissiveHandler **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = 'warn';
/**
 * Dismissive warning handler
 *
 *  Copyright (C) 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * Warning handler that dismisses (ignores) all warnings
 *
 * This is useful in a production environment.
 */
function DismissiveHandler()
{
    if ( !( this instanceof DismissiveHandler ) )
    {
        return new DismissiveHandler();
    }
}


DismissiveHandler.prototype = {
    /**
     * Handle a warning
     *
     * @param   {Warning}   warning  warning to handle
     * @return  {undefined}
     */
    handle: function( warning )
    {
        // intentionally do nothing
    }
}

module.exports = DismissiveHandler;

} )( module['warn/DismissiveHandler'] = {}, '.' );
/** warn/LogHandler **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = 'warn';
/**
 * Logging warning handler
 *
 *  Copyright (C) 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * Warning handler that logs all warnings to a console
 *
 * @param  {Object}  console  console with a warn or log method
 */
function LogHandler( console )
{
    if ( !( this instanceof LogHandler ) )
    {
        return new LogHandler( console );
    }

    this._console = console || {};
}


LogHandler.prototype = {
    /**
     * Handle a warning
     *
     * Will attempt to log using console.warn(), falling back to
     * console.log() if necessary and aborting entirely if neither is
     * available.
     *
     * This is useful as a default option to bring problems to the
     * developer's attention without affecting the control flow of the
     * software.
     *
     * @param   {Warning}   warning  warning to handle
     * @return  {undefined}
     */
    handle: function( warning )
    {
        var dest = this._console.warn || this._console.log;
        dest && dest.call( this._console,
            'Warning: ' + warning.message
        );
    }
}

module.exports = LogHandler;

} )( module['warn/LogHandler'] = {}, '.' );
/** warn/ThrowHandler **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = 'warn';
/**
 * Throwing warning handler
 *
 *  Copyright (C) 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * Warning handler that throws all warnings as exceptions
 */
function ThrowHandler()
{
    if ( !( this instanceof ThrowHandler ) )
    {
        return new ThrowHandler();
    }
}


ThrowHandler.prototype = {
    /**
     * Handle a warning
     *
     * Throws the error associated with the warning.
     *
     * This handler is useful for development and will ensure that problems
     * are brought to the attention of the developer.
     *
     * @param   {Warning}   warning  warning to handle
     * @return  {undefined}
     */
    handle: function( warning )
    {
        throw warning.getError();
    }
}

module.exports = ThrowHandler;

} )( module['warn/ThrowHandler'] = {}, '.' );
/** warn **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
/**
 * ease.js warning system
 *
 *  Copyright (C) 2011, 2012, 2013, 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

module.exports = {
    Warning: require( './warn/Warning' ),

    DismissiveHandler: require( './warn/DismissiveHandler' ),
    LogHandler:        require( './warn/LogHandler' ),
    ThrowHandler:      require( './warn/ThrowHandler' )
};

} )( module['warn'] = {}, '.' );
/** ClassBuilder **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
/**
 * Handles building of classes
 *
 *  Copyright (C) 2011, 2012, 2013, 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * TODO: This module is currently being tested /indirectly/ by the class
 *       tests. This is because of a refactoring. All of this logic used to
 *       be part of the class module. Test this module directly, but keep
 *       the existing class tests in tact for a higher-level test.
 */

var util    = require( './util' ),
    Warning = require( './warn' ).Warning,
    Symbol  = require( './util/Symbol' ),

    hasOwn = Object.prototype.hasOwnProperty,


    /**
     * IE contains a nasty enumeration "bug" (poor implementation) that makes
     * toString unenumerable. This means that, if you do obj.toString = foo,
     * toString will NOT show up in `for` or hasOwnProperty(). This is a problem.
     *
     * This test will determine if this poor implementation exists.
     */
    enum_bug = (
        Object.prototype.propertyIsEnumerable.call(
            { toString: function() {} },
            'toString'
        ) === false
    )
    ? true
    : false,

    /**
     * Hash of reserved members
     *
     * These methods cannot be defined in the class. They are for internal use
     * only. We must check both properties and methods to ensure that neither is
     * defined.
     *
     * @type {Object.<string,boolean>}
     */
    reserved_members = {
        '__initProps': true,
        'constructor': true
    },

    /**
     * Hash of methods that must be public
     *
     * Notice that this is a list of /methods/, not members, because this check
     * is performed only for methods. This is for performance reasons. We do not
     * have a situation where we will want to check for properties as well.
     *
     * @type {Object.<string,boolean>}
     */
    public_methods = {
        '__construct': true,
        '__mixin':     true,
        'toString':    true,
        '__toString':  true
    },

    /**
     * Symbol used to encapsulate internal data
     *
     * Note that this is intentionally generated *outside* the ClassBuilder
     * instance; this ensures that it is properly encapsulated and will not
     * be exposed on the Classbuilder instance (which would defeat the
     * purpose).
     */
    _priv = Symbol()
;


/**
 * Initializes class builder with given member builder
 *
 * The 'new' keyword is not required when instantiating this constructor.
 *
 * @param  {Object}  member_builder  member builder
 *
 * @param  {VisibilityObjectFactory}  visibility_factory  visibility object
 *                                                        generator
 *
 * @constructor
 */
module.exports = exports =
function ClassBuilder( warn_handler, member_builder, visibility_factory )
{
    // allow ommitting the 'new' keyword
    if ( !( this instanceof exports ) )
    {
        // module.exports for Closure Compiler
        return new module.exports(
            warn_handler, member_builder, visibility_factory
        );
    }

    /**
     * Determines how warnings should be handled
     * @type {WarningHandler}
     */
    this._warnHandler = warn_handler;

    /**
     * Used for building class members
     * @type {Object}
     */
    this._memberBuilder = member_builder;

    /**
     * Generates visibility object
     * @type {VisibilityObjectFactory}
     */
    this._visFactory = visibility_factory;


    /**
     * Class id counter, to be increment on each new definition
     * @type {number}
     */
    this._classId = 0;

    /**
     * Instance id counter, to be incremented on each new instance
     * @type {number}
     */
    this._instanceId = 0;

    /**
     * Set to TRUE when class is in the process of being extended to ensure that
     * a constructor can be instantiated (to use as the prototype) without
     * invoking the class construction logic
     *
     * @type {boolean}
     */
    this._extending = false;

    /**
     * A flag to let the system know that we are currently attempting to access
     * a static property from within a method. This means that the caller should
     * be given access to additional levels of visibility.
     *
     * @type {boolean}
     */
    this._spropInternal = false;
};


/**
 * Default class implementation
 *
 * @return undefined
 */
exports.ClassBase = function Class() {};

// the base class has the class identifier 0
util.defineSecureProp( exports.ClassBase, '__cid', 0 );


/**
 * Default static property method
 *
 * This simply returns undefined, signifying that the property was not found.
 *
 * @param  {string}  prop  requested property
 *
 * @return  {undefined}
 */
exports.ClassBase.$ = function( prop, val )
{
    if ( val !== undefined )
    {
        throw ReferenceError(
            "Cannot set value of undeclared static property '" + prop + "'"
        );
    }

    return undefined;
};


/**
 * Returns a hash of the reserved members
 *
 * The returned object is a copy of the original. It cannot be used to modify
 * the internal list of reserved members.
 *
 * @return  {Object.<string,boolean>}  reserved members
 */
exports.getReservedMembers = function()
{
    // return a copy of the reserved members
    return util.clone( reserved_members, true );
};


/**
 * Returns a hash of the forced-public methods
 *
 * The returned object is a copy of the original. It cannot be used to modify
 * the internal list of reserved members.
 *
 * @return  {Object.<string,boolean>}  forced-public methods
 */
exports.getForcedPublicMethods = function()
{
    return util.clone( public_methods, true );
};


/**
 * Returns reference to metadata for the requested class
 *
 * Since a reference is returned (rather than a copy), the returned object can
 * be modified to alter the metadata.
 *
 * @param  {Function|Object}  cls  class from which to retrieve metadata
 *
 * @return  {__class_meta} or null if unavailable
 */
exports.getMeta = function( cls )
{
    return ( cls[ _priv ] || {} ).meta || null;
}


/**
 * Determines if the class is an instance of the given type
 *
 * The given type can be a class, interface, trait or any other type of object.
 * It may be used in place of the 'instanceof' operator and contains additional
 * enhancements that the operator is unable to provide due to prototypal
 * restrictions.
 *
 * @param  {Object}  type      expected type
 * @param  {Object}  instance  instance to check
 *
 * @return  {boolean}  true if instance is an instance of type, otherwise false
 */
exports.isInstanceOf = function( type, instance )
{
    var meta, implemented, i;

    if ( !( type && instance ) )
    {
        return false;
    }

    // defer check to type, falling back to a more primitive check; this
    // also allows extending ease.js' type system
    return !!( type.__isInstanceOf || _instChk )( type, instance );
}


/**
 * Wrapper around ECMAScript instanceof check
 *
 * This will not throw an error if TYPE is not a function.
 *
 * Note that a try/catch is used instead of checking first to see if TYPE is
 * a function; this is due to the implementation of, notably, IE, which
 * allows instanceof to be used on some DOM objects with typeof `object'.
 * These same objects have typeof `function' in other browsers.
 *
 * @param  {*}       type      constructor to check against
 * @param  {Object}  instance  instance to examine
 *
 * @return  {boolean}  whether INSTANCE is an instance of TYPE
 */
function _instChk( type, instance )
{
    try
    {
        // check prototype chain (will throw an error if type is not a
        // constructor)
        if ( instance instanceof type )
        {
            return true;
        }
    }
    catch ( e ) {}

    return false;
}


/**
 * Mimics class inheritance
 *
 * This method will mimic inheritance by setting up the prototype with the
 * provided base class (or, by default, Class) and copying the additional
 * properties atop of it.
 *
 * The class to inherit from (the first argument) is optional. If omitted, the
 * first argument will be considered to be the properties list.
 *
 * @param  {Function|Object}  _   parent or definition object
 * @param  {Object=}          __  definition object if parent was provided
 *
 * @return  {Function}  extended class
 */
exports.prototype.build = function extend( _, __ )
{
    var build = this;

    // ensure we'll be permitted to instantiate abstract classes for the base
    this._extending = true;

    var a         = arguments,
        an        = a.length,
        props     = ( ( an > 0 ) ? a[ an - 1 ] : 0 ) || {},
        base      = ( ( an > 1 ) ? a[ an - 2 ] : 0 ) || exports.ClassBase,
        prototype = this._getBase( base ),
        cname     = '',
        autoa     = false,

        prop_init      = this._memberBuilder.initMembers(),
        members        = this._memberBuilder.initMembers( prototype ),
        static_members = {
            methods: this._memberBuilder.initMembers(),
            props:   this._memberBuilder.initMembers()
        },

        meta = exports.getMeta( base ) || {},

        abstract_methods =
            util.clone( meta.abstractMethods )
            || { __length: 0 },

        virtual_members =
            util.clone( meta.virtualMembers )
            || {}
    ;

    // prevent extending final classes
    if ( base.___$$final$$ === true )
    {
        throw Error(
            "Cannot extend final class " +
                ( base[ _priv ].meta.name || '(anonymous)' )
        );
    }

    // grab the name, if one was provided
    if ( cname = props.__name )
    {
        // we no longer need it
        delete props.__name;
    }

    // gobble up auto-abstract flag if present
    if ( ( autoa = props.___$$auto$abstract$$ ) !== undefined )
    {
        delete props.___$$auto$abstract$$;
    }

    // IE has problems with toString()
    if ( enum_bug )
    {
        if ( props.toString !== Object.prototype.toString )
        {
            props.__toString = props.toString;
        }
    }

    // increment class identifier
    this._classId++;

    // if we are inheriting from a prototype, we must make sure that all
    // properties initialized by the ctor are implicitly public; otherwise,
    // proxying will fail to take place
    // TODO: see Class.isA TODO
    if ( ( prototype[ _priv ] || {} ).vis === undefined )
    {
        this._discoverProtoProps( prototype, prop_init );
    }

    // build the various class components (XXX: this is temporary; needs
    // refactoring)
    try
    {
        this.buildMembers( props,
            this._classId,
            base,
            prop_init,
            {
                all:        members,
                'abstract': abstract_methods,
                'static':   static_members,
                'virtual':  virtual_members
            },
            function( inst )
            {
                return new_class.___$$svis$$;
            }
        );
    }
    catch ( e )
    {
        // intercept warnings /only/
        if ( e instanceof Warning )
        {
            this._warnHandler.handle( e );
        }
        else
        {
            throw e;
        }
    }

    // reference to the parent prototype (for more experienced users)
    prototype.___$$parent$$ = base.prototype;

    // set up the new class
    var new_class = this.createCtor( cname, abstract_methods, members );

    // closure to hold static initialization to be used later by subtypes
    this.initStaticVisibilityObj( new_class );

    var _self = this;
    var staticInit = function( ctor, inheriting )
    {
        _self.attachStatic( ctor, static_members, base, inheriting );
    }
    staticInit( new_class, false );

    this._attachPropInit(
        prototype, prop_init, members, new_class, this._classId
    );

    new_class.prototype             = prototype;
    new_class.prototype.constructor = new_class;
    new_class.___$$props$$          = prop_init;
    new_class.___$$methods$$        = members;
    new_class.___$$sinit$$          = staticInit;

    attachFlags( new_class, props );
    validateAbstract( new_class, cname, abstract_methods, autoa );

    // We reduce the overall cost of this definition by defining it on the
    // prototype rather than during instantiation. While this does increase the
    // amount of time it takes to access the property through the prototype
    // chain, it takes much more time to define the property in this manner.
    // Therefore, we can save a substantial amount of time by defining it on the
    // prototype rather than on each new instance via __initProps().
    util.defineSecureProp( prototype, '__self', new_class.___$$svis$$ );

    // create internal metadata for the new class
    var meta = createMeta( new_class, base );
    meta.abstractMethods = abstract_methods;
    meta.virtualMembers  = virtual_members;
    meta.name            = cname;

    attachAbstract( new_class, abstract_methods );
    attachId( new_class, this._classId );

    // returns a new instance of the class without invoking the constructor
    // (intended for use in prototype chains)
    new_class.asPrototype = function()
    {
        build._extending = true;
        var inst = new_class();
        build._extending = false;
        return inst;
    };

    // we're done with the extension process
    this._extending = false;

    return new_class;
};


exports.prototype._getBase = function( base )
{
    var type = ( typeof base );

    switch ( type )
    {
        // constructor (we could also check to ensure that the return value of
        // the constructor is an object, but that is not our concern)
        case 'function':
            return new base();

        // we can use objects as the prototype directly
        case 'object':
            return base;
    }

    // scalars
    throw TypeError( 'Must extend from Class, constructor or object' );
};


/**
 * Discovers public properties on the given object and create an associated
 * property
 *
 * This allows inheriting from a prototype that uses properties by ensuring
 * that we properly proxy to that property. Otherwise, assigning the value
 * on the private visibilit object would mask the underlying value rather
 * than modifying it, leading to an inconsistent and incorrect state.
 *
 * This assumes that the object has already been initialized with all the
 * properties. This may not be the case if the prototype constructor does
 * not do so, in which case there is nothing we can do.
 *
 * This does not recurse on the prototype chian.
 *
 * For a more detailed description of this issue, see the interoperability
 * test case for classes.
 *
 * @param  {Object}  obj        object from which to gather properties
 * @param  {Object}  prop_init  destination property object
 *
 * @return  {undefined}
 */
exports.prototype._discoverProtoProps = function( obj, prop_init )
{
    var hasOwn = Object.hasOwnProperty,
        pub    = prop_init[ 'public' ];

    for ( var field in obj )
    {
        var value = obj[ field ];

        // we are not interested in the objtype chain, nor are we
        // interested in functions (which are methods and need not be
        // proxied)
        if ( !( hasOwn.call( obj, field ) )
            || typeof value === 'function'
        )
        {
            continue;
        }

        this._memberBuilder.buildProp(
            prop_init, null, field, value, {}
        );
    }
};


exports.prototype.buildMembers = function buildMembers(
    props, class_id, base, prop_init, memberdest, staticInstLookup
)
{
    var context = {
        _cb: this,

        // arguments
        prop_init:        prop_init,
        class_id:         class_id,
        base:             base,
        staticInstLookup: staticInstLookup,

        defs: {},

        // holds member builder state
        state: {},

        // TODO: there does not seem to be tests for these guys; perhaps
        // this can be rectified with the reflection implementation
        members:          memberdest.all,
        abstract_methods: memberdest['abstract'],
        static_members:   memberdest['static'],
        virtual_members:  memberdest['virtual']
    };

    // default member handlers for parser
    var handlers = {
        each:     _parseEach,
        property: _parseProp,
        getset:   _parseGetSet,
        method:   _parseMethod
    };

    // a custom parser may be provided to hook the below property parser;
    // this can be done to save time on post-processing, or alter the
    // default behavior of the parser
    if ( props.___$$parser$$ )
    {
        // this isn't something that we actually want to parse
        var parser = props.___$$parser$$;
        delete props.___$$parser$$;

        // TODO: this is recreated every call!
        var hjoin = function( name, orig )
        {
            handlers[ name ] = function()
            {
                var args = [],
                    i    = arguments.length;

                while ( i-- ) args[ i ] = arguments[ i ];

                // invoke the custom handler with the original handler as
                // its last argument (which the custom handler may choose
                // not to invoke at all)
                args.push( orig );
                parser[ name ].apply( context, args );
            };
        };

        // this avoids a performance penalty unless the above property is
        // set
        parser.each     && hjoin( 'each', handlers.each );
        parser.property && hjoin( 'property', handlers.property );
        parser.getset   && hjoin( 'getset', handlers.getset );
        parser.method   && hjoin( 'method', handlers.method );
    }

    // parse members and process accumulated member state
    util.propParse( props, handlers, context );
    this._memberBuilder.end( context.state );
}


function _parseEach( name, value, keywords )
{
    var defs = this.defs;

    // disallow use of our internal __initProps() method
    if ( reserved_members[ name ] === true )
    {
        throw Error( name + " is reserved" );
    }

    // if a member was defined multiple times in the same class
    // declaration, throw an error (unless the `weak' keyword is
    // provided, which exists to accomodate this situation)
    if ( hasOwn.call( defs, name )
        && !( keywords['weak'] || defs[ name ].weak )
    )
    {
        throw Error(
            "Cannot redefine method '" + name + "' in same declaration"
        );
    }

    // keep track of the definitions (only during class declaration)
    // to catch duplicates
    defs[ name ] = keywords;
}


function _parseProp( name, value, keywords )
{
    var dest = ( keywordStatic( keywords ) )
        ? this.static_members.props
        : this.prop_init;

    // build a new property, passing in the other members to compare
    // against for preventing nonsensical overrides
    this._cb._memberBuilder.buildProp(
        dest, null, name, value, keywords, this.base
    );
}


function _parseGetSet( name, get, set, keywords )
{
    var dest = ( keywordStatic( keywords ) )
            ? this.static_members.methods
            : this.members,

        is_static  = keywordStatic( keywords ),
        instLookup = ( ( is_static )
            ? this.staticInstLookup
            : exports.getMethodInstance
        );

    this._cb._memberBuilder.buildGetterSetter(
        dest, null, name, get, set, keywords, instLookup,
        this.class_id, this.base
    );
}


function _parseMethod( name, func, is_abstract, keywords )
{
    var is_static  = keywordStatic( keywords ),
        dest       = ( is_static )
            ? this.static_members.methods
            : this.members,
        instLookup = ( is_static )
            ? this.staticInstLookup
            : exports.getMethodInstance
    ;

    // constructor check
    if ( public_methods[ name ] === true )
    {
        if ( keywords[ 'protected' ] || keywords[ 'private' ] )
        {
            throw TypeError(
                name + " must be public"
            );
        }
    }

    var used = this._cb._memberBuilder.buildMethod(
        dest, null, name, func, keywords, instLookup,
        this.class_id, this.base, this.state
    );

    // do nothing more if we didn't end up using this definition
    // (this may be the case, for example, with weak members)
    if ( !used )
    {
        return;
    }

    // note the concrete method check; this ensures that weak
    // abstract methods will not count if a concrete method of the
    // smae name has already been seen
    if ( is_abstract )
    {
        this.abstract_methods[ name ] = true;
        this.abstract_methods.__length++;
    }
    else if ( ( hasOwn.call( this.abstract_methods, name ) )
        && ( is_abstract === false )
    )
    {
        // if this was a concrete method, then it should no longer
        // be marked as abstract
        delete this.abstract_methods[ name ];
        this.abstract_methods.__length--;
    }

    if ( keywords['virtual'] )
    {
        this.virtual_members[ name ] = true;
    }
}


/**
 * Validates abstract class requirements
 *
 * We permit an `auto' flag for internal use only that will cause the
 * abstract flag to be automatically set if the class should be marked as
 * abstract, instead of throwing an error; this should be used sparingly and
 * never exposed via a public API (for explicit use), as it goes against the
 * self-documentation philosophy.
 *
 * @param  {function()}  ctor              class
 * @param  {string}      cname             class name
 * @param  {{__length}}  abstract_methods  object containing abstract methods
 * @param  {boolean}     auto              automatically flag as abstract
 *
 * @return  {undefined}
 */
function validateAbstract( ctor, cname, abstract_methods, auto )
{
    if ( ctor.___$$abstract$$ )
    {
        if ( !auto && ( abstract_methods.__length === 0 ) )
        {
            throw TypeError(
                "Class " + ( cname || "(anonymous)" ) + " was declared as " +
                "abstract, but contains no abstract members"
            );
        }
    }
    else if ( abstract_methods.__length > 0 )
    {
        if ( auto )
        {
            ctor.___$$abstract$$ = true;
            return;
        }

        throw TypeError(
            "Class " + ( cname || "(anonymous)" ) + " contains abstract " +
            "members and must therefore be declared abstract"
        );
    }
}


/**
 * Creates the constructor for a new class
 *
 * This constructor will call the __constructor method for concrete classes
 * and throw an exception for abstract classes (to prevent instantiation).
 *
 * @param  {string}          cname             class name (may be empty)
 * @param  {Array.<string>}  abstract_methods  list of abstract methods
 * @param  {Object}          members           class members
 *
 * @return  {Function}  constructor
 */
exports.prototype.createCtor = function( cname, abstract_methods, members )
{
    var new_class;

    if ( abstract_methods.__length === 0 )
    {
        new_class = this.createConcreteCtor( cname, members );
    }
    else
    {
        new_class = this.createAbstractCtor( cname );
    }

    util.defineSecureProp( new_class, _priv, {} );
    return new_class;
}


/**
 * Creates the constructor for a new concrete class
 *
 * This constructor will call the __constructor method of the class, if
 * available.
 *
 * @param  {string}  cname    class name (may be empty)
 * @param  {Object}  members  class members
 *
 * @return  {function()}  constructor
 */
exports.prototype.createConcreteCtor = function( cname, members )
{
    var args  = null,
        _self = this;

    /**
     * Constructor function to be returned
     *
     * The name is set to ClassInstance because some debuggers (e.g. v8) will
     * show the name of this function for constructor instances rather than
     * invoking the toString() method
     *
     * @constructor
     *
     * Suppressing due to complaints for using __initProps
     * @suppress {checkTypes}
     */
    function ClassInstance()
    {
        if ( !( this instanceof ClassInstance ) )
        {
            // store arguments to be passed to constructor and
            // instantiate new object
            args = arguments;
            return new ClassInstance();
        }

        initInstance( this );
        this.__initProps();

        // If we're extending, we don't actually want to invoke any class
        // construction logic. The above is sufficient to use this class in a
        // prototype, so stop here.
        if ( _self._extending )
        {
            return;
        }

        // generate and store unique instance id
        attachInstanceId( this, ++_self._instanceId );

        // FIXME: this is a bit of a kluge for determining whether the ctor
        // should be invoked before a child prector...
        var haspre = ( typeof this.___$$ctor$pre$$ === 'function' );
        if ( haspre
            && ClassInstance.prototype.hasOwnProperty( '___$$ctor$pre$$' )
        )
        {
            // FIXME: we're exposing _priv to something that can be
            // malicously set by the user
            this.___$$ctor$pre$$( _priv );
            haspre = false;
        }

        // call the constructor, if one was provided
        if ( typeof this.__construct === 'function' )
        {
            // note that since 'this' refers to the new class (even
            // subtypes), and since we're using apply with 'this', the
            // constructor will be applied to subtypes without a problem
            this.__construct.apply( this, ( args || arguments ) );
        }

        // FIXME: see above
        if ( haspre )
        {
            this.___$$ctor$pre$$( _priv );
        }

        if ( typeof this.___$$ctor$post$$ === 'function' )
        {
            this.___$$ctor$post$$( _priv );
        }

        args = null;

        // attach any instance properties/methods (done after
        // constructor to ensure they are not overridden)
        attachInstanceOf( this );

        // Provide a more intuitive string representation of the class
        // instance. If a toString() method was already supplied for us,
        // use that one instead.
        if ( !( hasOwn.call( members[ 'public' ], 'toString' ) ) )
        {
            // use __toString if available (see enum_bug), otherwise use
            // our own defaults
            this.toString = members[ 'public' ].__toString
                || ( ( cname )
                    ? function()
                    {
                        return '#<' + cname + '>';
                    }
                    : function()
                    {
                        return '#<anonymous>';
                    }
                )
            ;
        }

    };

    // provide a more intuitive string representation
    ClassInstance.toString = ( cname )
        ? function() { return cname; }
        : function() { return '(Class)'; }
    ;

    return ClassInstance;
}


/**
 * Creates the constructor for a new abstract class
 *
 * Calling this constructor will cause an exception to be thrown, as abstract
 * classes cannot be instantiated.
 *
 * @param  {string}  cname  class name (may be empty)
 *
 * @return  {function()}  constructor
 */
exports.prototype.createAbstractCtor = function( cname )
{
    var _self = this;

    var __abstract_self = function()
    {
        if ( !_self._extending )
        {
            throw Error(
                "Abstract class " + ( cname || '(anonymous)' ) +
                    " cannot be instantiated"
            );
        }
    };

    __abstract_self.toString = ( cname )
        ? function()
        {
            return cname;
        }
        : function()
        {
            return '(AbstractClass)';
        }
    ;

    return __abstract_self;
}


/**
 * Attaches __initProps() method to the class prototype
 *
 * The __initProps() method will initialize class properties for that instance,
 * ensuring that their data is not shared with other instances (this is not a
 * problem with primitive data types).
 *
 * The method will also initialize any parent properties (recursive) to ensure
 * that subtypes do not have a referencing issue, and subtype properties take
 * precedence over those of the parent.
 *
 * @param  {Object}  prototype   prototype to attach method to
 * @param  {Object}  properties  properties to initialize
 *
 * @param  {{public: Object, protected: Object, private: Object}}  members
 *
 * @param  {function()}  ctor  class
 * @param  {number}     cid  class id
 *
 * @return  {undefined}
 */
exports.prototype._attachPropInit = function(
    prototype, properties, members, ctor, cid
)
{
    var _self = this;

    util.defineSecureProp( prototype, '__initProps', function( inherit )
    {
        // defaults to false
        inherit = !!inherit;

        var iid    = this.__iid,
            parent = prototype.___$$parent$$,
            vis    = this[ _priv ].vis;

        // first initialize the parent's properties, so that ours will overwrite
        // them
        var parent_init = parent && parent.__initProps;
        if ( typeof parent_init === 'function' )
        {
            // call the parent prop_init, letting it know that it's been
            // inherited so that it does not initialize private members or
            // perform other unnecessary tasks
            parent_init.call( this, true );
        }

        // this will return our property proxy, if supported by our environment,
        // otherwise just a normal object with everything merged in
        var inst_props = _self._visFactory.createPropProxy(
            this, vis, properties[ 'public' ]
        );

        // Copies all public and protected members into inst_props and stores
        // private in a separate object, which adds inst_props to its prototype
        // chain and is returned. This is stored in a property referenced by the
        // class id, so that the private members can be swapped on each method
        // request, depending on calling context.
        var vis = vis[ cid ] = _self._visFactory.setup(
            inst_props, properties, members
        );

        // provide a means to access the actual instance (rather than the
        // property/visibility object) internally (this will translate to
        // this.__inst from within a method), but only if we're on our final
        // object (not a parent)
        if ( !inherit )
        {
            util.defineSecureProp( vis, '__inst', this );
        }
    });
}


/**
 * Determines if the given keywords should result in a static member
 *
 * A member will be considered static if the static or const keywords are given.
 *
 * @param {Object} keywords keywords to scan
 *
 * @return {boolean} true if to be static, otherwise false
 */
function keywordStatic( keywords )
{
    return ( keywords[ 'static' ] || keywords[ 'const' ] )
        ? true
        : false
    ;
}


/**
 * Creates and populates the static visibility object
 *
 * @param  {Function}  ctor  class
 *
 * @return  {undefined}
 */
exports.prototype.initStaticVisibilityObj = function( ctor )
{
    var _self = this;

    /**
     * the object will simply be another layer in the prototype chain to
     * prevent protected/private members from being mixed in with the public
     *
     * @constructor
     */
    var sobj = function() {};
    sobj.prototype = ctor;

    var sobji = new sobj();

    // override __self on the instance's visibility object, giving internal
    // methods access to the restricted static methods
    ctor.___$$svis$$ = sobji;

    // Override the class-level accessor method to allow the system to know we
    // are within a method. An internal flag is necessary, rather than using an
    // argument or binding, because those two options are exploitable. An
    // internal flag cannot be modified by conventional means.
    sobji.$ = function()
    {
        _self._spropInternal = true;
        var val = ctor.$.apply( ctor, arguments );
        _self._spropInternal = false;

        return val;
    };
}


/**
 * Attaches static members to a constructor (class)
 *
 * Static methods will be assigned to the constructor itself. Properties, on the
 * other hand, will be assigned to ctor.$. The reason for this is because JS
 * engines pre-ES5 support no means of sharing references to primitives. Static
 * properties of subtypes should share references to the static properties of
 * their parents.
 *
 * @param  {function()}  ctor        class
 * @param  {Object}      members     static members
 * @param  {function()}  base        base class inheriting from
 * @param  {boolean}     inheriting  true if inheriting static members,
 *                                   otherwise false (setting own static
 *                                   members)
 *
 * @return  {undefined}
 */
exports.prototype.attachStatic = function( ctor, members, base, inheriting )
{
    var methods = members.methods,
        props   = members.props,
        _self   = this
    ;

    // "Inherit" the parent's static methods by running the parent's static
    // initialization method. It is important that we do this before anything,
    // because this will recursively inherit all members in order, permitting
    // overrides.
    var baseinit = base.___$$sinit$$;
    if ( baseinit )
    {
        baseinit( ctor, true );
    }

    // initialize static property if not yet defined
    if ( !inheriting )
    {
        ctor.___$$sprops$$ = props;

        // provide a method to access static properties
        util.defineSecureProp( ctor, '$', function( prop, val )
        {
            // we use hasOwnProperty to ensure that undefined values will not
            // cause us to continue checking the parent, thereby potentially
            // failing to set perfectly legal values
            var found = false,

                // Determine if we were invoked in the context of a class. If
                // so, use that.  Otherwise, use ourself.
                context = ( this.___$$sprops$$ ) ? this : ctor,

                // We are in a subtype if the context does not match the
                // constructor. This works because, when invoked for the first
                // time, this method is not bound to the constructor. In such a
                // case, we default the context to the constructor and pass that
                // down the line to each recursive call. Therefore, recursive
                // calls to subtypes will have a context mismatch.
                in_subtype = ( context !== ctor )
            ;

            // Attempt to locate the property. First, we check public. If not
            // available and we are internal (within a method), we can move on
            // to check other levels of visibility. `found` will contain the
            // visibility level the property was found in, or false.
            found = hasOwn.call( props[ 'public' ], prop ) && 'public';
            if ( !found && _self._spropInternal )
            {
                // Check for protected/private. We only check for private
                // properties if we are not currently checking the properties of
                // a subtype. This works because the context is passed to each
                // recursive call.
                found = hasOwn.call( props[ 'protected' ], prop ) && 'protected'
                    || !in_subtype
                        && hasOwn.call( props[ 'private' ], prop ) && 'private'
                ;
            }

            // if we don't own the property, let the parent(s) handle it
            if ( found === false )
            {
                // TODO: This check is simple, but quick. It may be worth
                // setting a flag on the class during definition to specify if
                // it's extending from a non-class base.
                return ( base.__cid && base.$ || exports.ClassBase.$ ).apply(
                    context, arguments
                );
            }

            var prop_item = props[ found ][ prop ];

            // if a value was provided, this method should be treated as a
            // setter rather than a getter (we *must* test using
            // arguments.length to ensure that setting to undefined works)
            if ( arguments.length > 1 )
            {
                // if const, disallow modification
                if ( prop_item[ 1 ][ 'const' ] )
                {
                    throw TypeError(
                        "Cannot modify constant property '" + prop + "'"
                    );
                }

                prop_item[ 0 ] = val;
                return context;
            }
            else
            {
                // return the value
                return prop_item[ 0 ];
            }
        } );
    }

    // copy over public static methods
    util.copyTo( ctor, methods[ 'public' ], true );
    util.copyTo( ctor.___$$svis$$, methods[ 'protected' ], true );

    // private methods should not be inherited by subtypes
    if ( !inheriting )
    {
        util.copyTo( ctor.___$$svis$$, methods[ 'private' ], true );
    }
}


/**
 * Initializes class metadata for the given class
 *
 * @param  {Function}  func     class to initialize metadata for
 * @param  {Function}  cparent  class parent
 *
 * @return  {undefined}
 *
 * Suppressed due to warnings for use of __cid
 * @suppress {checkTypes}
 */
function createMeta( func, cparent )
{
    var id          = func.__cid,
        parent_meta = ( ( cparent.__cid )
            ? exports.getMeta( cparent )
            : undefined
        );

    // copy the parent prototype's metadata if it exists (inherit metadata)
    if ( parent_meta )
    {
        return func[ _priv ].meta = util.clone( parent_meta, true );
    }

    // create empty
    return func[ _priv ].meta = {
        implemented: []
    };
}


/**
 * Attaches an instance identifier to a class instance
 *
 * @param  {Object}  instance  class instance
 * @param  {number}  iid       instance id
 *
 * @return  {undefined}
 */
function attachInstanceId( instance, iid )
{
    util.defineSecureProp( instance, '__iid', iid );
}


/**
 * Initializes class instance
 *
 * This process will create the instance visibility object that will contain
 * private and protected members. The class instance is part of the prototype
 * chain.  This will be passed to all methods when invoked, permitting them to
 * access the private and protected members while keeping them encapsulated.
 *
 * For each instance, there is always a base. The base will contain a proxy to
 * the public members on the instance itself. The base will also contain all
 * protected members.
 *
 * Atop the base object is a private member object, with the base as its
 * prototype. There exists a private member object for the instance itself and
 * one for each supertype. This is stored by the class id (cid) as the key. This
 * permits the private member object associated with the class of the method
 * call to be bound to that method. For example, if a parent method is called,
 * that call must be invoked in the context of the parent, so the private
 * members of the parent must be made available.
 *
 * The resulting structure looks something like this:
 *   class_instance = { iid: { cid: {} } }
 *
 * @param  {Object}  instance  instance to initialize
 *
 * @return  {undefined}
 */
function initInstance( instance )
{
    /** @constructor */
    var prot = function() {};
    prot.prototype = instance;

    // initialize our *own* private metadata store; do not use the
    // prototype's
    util.defineSecureProp( instance, _priv, {} );

    // add the visibility objects to the data object for this class instance
    instance[ _priv ].vis = new prot();
}


/**
 * Attaches partially applied isInstanceOf() method to class instance
 *
 * @param  {Object}  instance  class instance to attach method to
 *
 * @return  {undefined}
 */
function attachInstanceOf( instance )
{
    var method = function( type )
    {
        return module.exports.isInstanceOf( type, instance );
    };

    // TODO: To improve performance (defineSecureProp can be costly), simply
    // define a normal prop and freeze the class afterward. The class shouldn't
    // have any mutable methods.
    util.defineSecureProp( instance, 'isInstanceOf', method );
    util.defineSecureProp( instance, 'isA', method );
}


/**
 * Returns the instance object associated with the given method
 *
 * The instance object contains the protected members. This object can be passed
 * as the context when calling a method in order to give that method access to
 * those members.
 *
 * One level above the instance object on the prototype chain is the object
 * containing the private members. This is swappable, depending on the class id
 * associated with the provided method call. This allows methods that were not
 * overridden by the subtype to continue to use the private members of the
 * supertype.
 *
 * @param  {function()}  inst  instance that the method is being called from
 * @param  {number}      cid   class id
 *
 * @return  {Object|null}  instance object if found, otherwise null
 *
 * @suppress {checkTypes}
 */
exports.getMethodInstance = function( inst, cid )
{
    if ( inst === undefined )
    {
        return null;
    }

    var iid  = inst.__iid,
        priv = inst[ _priv ],
        data;

    return ( iid && priv && ( data = priv.vis ) )
        ? data[ cid ]
        : null
    ;
}


/**
 * Attaches isAbstract() method to the class
 *
 * @param  {Function}  func     function (class) to attach method to
 * @param  {Array}     methods  abstract method names
 *
 * @return  {undefined}
 */
function attachAbstract( func, methods )
{
    var is_abstract = ( methods.__length > 0 ) ? true: false;

    /**
     * Returns whether the class contains abstract methods (and is therefore
     * abstract)
     *
     * @return  {boolean}  true if class is abstract, otherwise false
     */
    util.defineSecureProp( func, 'isAbstract', function()
    {
        return is_abstract;
    });
}


/**
 * Attaches the unique id to the class and its prototype
 *
 * The unique identifier is used internally to match a class and its instances
 * with the class metadata. Exposing the id breaks encapsulation to a degree,
 * but is a lesser evil when compared to exposing all metadata.
 *
 * @param  {function()}  ctor  constructor (class) to attach method to
 * @param  {number}      id    id to assign
 *
 * @return  {undefined}
 */
function attachId( ctor, id )
{
    util.defineSecureProp( ctor, '__cid', id );
    util.defineSecureProp( ctor.prototype, '__cid', id );
}


/**
 * Sets class flags
 *
 * @param  {Function}  ctor   class to flag
 * @param  {Object}   props  class properties
 *
 * @return  {undefined}
 */
function attachFlags( ctor, props )
{
    ctor.___$$final$$    = !!( props.___$$final$$ );
    ctor.___$$abstract$$ = !!( props.___$$abstract$$ );

    // The properties are no longer needed. Set to undefined rather than delete
    // (v8 performance)
    props.___$$final$$ = props.___$$abstract$$ = undefined;
}

} )( module['ClassBuilder'] = {}, '.' );
/** MethodWrapperFactory **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
/**
 * Builds method wrappers
 *
 *  Copyright (C) 2011, 2012, 2013 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Initializes factory to wrap methods
 *
 * @param  {function(Function,Function,number)}  factory  function that will
 *                                                        perform the actual
 *                                                        wrapping
 *
 * @constructor
 */
module.exports = exports = function MethodWrapperFactory( factory )
{
    // permit omission of the 'new' keyword for instantiation
    if ( !( this instanceof exports ) )
    {
        // module.exports for Closure Compiler
        return new module.exports( factory );
    }

    this._factory = factory;
};


/**
 * Wraps the provided method
 *
 * The returned function is determined by the factory function provided when the
 * MethodWrapperFactory was instantiated.
 *
 * @param  {function()}  method        method to wrap
 * @param  {function()}  super_method  super method, if overriding
 * @param  {number}      cid           class id that method is associated with
 * @param  {function()}  getInst       function to determine instance and return
 *                                     associated visibility object
 * @param  {string=}     name          name of method
 * @param  {Object=}     keywords      method keywords
 */
exports.prototype.wrapMethod = function(
    method, super_method, cid, getInst, name, keywords
)
{
    return this._factory( method, super_method, cid, getInst, name, keywords );
};

} )( module['MethodWrapperFactory'] = {}, '.' );
/** MethodWrappers **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
/**
 * Default method wrapper functions
 *
 *  Copyright (C) 2011, 2012, 2013, 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Method wrappers for standard (non-fallback)
 * @type {Object}
 */
exports.standard = {
    wrapOverride: function( method, super_method, cid, getInst )
    {
        var retf = function()
        {
            // we need some sort of context in order to set __super; it may
            // be undefined per strict mode requirements depending on how
            // the method was invoked
            var context = getInst( this, cid ) || this || {},
                retval  = undefined
            ;

            // the _super property will contain the parent method (store the
            // previous value to ensure that calls to multiple overrides will
            // be supported)
            var psup = context.__super;
            context.__super = super_method;

            retval = method.apply( context, arguments );

            // prevent sneaky bastards from breaking encapsulation by stealing
            // method references and ensure that __super is properly restored
            // for nested/multiple override invocations
            context.__super = psup;

            // if the value returned from the method was the context that we
            // passed in, return the actual instance (to ensure we do not break
            // encapsulation)
            if ( retval === context )
            {
                return this;
            }

            return retval;
        };

        // `super` is reserved and, in ES3, this causes problems with the
        // dot-notation; while `foo.super` will work fine in modern (ES5)
        // browsers, we need to maintain our ES3 compatibility
        retf['super'] = super_method;

        return retf;
    },


    wrapNew: function( method, super_method, cid, getInst )
    {
        return function()
        {
            var context = getInst( this, cid ) || this,
                retval  = undefined
            ;

            // invoke the method
            retval = method.apply( context, arguments );

            // if the value returned from the method was the context that we
            // passed in, return the actual instance (to ensure we do not break
            // encapsulation)
            if ( retval === context )
            {
                return this;
            }

            return retval;
        };
    },


    wrapProxy: function( proxy_to, _, cid, getInst, name, keywords )
    {
        // it is important that we store only a boolean value as to whether or
        // not this method is static *outside* of the returned closure, so as
        // not to keep an unnecessary reference to the keywords object
        var is_static = keywords && keywords[ 'static' ];

        var ret = function()
        {
            var context = getInst( this, cid ) || this,
                retval  = undefined,
                dest    = ( ( is_static )
                    ? context.$( proxy_to )
                    : context[ proxy_to ]
                )
            ;

            // rather than allowing a cryptic error to be thrown, attempt to
            // detect when the proxy call will fail and provide a useful error
            // message
            if ( !( ( dest !== null ) && ( typeof dest === 'object' )
                && ( typeof dest[ name ] === 'function' )
            ) )
            {
                throw TypeError(
                    "Unable to proxy " + name + "() call to '" + proxy_to +
                    "'; '" + proxy_to + "' is undefined or '" + name +
                    "' is not a function."
                );
            }

            retval = dest[ name ].apply( dest, arguments );

            // if the object we are proxying to returns itself, then instead
            // return a reference to *ourself* (so as not to break encapsulation
            // and to provide a more consistent and sensible API)
            return ( retval === dest )
                ? this
                : retval;
        };

        // ensures that proxies can be used to provide concrete
        // implementations of abstract methods with param requirements (we
        // have no idea what we'll be proxying to at runtime, so we need to
        // just power through it; see test case for more info)
        ret.__length = NaN;
        return ret;
    }
};

} )( module['MethodWrappers'] = {}, '.' );
/** MemberBuilder **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
/**
 * Handles building members (properties, methods)
 *
 *  Copyright (C) 2010, 2011, 2012, 2013, 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * This prototype could have easily been refactored into a number of others
 * (e.g. one for each type of member), but that refactoring has been
 * deferred until necessary to ensure ease.js maintains a relatively small
 * footprint.  Ultimately, however, such a decision is a micro-optimization
 * and shouldn't harm the design and maintainability of the software.
 *
 * TODO: Implementation is inconsistent between various members. For
 * example, methods use ___$$keywords$$, whereas properties use [ val,
 * keywords ]. Decide on a common format.
 */

var util       = require( './util' ),
    visibility = [ 'public', 'protected', 'private' ]
;


/**
 * Responsible for building class members
 *
 * @param  {Function}                wrap_method    method wrapper
 * @param  {Function}                wrap_override  method override wrapper
 * @param  {Function}                wrap_proxy     method proxy wrapper
 * @param  {MemberBuilderValidator}  validate       member validator
 *
 * @constructor
 */
module.exports = function MemberBuilder(
    wrap_method, wrap_override, wrap_proxy, validate
)
{
    // permit omitting 'new' keyword
    if ( !( this instanceof module.exports ) )
    {
        return new module.exports(
            wrap_method, wrap_override, wrap_proxy, validate
        );
    }

    this._wrapMethod   = wrap_method;
    this._wrapOverride = wrap_override;
    this._wrapProxy    = wrap_proxy;

    this._validate = validate;
};


// we're throwing everything into the prototype
exports = module.exports.prototype;


/**
 * Initializes member object
 *
 * The member object contains members for each level of visibility (public,
 * protected and private).
 *
 * @param  {Object}  mpublic     default public members
 * @param  {Object}  mprotected  default protected members
 * @param  {Object}  mprivate    default private members
 *
 * @return  {__visobj}
 */
exports.initMembers = function( mpublic, mprotected, mprivate )
{
    return {
        'public':    mpublic    || {},
        'protected': mprotected || {},
        'private':   mprivate   || {}
    };
};


/**
 * Copies a method to the appropriate member prototype, depending on
 * visibility, and assigns necessary metadata from keywords
 *
 * The provided ``member run'' state object is required and will be
 * initialized automatically if it has not been already. For the first
 * member of a run, the object should be empty.
 *
 * @param  {__visobj}  members
 * @param  {!Object}   meta     metadata container
 * @param  {string}    name     property name
 * @param  {*}         value    property value
 *
 * @param  {!Object.<boolean>}  keywords  parsed keywords
 *
 * @param  {Function}  instCallback  function to call in order to retrieve
 *                                   object to bind 'this' keyword to
 *
 * @param  {number}   cid   class id
 * @param  {Object=}  base  optional base object to scan
 *
 * @param  {Object}  state  member run state object
 *
 * @return  {undefined}
 */
exports.buildMethod = function(
    members, meta, name, value, keywords, instCallback, cid, base, state
)
{
    // these defaults will be used whenever a keyword set is unavailable,
    // which should only ever be the case if we're inheriting from a
    // prototype rather than an ease.js class/etc
    var kdefaults = this._methodKeywordDefaults;

    // TODO: We can improve performance by not scanning each one individually
    // every time this method is called
    var prev_data     = scanMembers( members, name, base ),
        prev          = ( prev_data ) ? prev_data.member : null,
        prev_keywords = ( prev && ( prev.___$$keywords$$ || kdefaults ) ),
        dest          = getMemberVisibility( members, keywords, name );
    ;

    // ensure that the declaration is valid (keywords make sense, argument
    // length, etc)
    this._validate.validateMethod(
        name, value, keywords, prev_data, prev_keywords, state
    );

    // we might be overriding an existing method
    if ( keywords[ 'proxy' ] && !( prev && keywords.weak ) )
    {
        // TODO: Note that this is not compatible with method hiding, due to its
        // positioning (see hideMethod() below); address once method hiding is
        // implemented (the validators currently handle everything else)
        dest[ name ] = this._createProxy(
            value, instCallback, cid, name, keywords
        );
    }
    else if ( prev )
    {
        if ( keywords.weak && !( prev_keywords[ 'abstract' ] ) )
        {
            // another member of the same name has been found; discard the
            // weak declaration
            return false;
        }
        else if ( keywords[ 'override' ] || prev_keywords[ 'abstract' ] )
        {
            // if we have the `abstract' keyword at this point, then we are
            // an abstract override
            var override = ( keywords[ 'abstract' ] )
                ? aoverride( name )
                : prev;

            // override the method
            dest[ name ] = this._overrideMethod(
                override, value, instCallback, cid
            );
        }
        else
        {
            // by default, perform method hiding, even if the keyword was not
            // provided (the keyword simply suppresses the warning)
            dest[ name ] = hideMethod( prev, value, instCallback, cid );
        }

    }
    else if ( keywords[ 'abstract' ] || keywords[ 'private' ] )
    {
        // we do not want to wrap abstract methods, since they are not
        // callable; further, we do not need to wrap private methods, since
        // they are only ever accessible when we are already within a
        // private context (see test case for more information)
        dest[ name ] = value;
    }
    else
    {
        // we are not overriding the method, so simply copy it over, wrapping it
        // to ensure privileged calls will work properly
        dest[ name ] = this._overrideMethod( null, value, instCallback, cid );
    }

    // store keywords for later reference (needed for pre-ES5 fallback)
    dest[ name ].___$$keywords$$ = keywords;
    return true;
};


/**
 * Default keywords to apply to methods inherited from a prototype.
 * @type  {Object}
 */
exports._methodKeywordDefaults = { 'virtual': true };


/**
 * Creates an abstract override super method proxy to NAME
 *
 * This is a fairly abstract concept that is disastrously confusing without
 * having been put into the proper context: This function is intended to be
 * used as a super method for a method override in the case of abstract
 * overrides. It only makes sense to be used, at least at this time, with
 * mixins.
 *
 * When called, the bound context (`this') will be the private member object
 * of the caller, which should contain a reference to the protected member
 * object of the supertype to proxy to. It is further assumed that the
 * protected member object (pmo) defines NAME such that it proxies to a
 * mixin; this means that invoking it could result in an infinite loop. We
 * therefore skip directly to the super-super method, which will be the
 * method we are interested in proxying to.
 *
 * There is one additional consideration: If this super method is proxying
 * from a mixin instance into a class, then it is important that we bind the
 * calling context to the pmo instaed of our own context; otherwise, we'll
 * be executing within the context of the trait, without access to the
 * members of the supertype that we are proxying to! The pmo will be used by
 * the ease.js method wrapper to look up the proper private member object,
 * so it is not a problem that the pmo is being passed in.
 *
 * That's a lot of text for such a small amount of code.
 *
 * @param  {string}  name  name of method to proxy to
 *
 * @return  {Function}  abstract override super method proxy
 */
function aoverride( name )
{
    return function()
    {
        return this.___$$super$$.prototype[ name ]
            .apply( this.___$$pmo$$, arguments );
    };
}


/**
 * Copies a property to the appropriate member prototype, depending on
 * visibility, and assigns necessary metadata from keywords
 *
 * @param  {__visobj}  members
 * @param  {!Object}   meta     metadata container
 * @param  {string}    name     property name
 * @param  {*}         value    property value
 *
 * @param  {!Object.<boolean>}  keywords  parsed keywords
 *
 * @param  {Object=}  base  optional base object to scan
 *
 * @return  {undefined}
 */
exports.buildProp = function( members, meta, name, value, keywords, base )
{
    // TODO: We can improve performance by not scanning each one individually
    // every time this method is called
    var prev_data     = scanMembers( members, name, base ),
        prev          = ( prev_data ) ? prev_data.member : null,
        prev_keywords = ( prev ) ? prev[ 1 ] : null;

    this._validate.validateProperty(
        name, value, keywords, prev_data, prev_keywords
    );

    getMemberVisibility( members, keywords, name )[ name ] =
        [ value, keywords ];
};


/**
 * Copies a getter/setter to the appropriate member prototype, depending on
 * visibility, and assigns necessary metadata from keywords
 *
 * TODO: This should essentially mirror buildMethod with regards to overrides,
 * proxies, etc.
 *
 * @param  {!__visobj}  members
 * @param  {!Object}    meta     metadata container
 * @param  {string}     name     getter name
 * @param  {*}          get      getter value
 * @param  {*}          set      setter value
 *
 * @param  {!Object.<boolean>}  keywords  parsed keywords
 *
 * @param  {Function}  instCallback  function to call in order to retrieve
 *                                   object to bind 'this' keyword to
 *
 * @param  {number}   cid   class id
 * @param  {Object=}  base  optional base object to scan
 *
 * @return  {undefined}
 *
 * Closure Compiler is improperly throwing warnings on Object.defineProperty():
 * @suppress {checkTypes}
 */
exports.buildGetterSetter = function(
    members, meta, name, get, set, keywords, instCallback, cid, base
)
{
    var prev_data     = scanMembers( members, name, base ),
        prev_keywords = ( ( prev_data && prev_data.get )
            ? prev_data.get.___$$keywords$$
            : null
        )
    ;

    this._validate.validateGetterSetter(
        name, {}, keywords, prev_data, prev_keywords
    );

    if ( get )
    {
        get = this._overrideMethod( null, get, instCallback, cid );

        // ensure we store the keywords *after* the override, otherwise they
        // will be assigned to the wrapped function (the getter)
        get.___$$keywords$$ = keywords;
    }

    Object.defineProperty(
        getMemberVisibility( members, keywords, name ),
        name,
        {
            get: get,
            set: ( set )
                ? this._overrideMethod( null, set, instCallback, cid )
                : set,

            enumerable:   true,
            configurable: false
        }
    );
};


/**
 * Returns member prototype to use for the requested visibility
 *
 * Will throw an exception if multiple access modifiers were used.
 *
 * @param  {__visobj} members
 *
 * @param  {!Object.<boolean>}  keywords  parsed keywords
 * @param  {string}             name      member name
 *
 * @return  {Object}  reference to visibility of members argument to use
 */
function getMemberVisibility( members, keywords, name )
{
    // there's cleaner ways of doing this, but consider it loop unrolling for
    // performance
    if ( keywords[ 'private' ] )
    {
        ( keywords[ 'public' ] || keywords[ 'protected' ] )
            && viserr( name );
        return members[ 'private' ];
    }
    else if ( keywords[ 'protected' ] )
    {
        ( keywords[ 'public' ] || keywords[ 'private' ] )
            && viserr( name );
        return members[ 'protected' ];
    }
    else
    {
        // public keyword is the default, so explicitly specifying it is only
        // for clarity
        ( keywords[ 'private' ] || keywords[ 'protected' ] )
            && viserr( name );
        return members[ 'public' ];
    }
}

function viserr( name )
{
    throw TypeError(
        "Only one access modifier may be used for definition of '" +
            name + "'"
    );
}



/**
 * Scan each level of visibility for the requested member
 *
 * @param  {__visobj} members
 *
 * @param  {string}   name  member to locate
 * @param  {Object=}  base  optional base object to scan
 *
 * @return  {{get,set,member}|null}
 */
function scanMembers( members, name, base )
{
    var i      = visibility.length,
        member = null;

    // locate requested member by scanning each level of visibility
    while ( i-- )
    {
        var visobj = members[ visibility[ i ] ];

        // In order to support getters/setters, we must go off of the
        // descriptor. We must also ignore base properties (last argument), such
        // as Object.prototype.toString(). However, we must still traverse the
        // prototype chain.
        if ( member = util.getPropertyDescriptor( visobj, name, true ) )
        {
            return {
                get:        member.get,
                set:        member.set,
                member:     member.value
            };
        }
    }

    // if a second comparison object was given, try again using it instead of
    // the original members object
    if ( base !== undefined )
    {
        var base_methods = base.___$$methods$$,
            base_props   = base.___$$props$$;

        // we must recurse on *all* the visibility objects of the base's
        // supertype; attempt to find the class associated with its
        // supertype, if any
        var base2 = ( ( base.prototype || {} ).___$$parent$$ || {} )
            .constructor;

        // scan the base's methods and properties, if they are available
        return ( base_methods && scanMembers( base_methods, name, base2 ) )
            || ( base_props && scanMembers( base_props, name, base2 ) )
            || null
        ;
    }

    // nothing was found
    return null;
}


/**
 * Hide a method with a "new" method
 */
function hideMethod( super_method, new_method, instCallback, cid )
{
    // TODO: This function is currently unimplemented. It exists at present to
    // provide a placeholder and ensure that the override keyword is required to
    // override a parent method.
    //
    // We should never get to this point if the default validation rule set is
    // used to prevent omission of the 'override' keyword.
    throw Error(
        'Method hiding not yet implemented (we should never get here; bug).'
    );
}


/**
 * Create a method that proxies to the method of another object
 *
 * @param  {string}  proxy_to  name of property (of instance) to proxy to
 *
 * @param  {Function}  instCallback  function to call in order to retrieve
 *                                   object to bind 'this' keyword to
 *
 * @param  {number}  cid       class id
 * @param  {string}  mname     name of method to invoke on destination object
 * @param  {Object}  keywords  method keywords
 *
 * @return  {Function}  proxy method
 */
exports._createProxy = function( proxy_to, instCallback, cid, mname, keywords )
{
    return this._wrapProxy.wrapMethod(
        proxy_to, null, cid, instCallback, mname, keywords
    );
};


/**
 * Generates a method override function
 *
 * The override function simply wraps the method so that its invocation will
 * pass a __super property. This property may be used to invoke the overridden
 * method.
 *
 * @param  {function()}  super_method      method to override
 * @param  {function()}  new_method        method to override with
 *
 * @param  {Function}  instCallback  function to call in order to retrieve
 *                                   object to bind 'this' keyword to
 *
 * @param  {number}   cid  class id
 *
 * @return  {function()}  override method
 */
exports._overrideMethod = function(
    super_method, new_method, instCallback, cid
)
{
    instCallback = instCallback || function() {};

    // return a function that permits referencing the super method via the
    // __super property
    var override = null;

    // are we overriding?
    override = (
        ( super_method )
            ? this._wrapOverride
            : this._wrapMethod
        ).wrapMethod( new_method, super_method, cid, instCallback );

    // This is a trick to work around the fact that we cannot set the length
    // property of a function. Instead, we define our own property - __length.
    // This will store the expected number of arguments from the super method.
    // This way, when a method is being overridden, we can check to ensure its
    // compatibility with its super method.
    util.defineSecureProp( override,
        '__length',
        ( new_method.__length || new_method.length )
    );

    return override;
}


/**
 * Return the visibility level as a numeric value, where 0 is public and 2 is
 * private
 *
 * @param  {Object}  keywords  keywords to scan for visibility level
 *
 * @return  {number}  visibility level as a numeric value
 */
exports._getVisibilityValue = function( keywords )
{
    if ( keywords[ 'protected' ] )
    {
        return 1;
    }
    else if ( keywords[ 'private' ] )
    {
        return 2;
    }
    else
    {
        // default is public
        return 0;
    }
}


/**
 * End member run and perform post-processing on state data
 *
 * A ``member run'' should consist of the members required for a particular
 * object (class/interface/etc). This action will perform validation
 * post-processing if a validator is available.
 *
 * @param  {Object}  state  member run state
 *
 * @return  {undefined}
 */
exports.end = function( state )
{
    this._validate && this._validate.end( state );
};
} )( module['MemberBuilder'] = {}, '.' );
/** MemberBuilderValidator **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
/**
 * Validation rules for members
 *
 *  Copyright (C) 2011, 2012, 2013, 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

module.exports = exports = function MemberBuilderValidator( warn_handler )
{
    // permit omitting 'new' keyword
    if ( !( this instanceof module.exports ) )
    {
        return new module.exports( warn_handler );
    }

    this._warningHandler = warn_handler || function() {};
};


/**
 * Initialize validation state if not already done
 *
 * @param  {Object}  state  validation state
 *
 * @return  {Object}  provided state object STATE
 */
exports.prototype._initState = function( state )
{
    if ( state.__vready ) return state;

    state.warn = {};
    state.__vready = true;
    return state;
};


/**
 * Perform post-processing on and invalidate validation state
 *
 * All queued warnings will be triggered.
 *
 * @param  {Object}  state  validation state
 *
 * @return  {undefined}
 */
exports.prototype.end = function( state )
{
    // trigger warnings
    for ( var f in state.warn )
    {
        var warns = state.warn[ f ];
        for ( var id in warns )
        {
            this._warningHandler( warns[ id ] );
        }
    }

    state.__vready = false;
};


/**
 * Enqueue warning within validation state
 *
 * @param  {Object}   state   validation state
 * @param  {string}   member  member name
 * @param  {string}   id      warning identifier
 * @param  {Warning}  warn    warning
 *
 * @return  {undefined}
 */
function _addWarn( state, member, id, warn )
{
    ( state.warn[ member ] = state.warn[ member ] || {} )[ id ] = warn;
}


/**
 * Remove warning from validation state
 *
 * @param  {Object}   state   validation state
 * @param  {string}   member  member name
 * @param  {string}   id      warning identifier
 *
 * @return  {undefined}
 */
function _clearWarn( state, member, id, warn )
{
    delete ( state.warn[ member ] || {} )[ id ];
}


/**
 * Validates a method declaration, ensuring that keywords are valid,
 * overrides make sense, etc.
 *
 * Throws exception on validation failure. Warnings are stored in the state
 * object for later processing. The state object will be initialized if it
 * has not been already; for the initial validation, the state object should
 * be empty.
 *
 * @param  {string}  name  method name
 * @param  {*}       value method value
 *
 * @param  {Object.<string,boolean>}  keywords  parsed keywords
 *
 * @param  {Object}  prev_data      data of member being overridden
 * @param  {Object}  prev_keywords  keywords of member being overridden
 *
 * @param  {Object}  state  pre-initialized state object
 *
 * @return {undefined}
 */
exports.prototype.validateMethod = function(
    name, value, keywords, prev_data, prev_keywords, state
)
{
    this._initState( state );

    var prev = ( prev_data ) ? prev_data.member : null;

    if ( keywords[ 'abstract' ] )
    {
        // do not permit private abstract methods (doesn't make sense, since
        // they cannot be inherited/overridden)
        if ( keywords[ 'private' ] )
        {
            throw TypeError(
                "Method '" + name + "' cannot be both private and abstract"
            );
        }
    }

    // const doesn't make sense for methods; they're always immutable
    if ( keywords[ 'const' ] )
    {
        throw TypeError(
            "Cannot declare method '" + name + "' as constant; keyword is " +
            "redundant"
        );
    }

    // virtual static does not make sense, as static methods cannot be
    // overridden
    if ( keywords[ 'virtual' ] && ( keywords[ 'static' ] ) )
    {
        throw TypeError(
            "Cannot declare static method '" + name + "' as virtual"
        );
    }

    // do not allow overriding getters/setters
    if ( prev_data && ( prev_data.get || prev_data.set ) )
    {
        throw TypeError(
            "Cannot override getter/setter '" + name + "' with method"
        );
    }

    if ( keywords[ 'proxy' ] )
    {
        // proxies are expected to provide the name of the destination object
        if ( typeof value !== 'string' )
        {
            throw TypeError(
                "Cannot declare proxy method '" + name + "'; string value " +
                    "expected"
            );
        }
        else if ( keywords[ 'abstract' ] )
        {
            // proxies are always concrete
            throw TypeError(
                "Proxy method '" + name + "' cannot be abstract"
            );
        }
    }

    // search for any previous instances of this member
    if ( prev )
    {
        // perform this check first, as it will make more sense than those that
        // follow, should this condition be satisfied
        if ( prev_keywords[ 'private' ] )
        {
            throw TypeError(
                "Private member name '" + name + "' conflicts with supertype"
            );
        }

        // disallow overriding properties with methods
        if ( !( typeof prev === 'function' ) )
        {
            throw TypeError(
                "Cannot override property '" + name + "' with method"
            );
        }

        // disallow overriding non-virtual methods
        if ( keywords[ 'override' ] && !( prev_keywords[ 'virtual' ] ) )
        {
            if ( !( keywords[ 'abstract' ] ) )
            {
                throw TypeError(
                    "Cannot override non-virtual method '" + name + "'"
                );
            }

            // at this point, we have `abstract override'
            if ( !( prev_keywords[ 'abstract' ] ) )
            {
                // TODO: test me
                throw TypeError(
                    "Cannot perform abstract override on non-abstract " +
                    "method '" + name + "'"
                );
            }
        }

        // do not allow overriding concrete methods with abstract unless the
        // abstract method is weak
        if ( keywords[ 'abstract' ]
            && !( keywords.weak )
            && !( prev_keywords[ 'abstract' ] )
        )
        {
            throw TypeError(
                "Cannot override concrete method '" + name + "' with " +
                    "abstract method"
            );
        }


        var lenprev = ( prev.__length === undefined )
            ? prev.length
            : prev.__length;

        var lennow = ( value.__length === undefined )
            ? value.length
            : value.__length;

        if ( keywords[ 'proxy' ] )
        {
            // otherwise we'd be checking against the length of a string.
            lennow = NaN;
        }

        if ( keywords.weak && !( prev_keywords[ 'abstract' ] ) )
        {
            // weak abstract declaration found after its concrete
            // definition; check in reverse order
            var tmp = lenprev;
            lenprev = lennow;
            lennow = tmp;
        }

        // ensure parameter list is at least the length of its supertype
        if ( lennow < lenprev )
        {
            throw TypeError(
                "Declaration of method '" + name + "' must be compatible " +
                    "with that of its supertype"
            );
        }

        // do not permit visibility deescalation
        if ( this._getVisibilityValue( prev_keywords ) <
            this._getVisibilityValue( keywords )
        )
        {
            throw TypeError(
                "Cannot de-escalate visibility of method '" + name + "'"
            );
        }

        // Disallow overriding method without override keyword (unless
        // parent method is abstract). In the future, this will provide a
        // warning to default to method hiding. Note the check for a
        if ( !( keywords[ 'override' ]
            || prev_keywords[ 'abstract' ]
            || keywords.weak
        ) )
        {
            throw TypeError(
                "Attempting to override method '" + name +
                "' without 'override' keyword"
            );
        }

        // prevent non-override warning
        if ( keywords.weak && prev_keywords[ 'override' ] )
        {
            _clearWarn( state, name, 'no' );
        }
    }
    else if ( keywords[ 'override' ] )
    {
        // using the override keyword without a super method may indicate a bug,
        // but it shouldn't stop the class definition (it doesn't adversely
        // affect the functionality of the class, unless of course the method
        // attempts to reference a supertype)
        _addWarn( state, name, 'no', Error(
            "Method '" + name +
            "' using 'override' keyword without super method"
        ) );
    }
};


/**
 * Validates a property declaration, ensuring that keywords are valid, overrides
 * make sense, etc.
 *
 * Throws exception on validation failure
 *
 * @param  {string}  name  method name
 * @param  {*}       value method value
 *
 * @param  {Object.<string,boolean>}  keywords  parsed keywords
 *
 * @param  {Object}  prev_data      data of member being overridden
 * @param  {Object}  prev_keywords  keywords of member being overridden
 *
 * @return {undefined}
 */
exports.prototype.validateProperty = function(
    name, value, keywords, prev_data, prev_keywords
)
{
    var prev = ( prev_data ) ? prev_data.member : null;

    // do not permit visibility de-escalation
    if ( prev )
    {
        // perform this check first, as it will make more sense than those that
        // follow, should this condition be satisfied
        if ( prev_keywords[ 'private' ] )
        {
            throw TypeError(
                "Private member name '" + name + "' conflicts with supertype"
            );
        }

        // disallow overriding methods with properties
        if ( typeof prev === 'function' )
        {
            throw new TypeError(
                "Cannot override method '" + name + "' with property"
            );
        }

        if ( this._getVisibilityValue( prev_keywords )
            < this._getVisibilityValue( keywords )
        )
        {
            throw TypeError(
                "Cannot de-escalate visibility of property '" + name + "'"
            );
        }
    }

    // do not allow overriding getters/setters
    if ( prev_data && ( prev_data.get || prev_data.set ) )
    {
        throw TypeError(
            "Cannot override getter/setter '" + name + "' with property"
        );
    }

    // abstract properties do not make sense
    if ( keywords[ 'abstract' ] )
    {
        throw TypeError(
            "Property '" + name + "' cannot be declared as abstract"
        );
    }

    // constants are static
    if ( keywords[ 'static' ] && keywords[ 'const' ] )
    {
        throw TypeError(
            "Static keyword cannot be used with const for property '" +
            name + "'"
        );
    }

    // properties are inherently virtual
    if ( keywords['virtual'] )
    {
        throw TypeError( "Cannot declare property '" + name + "' as virtual" );
    }
};


/**
 * Performs common validations on getters/setters
 *
 * If a problem is found, an exception will be thrown.
 *
 * @param  {string}                   name      getter/setter name
 * @param  {Object.<string,boolean>}  keywords  parsed keywords
 *
 * @return {undefined}
 */
exports.prototype.validateGetterSetter = function(
    name, value, keywords, prev_data, prev_keywords
)
{
    var prev    = ( prev_data ) ? prev_data.member : null,
        prev_gs = ( ( prev_data && ( prev_data.get || prev_data.set ) )
            ? true
            : false
        )
    ;

    // abstract getters/setters are not yet supported
    if ( keywords[ 'abstract' ] )
    {
        throw TypeError(
            "Cannot declare getter/setter '" + name + "' as abstract"
        );
    }

    // for const getters/setters, omit the setter
    if ( keywords[ 'const' ] )
    {
        throw TypeError(
            "Cannot declare const getter/setter '" + name + "'"
        );
    }

    // virtual static does not make sense, as static methods cannot be
    // overridden
    if ( keywords[ 'virtual' ] && ( keywords[ 'static' ] ) )
    {
        throw TypeError(
            "Cannot declare static method '" + name + "' as virtual"
        );
    }

    if ( prev || prev_gs )
    {
        // perform this check first, as it will make more sense than those that
        // follow, should this condition be satisfied
        if ( prev_keywords && prev_keywords[ 'private' ] )
        {
            throw TypeError(
                "Private member name '" + name + "' conflicts with supertype"
            );
        }

        // To speed up the system we'll simply check for a getter/setter, rather
        // than checking separately for methods/properties. This is at the
        // expense of more detailed error messages. They'll live.
        if ( !( prev_gs ) )
        {
            throw TypeError(
                "Cannot override method or property '" + name +
                    "' with getter/setter"
            );
        }

        if ( !( prev_keywords && prev_keywords[ 'virtual' ] ) )
        {
            throw TypeError(
                "Cannot override non-virtual getter/setter '" + name + "'"
            );
        }

        if ( !( keywords[ 'override' ] ) )
        {
            throw TypeError(
                "Attempting to override getter/setter '" + name +
                "' without 'override' keyword"
            );
        }

        // do not permit visibility de-escalation
        if ( this._getVisibilityValue( prev_keywords || {} )
            < this._getVisibilityValue( keywords )
        )
        {
            throw TypeError(
                "Cannot de-escalate visibility of getter/setter '" + name + "'"
            );
        }
    }
    else if ( keywords[ 'override' ] )
    {
        // using the override keyword without a super method may indicate a bug
        // in the user's code
        this._warningHandler( Error(
            "Getter/setter '" + name +
            "' using 'override' keyword without super getter/setter"
        ) );
    }
}


/**
 * Return the visibility level as a numeric value, where 0 is public and 2 is
 * private
 *
 * @param  {Object}  keywords  keywords to scan for visibility level
 *
 * @return  {number}  visibility level as a numeric value
 */
exports.prototype._getVisibilityValue = function( keywords )
{
    if ( keywords[ 'protected' ] )
    {
        return 1;
    }
    else if ( keywords[ 'private' ] )
    {
        return 2;
    }
    else
    {
        // default is public
        return 0;
    }
}

} )( module['MemberBuilderValidator'] = {}, '.' );
/** VisibilityObjectFactory **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
/**
 * Contains visibility object factory
 *
 *  Copyright (C) 2011, 2013, 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * XXX: tightly coupled
 */
var util = require( './util' );


/**
 * Initializes visibility object factory
 *
 * The visibility object is the "magic" behind ease.js. This factory creates the
 * object that holds the varying levels of visibility, which are swapped out and
 * inherited depending on circumstance.
 *
 * @constructor
 */
module.exports = exports = function VisibilityObjectFactory()
{
    // permit omitting 'new' keyword
    if ( !( this instanceof exports ) )
    {
        // module.exports instead of exports because Closure Compiler seems to
        // be confused
        return new module.exports();
    }
};


/**
 * Sets up properties
 *
 * This includes all members (including private). Private members will be set up
 * in a separate object, so that they can be easily removed from the mix. That
 * object will include the destination object in the prototype, so that the
 * access should be transparent. This object is returned.
 *
 * Properties are expected in the following format. Note that keywords are
 * ignored:
 *     { public: { prop: [ value, { keyword: true } ] } }
 *
 * @param  {Object}   dest        destination object
 * @param  {Object}   properties  properties to copy
 * @param  {Object=}  methods     methods to copy
 *
 * @return  {Object}  object containing private members and dest as prototype
 */
exports.prototype.setup = function setup( dest, properties, methods )
{
    // create the private layer atop of the destination object
    var obj = this._createPrivateLayer( dest, properties );

    // initialize each of the properties for this instance to
    // ensure we're not sharing references to prototype values
    this._doSetup( dest, properties[ 'public' ] );

    // Do the same for protected, but only if they do not exist already in
    // public. The reason for this is because the property object is laid /atop/
    // of the public members, meaning that a parent's protected members will
    // take precedence over a subtype's overriding /public/ members. Uh oh.
    this._doSetup( dest,
        properties[ 'protected' ],
        methods[ 'protected' ],
        true
    );

    // then add the private parts
    this._doSetup( obj, properties[ 'private' ], methods[ 'private' ] );

    return obj;
};


/**
 * Add an extra layer atop the destination object, which will contain the
 * private members
 *
 * The object provided will be used as the prototype for the new private layer,
 * so the provided object will be accessible on the prototype chain.
 *
 * Subtypes may override this method to alter the functionality of the private
 * visibility object (e.g. to prevent it from being created).
 *
 * @param  {Object}  atop_of     object to add private layer atop of
 * @param  {Object}  properties  properties
 *
 * @return  {Object}  private layer with given object as prototype
 */
exports.prototype._createPrivateLayer = function( atop_of, properties )
{
    /** @constructor */
    var obj_ctor = function() {};
    obj_ctor.prototype = atop_of;

    // we'll be returning an instance, so that the prototype takes effect
    var obj = new obj_ctor();

    // All protected properties need to be proxied from the private object
    // (which will be passed as the context) to the object containing protected
    // values. Otherwise, the protected property values would be set on the
    // private object, making them inaccessible to subtypes.
    this.createPropProxy( atop_of, obj, properties[ 'protected' ] );

    return obj;
};


/**
 * Set up destination object by copying over properties and methods
 *
 * The prot_priv parameter can be used to ignore both explicitly and
 * implicitly public methods.
 *
 * @param  {Object}   dest        destination object
 * @param  {Object}   properties  properties to copy
 * @param  {Object}   methods     methods to copy
 * @param  {boolean}  prot_priv   do not set unless protected or private
 *
 * @return  {undefined}
 */
exports.prototype._doSetup = function(
    dest, properties, methods, prot_priv
)
{
    var hasOwn = Array.prototype.hasOwnProperty;

    // copy over the methods
    if ( methods !== undefined )
    {
        for ( var method_name in methods )
        {
            if ( hasOwn.call( methods, method_name ) )
            {
                var pre = dest[ method_name ],
                    kw  = pre && pre.___$$keywords$$;

                // If requested, do not copy the method over if it already
                // exists in the destination object. Don't use hasOwn here;
                // unnecessary overhead and we want to traverse any prototype
                // chains. We do not check the public object directly, for
                // example, because we need a solution that will work if a proxy
                // is unsupported by the engine.
                //
                // Also note that we need to allow overriding if it exists in
                // the protected object (we can override protected with
                // protected). This is the *last* check to ensure a performance
                // hit is incured *only* if we're overriding protected with
                // protected.
                if ( !prot_priv
                    || ( pre === undefined )
                    || ( kw[ 'private' ] || kw[ 'protected' ] )
                )
                {
                    dest[ method_name ] = methods[ method_name ];
                }
            }
        }
    }

    // initialize private/protected properties and store in instance data
    for ( var prop in properties )
    {
        if ( hasOwn.call( properties, prop ) )
        {
            dest[ prop ] = util.clone( properties[ prop ][ 0 ] );
        }
    }
}


/**
 * Creates a proxy for all given properties to the given base
 *
 * The proxy uses getters/setters to forward all calls to the base. The
 * destination object will be used as the proxy. All properties within props
 * will be used proxied.
 *
 * To summarize: for each property in props, all gets and sets will be forwarded
 * to base.
 *
 * Please note that this does not use the JS proxy implementation. That will be
 * done in the future for engines that support it.
 *
 * @param  {Object}  base   object to proxy to
 * @param  {Object}  dest   object to treat as proxy (set getters/setters on)
 * @param  {Object}  props  properties to proxy
 *
 * @return  {Object}  returns dest
 */
exports.prototype.createPropProxy = function( base, dest, props )
{
    var hasOwn = Object.prototype.hasOwnProperty;

    for ( var prop in props )
    {
        if ( !( hasOwn.call( props, prop ) ) )
        {
            continue;
        }

        ( function( prop )
        {
            // just in case it's already defined, so we don't throw an error
            dest[ prop ] = undefined;

            // public properties, when set internally, must forward to the
            // actual variable
            Object.defineProperty( dest, prop, {
                set: function( val )
                {
                    base[ prop ] = val;
                },

                get: function()
                {
                    return base[ prop ];
                },

                enumerable: true
            } );
        } ).call( null, prop );
    }

    return dest;
};

} )( module['VisibilityObjectFactory'] = {}, '.' );
/** FallbackVisibilityObjectFactory **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
/**
 * Contains fallback visibility object factory
 *
 *  Copyright (C) 2010, 2011, 2013 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Initializes fallback visibility object factory
 *
 * Unlike the standard visibility object, fallback does not create various
 * layers. This is for the simple fact that setting a value on one of the layers
 * is not visible to layers beneath it (its prototypes). Fallback is necessary
 * if proxy support or emulation (via ES5 getters/setters) is unavailable.
 */
module.exports = exports = function FallbackVisibilityObjectFactory()
{
    // permit omitting 'new' keyword
    if ( !( this instanceof exports ) )
    {
        // module.exports for Closure Compiler
        return new module.exports();
    }
};


/**
 * "Inherit" from VisibilityObjectFactory
 */
exports.prototype = require( './VisibilityObjectFactory' )();


/**
 * Do not create private visibility layer
 *
 * We're likely falling back because we cannot properly support the private
 * visibility layer. Therefore, it will be omitted.
 *
 * @param  {Object}  atop_of     will be returned, unmodified
 * @param  {Object}  properties  ignored
 *
 * @return  {Object}  provided object with no additional layer
 */
exports.prototype._createPrivateLayer = function( atop_of, properties )
{
    return atop_of;
};


/**
 * Does not create property proxy
 *
 * The fallback implementation is used because proxies are not supported and
 * cannot be emulated with getters/setters.
 *
 * @param  {Object}  base   will be returned, unmodified
 * @param  {Object}  dest   ignored
 * @param  {Object}  props  ignored
 *
 * @return  {Object}  given base
 */
exports.prototype.createPropProxy = function( base, dest, props )
{
    return base;
};

} )( module['FallbackVisibilityObjectFactory'] = {}, '.' );
/** VisibilityObjectFactoryFactory **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
/**
 * Contains factory for visibility object factory
 *
 *  Copyright (C) 2011, 2013 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * XXX: Figure out how to resolve Closure Compiler's warning about shared
 * type information
 */

// XXX: Tightly coupled
var util = require( './util' ),

    VisibilityObjectFactory = require( './VisibilityObjectFactory' ),

    FallbackVisibilityObjectFactory =
        require( './FallbackVisibilityObjectFactory' )
;


/**
 * Responsible for instantiating the VisibilityObjectFactory appropriate for the
 * runtime environment
 *
 * This prototype determines what class should be instantiated. If we are within
 * an ECMAScript 5 environment, we can take full advantage of the standard
 * visibility object implementation. Otherwise, we are unable to emulate proxies
 * and must fall back on a less sophisticated implementation that sacrifices
 * visibility support.
 */
exports.fromEnvironment = function()
{
    // if falling back, return fallback, otherwise standard
    return ( util.definePropertyFallback() )
        ? FallbackVisibilityObjectFactory()
        : VisibilityObjectFactory()
    ;
};

} )( module['VisibilityObjectFactoryFactory'] = {}, '.' );
/** class **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
/**
 * Contains basic inheritance mechanism
 *
 *  Copyright (C) 2010, 2011, 2012, 2013, 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Console to use for logging
 *
 * This reference allows an alternative console to be used. Must contain
 * warn() or log() methods.
 *
 * TODO: This needs to be moved into a facade, once more refactoring can be
 * done; it was moved out of warn during its refactoring.
 *
 * @type {Object}
 */
var _console = ( typeof console !== 'undefined' ) ? console : undefined;

var util         = require( './util' ),
    ClassBuilder = require( './ClassBuilder' ),

    warn        = require( './warn' ),
    Warning     = warn.Warning,
    log_handler = warn.LogHandler( _console ),

    MethodWrapperFactory = require( './MethodWrapperFactory' ),
    wrappers             = require( './MethodWrappers' ).standard,

    class_builder = ClassBuilder(
        log_handler,
        require( './MemberBuilder' )(
            MethodWrapperFactory( wrappers.wrapNew ),
            MethodWrapperFactory( wrappers.wrapOverride ),
            MethodWrapperFactory( wrappers.wrapProxy ),
            require( './MemberBuilderValidator' )(
                function( warning )
                {
                    log_handler.handle( Warning( warning ) );
                }
            )
        ),
        require( './VisibilityObjectFactoryFactory' )
            .fromEnvironment()
    )
;

var _nullf = function() { return null; }


/**
 * This module may be invoked in order to provide a more natural looking class
 * definition mechanism
 *
 * This may not be used to extend existing classes. To extend an existing class,
 * use the class's extend() method. If unavailable (or extending a non-ease.js
 * class/object), use the module's extend() method.
 *
 * @param  {string|Object}  namedef  optional name or definition
 * @param  {Object=}        def      class definition if first argument is name
 *
 * @return  {Function|Object}  new class or staging object
 */
module.exports = function( namedef, def )
{
    var type   = ( typeof namedef ),
        result = null,
        args   = [],
        i      = arguments.length
    ;

    // passing arguments object prohibits optimizations in v8
    while ( i-- ) args[ i ] = arguments[ i ];

    switch ( type )
    {
        // anonymous class
        case 'object':
            result = createAnonymousClass.apply( null, args );
            break;

        // named class
        case 'string':
            result = createNamedClass.apply( null, args );
            break;

        default:
            // we don't know what to do!
            throw TypeError(
                "Expecting anonymous class definition or named class definition"
            );
    }

    return result;
};


/**
 * Creates a class, inheriting either from the provided base class or the
 * default base class
 *
 * @param  {Function|Object}  baseordfn   parent or definition object
 * @param  {Object=}          dfn         definition object if parent provided
 *
 * @return  {Function}  extended class
 */
module.exports.extend = extend;


/**
 * Implements an interface or set of interfaces
 *
 * @param  {...Function}  interfaces  interfaces to implement
 *
 * @return  {Object}  intermediate interface object
 */
module.exports.implement = function( interfaces )
{
    // implement on empty base
    return createImplement(
        null,
        Array.prototype.slice.call( arguments )
    );
};


/**
 * Mix a trait into a class
 *
 * The ultimate intent of this depends on the ultimate `extend' call---if it
 * extends another class, then the traits will be mixed into that class;
 * otherwise, the traits will be mixed into the base class. In either case,
 * a final `extend' call is necessary to complete the definition. An attempt
 * to instantiate the return value before invoking `extend' will result in
 * an exception.
 *
 * @param  {Array.<Function>}  traits  traits to mix in
 *
 * @return  {Function}  staging object for class definition
 */
module.exports.use = function( traits )
{
    var args = [], i = arguments.length;
    while( i-- ) args[ i ] = arguments[ i ];

    // consume traits onto an empty base
    return createUse( _nullf, args );
};


var _dummyclass = { prototype: {} };
var _dummyinst  = { constructor: { prototype: {} } };

/**
 * Determines whether the provided object is a class created through ease.js
 *
 * TODO: delegate to ClassBuilder
 *
 * @param  {Object}  obj  object to test
 *
 * @return  {boolean}  true if class (created through ease.js), otherwise false
 */
module.exports.isClass = function( obj )
{
    obj = obj || _dummyclass;

    if ( !obj.prototype )
    {
        return false;
    }

    var meta = ClassBuilder.getMeta( obj );

    // TODO: we're checking a random field on the meta object; do something
    // proper
    return ( ( ( meta !== null ) && meta.implemented )
        || ( obj.prototype instanceof ClassBuilder.ClassBase ) )
        ? true
        : false
    ;
};


/**
 * Determines whether the provided object is an instance of a class created
 * through ease.js
 *
 * TODO: delegate to ClassBuilder
 *
 * @param  {Object}  obj  object to test
 *
 * @return  {boolean}  true if instance of class (created through ease.js),
 *                     otherwise false
 */
module.exports.isClassInstance = function( obj )
{
    obj = obj || _dummyinst;

    // if the constructor is a class, then we must be an instance!
    return module.exports.isClass( obj.constructor );
};


/**
 * Determines if the class is an instance of the given type
 *
 * The given type can be a class, interface, trait or any other type of object.
 * It may be used in place of the 'instanceof' operator and contains additional
 * enhancements that the operator is unable to provide due to prototypal
 * restrictions.
 *
 * @param  {Object}  type      expected type
 * @param  {Object}  instance  instance to check
 *
 * @return  {boolean}  true if instance is an instance of type, otherwise false
 */
module.exports.isInstanceOf = ClassBuilder.isInstanceOf;


/**
 * Alias for isInstanceOf()
 *
 * May read better in certain situations (e.g. Cat.isA( Mammal )) and more
 * accurately conveys the act of inheritance, implementing interfaces and
 * traits, etc.
 */
module.exports.isA = module.exports.isInstanceOf;


/**
 * Creates a new anonymous Class from the given class definition
 *
 * @param  {Object}  def  class definition
 *
 * @return  {Function}  new anonymous class
 */
function createAnonymousClass( def )
{
    // ensure we have the proper number of arguments (if they passed in
    // too many, it may signify that they don't know what they're doing,
    // and likely they're not getting the result they're looking for)
    if ( arguments.length > 1 )
    {
        throw Error(
            "Expecting one argument for anonymous Class definition; " +
                arguments.length + " given."
        );
    }

    return extend( def );
}


/**
 * Creates a new named Class from the given class definition
 *
 * @param  {string}  name  class name
 * @param  {Object}  def   class definition
 *
 * @return  {Function|Object}  new named class or staging object if definition
 *                             was not provided
 */
function createNamedClass( name, def )
{
    // if too many arguments were provided, it's likely that they're
    // expecting some result that they're not going to get
    if ( arguments.length > 2 )
    {
        throw Error(
            "Expecting at most two arguments for definition of named Class '" +
                name + "'; " + arguments.length + " given."
        );
    }

    // if no definition was given, return a staging object, to apply the name to
    // the class once it is actually created
    if ( def === undefined )
    {
        return createStaging( name );
    }
    // the definition must be an object
    else if ( typeof def !== 'object' )
    {
        throw TypeError(
            "Unexpected value for definition of named Class '" + name +
                "'; object expected"
        );
    }

    // add the name to the definition
    def.__name = name;

    return extend( def );
}


/**
 * Creates a staging object to stage a class name
 *
 * The class name will be applied to the class generated by operations performed
 * on the staging object. This allows applying names to classes that need to be
 * extended or need to implement interfaces.
 *
 * @param  {string}  cname  desired class name
 *
 * @return  {Object}  object staging the given class name
 */
function createStaging( cname )
{
    return {
        extend: function()
        {
            var args = [],
                i    = arguments.length;

            while ( i-- ) args[ i ] = arguments[ i ];

            // extend() takes a maximum of two arguments. If only one
            // argument is provided, then it is to be the class definition.
            // Otherwise, the first argument is the supertype and the second
            // argument is the class definition. Either way you look at it,
            // the class definition is always the final argument.
            //
            // We want to add the name to the definition.
            args[ args.length - 1 ].__name = cname;

            return extend.apply( null, args );
        },

        implement: function()
        {
            var args = [],
                i    = arguments.length;

            while ( i-- ) args[ i ] = arguments[ i ];

            // implement on empty base, providing the class name to be used once
            // extended
            return createImplement( null, args, cname );
        },

        use: function()
        {
            var args = [],
                i    = arguments.length;

            while ( i-- ) args[ i ] = arguments[ i ];

            return createUse( _nullf, args );
        }
    };
}


/**
 * Creates an intermediate object to permit implementing interfaces
 *
 * This object defers processing until extend() is called. This intermediate
 * object ensures that a usable class is not generated until after extend() is
 * called, as it does not make sense to create a class without any
 * body/definition.
 *
 * @param  {Object}   base    base class to implement atop of, or null
 * @param  {Array}    ifaces  interfaces to implement
 * @param  {string=}  cname   optional class name once extended
 *
 * @return  {Object}  intermediate implementation object
 */
function createImplement( base, ifaces, cname )
{
    // Defer processing until after extend(). This also ensures that implement()
    // returns nothing usable.
    var partial = {
        extend: function()
        {
            var an       = arguments.length,
                def      = arguments[ an - 1 ],
                ext_base = ( an > 1 ) ? arguments[ an - 2 ] : null
            ;

            // if any arguments remain, then they likely misunderstood what this
            // method does
            if ( an > 2 )
            {
                throw Error(
                    "Expecting no more than two arguments for extend()"
                );
            }

            // if a base was already provided for extending, don't allow them to
            // give us yet another one (doesn't make sense)
            if ( base && ext_base )
            {
                throw Error(
                    "Cannot override parent " + base.toString() + " with " +
                    ext_base.toString() + " via extend()"
                );
            }

            // if a name was provided, use it
            if ( cname )
            {
                def.__name = cname;
            }

            // If a base was provided when createImplement() was called, use
            // that. Otherwise, use the extend() base passed to this function.
            // If neither of those are available, extend from an empty class.
            ifaces.push( base || ext_base || extend( {} ) );

            return extend.call( null,
                implement.apply( this, ifaces ),
                def
            );
        },

        // TODO: this is a naive implementation that works, but could be
        // much more performant (it creates a subtype before mixing in)
        use: function()
        {
            var traits = [],
                i      = arguments.length;

            // passing arguments object prohibits optimizations in v8
            while ( i-- ) traits[ i ] = arguments[ i ];

            return createUse(
                function() { return partial.__createBase(); },
                traits
            );
        },

        // allows overriding default behavior
        __createBase: function()
        {
            return partial.extend( {} );
        }
    };

    return partial;
}


/**
 * Create a staging object representing an eventual mixin
 *
 * This staging objects prepares a class definition for trait mixin. In
 * particular, the returned staging object has the following features:
 *   - invoking it will, if mixing into an existing (non-base) class without
 *     subclassing, immediately complete the mixin and instantiate the
 *     generated class;
 *   - calling `use' has the effect of chaining mixins, stacking them atop
 *     of one-another; and
 *   - invoking `extend' will immediately complete the mixin, resulting in a
 *     subtype of the base.
 *
 * Mixins are performed lazily---the actual mixin will not take place until
 * the final `extend' call, which may be implicit by invoking the staging
 * object (performing instantiation).
 *
 * The third argument determines whether or not a final `extend' call must
 * be explicit: in this case, any instantiation attempts will result in an
 * exception being thrown.
 *
 * @param  {function()}        basef    returns base from which to lazily
 *                                       extend
 * @param  {Array.<Function>}  traits   traits to mix in
 * @param  {boolean}           nonbase  extending from a non-base class
 *                                       (setting will permit instantiation
 *                                       with implicit extend)
 *
 * @return  {Function}  staging object for mixin
 */
function createUse( basef, traits, nonbase )
{
    // invoking the partially applied class will immediately complete its
    // definition and instantiate it with the provided constructor arguments
    var partial = function()
    {
        // this argument will be set only in the case where an existing
        // (non-base) class is extended, meaning that an explict Class or
        // AbstractClass was not provided
        if ( !( nonbase ) )
        {
            throw TypeError(
                "Cannot instantiate incomplete class definition; did " +
                "you forget to call `extend'?"
            );
        }

        return createMixedClass( basef(), traits )
            .apply( null, arguments );
    };


    // otherwise, its definition is deferred until additional context is
    // given during the extend operation
    partial.extend = function()
    {
        var an       = arguments.length,
            dfn      = arguments[ an - 1 ],
            ext_base = ( an > 1 ) ? arguments[ an - 2 ] : null,
            base     = basef();

        // extend the mixed class, which ensures that all super references
        // are properly resolved
        return extend.call( null,
            createMixedClass( ( base || ext_base ), traits ),
            dfn
        );
    };

    // syntatic sugar to avoid the aruduous and seemingly pointless `extend'
    // call simply to mix in another trait
    partial.use = function()
    {
        var args = [],
            i    = arguments.length;

        while ( i-- ) args[ i ] = arguments[ i ];

        return createUse(
            function()
            {
                return partial.__createBase();
            },
            args,
            nonbase
        );
    };

    // allows overriding default behavior
    partial.__createBase = function()
    {
        return partial.extend( {} );
    };

    return partial;
}


function createMixedClass( base, traits )
{
    // generated definition for our [abstract] class that will mix in each
    // of the provided traits; it will automatically be marked as abstract
    // if needed
    var dfn = { ___$$auto$abstract$$: true };

    // this object is used as a class-specific context for storing trait
    // data; it will be encapsulated within a ctor closure and will not be
    // attached to any class
    var tc = [];

    // "mix" each trait into the class definition object
    for ( var i = 0, n = traits.length; i < n; i++ )
    {
        traits[ i ].__mixin( dfn, tc, ( base || ClassBuilder.ClassBase ) );
    }

    // create the mixed class from the above generated definition
    var C    = extend.call( null, base, dfn ),
        meta = ClassBuilder.getMeta( C );

    // add each trait to the list of implemented types so that the
    // class is considered to be of type T in traits
    var impl = meta.implemented;
    for ( var i = 0, n = traits.length; i < n; i++ )
    {
        impl.push( traits[ i ] );
        traits[ i ].__mixinImpl( impl );
    }

    return C;
}


/**
 * Mimics class inheritance
 *
 * This method will mimic inheritance by setting up the prototype with the
 * provided base class (or, by default, Class) and copying the additional
 * properties atop of it.
 *
 * The class to inherit from (the first argument) is optional. If omitted, the
 * first argument will be considered to be the properties list.
 *
 * @param  {Function|Object}  _   parent or definition object
 * @param  {Object=}          __  definition object if parent was provided
 *
 * @return  {Function}  extended class
 */
function extend( _, __ )
{
    var args = [],
        i    = arguments.length;

    // passing arguments object prohibits optimizations in v8
    while ( i-- ) args[ i ] = arguments[ i ];

    // set up the new class
    var new_class = class_builder.build.apply( class_builder, args );

    // set up some additional convenience props
    setupProps( new_class );

    // lock down the new class (if supported) to ensure that we can't add
    // members at runtime
    util.freeze( new_class );

    return new_class;
}


/**
 * Implements interface(s) into an object
 *
 * This will copy all of the abstract methods from the interface and merge it
 * into the given object.
 *
 * @param  {Object}       baseobj     base object
 * @param  {...Function}  interfaces  interfaces to implement into dest
 *
 * @return  {Object}  destination object with interfaces implemented
 */
var implement = function( baseobj, interfaces )
{
    var an   = arguments.length,
        dest = {},
        base = arguments[ an - 1 ],
        arg  = null,

        implemented   = [],
        make_abstract = false
    ;

    // add each of the interfaces
    for ( var i = 0; i < ( an - 1 ); i++ )
    {
        arg = arguments[ i ];

        // copy all interface methods to the class (does not yet deep copy)
        util.propParse( arg.prototype, {
            method: function( name, func, is_abstract, keywords )
            {
                dest[ 'abstract ' + name ] = func.definition;
                make_abstract = true;
            }
        } );
        implemented.push( arg );
    }

    // xxx: temporary
    if ( make_abstract )
    {
        dest.___$$abstract$$ = true;
    }

    // create a new class with the implemented abstract methods
    var class_new = module.exports.extend( base, dest );
    ClassBuilder.getMeta( class_new ).implemented = implemented;

    return class_new;
}


/**
 * Sets up common properties for the provided function (class)
 *
 * @param  {function()}  func  function (class) to set up
 *
 * @return  {undefined}
 */
function setupProps( func )
{
    attachExtend( func );
    attachImplement( func );
    attachUse( func );
}


/**
 * Attaches extend method to the given function (class)
 *
 * @param  {Function}  func  function (class) to attach method to
 *
 * @return  {undefined}
 */
function attachExtend( func )
{
    /**
     * Shorthand for extending classes
     *
     * This method can be invoked on the object, rather than having to call
     * Class.extend( this ).
     *
     * @param  {Object}  props  properties to add to extended class
     *
     * @return  {Object}  extended class
     */
    util.defineSecureProp( func, 'extend', function( props )
    {
        return extend( this, props );
    });
}


/**
 * Attaches implement method to the given function (class)
 *
 * Please see the implement() export of this module for more information.
 *
 * @param  {function()}  func  function (class) to attach method to
 *
 * @return  {undefined}
 */
function attachImplement( func )
{
    util.defineSecureProp( func, 'implement', function()
    {
        var args = [], i = arguments.length;
        while( i-- ) args[ i ] = arguments[ i ];

        return createImplement( func, args );
    });
}


/**
 * Attaches use method to the given function (class)
 *
 * Please see the `use' export of this module for more information.
 *
 * @param  {function()}  func  function (class) to attach method to
 *
 * @return  {undefined}
 */
function attachUse( func )
{
    util.defineSecureProp( func, 'use', function()
    {
        var args = [], i = arguments.length;
        while( i-- ) args[ i ] = arguments[ i ];

        return createUse( function() { return func; }, args, true );
    } );
}

} )( module['class'] = {}, '.' );
/** class_abstract **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
/**
 * Wrapper permitting the definition of abstract classes
 *
 * This doesn't actually introduce any new functionality. Rather, it sets a
 * flag to allow abstract methods within a class, forcing users to clearly
 * state that a class is abstract.
 *
 *  Copyright (C) 2010, 2011, 2013, 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var Class = require( './class' );


/**
 * Creates an abstract class
 *
 * @return  {Function}  abstract class
 */
module.exports = exports = function()
{
    markAbstract( arguments[ arguments.length - 1 ] );

    // forward everything to Class
    var result = Class.apply( this, arguments );

    // if we're using the temporary object, then override its methods to permit
    // abstract classes
    if ( !Class.isClass( result ) )
    {
        abstractOverride( result );
    }

    return result;
};


/**
 * Creates an abstract class from a class extend operation
 *
 * @return  {Function}  abstract class
 */
exports.extend = function()
{
    markAbstract( arguments[ arguments.length - 1 ] );
    return Class.extend.apply( this, arguments );
};


/**
 * Mixes in a trait
 *
 * @return  {Object}  staged abstract class
 */
exports.use = function()
{
    return abstractOverride(
        Class.use.apply( this, arguments )
    );
};


/**
 * Creates an abstract class implementing the given members
 *
 * Simply wraps the class module's implement() method.
 *
 * @return  {Object}  staged abstract class
 */
exports.implement = function()
{
    return abstractOverride(
        Class.implement.apply( this, arguments )
    );
};


/**
 * Causes a definition to be flagged as abstract
 *
 * @param  {*}  dfn  suspected definition object
 *
 * @return  {undefined}
 */
function markAbstract( dfn )
{
    if ( typeof dfn === 'object' )
    {
        // mark as abstract
        dfn.___$$abstract$$ = true;
    }
}


/**
 * Overrides object members to permit abstract classes
 *
 * @param  {Object}  obj  object to override
 *
 * @return  {Object}  obj
 */
function abstractOverride( obj )
{
    var extend = obj.extend,
        impl   = obj.implement,
        use    = obj.use;

    // wrap and apply the abstract flag, only if the method is defined (it
    // may not be under all circumstances, e.g. after an implement())
    impl && ( obj.implement = function()
    {
        return abstractOverride( impl.apply( this, arguments ) );
    } );

    var mixin = false;
    use && ( obj.use = function()
    {
        return abstractOverride( use.apply( this, arguments ) );
    } );

    // wrap extend, applying the abstract flag
    obj.extend = function()
    {
        markAbstract( arguments[ arguments.length - 1 ] );
        return extend.apply( this, arguments );
    };

    // used by mixins; we need to mark the intermediate subtype as abstract,
    // but ensure we don't throw any errors if no abstract members are mixed
    // in (since thay may be mixed in later on)
    obj.__createBase = function()
    {
        return extend( { ___$$auto$abstract$$: true } );
    };

    return obj;
}

} )( module['class_abstract'] = {}, '.' );
/** interface **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
/**
 * Contains interface module
 *
 *  Copyright (C) 2010, 2011, 2012, 2013, 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var util           = require( './util' ),

    MethodWrapperFactory = require( './MethodWrapperFactory' ),
    wrappers             = require( './MethodWrappers' ).standard,

    member_builder = require( './MemberBuilder' )(
        MethodWrapperFactory( wrappers.wrapNew ),
        MethodWrapperFactory( wrappers.wrapOverride ),
        MethodWrapperFactory( wrappers.wrapProxy ),
        require( './MemberBuilderValidator' )()
    ),

    Class        = require( './class' ),
    ClassBuilder = require( './ClassBuilder' );;


/**
 * This module may be invoked in order to provide a more natural looking
 * interface definition
 *
 * Only new interfaces may be created using this method. They cannot be
 * extended. To extend an existing interface, call its extend() method, or use
 * the extend() method of this module.
 *
 * @param  {string|Object}  namedef  optional name or definition
 * @param  {Object=}        def      interface definition if first arg is name
 *
 * @return  {Function|Object}  new interface or staging object
 */
module.exports = function( namedef, def )
{
    var type   = ( typeof namedef ),
        result = null
    ;

    switch ( type )
    {
        // anonymous interface
        case 'object':
            result = createAnonymousInterface.apply( null, arguments );
            break;

        // named class
        case 'string':
            result = createNamedInterface.apply( null, arguments );
            break;

        default:
            // we don't know what to do!
            throw TypeError(
                "Expecting anonymous interface definition or named " +
                    "interface definition"
            );
    }

    return result;
};


/**
 * Creates an interface
 *
 * @return  {Function}  extended interface
 */
module.exports.extend = function()
{
    return extend.apply( this, arguments );
};


/**
 * Determines whether the provided object is an interface created through
 * ease.js
 *
 * @param  {Object}  obj  object to test
 *
 * @return  {boolean}  true if interface (created through ease.js), otherwise
 *                     false
 */
module.exports.isInterface = function( obj )
{
    obj = obj || {};

    return ( obj.prototype instanceof Interface )
        ? true
        : false
    ;
};


/**
 * Default interface implementation
 *
 * @return  {undefined}
 */
function Interface() {}


/**
 * Creates a new anonymous Interface from the given interface definition
 *
 * @param  {Object}  def  interface definition
 *
 * @return  {Function}  new anonymous interface
 */
function createAnonymousInterface( def )
{
    // ensure we have the proper number of arguments (if they passed in
    // too many, it may signify that they don't know what they're doing,
    // and likely they're not getting the result they're looking for)
    if ( arguments.length > 1 )
    {
        throw Error(
            "Expecting one argument for Interface definition; " +
                arguments.length + " given."
        );
    }

    return extend( def );
}


/**
 * Creates a new named interface from the given interface definition
 *
 * @param  {string}  name  interface name
 * @param  {Object}  def   interface definition
 *
 * @return  {Function}  new named interface
 */
function createNamedInterface( name, def )
{
    // if too many arguments were provided, it's likely that they're
    // expecting some result that they're not going to get
    if ( arguments.length > 2 )
    {
        throw Error(
            "Expecting two arguments for definition of named Interface '" +
                name + "'; " + arguments.length + " given."
        );
    }

    // the definition must be an object
    if ( typeof def !== 'object' )
    {
        throw TypeError(
            "Unexpected value for definition of named Interface '" +
                name + "'; object expected"
        );
    }

    // add the name to the definition
    def.__name = name;

    return extend( def );
}


/**
 * Augment an exception with interface name and then throw
 *
 * @param  {string}  iname  interface name or empty string
 * @param  {Error}   e      exception to augment
 */
function _ithrow( iname, e )
{
    // alter the message to include our name
    e.message = "Failed to define interface " +
        ( ( iname ) ? iname : '(anonymous)' ) + ": " + e.message
    ;

    throw e;
}


var extend = ( function( extending )
{
    return function extend()
    {
        // ensure we'll be permitted to instantiate interfaces for the base
        extending = true;

        var a         = arguments,
            an        = a.length,
            props     = ( ( an > 0 ) ? a[ an - 1 ] : 0 ) || {},
            base      = ( ( an > 1 ) ? a[ an - 2 ] : 0 ) || Interface,
            prototype = new base(),
            iname     = '',

            // holds validation state
            vstate = {},

            members = member_builder.initMembers(
                prototype, prototype, prototype
            )
        ;

        // grab the name, if one was provided
        if ( iname = props.__name )
        {
            // we no longer need it
            delete props.__name;
        }

        // sanity check
        inheritCheck( prototype );

        var new_interface = createInterface( iname );

        util.propParse( props, {
            assumeAbstract: true,

            // override default exceptions from parser errors
            _throw: function( e )
            {
                _ithrow( iname, e );
            },

            property: function()
            {
                // should never get to this point because of assumeAbstract
                _ithrow( iname, TypeError( "Unexpected internal error" ) );
            },

            getset: function()
            {
                // should never get to this point because of assumeAbstract
                _ithrow( iname, TypeError( "Unexpected internal error" ) );
            },

            method: function( name, value, is_abstract, keywords )
            {
                // all members must be public
                if ( keywords[ 'protected' ] || keywords[ 'private' ] )
                {
                    _ithrow( iname, TypeError(
                        "Member " + name + " must be public"
                    ) );
                }

                member_builder.buildMethod(
                    members, null, name, value, keywords,
                    null, 0, {}, vstate
                );
            }
        } );

        attachExtend( new_interface );
        attachStringMethod( new_interface, iname );
        attachCompat( new_interface );
        attachInstanceOf( new_interface );

        new_interface.prototype   = prototype;
        new_interface.constructor = new_interface;

        // freeze the interface (preventing additions), if supported
        util.freeze( new_interface );

        // we're done; let's not allow interfaces to be instantiated anymore
        extending = false;

        return new_interface;
    };


    /**
     * Creates a new interface constructor function
     *
     * @param  {string=}  iname  interface name
     *
     * @return  {function()}
     */
    function createInterface( iname )
    {
        return function()
        {
            // allows us to extend the interface without throwing an exception
            // (since the prototype requires an instance)
            if ( !extending )
            {
                // only called if someone tries to create a new instance of an
                // interface
                throw Error(
                    "Interface " + ( ( iname ) ? ( iname + ' ' ) : '' ) +
                        " cannot be instantiated"
                );
            }
        };
    }
} )( false );


/**
 * Assures that the parent object is a valid object to inherit from
 *
 * This method allows inheriting from any object (note that it will likely cause
 * errors if not an interface), but will place restrictions on objects like
 * Classes that do not make sense to inherit from. This will provide a more
 * friendly error, with suggestions on how to resolve the issue, rather than a
 * cryptic error resulting from inheritance problems.
 *
 * This method will throw an exception if there is a violation.
 *
 * @param  {Object}  prototype  prototype to check for inheritance flaws
 *
 * @return  {undefined}
 */
function inheritCheck( prototype )
{
    // if we're inheriting from another interface, then we're good
    if ( !( prototype instanceof Interface ) )
    {
        throw new TypeError( "Interfaces may only extend other interfaces" );
    }
}


/**
 * Attaches extend method to the given function (interface)
 *
 * @param  {Function}  func  function (interface) to attach method to
 *
 * @return  {undefined}
 */
function attachExtend( func )
{
    /**
     * Shorthand for extending interfaces
     *
     * This method can be invoked on the object, rather than having to call
     * Interface.extend( this ).
     *
     * @param  {Object}  props  properties to add to extended interface
     *
     * @return  {Object}  extended interface
     */
    util.defineSecureProp( func, 'extend', function( props )
    {
        return extend( this, props );
    });
}


/**
 * Provides more sane/useful output when interface is converted to a string
 *
 * @param  {Object}   func   interface
 * @param  {string=}  iname  interface name
 *
 * @return  {undefined}
 */
function attachStringMethod( func, iname )
{
    func.toString = ( iname )
        ? function() { return '[object Interface <' + iname + '>]'; }
        : function() { return '[object Interface]'; }
    ;
}


/**
 * Attaches a method to assert whether a given object is compatible with the
 * interface
 *
 * @param  {Function}  iface  interface to attach method to
 *
 * @return  {undefined}
 */
function attachCompat( iface )
{
    util.defineSecureProp( iface, 'isCompatible', function( obj )
    {
        return isCompat( iface, obj );
    } );
}


/**
 * Determines if the given object is compatible with the given interface.
 *
 * An object is compatible if it defines all methods required by the
 * interface, with at least the required number of parameters.
 *
 * Processing time is linear with respect to the number of members of the
 * provided interface.
 *
 * To get the actual reasons in the event of a compatibility failure, use
 * analyzeCompat instead.
 *
 * @param  {Interface}  iface  interface that must be adhered to
 * @param  {Object}     obj    object to check compatibility against
 *
 * @return  {boolean}  true if compatible, otherwise false
 */
function isCompat( iface, obj )
{
    // yes, this processes the entire interface, but it is hopefully small
    // anyway and the process is fast enough that doing otherwise may be
    // micro-optimizing
    return analyzeCompat( iface, obj ).length === 0;
}


/**
 * Analyzes the given object to determine if there exists any compatibility
 * issues with respect to the given interface
 *
 * Will provide an array of the names of incompatible members. A method is
 * incompatible if it is not defined or if it does not define at least the
 * required number of parameters.
 *
 * Processing time is linear with respect to the number of members of the
 * provided interface.
 *
 * @param  {Interface}  iface  interface that must be adhered to
 * @param  {Object}     obj    object to check compatibility against
 *
 * @return  {Array.<Array.<string, string>>}  compatibility reasons
 */
function analyzeCompat( iface, obj )
{
    var missing = [];

    util.propParse( iface.prototype, {
        method: function( name, func, is_abstract, keywords )
        {
            if ( typeof obj[ name ] !== 'function' )
            {
                missing.push( [ name, 'missing' ] );
            }
            else if ( obj[ name ].length < func.__length )
            {
                // missing parameter(s); note that we check __length on the
                // interface method (our internal length) but not on the
                // object (since it may be a vanilla object)
                missing.push( [ name, 'incompatible' ] );
            }
        }
    } );

    return missing;
}


/**
 * Attaches instance check method
 *
 * This method is invoked when checking the type of a class against an
 * interface.
 *
 * @param  {Interface}  iface  interface that must be adhered to
 *
 * @return  {undefined}
 */
function attachInstanceOf( iface )
{
    util.defineSecureProp( iface, '__isInstanceOf', function( type, obj )
    {
        return _isInstanceOf( type, obj );
    } );
}


/**
 * Determine if INSTANCE implements the interface TYPE
 *
 * @param  {Interface}  type      interface to check against
 * @param  {Object}     instance  instance to examine
 *
 * @return  {boolean}  whether TYPE is implemented by INSTANCE
 */
function _isInstanceOf( type, instance )
{
    // we are interested in the class's metadata, not the instance's
    var proto = instance.constructor;

    // if no metadata are available, then our remaining checks cannot be
    // performed
    var meta;
    if ( !instance.__cid || !( meta = ClassBuilder.getMeta( proto ) ) )
    {
        return isCompat( type, instance );
    }

    var implemented = meta.implemented,
        i           = implemented.length;

    // check implemented interfaces et. al. (other systems may make use of
    // this meta-attribute to provide references to types)
    while ( i-- )
    {
        if ( implemented[ i ] === type )
        {
            return true;
        }
    }

    return false;
}

module.exports.isInstanceOf = _isInstanceOf;

} )( module['interface'] = {}, '.' );
/** Trait **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
/**
 * Provides system for code reuse via traits
 *
 *  Copyright (C) 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var AbstractClass = require( './class_abstract' ),
    ClassBuilder  = require( './ClassBuilder' ),
    Interface     = require( './interface' );


function _fvoid() {};


/**
 * Trait constructor / base object
 *
 * The interpretation of the argument list varies by number. Further,
 * various trait methods may be used as an alternative to invoking this
 * constructor.
 *
 * @return  {Function}  trait
 */
function Trait()
{
    switch ( arguments.length )
    {
        case 0:
            throw Error( "Missing trait name or definition" );

        case 1:
            return ( typeof arguments[ 0 ] === 'string' )
                ? _createStaging.apply( this, arguments )
                : Trait.extend.apply( this, arguments );

        case 2:
            return createNamedTrait.apply( this, arguments );
    }

    throw Error(
        "Expecting at most two arguments for definition of named " +
            "Trait " + name + "'; " + arguments.length + " given"
    );
};


/**
 * Create a named trait
 *
 * @param  {string}  name  trait name
 * @param  {Object}  def   trait definition
 *
 * @return  {Function}  named trait
 */
function createNamedTrait( name, dfn )
{
    if ( typeof name !== 'string' )
    {
        throw Error(
            "First argument of named class definition must be a string"
        );
    }

    dfn.__name = name;
    return Trait.extend( dfn );
}


function _createStaging( name )
{
    return {
        extend: function( dfn )
        {
            return createNamedTrait( name, dfn );
        },

        implement: function()
        {
            return createImplement( arguments, name );
        }
    };
}


Trait.extend = function( dfn )
{
    // we may have been passed some additional metadata
    var meta = ( this || {} ).__$$meta || {};

    // store any provided name, since we'll be clobbering it (the definition
    // object will be used to define the hidden abstract class)
    var name    = dfn.__name || '(Trait)',
        type    = _getTraitType( dfn ),
        isparam = ( type === 'param' );

    // augment the parser to handle our own oddities
    dfn.___$$parser$$ = {
        each:     _parseMember,
        property: _parseProps,
        getset:   _parseGetSet
    };

    // automatically mark ourselves as abstract if an abstract method is
    // provided
    dfn.___$$auto$abstract$$ = true;

    // give the abstract trait class a distinctive name for debugging
    dfn.__name = '#AbstractTrait#';

    // if __mixin was provided,in the definition, then we should crate a
    // paramaterized trait
    var Trait = ( isparam )
        ? function ParameterTraitType()
        {
            // duplicate ars in a way that v8 can optimize
            var args = [], i = arguments.length;
            while ( i-- ) args[ i ] = arguments[ i ];

            var AT = function ArgumentTrait()
            {
                throw Error( "Cannot re-configure argument trait" );
            };

            // TODO: mess!
            AT.___$$mixinargs = args;
            AT.__trait        = 'arg';
            AT.__acls         = Trait.__acls;
            AT.__ccls         = Trait.__ccls;
            AT.toString       = Trait.toString;
            AT.__mixinImpl    = Trait.__mixinImpl;
            AT.__isInstanceOf = Trait.__isInstanceOf;

            // mix in the argument trait instead of the original
            AT.__mixin = function( dfn, tc, base )
            {
                mixin( AT, dfn, tc, base );
            };

            return AT;
        }
        : function TraitType()
        {
            throw Error( "Cannot instantiate non-parameterized trait" );
        };

    // implement interfaces if indicated
    var base = AbstractClass;
    if ( meta.ifaces )
    {
        base = base.implement.apply( null, meta.ifaces );
    }

    // and here we can see that traits are quite literally abstract classes
    var tclass = base.extend( dfn );

    Trait.__trait  = type;
    Trait.__acls   = tclass;
    Trait.__ccls   = null;
    Trait.toString = function()
    {
        return ''+name;
    };

    // we're not a param trait, but we want consistent data
    Trait.___$$mixinargs = [];

    // invoked to trigger mixin
    Trait.__mixin = function( dfn, tc, base )
    {
        mixin( Trait, dfn, tc, base );
    };

    // mixes in implemented types
    Trait.__mixinImpl = function( dest_meta )
    {
        mixinImpl( tclass, dest_meta );
    };

    // TODO: this and the above should use util.defineSecureProp
    Trait.__isInstanceOf = Interface.isInstanceOf;

    return Trait;
};


/**
 * Retrieve a string representation of the trait type
 *
 * A trait is parameterized if it has a __mixin method; otherwise, it is
 * standard.
 *
 * @param   {Object}  dfn  trait definition object
 * @return  {string}  trait type
 */
function _getTraitType( dfn )
{
    return ( typeof dfn.__mixin === 'function' )
        ? 'param'
        : 'std';
}


/**
 * Verifies trait member restrictions
 *
 * @param  {string}   name      property name
 * @param  {*}        value     property value
 * @param  {Object}   keywords  property keywords
 * @param  {Function} h         original handler that we replaced
 *
 * @return  {undefined}
 */
function _parseMember( name, value, keywords, h )
{
    // traits are not permitted to define constructors
    if ( name === '__construct' )
    {
        throw Error( "Traits may not define __construct" );
    }

    // will be supported in future versions
    if ( keywords['static'] )
    {
        throw Error(
            "Cannot define member `" + name + "'; static trait " +
            "members are currently unsupported"
        );
    }

    // apply original handler
    h.apply( this, arguments );
}


/**
 * Throws error if non-internal property is found within PROPS
 *
 * For details and rationale, see the Trait/PropertyTest case.
 *
 * @param  {string}   name      property name
 * @param  {*}        value     property value
 * @param  {Object}   keywords  property keywords
 * @param  {Function} h         original handler that we replaced
 *
 * @return  {undefined}
 */
function _parseProps( name, value, keywords, h )
{
    // ignore internal properties
    if ( name.substr( 0, 3 ) === '___' )
    {
        return;
    }

    if ( !( keywords['private'] ) )
    {
        throw Error(
            "Cannot define property `" + name + "'; only private " +
            "properties are permitted within Trait definitions"
        );
    }

    // apply original handler
    h.apply( this, arguments );
}


/**
 * Immediately throws an exception, as getters/setters are unsupported
 *
 * This is a temporary restriction; they will be supported in future
 * releases.
 *
 * @param  {string}   name      property name
 * @param  {*}        value     property value
 * @param  {Object}   keywords  property keywords
 * @param  {Function} h         original handler that we replaced
 *
 * @return  {undefined}
 */
function _parseGetSet( name, value, keywords, h )
{
    throw Error(
        "Cannot define property `" + name + "'; getters/setters are " +
        "currently unsupported"
    );
}


/**
 * Implement one or more interfaces
 *
 * Implementing an interface into a trait has the same effect as it does
 * within classes in that it will automatically define abstract methods
 * unless a concrete method is provided. Further, the class that the trait
 * is mixed into will act as though it implemented the interfaces.
 *
 * @param  {...Function}  interfaces  interfaces to implement
 *
 * @return  {Object}  staged trait object
 */
Trait.implement = function()
{
    return createImplement( arguments );
};


/**
 * Create a staging object from which a trait implementing a set of
 * interfaces may be defined
 *
 * @param  {...Function}  interfaces  interfaces to implement
 * @param  {string=}      name        optional trait name
 *
 * @return  {Object}  staged trait object
 */
function createImplement( ifaces, name )
{
    return {
        extend: function( dfn )
        {
            if ( name )
            {
                dfn.__name = name;
            }

            // pass our interface metadata as the invocation context
            return Trait.extend.call(
                { __$$meta: { ifaces: ifaces } },
                dfn
            );
        }
    };
}


/**
 * Determines if the provided value references a trait
 *
 * @param   {*}        trait  value to check
 * @return  {boolean}  whether the provided value references a trait
 */
Trait.isTrait = function( trait )
{
    return !!( trait || {} ).__trait;
};


/**
 * Determines if the provided value references a parameterized trait
 *
 * @param   {*}        trait  value to check
 * @return  {boolean}  whether the provided value references a param trait
 */
Trait.isParameterTrait = function( trait )
{
    return !!( ( trait || {} ).__trait === 'param' );
};


/**
 * Determines if the provided value references an argument trait
 *
 * An argument trait is a configured parameter trait.
 *
 * @param   {*}        trait  value to check
 * @return  {boolean}  whether the provided value references an arg trait
 */
Trait.isArgumentTrait = function( trait )
{
    return !!( ( trait || {} ).__trait === 'arg' );
};


/**
 * Create a concrete class from the abstract trait class
 *
 * This class is the one that will be instantiated by classes that mix in
 * the trait.
 *
 * @param  {AbstractClass}  acls  abstract trait class
 *
 * @return  {Class}  concrete trait class for instantiation
 */
function createConcrete( acls )
{
    // start by providing a concrete implementation for our dummy method and
    // a constructor that accepts the protected member object of the
    // containing class
    var dfn = {
        // protected member object (we define this as protected so that the
        // parent ACLS has access to it (!), which is not prohibited since
        // JS does not provide a strict typing mechanism...this is a kluge)
        // and target supertype---that is, what __super calls should
        // referene
        'protected ___$$pmo$$': null,
        'protected ___$$super$$': null,
        __construct: function( base, pmo )
        {
            this.___$$super$$ = base;
            this.___$$pmo$$   = pmo;
        },

        // mainly for debugging; should really never see this.
        __name: '#ConcreteTrait#'
    };

    // every abstract method should be overridden with a proxy to the
    // protected member object that will be passed in via the ctor
    var amethods = ClassBuilder.getMeta( acls ).abstractMethods;
    for ( var f in amethods )
    {
        // TODO: would be nice if this check could be for '___'; need to
        // replace amethods.__length with something else, then
        if ( !( Object.hasOwnProperty.call( amethods, f ) )
            || ( f.substr( 0, 2 ) === '__' )
        )
        {
            continue;
        }

        // we know that if it's not public, then it must be protected
        var vis = ( acls.___$$methods$$['public'][ f ] !== undefined )
            ? 'public'
            : 'protected';

        // setting the correct visibility modified is important to prevent
        // visibility de-escalation errors if a protected concrete method is
        // provided
        dfn[ vis + ' proxy ' + f ] = '___$$pmo$$';
    }

    // virtual methods need to be handled with care to ensure that we invoke
    // any overrides
    createVirtProxy( acls, dfn );

    return acls.extend( dfn );
}


/**
 * Create virtual method proxies for all virtual members
 *
 * Virtual methods are a bit of hassle with traits: we are in a situation
 * where we do not know at the time that the trait is created whether or not
 * the virtual method has been overridden, since the class that the trait is
 * mixed into may do the overriding. Therefore, we must check if an override
 * has occured *when the method is invoked*; there is room for optimization
 * there (by making such a determination at the time of mixin), but we'll
 * leave that for later.
 *
 * @param  {AbstractClass}  acls  abstract trait class
 * @param  {Object}         dfn   destination definition object
 *
 * @return  {undefined}
 */
function createVirtProxy( acls, dfn )
{
    var vmembers = ClassBuilder.getMeta( acls ).virtualMembers;

    // f = `field'
    for ( var f in vmembers )
    {
        var vis = ( acls.___$$methods$$['public'][ f ] !== undefined )
            ? 'public'
            : 'protected';

        var srcmethod = acls.___$$methods$$[ vis ][ f ],
            plen      = srcmethod.__length;

        // this is the aforementioned proxy method; see the docblock for
        // more information
        dfn[ vis + ' virtual override ' + f ] = ( function( f )
        {
            var retf = function()
            {
                var pmo = this.___$$pmo$$,
                    o   = pmo[ f ];

                // proxy to virtual override from the class we are mixed
                // into, if found; otherwise, proxy to our supertype
                return ( o )
                    ? o.apply( pmo, arguments )
                    : this.__super.apply( this, arguments );
            };

            retf.__length = plen;
            return retf;
        } )( f );

        // this guy bypasses the above virtual override check, which is
        // necessary in certain cases to prevent infinte recursion
        dfn[ vis + ' virtual __$$' + f ] = ( function( method )
        {
            var retf = function()
            {
                return method.apply( this, arguments );
            };

            retf.__length = plen;
            return retf;
        } )( srcmethod );
    }
}


/**
 * Mix trait into the given definition
 *
 * The original object DFN is modified; it is not cloned. TC should be
 * initialized to an empty array; it is used to store context data for
 * mixing in traits and will be encapsulated within a ctor closure (and thus
 * will remain in memory).
 *
 * @param  {Trait}   trait  trait to mix in
 * @param  {Object}  dfn    definition object to merge into
 * @param  {Array}   tc     trait class context
 * @param  {Class}   base   target supertyep
 *
 * @return  {Object}  dfn
 */
function mixin( trait, dfn, tc, base )
{
    // the abstract class hidden within the trait
    var acls = trait.__acls;

    // retrieve the private member name that will contain this trait object
    var iname = addTraitInst( trait, dfn, tc, base );

    // TODO: this should not be necessary for dfn metadata
    dfn[ 'weak virtual ___$$ctor$pre$$' ]  = _fvoid;
    dfn[ 'weak virtual ___$$ctor$post$$' ] = _fvoid;

    // TODO: this is a kluge; generalize and move
    // this ensures __construct is called before __mixin when mixing into
    // the base class
    if ( base === ClassBuilder.ClassBase )
    {
        dfn[ 'virtual override ___$$ctor$post$$' ] = _tctorApply;
        dfn[ 'virtual override ___$$ctor$pre$$' ]  = _fvoid;
    }
    else
    {
        dfn[ 'virtual override ___$$ctor$post$$' ]  = _fvoid;
        dfn[ 'virtual override ___$$ctor$pre$$' ] = _tctorApply;
    }

    // recursively mix in trait's underlying abstract class (ensuring that
    // anything that the trait inherits from is also properly mixed in)
    mixinCls( acls, dfn, iname );
    return dfn;
}


/**
 * Recursively mix in class methods
 *
 * If CLS extends another class, its methods will be recursively processed
 * to ensure that the entire prototype chain is properly proxied.
 *
 * For an explanation of the iname parameter, see the mixin function.
 *
 * @param  {Class}   cls    class to mix in
 * @param  {Object}  dfn    definition object to merge into
 * @param  {string}  iname  trait object private member instance name
 *
 * @return {undefined}
 */
function mixinCls( cls, dfn, iname )
{
    var methods = cls.___$$methods$$;

    mixMethods( methods['public'], dfn, 'public', iname );
    mixMethods( methods['protected'], dfn, 'protected', iname );

    // if this class inherits from another class that is *not* the base
    // class, recursively process its methods; otherwise, we will have
    // incompletely proxied the prototype chain
    var parent = methods['public'].___$$parent$$;
    if ( parent && ( parent.constructor !== ClassBuilder.ClassBase ) )
    {
        mixinCls( parent.constructor, dfn, iname );
    }
}


/**
 * Mix implemented types into destination object
 *
 * The provided destination object will ideally be the `implemented' array
 * of the destination class's meta object.
 *
 * @param  {Class}   cls        source class
 * @param  {Object}  dest_meta  destination object to copy into
 *
 * @return {undefined}
 */
function mixinImpl( cls, dest_meta )
{
    var impl = ClassBuilder.getMeta( cls ).implemented || [],
        i    = impl.length;

    while ( i-- )
    {
        // TODO: this could potentially result in duplicates
        dest_meta.push( impl[ i ] );
    }
}


/**
 * Mix methods from SRC into DEST using proxies
 *
 * @param  {Object}  src    visibility object to scavenge from
 * @param  {Object}  dest   destination definition object
 * @param  {string}  vis    visibility modifier
 * @param  {string}  iname  proxy destination (trait instance)
 *
 * @return  {undefined}
 */
function mixMethods( src, dest, vis, iname )
{
    for ( var f in src )
    {
        if ( !( Object.hasOwnProperty.call( src, f ) ) )
        {
            continue;
        }

        // TODO: generalize
        // __mixin is exclusive to the trait (private-ish, but can be
        // invoked publically internally)
        if ( f === '__mixin' )
        {
            continue;
        }

        // TODO: this is a kluge; we'll use proper reflection eventually,
        // but for now, this is how we determine if this is an actual method
        // vs. something that just happens to be on the visibility object
        if ( !( src[ f ].___$$keywords$$ ) )
        {
            continue;
        }

        var keywords = src[ f ].___$$keywords$$,
            vis      = keywords['protected'] ? 'protected' : 'public';

        // if abstract, then we are expected to provide the implementation;
        // otherwise, we proxy to the trait's implementation
        if ( keywords[ 'abstract' ] && !( keywords[ 'override' ] ) )
        {
            // copy the abstract definition (N.B. this does not copy the
            // param names, since that is not [yet] important); the
            // visibility modified is important to prevent de-escalation
            // errors on override
            dest[ vis + ' weak abstract ' + f ] = src[ f ].definition;
        }
        else
        {
            var vk    = keywords['virtual'],
                virt  = vk ? 'virtual ' : '',
                ovr   = ( keywords['override'] ) ? 'override ' : '',
                pname = ( vk ? '' : 'proxy ' ) + virt + ovr + vis + ' ' + f;

            // if we have already set up a proxy for a field of this name,
            // then multiple traits have defined the same concrete member
            if ( dest[ pname ] !== undefined )
            {
                // TODO: between what traits?
                throw Error( "Trait member conflict: `" + f + "'" );
            }

            // if non-virtual, a normal proxy should do
            if ( !( keywords[ 'virtual' ] ) )
            {
                dest[ pname ] = iname;
                continue;
            }

            // proxy this method to what will be the encapsulated trait
            // object (note that we do not use the proxy keyword here
            // beacuse we are not proxying to a method of the same name)
            dest[ pname ] = ( function( f )
            {
                var retf = function()
                {
                    var pdest = this[ iname ];

                    // invoke the direct method on the trait instance; this
                    // bypasses the virtual override check on the trait
                    // method to ensure that it is invoked without
                    // additional overhead or confusion
                    var ret = pdest[ '__$$' + f ].apply( pdest, arguments );

                    // if the trait returns itself, return us instead
                    return ( ret === pdest )
                        ? this
                        : ret;
                };

                retf.__length = src[ f ].__length;
                return retf;
            } )( f );
        }
    }
}


/**
 * Add concrete trait class to a class instantion list
 *
 * This list---which will be created if it does not already exist---will be
 * used upon instantiation of the class consuming DFN to instantiate the
 * concrete trait classes.
 *
 * Here, `tc' and `to' are understood to be, respectively, ``trait class''
 * and ``trait object''.
 *
 * @param  {Class}   T     trait
 * @param  {Object}  dfn   definition object of class being mixed into
 * @param  {Array}   tc    trait class object
 * @param  {Class}   base  target supertyep
 *
 * @return  {string}  private member into which C instance shall be stored
 */
function addTraitInst( T, dfn, tc, base )
{
    var base_cid = base.__cid;

    // creates a property of the form ___$to$N$M to hold the trait object
    // reference; M is required because of the private member restrictions
    // imposed to be consistent with pre-ES5 fallback
    var iname = '___$to$' + T.__acls.__cid + '$' + base_cid;

    // the trait object array will contain two values: the destination field
    // and the trait to instantiate
    tc.push( [ iname, T ] );

    // we must also add the private field to the definition object to
    // support the object assignment indicated by TC
    dfn[ 'private ' + iname ] = null;

    // create internal trait ctor if not available
    if ( dfn.___$$tctor$$ === undefined )
    {
        // TODO: let's check for inheritance or something to avoid this weak
        // definition (this prevents warnings if there is not a supertype
        // that defines the trait ctor)
        dfn[ 'weak virtual ___$$tctor$$' ] = function() {};
        dfn[ 'virtual override ___$$tctor$$' ] = createTctor( tc, base );
    }

    return iname;
}


/**
 * Trait initialization constructor
 *
 * May be used to initialize all traits mixed into the class that invokes
 * this function. All concrete trait classes are instantiated and their
 * resulting objects assigned to their rsepective pre-determined field
 * names.
 *
 * The MIXINARGS are only useful in the case of parameterized trait.
 *
 * This will lazily create the concrete trait class if it does not already
 * exist, which saves work if the trait is never used.
 *
 * Note that the private symbol used to encapsulate class data must be
 * passed to this function to provide us access to implementation details
 * that we really shouldn't be messing around with. :) In particular, we
 * need access to the protected visibility object, and there is [currently]
 * no API for doing so.
 *
 * @param  {Object}  tc       trait class list
 * @param  {Class}   base     target supertype
 * @param  {Symbol}  privsym  symbol used as key for encapsulated data
 *
 * @return  {undefined}
 */
function tctor( tc, base, privsym )
{
    // instantiate all traits and assign the object to their
    // respective fields
    for ( var t in tc )
    {
        var f = tc[ t ][ 0 ],
            T = tc[ t ][ 1 ],
            C = T.__ccls || ( T.__ccls = createConcrete( T.__acls ) );

        // instantiate the trait, providing it with our protected visibility
        // object so that it has access to our public and protected members
        // (but not private); in return, we will use its own protected
        // visibility object to gain access to its protected members...quite
        // the intimate relationship
        this[ f ] = C( base, this[ privsym ].vis )[ privsym ].vis;

        // this has been previously validated to ensure that it is a
        // function
        this[ f ].__mixin && this[ f ].__mixin.apply(
            this[ f ], T.___$$mixinargs
        );
    }

    // if we are a subtype, be sure to initialize our parent's traits
    this.__super && this.__super( privsym );
};


/**
 * Create trait constructor
 *
 * This binds the generic trait constructor to a reference to the provided
 * trait class list.
 *
 * @param  {Object}  tc    trait class list
 * @param  {Class}   base  target supertype
 *
 * @return  {function()}  trait constructor
 */
function createTctor( tc, base )
{
    return function( privsym )
    {
        return tctor.call( this, tc, base, privsym );
    };
}


function _tctorApply()
{
    this.___$$tctor$$.apply( this, arguments );
}


module.exports = Trait;

} )( module['Trait'] = {}, '.' );
/** class_final **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
/**
 * Wrapper permitting the definition of final classes
 *
 *  Copyright (C) 2010, 2011, 2013 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var Class = require( './class' );


/**
 * Creates a final class
 *
 * @return  {Function}  final class
 */
exports = module.exports = function()
{
    markFinal( arguments[ arguments.length - 1 ] );

    // forward everything to Class
    var result = Class.apply( this, arguments );

    if ( !Class.isClass( result ) )
    {
        finalOverride( result );
    }

    return result;
};


/**
 * Creates a final class from a class extend operation
 *
 * @return  {Function}  final class
 */
exports.extend = function()
{
    markFinal( arguments[ arguments.length - 1 ] );
    return Class.extend.apply( this, arguments );
};


/**
 * Causes a definition to be flagged as final
 *
 * @param  {!Arguments}  dfn  suspected definition object
 *
 * @return  {undefined}
 */
function markFinal( dfn )
{
    if ( typeof dfn === 'object' )
    {
        // mark as abstract
        dfn.___$$final$$ = true;
    }
}


/**
 * Overrides object members to permit final classes
 *
 * @param  {Object}  obj  object to override
 *
 * @return  {undefined}
 */
function finalOverride( obj )
{
    var extend = obj.extend;

    // wrap extend, applying the abstract flag
    obj.extend = function()
    {
        markFinal( arguments[ arguments.length - 1 ] );
        return extend.apply( this, arguments );
    };
}

} )( module['class_final'] = {}, '.' );
/** FallbackMemberBuilder **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
/**
 * Handles building members (properties, methods) in a pre-ES5 environment
 *
 *  Copyright (C) 2011, 2013 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Supertype
 */
var MemberBuilder = require( './MemberBuilder' );

/**
 * Responsible for building class members
 */
module.exports = exports = function FallbackMemberBuilder(
    wrap_method, wrap_override
)
{
    // permit omitting 'new' keyword
    if ( !( this instanceof module.exports ) )
    {
        return new module.exports( wrap_method, wrap_override );
    }

    // invoke parent constructor
    module.exports.prototype.constructor.call( this,
        wrap_method, wrap_override
    );
};

// inherit from MemberBuilder
module.exports.prototype   = new MemberBuilder();
module.exports.constructor = module.exports;


/**
 * Getters/setters are unsupported in a pre-ES5 environment
 *
 * Simply throw an exception, as it clearly represents that the developer did
 * not account for the possibility that their software may have been executed in
 * a pre-ES5 environment.
 */
exports.prototype.buildGetterSetter = function()
{
    throw Error( 'Getters/setters are unsupported in this environment' );
};
} )( module['FallbackMemberBuilder'] = {}, '.' );
/** util/Global **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = 'util';
/**
 * Global scope handling
 *
 *  Copyright (C) 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// retrieve global scope; works with ES5 strict mode
(0,eval)( 'var _the_global=this' );

// prototype to allow us to augment the global scope for our own purposes
// without polluting the global scope
function _G() {}
_G.prototype = _the_global;


/**
 * Provides access to and augmentation of global variables
 *
 * This provides a static method to consistently provide access to the
 * object representing the global scope, regardless of environment. Through
 * instantiation, its API permits augmenting a local object whose prototype
 * is the global scope, providing alternatives to variables that do not
 * exist.
 */
function Global()
{
    // allows omitting `new` keyword, consistent with ease.js style
    if ( !( this instanceof Global ) )
    {
        return new Global();
    }

    // do not pollute the global scope (previously, _the_global was used as
    // the prototype for a new object to take advantage of native overrides,
    // but unfortunately IE<=8 did not support this and always returned
    // undefined values from the prototype).
    this._alt = {};
}


/**
 * Provides consistent access to the global scope through all ECMAScript
 * versions, for any root variable name, and works with ES5 strict mode.
 *
 * As an example, Node.js exposes the variable `root` to represent global
 * scope, but browsers expose `window`. Further, ES5 strict mode will
 * provide an error when checking whether `typeof SomeGlobalVar ===
 * 'undefined'`.
 *
 * @return  {Object}  global object
 */
Global.expose = function()
{
    return _the_global;
};


Global.prototype = {
    /**
     * Provide a value for the provided global variable name if it is not
     * defined
     *
     * A function returning the value to assign to NAME should be provided,
     * ensuring that the alternative is never even evaluated unless it is
     * needed.
     *
     * The global scope will not be polluted with this alternative;
     * consequently, you must access the value using the `get` method.
     *
     * @param  {string}      name  global variable name
     * @param  {function()}  f     function returning value to assign
     *
     * @return  {Global}  self
     */
    provideAlt: function( name, f )
    {
        if ( ( _the_global[ name ] !== undefined )
            || ( this._alt[ name ] !== undefined )
        )
        {
            return;
        }

        this._alt[ name ] = f();
        return this;
    },


    /**
     * Retrieve global value or provided alternative
     *
     * This will take into account values provided via `provideAlt`; if no
     * alternative was provided, the request will be deleagated to the
     * global variable NAME, which may or may not be undefined.
     *
     * No error will be thrown if NAME is not globally defined.
     *
     * @param  {string}  name  global variable name
     *
     * @return  {*}  value associated with global variable NAME or
     *               its provided alternative
     */
    get: function( name )
    {
        return ( this._alt[ name ] !== undefined )
            ? this._alt[ name ]
            : _the_global[ name ];
    }
};

module.exports = Global;

} )( module['util/Global'] = {}, '.' );
/** util/Symbol **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = 'util';
/**
 * Forward-compatible subset of ES6 Symbol
 *
 *  Copyright (C) 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * This is *not* intended to be a complete implementation; it merely
 * performs what is needed for ease.js, preferring the benefits of the ES6
 * Symbol implementation while falling back to sane ES5 and ES3 options.
 */

// to be used if there is no global Symbol available
var FallbackSymbol = require( './symbol/FallbackSymbol' );

var _root = require( './Global' ).expose();
module.exports = _root.Symbol || FallbackSymbol;

} )( module['util/Symbol'] = {}, '.' );
/** util/symbol/FallbackSymbol **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = 'util/symbol';
/**
 * Forward-compatible subset of ES6 Symbol for pre-ES6 environments
 *
 *  Copyright (C) 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * This is *not* intended to be a complete implementation; it merely
 * performs what is needed for ease.js. In particular, this pre-ES6
 * implementation will simply generate a random string to be used as a key;
 * the caller is expected to add the key to the destination object as
 * non-enumerable, if supported by the environment.
 */

// ensures that, so long as these methods have not been overwritten by the
// time ease.js is loaded, we will maintain a proper reference
var _random = Math.random,
    _floor  = Math.floor;

// prefix used for all generated symbol strings (this string is highly
// unlikely to exist in practice); it will produce a string containing a
// non-printable ASCII character that is *not* the null byte
var _root = ' ' + String.fromCharCode(
    _floor( _random() * 10 ) % 31 + 1
) + '$';


/**
 * Generate a pseudo-random string (with a common prefix) to be used as an
 * object key
 *
 * The returned key is unique so long as Math.{random,floor} are reliable.
 * This will be true so long as (1) the runtime provides a reliable
 * implementation and (2) Math.{floor,random} have not been overwritten at
 * the time that this module is loaded. This module stores an internal
 * reference to this methods, so malicious code loaded after this module
 * will not be able to compromise the return value.
 *
 * Note that the returned string is not wholly random: a common prefix is
 * used to ensure that collisions with other keys on objects is highly
 * unlikely; you should not rely on this behavior, though, as it is an
 * implementation detail that may change in the future.
 *
 * @return  {string}  pseudo-random string with common prefix
 */
function FallbackSymbol()
{
    if ( !( this instanceof FallbackSymbol ) )
    {
        return new FallbackSymbol();
    }

    this.___$$id$$ = ( _root + _floor( _random() * 1e8 ) );
}


FallbackSymbol.prototype = {
    /**
     * Return random identifier
     *
     * This is convenient, as it allows us to both treat the symbol as an
     * object of type FallbackSymbol and use the symbol as a key (since
     * doing so will automatically call this method).
     *
     * @return  {string}  random identifier
     */
    toString: function()
    {
        return this.___$$id$$;
    }
};


module.exports = FallbackSymbol;

} )( module['util/symbol/FallbackSymbol'] = {}, '.' );
/** version **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
/**
 * Provides version information
 *
 *  Copyright (C) 2010, 2011, 2012, 2013, 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify it under the
 *  terms of the GNU General Public License as published by the Free Software
 *  Foundation, either version 3 of the License, or (at your option) any later
 *  version.
 *
 *  This program is distributed in the hope that it will be useful, but WITHOUT
 *  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 *  FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
 *  more details.
 *
 *  You should have received a copy of the GNU General Public License along with
 *  this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author  Mike Gerwitz
 */

var major  = 0,
    minor  = 2,
    rev    = 4,
    suffix = '',

    version = [ major, minor, rev, suffix ];

version.major  = major;
version.minor  = minor;
version.rev    = rev;
version.suffix = suffix;

version.toString = function()
{
    return this.join( '.' )
        .replace( /\.([^.]*)$/, '-$1' )
        .replace( /-$/, '' );
};

module.exports = version;
} )( module['version'] = {}, '.' );
/** warn/DismissiveHandler **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = 'warn';
/**
 * Dismissive warning handler
 *
 *  Copyright (C) 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * Warning handler that dismisses (ignores) all warnings
 *
 * This is useful in a production environment.
 */
function DismissiveHandler()
{
    if ( !( this instanceof DismissiveHandler ) )
    {
        return new DismissiveHandler();
    }
}


DismissiveHandler.prototype = {
    /**
     * Handle a warning
     *
     * @param   {Warning}   warning  warning to handle
     * @return  {undefined}
     */
    handle: function( warning )
    {
        // intentionally do nothing
    }
}

module.exports = DismissiveHandler;

} )( module['warn/DismissiveHandler'] = {}, '.' );
/** warn/LogHandler **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = 'warn';
/**
 * Logging warning handler
 *
 *  Copyright (C) 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * Warning handler that logs all warnings to a console
 *
 * @param  {Object}  console  console with a warn or log method
 */
function LogHandler( console )
{
    if ( !( this instanceof LogHandler ) )
    {
        return new LogHandler( console );
    }

    this._console = console || {};
}


LogHandler.prototype = {
    /**
     * Handle a warning
     *
     * Will attempt to log using console.warn(), falling back to
     * console.log() if necessary and aborting entirely if neither is
     * available.
     *
     * This is useful as a default option to bring problems to the
     * developer's attention without affecting the control flow of the
     * software.
     *
     * @param   {Warning}   warning  warning to handle
     * @return  {undefined}
     */
    handle: function( warning )
    {
        var dest = this._console.warn || this._console.log;
        dest && dest.call( this._console,
            'Warning: ' + warning.message
        );
    }
}

module.exports = LogHandler;

} )( module['warn/LogHandler'] = {}, '.' );
/** warn/ThrowHandler **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = 'warn';
/**
 * Throwing warning handler
 *
 *  Copyright (C) 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * Warning handler that throws all warnings as exceptions
 */
function ThrowHandler()
{
    if ( !( this instanceof ThrowHandler ) )
    {
        return new ThrowHandler();
    }
}


ThrowHandler.prototype = {
    /**
     * Handle a warning
     *
     * Throws the error associated with the warning.
     *
     * This handler is useful for development and will ensure that problems
     * are brought to the attention of the developer.
     *
     * @param   {Warning}   warning  warning to handle
     * @return  {undefined}
     */
    handle: function( warning )
    {
        throw warning.getError();
    }
}

module.exports = ThrowHandler;

} )( module['warn/ThrowHandler'] = {}, '.' );
/** warn/Warning **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = 'warn';
/**
 * Warning prototype
 *
 *  Copyright (C) 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * Permits wrapping an exception as a warning
 *
 * Warnings are handled differently by the system, depending on the warning
 * level that has been set.
 *
 * @param {Error} e exception (error) to wrap
 *
 * @return {Warning} new warning instance
 *
 * @constructor
 */
function Warning( e )
{
    // allow instantiation without use of 'new' keyword
    if ( !( this instanceof Warning ) )
    {
        return new Warning( e );
    }

    // ensure we're wrapping an exception
    if ( !( e instanceof Error ) )
    {
        throw TypeError( "Must provide exception to wrap" );
    }

    Error.prototype.constructor.call( this, e.message );

    // copy over the message for convenience
    this.message = e.message;
    this.name    = 'Warning';
    this._error  = e;

    this.stack = e.stack &&
        e.stack.replace( /^.*?\n+/,
            this.name + ': ' + this.message + "\n"
        );
};

// ensures the closest compatibility...just be careful not to modify Warning's
// prototype
Warning.prototype = Error();
Warning.prototype.constructor = Warning;
Warning.prototype.name = 'Warning';


/**
 * Return the error wrapped by the warning
 *
 * @return {Error} wrapped error
 */
Warning.prototype.getError = function()
{
    return this._error;
};


module.exports = Warning;

} )( module['warn/Warning'] = {}, '.' );

    // the following should match the exports of /index.js
    ns_exports.Class         = module['class'].exports;
    ns_exports.AbstractClass = module['class_abstract'].exports;
    ns_exports.FinalClass    = module['class_final'].exports;
    ns_exports.Interface     = module['interface'].exports;
    ns_exports.Trait         = module['Trait'].exports;
    ns_exports.version       = module['version'].exports;
} )( easejs, '.' );

