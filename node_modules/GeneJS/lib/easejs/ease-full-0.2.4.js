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

module.common = module['test/common'] = { exports: {
    require: function ( id )
    {
        return require( id );
    },

    testCase: function()
    {
        return require( '/test/inc-testcase' ).apply( this, arguments );
    }
} };


function failAssertion( err )
{
    throw Error( 'Assertion failed: ' + ( err || '(no failure message)' ) );
}


/**
 * Bare-bones implementation of node.js assert module
 *
 * This contains only the used assertions
 */
module.assert = { exports: {
    equal: function ( val, cmp, err )
    {
        if ( val != cmp )
        {
            failAssertion( err );
        }
    },


    strictEqual: function( val, cmp, err )
    {
        if ( val !== cmp )
        {
            failAssertion( err );
        }
    },


    notStrictEqual: function( val, cmp, err )
    {
        if ( val === cmp )
        {
            failAssertion( err );
        }
    },


    notEqual: function ( val, cmp, err )
    {
        if ( val === cmp )
        {
            failAssertion( err );
        }
    },


    // dumbed down impl which works for what we use
    deepEqual: function ( val, cmp, err )
    {
        if ( val == cmp )
        {
            return;
        }

        if ( ( cmp instanceof Array ) && ( val instanceof Array ) )
        {
            var i   = 0,
                len = cmp.length;

            for ( ; i < len; i++ )
            {
                // recurse
                module.assert.exports.deepEqual( val[ i ], cmp[ i ], err );
            }

            return;
        }
        else if ( ( typeof cmp === 'object' ) && ( typeof val === 'object' ) )
        {
            for ( var i in cmp )
            {
                // recurse
                module.assert.exports.deepEqual( val[ i ], cmp[ i ], err );
            }

            return;
        }

        failAssertion( err );
    },


    ok: function ( result, err )
    {
        if ( !result )
        {
            failAssertion( err );
        }
    },


    fail: function ( err )
    {
        failAssertion( err );
    },


    'throws': function ( test, expected, err )
    {
        expected = expected || Error;

        try
        {
            test();
        }
        catch ( e )
        {
            if ( !( e instanceof expected ) )
            {
                failAssertion( err );
            }
        }
    },


    doesNotThrow: function ( test, not_expected, err )
    {
        not_expected = not_expected || Error;

        try
        {
            test();
        }
        catch ( e )
        {
            if ( e instanceof not_expected )
            {
                failAssertion( err );
            }
        }
    }
} };

/** TEST CASES **/
ns_exports.runTests = function()
{
/** TEST CASE: inc-testcase.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/inc-testcase...<br />' )
/**
 * Simple X-Unit-style test cases
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

var assert         = require( 'assert' ),
    assert_wrapped = {},
    acount         = 0,
    icount         = 0,
    scount         = 0,
    skpcount       = 0,
    tcount         = 0,

    // when set to true, final statistics will be buffered until suite ends
    suite    = false,
    failures = [],

    // dummy object to be thrown for test skipping
    SkipTest = { skip: true },

    common_require = require( __dirname + '/common' ).require
;


// wrap each of the assertions so that we can keep track of the number of times
// that they were invoked
for ( var f in assert )
{
    var _assert_cur = assert[ f ];

    if ( typeof _assert_cur !== 'function' )
    {
        continue;
    }

    // wrap the assertion to keep count
    assert_wrapped[ f ] = ( function( a )
    {
        return function()
        {
            incAssertCount();
            a.apply( this, arguments );
        };
    } )( _assert_cur );
}


function incAssertCount()
{
    acount++;
};


/**
 * Defines and runs a test case
 *
 * This is a very basic system that provides a more familiar jUnit/phpUnit-style
 * output for xUnit tests and allows all tests in the case to be run in the
 * event of a test failure.
 *
 * The test name should be given as the key and the test itself as a function as
 * the value. The test will be invoked within the context of the assertion
 * module.
 *
 * This will be evolving throughout the life of the project. Mainly, it cannot
 * be run as part of a suite without multiple summary outputs.
 *
 * @param  {string|Object.<string,function()>}  SUT module path; or object
 *                                              containing tests
 *
 * @param  {Object.<string,function()>=}  object containing tests, if first
 *                                        argument is provided
 *
 * @return  {undefined}
 */
module.exports = function( _, __ )
{
    var args      = Array.prototype.slice.call( arguments ),
        test_case = args.pop(),
        sutpath   = args.pop();

    var context  = prepareCaseContext(),
        setUp    = test_case.setUp;

    // automatically include SUT if its module path was provided
    if ( sutpath )
    {
        context.Sut = common_require( sutpath );
    }

    // if we're not running a suite, clear out the failures
    if ( !( suite ) )
    {
        init();
    }

    // perform case-wide setup
    test_case.caseSetUp && test_case.caseSetUp.call( context );

    // remove unneeded methods so we don't invoke them as tests below
    delete test_case.caseSetUp;
    delete test_case.setUp;

    // run each test in the case
    for ( var test in test_case )
    {
        var data   = test.match( /^(?:@(.*?)\((.*?)\))?(.*)$/ ),
            method = data[ 1 ],
            prop   = data[ 2 ],
            name   = data[ 3 ],
            count  = 1,
            args   = [ [] ]
        ;

        if ( method === 'each' )
        {
            if ( !( context[ prop ] ) )
            {
                throw Error( "Unknown @each context: " + prop );
            }

            count = context[ prop ].length;
            args  = [];

            for ( var i = 0; i < count; i++ )
            {
                args.push( [ context[ prop ][ i ] ] );
            }
        }
        else if ( method )
        {
            throw Error( "Unknown test method: " + method );
        }


        // perform the appropriate number of tests
        for ( var i = 0; i < count; i++ )
        {
            tryTest(
                test_case,
                test,
                ( setUp || null ),
                name + ( ( count > 1 )
                    ? ( ' (' + i + ')' )
                    : ''
                ),
                context,
                args[ i ]
            );

            // output a newline and the count every 60 tests
            ( tcount % 60 ) || testPrint( " " + tcount + "\n" );
        }
    }

    // only output statistics if we're not running a suite (otherwise they'll be
    // output at the end of the suite)
    if ( !( suite ) )
    {
        endStats();
    }
};


/**
 * Attempt a test
 *
 * @param  {Object}    test_case  object containing all test cases
 * @param  {string}    test       complete key of test to run
 * @param  {Function}  setUp      test setup method, or null
 * @param  {string}    test_str   text to use on failure
 * @param  {Object}    context    context to bind to test function
 * @param  {Array}     args       arguments to pass to test function
 *
 * @return {undefined}
 */
function tryTest( test_case, test, setUp, test_str, context, args )
{
    var acount_last = acount;

    try
    {
        // xUnit-style setup
        if ( setUp )
        {
            setUp.call( context );
        }

        test_case[ test ].apply( context, args );

        // if there were no assertions, then the test should be marked as
        // incomplete
        if ( acount_last === acount )
        {
            testPrint( 'I' );
            icount++;
        }
        else
        {
            scount++;
            testPrint( '.' );
        }
    }
    catch ( e )
    {
        if ( e === SkipTest )
        {
            testPrint( 'S' );
            skpcount++;
        }
        else
        {
            testPrint( 'F' );
            failures.push( [ test_str, e ] );
        }
    }

    tcount++;
}


/**
 * Reset counters
 */
function init()
{
    failures = [];
    scount   = acount = icount = skpcount = 0;
}


/**
 * Display end stats (failures, counts)
 */
function endStats()
{
    testPrint( "\n" );
    if ( tcount % 60 !== 0 )
    {
        testPrint( "\n" );
    }

    if ( failures.length )
    {
        outputTestFailures( failures );
    }

    // print test case summary
    testPrint(
        ( ( failures.length ) ? "FAILED" : "OK" ) + " - " +
        scount + " successful, " + failures.length + " failure(s), " +
        ( ( icount > 0 ) ? icount + ' incomplete, ' : '' ) +
        ( ( skpcount > 0 ) ? skpcount + ' skipped, ' : '' ) +
        ( scount + icount + skpcount + failures.length ) + " total " +
        '(' + acount + " assertion" + ( ( acount !== 1 ) ? 's' : '' ) + ")\n"
    );

    // exit with non-zero status to indicate failure
    failures.length
        && typeof process !== 'undefined'
        && process.exit( 1 );
}


/**
 * Start test suite, deferring summary stats until call to endSuite()
 */
module.exports.startSuite = function()
{
    init();
    suite = true;
};


/**
 * Ens test suite, display stats buffered since startSuite()
 */
module.exports.endSuite = function()
{
    suite = false;
    endStats();
};


function getMock( proto )
{
    var P    = common_require( proto ),
        Mock = function() {},

        proto = Mock.prototype = new P()
    ;

    for ( var i in proto )
    {
        // only mock out methods
        if ( typeof proto[ i ] !== 'function' )
        {
            continue;
        }

        // clear the method
        proto[ i ] = function() {};
    }

    return new Mock();
}


function skipTest()
{
    throw SkipTest;
}


/**
 * Prepare assertion methods on context
 *
 * @return  {Object}  context
 */
function prepareCaseContext()
{
    return {
        require: common_require,

        fail:                 assert_wrapped.fail,
        assertOk:             assert_wrapped.ok,
        assertEqual:          assert_wrapped.equal,
        assertNotEqual:       assert_wrapped.notEqual,
        assertDeepEqual:      assert_wrapped.deepEqual,
        assertStrictEqual:    assert_wrapped.strictEqual,
        assertNotStrictEqual: assert_wrapped.notStrictEqual,
        assertThrows:         assert_wrapped['throws'],
        assertDoesNotThrow:   assert_wrapped.doesNotThrow,
        assertIfError:        assert_wrapped.ifError,
        incAssertCount:       incAssertCount,

        getMock: getMock,
        skip:    skipTest
    };
}


/**
 * Outputs test failures and their stack traces
 *
 * @param  {Array}  failures
 *
 * @return  {undefined}
 */
function outputTestFailures( failures )
{
    var i, cur, name, e;

    // if we don't have stdout access, throw an error containing each of the
    // error strings
    if ( typeof process === 'undefined' )
    {
        var err = '',
            i   = failures.length;

        for ( var i in failures )
        {
            var failure = failures[ i ];

            err += failure[ 0 ] +
                ' (' + ( failure[ 1 ].message || 'no message' ) + ')' +
                ( ( failure[ 1 ].stack )
                    ? ( '<br />' +
                        failure[ 1 ].stack.replace( /\n/g, '<br />' ) +
                        '<br />'
                    )
                    : '; '
                )
        }

        throw Error( err );
    }

    for ( var i = 0; i < failures.length; i++ )
    {
        cur = failures[ i ];

        name = cur[ 0 ];
        e    = cur[ 1 ];  // ideally Error, but may not be

        // output the name followed by the stack trace
        testPrint(
            '#' + i + ' ' + name + '\n'
            + ( e.stack || e ) + "\n\n"
        );
    }
}


/**
 * Outputs a string if stdout is available (node.js)
 *
 * @param  {string}  str  string to output
 *
 * @return  {undefined}
 */
var testPrint = ( ( typeof process === 'undefined' )
    || ( typeof process.stdout === 'undefined' ) )
        ? function() {}
        : function( str )
        {
            process.stdout.write( str );
        };

} )( module['test/inc-testcase'] = {}, 'test' );
/** TEST CASE: MemberBuilder/inc-common.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/MemberBuilder/inc-common...<br />' )
/**
 * Shared functions for MemberBuilder tests
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
 * Perform common assertions on validator arguments
 *
 * @param {Object}     testcase   test case being executed
 * @param {arguments}  args       arguments to check
 * @param {string}     name       member name
 * @param {*}          value      expected value
 * @param {Object}     keywords   expected keywords
 * @param {Object}     state      validation state
 * @param {function()} prevLookup function to look up prev member data
 *
 * @return {undefined}
 */
exports.testArgs = function(
    testcase, args, name, value, keywords, state, prevLookup
)
{
    var prev = {
        value:    { expected: null, given: args[ 3 ] },
        keywords: { expected: null, given: args[ 4 ] }
    };

    prev = prevLookup( prev, prev.value.given, prev.keywords.given );

    testcase.assertEqual( name, args[ 0 ],
        "Incorrect name passed to validator"
    );

    testcase.assertDeepEqual( value, args[ 1 ],
        "Incorrect value passed to validator"
    );

    testcase.assertStrictEqual( keywords, args[ 2 ],
        "Incorrect keywords passed to validator"
    );

    testcase.assertStrictEqual( prev.value.expected, prev.value.given,
        "Previous data should contain prev value if overriding, " +
        "otherwise null"
    );

    testcase.assertDeepEqual( prev.keywords.expected, prev.keywords.given,
        "Previous keywords should contain prev keyword if " +
        "overriding, otherwise null"
    );

    testcase.assertStrictEqual( state, args[ 5 ],
        "State object was not passed to validator"
    );
};
} )( module['test/MemberBuilder/inc-common'] = {}, 'test/MemberBuilder' );
/** TEST CASE: MemberBuilderValidator/inc-common.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/MemberBuilderValidator/inc-common...<br />' )
/**
 * Shared functions for MemberBuilderValidator tests
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
 * Member name to be used in tests
 * @type {string}
 */
exports.testName = 'fooBar';


/**
 * Quickly tests for validation failures
 *
 * The following will be ensured by this assertion:
 *  - An exception must be thrown
 *  - The exception message must contain the name of the member
 *  - The exception message must contain the identifier string
 *
 * @param {string} name       name expected in error string
 * @param {string} identifier string to match in error message
 *
 * @param {function()} action function to invoke for test
 *
 * @return {undefined}
 */
exports.quickFailureTest = function( name, identifier, action )
{
    var _self = this;

    _self.incAssertCount();

    try
    {
        action();
    }
    catch ( e )
    {
        // using the identifier, ensure the error string makes sense
        _self.assertOk( ( e.message.search( identifier ) !== -1 ),
            "Incorrect error; expected identifier '" + identifier +
            "', but received: " + e.message
        );

        // to aid in debugging, the error message should contain the
        // name of the method
        _self.assertOk( ( e.message.search( name ) !== -1 ),
            'Error message should contain member name'
        );

        return;
    }

    _self.fail( false, true, "Expected failure" );
};


/**
 * Tests to ensure that a member with the given keywords fails validation with
 * an error message partially matching the provided identifier
 *
 * To test overrides, specify keywords for 'prev'. To test for success instead
 * of failure, set identifier to null.
 */
exports.quickKeywordTest = function(
    type, keywords, identifier, prev, prev_data
)
{
    var keyword_obj = {},
        prev_obj    = {},
        prev_data   = prev_data || {},
        name        = exports.testName,
        state       = {},
        _self       = this;

    // convert our convenient array into a keyword obj
    for ( var i = 0, len = keywords.length; i < len; i++ )
    {
        keyword_obj[ keywords[ i ] ] = true;
    }

    // if prev keywords were given, do the same thing with those to
    // generate our keyword obj
    if ( prev !== undefined )
    {
        for ( var i = 0, len = prev.length; i < len; i++ )
        {
            prev_obj[ prev[ i ] ] = true;
        }

        // define a dummy previous method value
        prev_data.member = function() {};
    }

    var testfunc = function()
    {
        // proxies use strings, while all others use functions
        var val = ( keyword_obj[ 'proxy' ] ) ? 'proxyDest': function() {};

        _self.sut[ type ](
            name, val, keyword_obj, prev_data, prev_obj, state
        );
    };

    if ( identifier )
    {
        this.quickFailureTest.call( this, name, identifier, testfunc );
    }
    else
    {
        this.assertDoesNotThrow( testfunc );
    }

    this.sut.end( state );
};


/**
 * Passes test visibility levels [ x1, x2 ] to test method T to ensure that test
 * T will pass when x2 is used to override a member declared using x1
 *
 * @param {function(function())} test test function
 *
 * @return {undefined}
 */
exports.visEscalationTest = function( test )
{
    // note: private/private is intentionally omitted; see private naming
    // conflict test
    var tests = [
        [ 'protected', 'public'    ],
        [ 'public',    'public'    ],
        [ 'protected', 'protected' ]
    ];

    for ( var i = 0, len = tests.length; i < len; i++ )
    {
        var cur = tests[ i ];
        test( cur );
    }
};


exports.privateNamingConflictTest = function( test )
{
    var tests = [
        [ 'private', 'private'   ],
        [ 'private', 'protected' ],
        [ 'private',' public'    ]
    ];

    var i = tests.length;
    while ( i-- )
    {
        test( tests[ i ] );
    }
};


/**
 * Performs a simple visibility change test using access modifiers
 *
 * Important: invoke within the context of the test case.
 *
 * @param  {string}  start     start keyword
 * @param  {string}  override  overriding keyword
 * @param  {bool}    failtest  whether the assertion should test for failure
 *
 * @param  {function()}  func  test function
 *
 * @param  {string}  failstr  string to check for in failure string
 *
 * @return  {undefined}
 */
exports.quickVisChangeTest = function(
    start, override, failtest, func, failstr
)
{
    var _self = this,
        name  = 'foo',

        startobj    = {},
        overrideobj = {}
    ;

    startobj[ start ]       = true;
    overrideobj[ override ] = true;

    var testfun = function()
    {
        func( name, startobj, overrideobj );
    };

    if ( failtest )
    {
        this.quickFailureTest.call( this,
            name, ( failstr || 'de-escalate' ), testfun
        );
    }
    else
    {
        this.assertDoesNotThrow( testfun, Error );
    }
};

} )( module['test/MemberBuilderValidator/inc-common'] = {}, 'test/MemberBuilderValidator' );
/** TEST CASE: Class/AbstractTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Class/AbstractTest...<br />' )
/**
 * Tests abstract classes
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut   = this.require( 'class_abstract' );
        this.Class = this.require( 'class' );
    },


    /**
     * In order to ensure that the code documents itself, we should require
     * that all classes containing abstract members must themselves be
     * declared as abstract.  Otherwise, you are at the mercy of the
     * developer's documentation/comments to know whether or not the class
     * is indeed abstract without looking through its definition.
     */
    'Must declare classes with abstract members as abstract': function()
    {
        try
        {
            // should fail; class not declared as abstract
            this.Class( 'Foo',
            {
                'abstract foo': []
            } );
        }
        catch ( e )
        {
            this.assertOk(
                e.message.search( 'Foo' ) !== -1,
                "Abstract class declaration error should contain class name"
            );

            return;
        }

        this.assertFail(
            "Should not be able to declare abstract members unless " +
                "class is also declared as abstract"
        );
    },


    /**
     * Abstract members should be permitted if the class itself is declared
     * as abstract; converse of above test.
     */
    'Can declare class as abstract': function()
    {
        var Sut = this.Sut;
        this.assertDoesNotThrow( function()
        {
            Sut(
            {
                'abstract foo': []
            } );
        }, Error );
    },


    /**
     * If a class is declared as abstract, it should contain at least one
     * abstract method. Otherwise, the abstract definition is pointless and
     * unnecessarily confusing---the whole point of the declaration is
     * to produce self-documenting code.
     */
    'Abstract classes must contain abstract methods': function()
    {
        try
        {
            // should fail; class not declared as abstract
            this.Sut( 'Foo', {} );
        }
        catch ( e )
        {
            this.assertOk(
                e.message.search( 'Foo' ) !== -1,
                "Abstract class declaration error should contain class name"
            );

            return;
        }

        this.assertFail(
            "Abstract classes should contain at least one abstract method"
        );
    },


    /**
     * Abstract methods should remain virtual until they are defined.
     * That is, if a subtype doesn't provide a concrete implementation, it
     * should still be considered virtual.
     */
    'Abstract methods can be defined concretely by sub-subtypes': function()
    {
        var AbstractFoo = this.Sut( 'Foo',
            {
                'abstract foo': []
            } ),

            SubAbstractFoo = this.Sut.extend( AbstractFoo, {} );

        var Class = this.Class;
        this.assertDoesNotThrow( function()
        {
            Class.extend( SubAbstractFoo,
            {
                // we should NOT need the override keyword for concrete
                // implementations of abstract super methods
                'foo': function() {}
            } )
        }, Error );
    },


    /**
     * Just as Class contains an extend method, so should AbstractClass.
     */
    'Abstract class extend method returns new class': function()
    {
        this.assertEqual( typeof this.Sut.extend, 'function',
            "AbstractClass contains extend method"
        );

        this.assertOk(
            this.Class.isClass(
                this.Sut.extend( { 'abstract foo': [] } )
            ),
            "Abstract class extend method returns class"
        );
    },


    /**
     * Just as Class contains an implement method, so should AbstractClass.
     * We test implementation further on in this test case.
     */
    'Abstract class contains implement method': function()
    {
        this.assertEqual( typeof this.Sut.implement, 'function',
            "AbstractClass contains implement method"
        );
    },


    /**
     * All classes should have a method to determine if they are abstract.
     * We test specific cases below.
     */
    'All classes have an isAbstract() method': function()
    {
        this.assertEqual(
            typeof ( this.Class( {} ).isAbstract ),
            'function'
        );
    },


    /**
     * For this test, note that (as was tested above) a class containing
     * abstract members must be declared as abstract; therefore, this test
     * extends to assert that classes with no abstract methods are not
     * considered to be abstract.
     */
    'Concrete classes are not considered to be abstract': function()
    {
        this.assertOk( !( this.Class( {} ).isAbstract() ) );
    },


    /**
     * In the same spirit as the preceding test, this extends to asserting
     * that a class containing abstract methods must be considered to be
     * abstract.
     */
    'Abstract classes are considered to be abstract': function()
    {
        this.assertOk(
            this.Sut( { 'abstract method': [] } ).isAbstract()
        );
    },


    /**
     * In the spirit of the aforementioned, subtypes that do not provide
     * concrete definitions for *all* abstract methods of their supertype
     * must too be considered to be abstract.
     */
    'Subtypes are abstract if no concrete method is provided': function()
    {
        var Base = this.Sut(
        {
            'abstract foo': [],
            'abstract bar': []
        } );

        this.assertOk(
            this.Sut.extend( Base,
            {
                // only provide concrete impl. for a single method; `bar' is
                // still abstract
                foo: function() {}
            } ).isAbstract()
        );
    },


    /**
     * Ensure that a subtype is not considered to be abstract if it provides
     * concrete definitions of each of its supertype's abstract methods.
     */
    'Subtypes are not considered abstract if concrete methods are provided':
    function()
    {
        var Base = this.Sut(
        {
            'abstract foo': [],
            'abstract bar': []
        } );

        this.assertOk(
            this.Class.extend( Base,
            {
                // provide concrete impls. for both
                foo: function() {},
                bar: function() {}
            } ).isAbstract() === false
        );
    },


    /**
     * Since an abstract class does not provide a complete object
     * description, it cannot be instantiated.
     */
    'Abstract classes cannot be instantiated': function()
    {
        var Sut = this.Sut;
        this.assertThrows( function()
        {
            Sut( { 'abstract foo': [] } )();
        }, Error );
    },


    /**
     * However, a concrete subtype of an abstract class may be instantiated.
     * Otherwise abstract classes would be pretty useless.
     */
    'Concrete subtypes of abstract classes can be instantiated': function()
    {
        var Sut = this.Sut;
        this.assertDoesNotThrow( function()
        {
            Sut( { 'abstract foo': [] } )
                .extend( { foo: function() {} } )
                ();
        }, Error );
    },


    /**
     * Even though an abstract class itself cannot be instantiated, its
     * constructor may still be inherited (and therefore invoked) through
     * concrete subtypes.
     */
    'Can call constructors of abstract supertypes': function()
    {
        var ctor_called = false;
        this.Sut(
        {
            __construct: function() { ctor_called = true; },
            'abstract foo': []
        } ).extend( { foo: function() {} } )();

        this.assertOk( ctor_called );
    },


    /**
     * Abstract methods declare an API strictly for the purpose of ensuring
     * that subtypes are all compatible with respect to that particular
     * field; parameter count, therefore, should be enforced to point out
     * potential bugs to developers. Whether or not the subtype makes use of
     * a particular argument is a separate and unrelated issue.
     */
    'Concrete methods must implement the proper number of parameters':
    function()
    {
        var Sut = this.Sut;
        this.assertThrows( function()
        {
            // concrete implementation missing parameter `two'
            Sut( { 'abstract foo': [ 'one', 'two' ] } )
                .extend( { foo: function( one ) {} } );
        }, Error );
    },


    /**
     * It may be the case that a subtype wishes to provide a new definition
     * for a particular abstract method---without providing a concrete
     * implementation---to add additional parameters. However, to remain
     * compatible with the supertype, that implementation must provide at
     * least the same number of arguments as the respective method of the
     * supertype.
     *
     * This tests the error condition; see below for the complement.
     */
    'Abstract methods of subtypes must declare compatible parameter count':
    function()
    {
        var Sut = this.Sut;
        this.assertThrows( function()
        {
            Sut.extend( Sut( { 'abstract foo': [ 'one' ] } ),
            {
                // incorrect number of arguments
                'abstract foo': []
            } );
        }, TypeError );
    },


    /**
     * Complements the above test to ensure that compatible abstract
     * overrides are permitted.
     */
    'Abstract members may implement more parameters than supertype':
    function()
    {
        var Sut = this.Sut;
        this.assertDoesNotThrow( function()
        {
            Sut.extend( Sut( { 'abstract foo': [ 'one' ] } ),
            {
                // one greater
                'abstract foo': [ 'one', 'two' ]
            } );
        }, Error );
    },


    /**
     * While this may not necessarily be sensical in all situations, it may
     * be useful for documentation.
     */
    'Abstract members may implement equal parameters to supertype':
    function()
    {
        var Sut = this.Sut;
        this.assertDoesNotThrow( function()
        {
            Sut.extend( Sut( { 'abstract foo': [ 'one' ] } ),
            {
                // same number
                'abstract foo': [ 'one' ]
            } );
        }, Error );
    },


    /**
     * This test just ensures consistency by ensuring that an empty
     * parameter definition for abstract methods imposes no parameter count
     * requirement on its concrete definition.
     */
    'Concrete methods have no parameter requirement with empty definition':
    function()
    {
        var Sut = this.Sut;
        this.assertDoesNotThrow( function()
        {
            Sut( { 'abstract foo': [] } ).extend(
            {
                foo: function() {}
            } );
        }, Error );
    },


    /**
     * An abstract method is represented by an array listing its parameters
     * (that must be implemented by concrete definitions).
     */
    'Abstract methods must be declared as arrays': function()
    {
        var Class = this.Class;

        this.assertThrows( function()
        {
            // likely demonstrates misunderstanding of the syntax
            Class.extend( { 'abstract foo': function() {} } );
        }, TypeError, "Abstract method cannot be declared as a function" );

        this.assertThrows( function()
        {
            // might be common mistake for attempting to denote a single
            // parameter; pure speculation.
            Class.extend( { 'abstract foo': 'scalar' } );
        }, TypeError, "Abstract method cannot be declared as a scalar" );
    },


    /**
     * There was an issue where the object holding the abstract methods list
     * was not checking for methods by using hasOwnProperty(). Therefore, if
     * a method such as toString() was defined, it would be matched in the
     * abstract methods list. As such, the abstract methods count would be
     * decreased, even though it was not an abstract method to begin with
     * (nor was it removed from the list, because it was never defined in
     * the first place outside of the prototype).
     *
     * This negative number !== 0, which causes a problem when checking to
     * ensure that there are 0 abstract methods. We check explicitly for 0
     * because, if it's non-zero, then it's either abstract or something is
     * wrong. Negative is especially wrong. It should never be negative!
     */
    'Does not recognize object prototype members as abstract': function()
    {
        var Sut = this.Sut;
        this.assertDoesNotThrow( function()
        {
            Sut( { 'abstract method': [] } ).extend(
            {
                // concrete, so the result would otherwise not be abstract
                method: function() {},

                // the problem---this exists in the prototype chain of every
                // object
                'toString': function() {}
            })();
        }, Error );
    },


    /**
     * Ensure we support named abstract class extending
     */
    'Can create named abstract subtypes': function()
    {
        this.assertOk(
            this.Sut( 'Named' ).extend(
                this.Sut( { 'abstract foo': [] } ),
                {}
            ).isAbstract()
        );
    },


    /**
     * Abstract classes, when extended, should yield a concrete class by
     * default. Otherwise, the user should once again use AbstractClass to
     * clearly state that the subtype is abstract. Remember:
     * self-documenting.
     */
    'Calling extend() on abstract class yields concrete class': function()
    {
        var Foo        = this.Sut( { 'abstract foo': [] } ),
            cls_named  = this.Sut( 'NamedSubFoo' ).extend( Foo, {} ),
            cls_anon   = this.Sut.extend( Foo, {} );

        var Class = this.Class;

        // named
        this.assertThrows(
            function()
            {
                // should throw an error, since we're not declaring it as
                // abstract and we're not providing a concrete impl
                Class.isAbstract( cls_named.extend( {} ) );
            },
            TypeError,
            "Extending named abstract classes should be concrete"
        );

        // anonymous
        this.assertThrows(
            function()
            {
                // should throw an error, since we're not declaring it as abstract
                // and we're not providing a concrete impl
                Class.isAbstract( cls_anon.extend( {} ) );
            },
            TypeError,
            "Extending anonymous abstract classes should be concrete"
        );
    },


    /**
     * Extending an abstract class after an implement() should still result
     * in an abstract class. Essentially, we are testing to ensure that the
     * extend() method is properly wrapped to flag the resulting class as
     * abstract. This was a bug.
     */
    'Implementing interfaces will preserve abstract class definition':
    function()
    {
        var Sut       = this.Sut,
            Interface = this.require( 'interface' );

        this.assertOk(
            // if not considered abstract, extend() will fail, as it will
            // contain abstract member foo
            Sut( 'TestImplExtend' )
                .implement( Interface( { foo: [] } ) )
                .extend( {} )
                .isAbstract()
        );
    }
} );
} )( module['test/Class/AbstractTest'] = {}, 'test/Class' );
/** TEST CASE: ClassBuilder/ConstTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/ClassBuilder/ConstTest...<br />' )
/**
 * Tests const keyword
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut =  this.require( 'ClassBuilder' );
        this.MethodWrapperFactory = this.require( 'MethodWrapperFactory' );

        this.wrappers = this.require( 'MethodWrappers' ).standard;
    },


    setUp: function()
    {
        // XXX: get rid of this disgusting mess; we're mid-refactor and all
        // these dependencies should not be necessary for testing
        this.builder = this.Sut(
            this.require( 'warn' ).DismissiveHandler(),
            this.require( 'MemberBuilder' )(
                this.MethodWrapperFactory( this.wrappers.wrapNew ),
                this.MethodWrapperFactory( this.wrappers.wrapOverride ),
                this.MethodWrapperFactory( this.wrappers.wrapProxy ),
                this.getMock( 'MemberBuilderValidator' )
            ),
            this.require( 'VisibilityObjectFactoryFactory' )
                .fromEnvironment()
        )
    },


    /** The const keyword should result in a static property. The rationale for
     * this is that, if a value is constant, then instances do not make sense.
     */
    'const keyword declares properties as static': function()
    {
        var val = 'baz',
            Foo = this.builder.build(
            {
                'const foo': val
            } )
        ;

        this.assertEqual( val, Foo.$('foo'),
            "Const keyword should declare properties as static"
        );
    },


    /**
     * As the name implies, constant properties should not be writable.
     */
    'const keyword creates immutable property': function()
    {
        try
        {
            // this should fail (trying to alter const prop foo)
            this.builder.build( { 'const foo': 'bar'  } ).$( 'foo', 'baz' );
        }
        catch ( e )
        {
            this.assertOk(
                e.message.search( 'foo' ) !== -1,
                "Const modification error should contain name of property"
            );

            return;
        }

        this.fail( "Constant properties should not be writable" );
    },


    /**
     * Unlike other languages such as PHP, the const keyword can have different
     * levels of visibility.
     */
    'Access modifiers are permitted with const keyword': function()
    {
        var protval = 'bar',
            privval = 'baz',

            Foo = this.builder.build(
            {
                'protected const prot': protval,
                'private   const priv': privval,

                'public static getProt': function()
                {
                    return this.$('prot');
                },

                'public static getPriv': function()
                {
                    return this.$('priv');
                }
            } ),

            // be sure to override each method to ensure we're checking
            // references on the subtype, *not* the parent type
            SubFoo = this.builder.build( Foo,
            {
                'public static getProt': function()
                {
                    return this.$('prot');
                },

                'public static getPriv': function()
                {
                    return this.$('priv');
                }
            } )
        ;

        this.assertEqual( Foo.$('prot'), undefined,
            "Protected constants are not available publicly"
        );

        this.assertEqual( Foo.$('priv'), undefined,
            "Private constants are not available publicly"
        );

        this.assertEqual( Foo.getProt(), protval,
            "Protected constants are available internally"
        );

        this.assertEqual( Foo.getPriv(), privval,
            "Private constants are available internally"
        );

        this.assertEqual( SubFoo.getProt(), protval,
            "Protected constants are available to subtypes internally"
        );

        this.assertEqual( SubFoo.getPriv(), undefined,
            "Private constants are NOT available to subtypes internally"
        );
    }
} );

} )( module['test/ClassBuilder/ConstTest'] = {}, 'test/ClassBuilder' );
/** TEST CASE: ClassBuilder/FinalTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/ClassBuilder/FinalTest...<br />' )
/**
 * Tests final members
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


require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Class      = this.require( 'class' );
        this.FinalClass = this.require( 'class_final' );
    },


    /**
     * Ensure that FinalClass properly forwards data to create a new Class.
     */
    'Final classes are valid classes': function()
    {
        this.assertOk( this.Class.isClass( this.FinalClass( {} ) ),
            "Final classes should generate valid classes"
        );
    },


    /**
     * When a class is declared as final, it should prevent it from ever
     * being extended. Ever.
     */
    'Final classes cannot be extended': function()
    {
        try
        {
            // this should fail
            this.FinalClass( 'Foo', {} ).extend( {} );
        }
        catch ( e )
        {
            this.assertOk(
                e.message.search( 'Foo' ) !== -1,
                "Final class error message should contain name of class"
            );

            return;
        }

        this.assertFail( "Should not be able to extend final classes" );
    },


    /**
     * Ensure we're able to create final classes by extending existing
     * classes.
     */
    'Can create final subtypes': function()
    {
        // XXX: clean up this mess.
        var builder = this.require( 'ClassBuilder' )(
            this.require( 'warn' ).DismissiveHandler(),
            this.require( 'MemberBuilder' )(),
            this.require( 'VisibilityObjectFactoryFactory' )
                .fromEnvironment()
        );

        var Foo        = builder.build( {} ),
            FinalNamed = this.FinalClass( 'FinalNamed' ).extend( Foo, {} ),
            FinalAnon  = this.FinalClass.extend( Foo, {} )
        ;

        // named (TODO: check error message)
        this.assertThrows( function()
        {
            FinalNamed.extend( {} );
        }, Error, "Cannot extend final named subtype" );

        // anonymous (TODO: check error message)
        this.assertThrows( function()
        {
            FinalAnon.extend( {} );
        }, Error, "Cannot extend final anonymous subtype" );
    }
} );
} )( module['test/ClassBuilder/FinalTest'] = {}, 'test/ClassBuilder' );
/** TEST CASE: ClassBuilder/InstanceTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/ClassBuilder/InstanceTest...<br />' )
/**
 * Tests treatment of class instances
 *
 *  Copyright (C) 2014 Mike Gerwitz
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut = this.require( 'ClassBuilder' );
    },


    /**
     * Instance check delegation helps to keep ease.js extensible and more
     * loosely coupled. If the given type implements a method
     * __isInstanceOf, it will be invoked and its return value will be the
     * result of the entire expression.
     */
    'Delegates to type-specific instance method if present': function()
    {
        var _self = this;

        // object to assert against
        var obj    = {},
            called = false;

        // mock type
        var type = { __isInstanceOf: function( givent, giveno )
        {
            _self.assertStrictEqual( givent, type );
            _self.assertStrictEqual( giveno, obj );

            called = true;
            return true;
        } };

        this.assertOk( this.Sut.isInstanceOf( type, obj ) );
        this.assertOk( called );
    },


    /**
     * In the event that the provided type does not provide any instance
     * check method, we shall fall back to ECMAScript's built-in instanceof
     * operator.
     */
    'Falls back to ECMAScript instanceof check lacking type method':
    function()
    {
        // T does not define __isInstanceOf
        var T = function() {},
            o = new T();

        this.assertOk( this.Sut.isInstanceOf( T, o ) );
        this.assertOk( !( this.Sut.isInstanceOf( T, {} ) ) );
    },


    /**
     * The instanceof operator will throw an exception if the second operand
     * is not a function. Our fallback shall not do that---it shall simply
     * return false.
     */
    'Fallback does not throw exception if type is not a constructor':
    function()
    {
        var _self = this;
        this.assertDoesNotThrow( function()
        {
            // type is not a ctor; should just return false
            _self.assertOk( !( _self.Sut.isInstanceOf( {}, {} ) ) );
        } );
    }
} );

} )( module['test/ClassBuilder/InstanceTest'] = {}, 'test/ClassBuilder' );
/** TEST CASE: ClassBuilder/MemberRestrictionTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/ClassBuilder/MemberRestrictionTest...<br />' )
/**
 * Tests class builder member restrictions
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        // XXX: the Sut is not directly tested; get rid of these!
        this.Class         = this.require( 'class' );
        this.AbstractClass = this.require( 'class_abstract' );

        this.Sut = this.require( 'ClassBuilder' );

        // weak flag test data
        this.weak = [
            [ 'weak foo', 'foo' ],       // former weak
            [ 'foo', 'weak foo' ],       // latter weak
            [ 'weak foo', 'weak foo' ]  // both weak
        ];
    },


    /**
     * It's always useful to be able to quickly reference a list of reserved
     * members so that an implementer can programatically handle runtime
     * cases. It's also useful for testing.
     */
    'Can retrieve a list of reserved members': function()
    {
        var reserved = this.Sut.getReservedMembers();

        this.assertOk( reserved instanceof Object,
            "Can retrieve hash of reserved members"
        );
    },


    /**
     * Ability to alter the reserved members list would permit implementors
     * to break compatibility with libraries that use the reserved members
     * being added.  Furthermore, it could add unintended consequences if a
     * reserved member were removed from the list and used. To put it
     * simply, it could cause complete and utter chaos. As such, no. No, no,
     * no.
     *
     * It is of course true that future versions of ease.js could add
     * additional reserved members, which is why one should never prefix
     * their variables in the same manner ease.js does for reserved members.
     * But let's leave that to ease.js, shall we?
     */
    'Cannot modify internal reserved members list': function()
    {
        var val = 'foo';

        // attempt to add to list
        this.Sut.getReservedMembers().foo = val;

        this.assertNotEqual(
            this.Sut.getReservedMembers().foo,
            val,
            "Cannot alter internal list of reserved members"
        );
    },


    /**
     * This test is to ensure that nobody (a) removes reserved members
     * without understanding the consequences or (b) adds reserved members
     * without properly documenting them.
     */
    'Proper members are reserved': function()
    {
        var chk      = [ '__initProps', 'constructor' ],
            i        = chk.length,
            reserved = this.Sut.getReservedMembers();

        while ( i-- )
        {
            var cur = chk[ i ];

            this.assertOk( reserved.hasOwnProperty( cur ),
                "Member '" + cur + "' should be reserved"
            );

            delete reserved[ cur ];
        }

        // ensure there are no others that we didn't expect
        for ( var name in reserved )
        {
            this.assertFail( "Untested reserved member found: " + name );
        }
    },


    /**
     * Ensure that each of the reserved members will throw an exception if
     * they are used.
     */
    'All reserved members are actually reserved': function()
    {
        var _self    = this,
            reserved = this.Sut.getReservedMembers(),
            count    = 0;

        // test each of the reserved members
        for ( var name in reserved )
        {
            // properties
            this.assertThrows(
                function()
                {
                    var obj = {};
                    obj[ name ] = '';

                    _self.Class( obj );
                },
                Error,
                "Reserved members cannot be used in class definitions as " +
                    "properties"
            );

            // methods
            this.assertThrows(
                function()
                {
                    var obj = {};
                    obj[ name ] = function() {};

                    _self.Class( obj );
                },
                Error,
                "Reserved members cannot be used in class definitions as " +
                    "methods"
            );

            count++;
        }

        // ensure we weren't provided an empty object
        this.assertNotEqual( count, 0,
            "Reserved memebers were tested"
        );
    },


    /**
     * We want these available for the same reason that we want the
     * restricted members available (see above)
     */
    'Can retrieve list of forced public methods': function()
    {
        var pub   = this.Sut.getForcedPublicMethods(),
            count = 0;

        this.assertOk( pub instanceof Object,
            "Can retrieve hash of forced-public methods"
        );

        for ( var name in pub )
        {
            count++;
        }

        // ensure we weren't provided an empty object
        this.assertNotEqual( count, 0,
            "Forced-public method list is not empty"
        );
    },


    /**
     * See above. Same reason that we don't want reserved members to be
     * modified.
     */
    'Cannot modify internal forced public methods list': function()
    {
        var val = 'foo';

        // attempt to add to list
        this.Sut.getForcedPublicMethods().foo = val;

        this.assertNotEqual(
            this.Sut.getForcedPublicMethods().foo,
            val,
            "Cannot alter internal list of forced-public methods"
        );
    },


    /**
     * Ensure that an exception will be thrown for each forced-public method
     * that is not declared as public in the class definition.
     */
    'All forced public methods are forced to public': function()
    {
        var _self = this,
            pub   = this.Sut.getForcedPublicMethods();

        // test each of the reserved members
        for ( var name in pub )
        {
            this.assertThrows( function()
            {
                var obj = {};
                obj[ 'private ' + name ] = function() {};

                _self.Class( obj );
            }, Error, "Forced-public methods must be declared as public" );
        }
    },


    /**
     * If different keywords are used, then a definition object could
     * contain two members of the same name. This is probably a bug in the
     * user's implementation, so we should flip our shit.
     *
     * But, see the next test.
     */
    'Cannot define two members of the same name': function()
    {
        var _self = this;
        this.assertThrows( function()
        {
            // duplicate foos
            _self.Class(
            {
                'public foo':    function() {},
                'protected foo': function() {}
            } );
        } );
    },


    /**
     * Code generation tools may find it convenient to declare a duplicate
     * member without knowing whether or not a duplicate will exist; this
     * may save time and complexity when ease.js has been designed to handle
     * certain situations. If at least one of the conflicting members has
     * been flagged as `weak', then we should ignore the error.
     *
     * As an example, this is used interally with ease.js to inherit
     * abstract members from traits while still permitting concrete
     * definitions.
     */
    '@each(weak) Can define members of the same name if one is weak':
    function( weak )
    {
        // TODO: this makes assumptions about how the code works; the code
        // needs to be refactored to permit more sane testing (since right
        // now it'd be a clusterfuck)
        var dfn = {};
        dfn[ 'abstract ' + weak[ 0 ] ] = [];
        dfn[ 'abstract ' + weak[ 1 ] ] = [];

        var _self = this;
        this.assertDoesNotThrow( function()
        {
            _self.AbstractClass( dfn );
        } );
    },


    /**
     * During the course of processing, certain data are accumulated into
     * the member builder state; this state must be post-processed to
     * complete anything that may be pending.
     */
    'Member builder state is ended after processing': function()
    {
        var _self = this,
            build = this.require( 'MemberBuilder' )();

        var sut = this.Sut(
            this.require( 'warn' ).DismissiveHandler(),
            build,
            this.require( 'VisibilityObjectFactoryFactory' )
                .fromEnvironment()
        );

        // TODO: test that we're passed the right state
        var called = false;
        build.end = function( state )
        {
            called = true;
        };

        sut.build( {} );
        this.assertOk( called );
    }
} );
} )( module['test/ClassBuilder/MemberRestrictionTest'] = {}, 'test/ClassBuilder' );
/** TEST CASE: ClassBuilder/StaticTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/ClassBuilder/StaticTest...<br />' )
/**
 * Tests static members
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


require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.fallback = this.require( 'util' ).definePropertyFallback();

        this.ClassBuilder         = this.require( 'ClassBuilder' );
        this.MemberBuilder        = this.require( 'MemberBuilder' );
        this.MethodWrapperFactory = this.require( 'MethodWrapperFactory' );

        this.wrappers = this.require( 'MethodWrappers' ).standard;
    },


    setUp: function()
    {
        // XXX: get rid of this disgusting mess; we're mid-refactor and all
        // these dependencies should not be necessary for testing
        this.builder = this.ClassBuilder(
            this.require( 'warn' ).DismissiveHandler(),
            this.MemberBuilder(
                this.MethodWrapperFactory( this.wrappers.wrapNew ),
                this.MethodWrapperFactory( this.wrappers.wrapOverride ),
                this.MethodWrapperFactory( this.wrappers.wrapProxy ),
                this.getMock( 'MemberBuilderValidator' )
            ),
            this.require( 'VisibilityObjectFactoryFactory' )
                .fromEnvironment()
        );
    },


    /**
     * To provide access to static members, this.__self is made available inside
     * of instances.
     */
    'Self property references class definition': function()
    {
        var val = [ 'baz' ],
            Foo = this.builder.build(
            {
                'public test': function()
                {
                    return this.__self;
                }
            } );

        Foo.bar = val;

        // we must use instanceof here because the __self object has the class
        // in its prototype chain
        this.assertOk( ( Foo().test().bar === Foo.bar ),
            "__self property references class definition"
        );
    },


    /**
     * If a static property does not exist, the getter should return undefined.
     *
     * This test exists to ensure an error is not thrown if the property is not
     * found. This is because we check each parent and eventually reach the base
     * object. We must ensure the base object does not cause any problems.
     */
    'Static property lookup returns undefined if not found': function()
    {
        var result = this.builder.build( {} ).$( 'foo' );

        this.assertEqual( result, undefined,
            "Static property getter should return undefined if not found"
        );
    },


    /**
     * If supported by the environment, ensure that the accessor method used to
     * access static properties is not enumerable. It's unnecessary clutter (and
     * confusion) otherwise.
     */
    'Static property accessor is not enumerable': function()
    {
        var get = Object.getOwnPropertyDescriptor,
            Foo = this.builder.build( {} );

        // don't perform the test if unsupported
        if ( this.fallback )
        {
            return;
        }

        this.assertEqual( get( Foo, '$' ).enumerable, false,
            "Static property accessor method should not be enumerable"
        );
    },


    /**
     * Static members, by their nature, should be accessible through the class
     * definition itself; that is, without instantiation. It should also not be
     * available through the generated prototype (and therefore, be unavailable
     * to instances).
     */
    'Public static members are accessible via class definition only': function()
    {
        var val  = 'foo',
            val2 = 'bar',
            Foo  = this.builder.build(
            {
                'public static foo': val,

                // should be public by default
                'static bar': val2,

                // the same rules should apply to methods
                'public static baz': function()
                {
                    return val;
                },

                'static foobar': function()
                {
                    return val2;
                }
            } );

        // properties should be accessible via class definition
        this.assertEqual( Foo.$('foo'), val,
            "Public static properties should be accessible via class definition"
        );

        // as long as the above test succeeded, we can then conclude that static
        // members are public by default if the following succeeds
        this.assertEqual( Foo.$('bar'), val2,
            "Static properties are public by default"
        );

        // methods should be accessible via class definition
        this.assertEqual( Foo.baz(), val,
            "Public static methods should be accessible via class definition"
        );

        // same rules as above, but with a method
        this.assertEqual( Foo.foobar(), val2,
            "Static methods are public by default"
        );

        // getter/setter method should not be a part of the prototype
        this.assertEqual( Foo.prototype.$, undefined,
            "Public static properties are *not* part of the prototype"
        );
    },


    /**
     * Same as above, but with getters/setters. We can only run this test if
     * getters/setters are supported by the engine running it.
     */
    'Public static getters/setter accessible via class dfn only': function()
    {
        // if unsupported, don't bother with the test
        if ( this.fallback )
        {
            return;
        }

        // we must define in this manner so older engines won't blow up due to
        // syntax errors
        var def    = {},
            val    = 'baz',
            called = [];

        Object.defineProperty( def, 'public static foo', {
            get: function() { return val; },
            set: function() { called[ 0 ] = true; },

            enumerable: true
        } );

        // should be public by default if not specified
        Object.defineProperty( def, 'static bar', {
            get: function() { return val; },
            set: function() { called[ 1 ] = true; },

            enumerable: true
        } );

        // define the class
        var Foo = this.builder.build( def );

        this.assertEqual( Foo.foo, val,
            "Public static getters are accessible via class definition"
        );

        Foo.foo = 'moo';
        this.assertEqual( called[ 0 ], true,
            "Public static setters are accessible via class definition"
        );

        this.assertEqual( Foo.bar, val,
            "Static getters are public by default"
        );

        Foo.bar = 'moo';
        this.assertEqual( called[ 1 ], true,
            "Static setters are public by default"
        );

        // none of these should be available on the prototype
        this.assertEqual( Foo.prototype.foo, undefined,
            "Public static getters/getters are unavailable on prototype (0)"
        );
        this.assertEqual( Foo.prototype.bar, undefined,
            "Public static getters/getters are unavailable on prototype (1)"
        );
    },


    /**
     * With non-static methods, 'this' is bound to the instance. In the case of
     * static members, we should bind to the class definition (equivalent of
     * this.__self).
     *
     * This functionality had already existed previously. When a propobj is not
     * available for an instance, it falls back. This serves as a regression
     * test to ensure this functionality remains.
     */
    'Static methods not bound to instance': function()
    {
        var result = null,
            Foo    = this.builder.build(
            {
                'public static foo': function()
                {
                    result = this;
                }
            } );

        // call the static method
        Foo.foo();

        // note that the objects themselves aren't the same, due to the property
        // object
        this.assertEqual( result.foo, Foo.foo,
            "Static members are bound to class definition rather than instance"
        );
    },


    /**
     * We don't have the benefit of static members being part of the prototype
     * chain. Inheritance is not automatic. This test deals only with ensuring
     * that *public* static members are inherited by subtypes.
     */
    'Public static members are inherited by subtypes': function()
    {
        var def = {
            'public static foo': 'val',
            'public static func': function() {},

            'public bla': 'moo'
        };

        // also test getters/setters if supported
        if ( !this.fallback )
        {
            Object.defineProperty( def, 'public static bar', {
                get: function() {},
                set: function() {},

                enumerable: true
            } );
        }

        var baz = 'foobar',
            Foo = this.builder.build( def ),

            // extends from the parent and adds an additional
            SubFoo = this.builder.build( Foo, { 'public static baz': baz } ),

            // simply extends from the parent (also serves as a check to ensure
            // that static members of *all* parents are inherited, not just the
            // immediate)
            SubSubFoo = this.builder.build( SubFoo, {} )
        ;

        // properties
        this.assertEqual( SubFoo.$('foo'), Foo.$('foo'),
            "Public static properties are inherited by subtypes"
        );
        this.assertEqual( SubSubFoo.$('foo'), Foo.$('foo'),
            "Public static properties are inherited by sub-subtypes"
        );

        // methods
        this.assertDeepEqual( SubFoo.func, Foo.func,
            "Public static methods are inherited by subtypes"
        );
        this.assertDeepEqual( SubSubFoo.func, Foo.func,
            "Public static methods are inherited by sub-subtypes"
        );

        // merge
        this.assertEqual( SubFoo.$('baz'), baz,
            "Subtypes contain both inherited static members as well as their " +
            "own"
        );

        // getters/setters (if supported by engine)
        if ( !this.fallback )
        {
            var super_data   = Object.getOwnPropertyDescriptor( Foo, 'bar' ),
                sub_data     = Object.getOwnPropertyDescriptor( SubFoo, 'bar' ),
                sub_sub_data = Object.getOwnPropertyDescriptor(
                    SubSubFoo, 'bar'
                )
            ;

            // getters
            this.assertDeepEqual( super_data.get, sub_data.get,
                "Public static getters are inherited by subtypes"
            );
            this.assertDeepEqual( super_data.get, sub_sub_data.get,
                "Public static getters are inherited by sub-subtypes"
            );

            // setters
            this.assertDeepEqual( super_data.set, sub_data.set,
                "Public static setters are inherited by subtypes"
            );
            this.assertDeepEqual( super_data.set, sub_sub_data.set,
                "Public static setters are inherited by sub-subtypes"
            );
        }
    },


    /**
     * Static references should be inherited by subtypes. That is, modifying a
     * static property of a supertype should modify the same static property of
     * the subtype, so long as the subtype has not defined a property of the
     * same name.
     */
    'Public static property references are inherited by subtypes': function()
    {
        var val  = [ 1, 2, 3 ],
            val2 = [ 'a', 'b', 'c' ],

            Foo = this.builder.build(
            {
                'public static bar': val
            } ),
            SubFoo = this.builder.build( Foo, {} )
        ;

        // the properties should reference the same object
        this.assertOk( SubFoo.$('bar') === Foo.$('bar'),
            "Inherited static properties should share references"
        );

        // setting a property on Foo should set the property on SubFoo and
        // vice-versa
        Foo.$( 'bar', val2 );
        this.assertDeepEqual( Foo.$( 'bar' ), val2,
            "Can set static property values"
        );

        this.assertOk( Foo.$( 'bar' ) === SubFoo.$( 'bar' ),
            "Setting a static property value on a supertype also sets the " +
                "value on subtypes"
        );

        SubFoo.$( 'bar', val );
        this.assertOk( Foo.$( 'bar' ) === SubFoo.$( 'bar' ) );
    },


    /**
     * Static members do not have the benefit of prototype chains. We must
     * implement our own means of traversing the inheritance tree. This is done
     * by checking to see if a class has defined the requested property, then
     * forwarding the call to the parent if it has not.
     *
     * The process of looking up the property is very important. hasOwnProperty
     * is used rather than checking for undefined, because they have drastically
     * different results. Setting a value to undefined (if hasOwnProperty were
     * not used) would effectively forward all requests to the base class (since
     * no property would be found), thereby preventing it from ever being
     * written to again.
     */
    'Setting static props to undefined will not corrupt lookup': function()
    {
        var val = 'baz',
            Foo = this.builder.build(
            {
                'public static foo': ''
            } )
        ;

        // first check to ensure we can set the value to null
        Foo.$( 'foo', null );
        this.assertStrictEqual( Foo.$( 'foo' ), null,
            "Static properties may be set to null"
        );

        // then undefined (this actually won't do anything)
        Foo.$( 'foo', undefined );
        this.assertStrictEqual( Foo.$( 'foo' ), undefined,
            "Static properties may be set to undefined"
        );

        // then set back to a scalar
        Foo.$( 'foo', val );
        this.assertEqual( Foo.$( 'foo' ), val,
            "Setting static property to undefined does not corrupt lookup " +
            "process"
        );
    },


    /**
     * Ensure that the proper context is returned by static property setters. It
     * should return the calling class, regardless of whether or not it owns the
     * property being requested.
     */
    'Static property setters return proper context': function()
    {
        var Foo = this.builder.build(
            {
                'public static foo': ''
            } ),

            SubFoo = this.builder.build( Foo, {} )
        ;

        this.assertOk( Foo.$( 'foo', 'val' ) === Foo,
            "Static property setter returns self"
        );

        this.assertOk( SubFoo.$( 'foo', 'val' ) === SubFoo,
            "Static property setter returns calling class, even if property " +
            "is owned by a supertype"
        );
    },


    /**
     * Users should not be permitted to set values of static properties that
     * have not been declared.
     */
    'Attempting to set undeclared static prop results in exception': function()
    {
        var _self = this;

        this.assertThrows(
            function()
            {
                // should throw an exception since property 'foo' has not been
                // declared
                _self.builder.build( {} ).$( 'foo', 'val' );
            },
            ReferenceError,
            "Attempting to set an undeclaraed static property results in an " +
                "exception"
        );
    },


    /**
     * Same as above test. In this case, we have to keep in mind that non-class
     * bases may not have the static accessor method defined. In that case,
     * attempting to call it would cause an error.
     *
     * Of course, even if they did have a static accessor method defined, we
     * wouldn't want to use it, as it isn't the one provided by us. Let's close
     * up as many holes in the framework as we can. It's more to prevent
     * unintended side-effects than anything. There's not much one could do with
     * a "fake" static accessor method that they couldn't with a base class. So,
     * for good measure, we'll declare one on our test base.
     */
    'Accessing static accessor method on non-class base also works': function()
    {
        var _self = this,
            base  = function() {},
            Test  = _self.builder.build( base, {} )
        ;

        // we do not want to call this
        base.$ = function()
        {
            _self.fail(
                "Should not call static accessor method of non-class base"
            );
        };

        // get
        this.assertEqual( undefined, Test.$( 'foo' ) );

        // set
        this.assertThrows(
            function()
            {
                Test.$( 'foo', 'val' );
            },
            ReferenceError,
            "Attempting to set an undeclaraed static property results in an " +
                "exception on non-class base"
        );
    },


    /**
     * Protected members should be available from within the class but shouldn't
     * be exposed to the world
     */
    'Protected static members are available inside class only': function()
    {
        var val = 'foo',
            Foo = this.builder.build(
            {
                'protected static prop': val,


                // the same rules should apply to methods
                'protected static baz': function()
                {
                    return val;
                },

                // ensure method is accessible to static methods
                'public static staticBaz': function()
                {
                    return this.baz();
                },

                // ensure method is accessible to instance methods
                'public instBaz': function()
                {
                    return this.__self.baz();
                },

                'public static staticGetProp': function()
                {
                    return this.$('prop');
                },

                'public instGetProp': function()
                {
                    return this.__self.$('prop');
                }
            } );

        this.assertEqual( Foo.baz, undefined,
            "Protected methods should not be accessible outside the class"
        );

        this.assertEqual( Foo.staticBaz(), val,
            "Protected methods are accessible to static methods"
        );

        this.assertEqual( Foo().instBaz(), val,
            "Protected methods are accessible to instance methods"
        );

        this.assertEqual( Foo.staticGetProp(), val,
            "Protected static properties are accessible to static methods"
        );

        this.assertEqual( Foo().instGetProp(), val,
            "Protected static properties are accessible to instance methods"
        );
    },


    /**
     * Same as above, but with getters/setters. We can only run this test if
     * getters/setters are supported by the engine running it.
     */
    'Protected static getters/setters accessible inside class only': function()
    {
        // if unsupported, don't bother with the test
        if ( this.fallback )
        {
            return;
        }

        // we must define in this manner so older engines won't blow up due to
        // syntax errors
        var def    = {
                'public static getProp': function()
                {
                    // getters/setters are not accessed using the accessor
                    // method
                    return this.foo;
                },

                'public static setProp': function( val )
                {
                    this.foo = val;
                }
            },
            val    = 'baz',
            called = [];

        Object.defineProperty( def, 'protected static foo', {
            get: function() { return val; },
            set: function() { called[ 0 ] = true; },

            enumerable: true
        } );

        // define the class
        var Foo = this.builder.build( def );

        this.assertEqual( Foo.getProp(), val,
            "Protected static getters are accessible from within the class"
        );

        Foo.setProp( 'bla' );
        this.assertEqual( called[ 0 ], true,
            "Protected static setters are accessible from within the class"
        );

        this.assertEqual( Foo.foo, undefined,
            "Protected static getters/getters are not public"
        );
    },


    /**
     * As usual, protected members (in this case, static) should be inherited by
     * subtypes.
     *
     * Long function is long. Kids, don't do this at home.
     */
    'Protected static members are inherited by subtypes': function()
    {
        var val  = 'baz',
            val2 = 'bazbaz',
            def = {
            'protected static prop': val,

            'protected static foo': function()
            {
                return val;
            }
        };

        // also test getters/setters if supported
        if ( !this.fallback )
        {
            Object.defineProperty( def, 'protected static bar', {
                get: function() {},
                set: function() {},

                enumerable: true
            } );

            // used to get the property descriptor of a protected property
            def[ 'public static getPropDesc' ] = function( prop )
            {
                return Object.getOwnPropertyDescriptor( this, prop );
            };
        }

        var Foo  = this.builder.build( def ),

            SubFoo = this.builder.build( Foo,
            {
                'public static bar': function()
                {
                    return this.foo();
                },

                'protected static foo2': function()
                {
                    return val2;
                },

                'public static bar2': function()
                {
                    return this.foo2();
                },

                'public static getProp': function()
                {
                    return this.$('prop');
                }
            } ),

            SubSubFoo = this.builder.build( SubFoo, {} )
        ;

        this.assertEqual( SubFoo.bar(), val,
            "Subtypes inherit parents' protected static methods"
        );

        this.assertEqual( SubFoo.bar2(), val2,
            "Static methods have access to other static methods in the same " +
            "class"
        );

        // for extra assurance, to ensure our recursive implementation is
        // correct
        this.assertEqual( SubSubFoo.bar(), val,
            "Sub-subtypes inherit parents' protected static methods"
        );

        this.assertEqual( SubFoo.getProp(), val,
            "Subtypes inherit parents' protected static properties"
        );

        this.assertEqual( SubSubFoo.getProp(), val,
            "Sub-subtypes inherit parents' protected static properties"
        );

        // getters/setters (if supported by engine)
        if ( !this.fallback )
        {
            var super_data   = Foo.getPropDesc( 'bar' ),
                sub_data     = SubFoo.getPropDesc( 'bar' ),
                sub_sub_data = SubSubFoo.getPropDesc( 'bar' )
            ;

            // getters
            this.assertDeepEqual( super_data.get, sub_data.get,
                "Protected static getters are inherited by subtypes"
            );
            this.assertDeepEqual( super_data.get, sub_sub_data.get,
                "Protected static getters are inherited by sub-subtypes"
            );

            // setters
            this.assertDeepEqual( super_data.set, sub_data.set,
                "Protected static setters are inherited by subtypes"
            );
            this.assertDeepEqual( super_data.set, sub_sub_data.set,
                "Protected static setters are inherited by sub-subtypes"
            );
        }
    },


    /**
     * Private members should be available from within the class, but not
     * outside of it
     */
    'Private static members are available inside class only': function()
    {
        var val = 'foo',
            Foo = this.builder.build(
            {
                'private static prop': val,


                // the same rules should apply to methods
                'private static baz': function()
                {
                    return val;
                },

                // ensure method is accessible to static methods
                'public static staticBaz': function()
                {
                    return this.baz();
                },

                // ensure method is accessible to instance methods
                'public instBaz': function()
                {
                    return this.__self.baz();
                },

                'public static staticGetProp': function()
                {
                    return this.$('prop');
                },

                'public instGetProp': function()
                {
                    return this.__self.$('prop');
                }
            } );

        this.assertEqual( Foo.baz, undefined,
            "Private methods should not be accessible outside the class"
        );

        this.assertEqual( Foo.staticBaz(), val,
            "Private methods are accessible to static methods"
        );

        this.assertEqual( Foo().instBaz(), val,
            "Private methods are accessible to instance methods"
        );

        this.assertEqual( Foo.staticGetProp(), val,
            "Private static properties are accessible to static methods"
        );

        this.assertEqual( Foo().instGetProp(), val,
            "Private static properties are accessible to instance methods"
        );
    },


    /**
     * Private static members should not be inherited by subtypes. Of course.
     * Moving along...
     */
    'Private static members are not inherited by subtypes': function()
    {
        var def = {
            'private static prop': 'foo',
            'private static priv': function() {}
        };

        if ( !this.fallback )
        {
            Object.defineProperty( def, 'private static foo', {
                get: function() { return 'foo'; },
                set: function() {},

                enumerable: true
            } );
        }

        var Foo = this.builder.build( def ),

            SubFoo = this.builder.build( Foo,
            {
                'public static getPriv': function()
                {
                    return this.priv;
                },


                'public static getGetSet': function()
                {
                    return this.foo;
                },

                'public static staticGetProp': function()
                {
                    return this.$('prop');
                },

                'public instGetProp': function()
                {
                    return this.__self.$('prop');
                }
            } )
        ;

        this.assertEqual( SubFoo.getPriv(), undefined,
            "Private static methods should not be inherited by subtypes"
        );

        this.assertEqual( SubFoo.getGetSet(), undefined,
            "Private static getters/setters should not be inherited by subtypes"
        );

        this.assertEqual( SubFoo().instGetProp(), undefined,
            "Private static properties should not be inherited by subtypes " +
            "(inst)"
        );

        this.assertEqual( SubFoo.staticGetProp(), undefined,
            "Private static properties should not be inherited by subtypes " +
            "(static)"
        );
    },


    /**
     * Same as above, but with getters/setters. We can only run this test if
     * getters/setters are supported by the engine running it.
     */
    'Private static getters/setters accessible inside class only': function()
    {
        // if unsupported, don't bother with the test
        if ( this.fallback )
        {
            return;
        }

        // we must define in this manner so older engines won't blow up due to
        // syntax errors
        var def    = {
                'public static getProp': function()
                {
                    // getters/setters are not accessed using the accessor
                    // method
                    return this.foo;
                },

                'public static setProp': function( val )
                {
                    this.foo = val;
                }
            },
            val    = 'baz',
            called = [];

        Object.defineProperty( def, 'private static foo', {
            get: function() { return val; },
            set: function() { called[ 0 ] = true; },

            enumerable: true
        } );

        // define the class
        var Foo = this.builder.build( def );

        this.assertEqual( Foo.getProp(), val,
            "Private static getters are accessible from within the class"
        );

        Foo.setProp( 'bla' );
        this.assertEqual( called[ 0 ], true,
            "Private static setters are accessible from within the class"
        );

        this.assertEqual( Foo.foo, undefined,
            "Private static getters/getters are not public"
        );
    },


    /**
     * Public and protected static methods should be able to be overridden by
     * subtypes. We needn't test private methods, as they are not inherited.
     */
    'Static methods can be overridden by subtypes': function()
    {
        var val = 'bar',
            Foo = this.builder.build(
            {
                'public static foo': function() {},
                'protected static bar': function() {}
            } ),

            SubFoo = this.builder.build( Foo,
            {
                'public static foo': function()
                {
                    return val;
                },

                'public static prot': function()
                {
                    return this.bar();
                },

                'protected static bar': function()
                {
                    return val;
                }
            } );

        this.assertEqual( SubFoo.foo(), val,
            "Public static methods can be overridden by subtypes"
        );

        this.assertEqual( SubFoo.prot(), val,
            "Protected static methods can be overridden by subtypes"
        );
    },



    /**
     * This tests very closely to the implementation, which is not good.
     * However, it's important to protecting the data. The accessor method works
     * off of context, so it's important to ensure that the data will remain
     * encapsulated if the user attempts to be tricky and bind to a supertype.
     */
    'Cannot exploit accessor method to gain access to parent private props':
    function()
    {
        var Foo = this.builder.build(
            {
                'private static foo': 'bar'
            } ),

            SubFoo = this.builder.build( Foo,
            {
                'public static getParentPrivate': function()
                {
                    return this.$.call( Foo, 'foo' );
                }
            } )
        ;

        this.assertEqual( SubFoo.getParentPrivate(), undefined,
            "Cannot exploit accses modifier to gain access to parent private props"
        );
    },


    /**
     * Static members cannot be overridden. Instead, static members can be
     * *hidden* if a member of the same name is defined by a subtype.
     */
    'Cannot override static members': function()
    {
        var val_orig = 'foobaz',
            val      = 'foobar',

            Foo = this.builder.build(
            {
                'public static prop': val_orig,

                'public static foo': function()
                {
                    return this.bar();
                },

                'public static bar': function()
                {
                    return val_orig;
                },

                'public static baz': function()
                {
                    return this.$( 'prop' );
                }
            } ),

            SubFoo = this.builder.build( Foo,
            {
                'public static prop': val,

                // override parent static method (this is truly overriding, not
                // hiding)
                'public static bar': function()
                {
                    return val;
                },

                'public static getProp': function()
                {
                    return this.$( 'prop' );
                }
            } )
        ;

        // cannot override
        this.assertNotEqual( SubFoo.foo(), val,
            "System does not support overriding static methods"
        );
        this.assertNotEqual( SubFoo.baz(), val,
            "System does not support overriding static properties"
        );

        // but we can hide them
        this.assertEqual( SubFoo.bar(), val,
            "System supports static method hiding"
        );
        this.assertEqual( SubFoo.getProp(), val,
            "System supports static property hiding"
        );
    },


    /**
     * Since members are statically bound, calls to parent methods should retain
     * access to their private members.
     */
    'Calls to parent static methods retain private member access': function()
    {
        var val = 'foobar',
            Foo = this.builder.build(
            {
                'private static _priv': val,

                'public static getPriv': function()
                {
                    return this.$('_priv');
                }
            } ),

            SubFoo = this.builder.build( Foo,
            {
                'public static getPriv2': function()
                {
                    return this.getPriv();
                }
            } )
        ;

        this.assertEqual( SubFoo.getPriv(), val,
            'Calls to parent static methods should retain access to their own ' +
            'private members when called externally'
        );

        this.assertEqual( SubFoo.getPriv2(), val,
            'Calls to parent static methods should retain access to their own ' +
            'private members when called internally'
        );
    }
} );

} )( module['test/ClassBuilder/StaticTest'] = {}, 'test/ClassBuilder' );
/** TEST CASE: ClassBuilder/VisibilityTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/ClassBuilder/VisibilityTest...<br />' )
/**
 * Tests class builder visibility implementation
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

 * See also: Class/VisibilityTest
 */

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut                  = this.require( 'ClassBuilder' );
        this.MethodWrapperFactory = this.require( 'MethodWrapperFactory' );

        this.wrappers = this.require( 'MethodWrappers' ).standard;
        this.util     = this.require( 'util' );
    },


    setUp: function()
    {
        // XXX: get rid of this disgusting mess; we're mid-refactor and all
        // these dependencies should not be necessary for testing
        this.builder = this.Sut(
            this.require( 'warn' ).DismissiveHandler(),
            this.require( '/MemberBuilder' )(
                this.MethodWrapperFactory( this.wrappers.wrapNew ),
                this.MethodWrapperFactory( this.wrappers.wrapOverride ),
                this.MethodWrapperFactory( this.wrappers.wrapProxy ),
                this.getMock( 'MemberBuilderValidator' )
            ),
            this.require( '/VisibilityObjectFactoryFactory' ).fromEnvironment()
        );
    },


    /**
     * As discussed in GH#15, there's a bit of an issue when passing around
     * 'this' from within a method. For example, passing 'this' as an argument
     * or invoking a method with it as the context will effectively defeat
     * encapsulation.  Unfortunately, there's really no way around that. Maybe a
     * more elegant solution will arise in the future. For now, not likely.
     *
     * We need to provide a means to reference the actual instance. __inst is
     * that solution.
     */
    'Self property references instance rather than property object': function()
    {
        var result = null,
            ref    = null,

            foo = this.builder.build( {
                'public __construct': function()
                {
                    // rather than returning, assign to external var so that we can
                    // rest assured that the return value wasn't manipulated
                    result = this.__inst;
                    ref    = this;
                }
            } )();

        this.assertDeepEqual( result, foo,
            "this.__inst returns reference to actual instance"
        );

        // the property should be read-only
        if ( this.util.definePropertyFallback() === false )
        {
            this.assertEqual(
                Object.getOwnPropertyDescriptor( ref, '__inst' ).writable,
                false,
                "this.__inst is not writable"
            );
        }
    }
} );

} )( module['test/ClassBuilder/VisibilityTest'] = {}, 'test/ClassBuilder' );
/** TEST CASE: Class/ConstructorTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Class/ConstructorTest...<br />' )
/**
 * Tests class module constructor creation
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

require( 'common' ).testCase(
{
    setUp: function()
    {
        this.Sut = this.require( 'class' );
    },


    /**
     * As a sanity check, ensure that the constructor is not invoked upon
     * defining the class. (Note that the case of ensuring that it is not
     * called when creating a subtype is handled by the ExtendTest case.)
     */
    'Constructor should not be invoked before instantiation': function()
    {
        var called = false;
        this.Sut.extend( { __construct: function() { called = true; } } );

        this.assertNotEqual( called, true );
    },


    /**
     * Since __construct is a special method that is not recognized by
     * ECMAScript itself, we must ensure that it is invoked when the class
     * is instantiated. Further, it should only be called a single time,
     * which is particularly important if it produces side-effects.
     */
    'Constructor should be invoked once upon instantiation': function()
    {
        var called = 0;

        var Foo = this.Sut.extend(
        {
            __construct: function() { called++; }
        } );

        // note that we're not yet testing the more consise new-less
        // invocation style
        new Foo();
        this.assertEqual( called, 1 );
    },


    /**
     * Once invoked, the __construct method should be bound to the newly
     * created instance.
     */
    'Constructor should be invoked within context of new instance':
    function()
    {
        var expected = Math.random();

        var Foo = this.Sut.extend(
            {
                val: null,
                __construct: function() { this.val = expected; }
            } );

        // if `this' was bound to the instance, then __construct should set
        // VAL to EXPECTED
        var inst = new Foo();
        this.assertEqual( inst.val, expected );
    },


    /**
     * All arguments passed to the constructor (that is, by invoking the
     * ``class'') should be passed to __construct, unchanged and
     * uncopied---that is, references should be retained.
     */
    'Constructor arguments should be passed unchanged to __construct':
    function()
    {
        var args  = [ "foo", { bar: 'baz' }, [ 'moo', 'cow' ] ],
            given = null;

        var Foo = this.Sut.extend(
        {
            __construct: function()
            {
                given = Array.prototype.slice.call( arguments, 0 );
            }
        } );

        new Foo( args[ 0 ], args[ 1 ], args[ 2 ] );

        // make sure we have everything and didn't get anything extra
        this.assertEqual( given.length, args.length );

        var i = args.length;
        while ( i-- )
        {
            this.assertStrictEqual( given[ i ], args[ i ],
                "Ctor argument mismatch: " + i
            );
        }
    },


    /**
     * If a subtype does not define its own constructor, then its parent's
     * should be called by default. Note that this behavior---as is clear by
     * the name __construct---is modelled after PHP; Java classes, for
     * instance, do not inherit their parents' constructors.
     */
    'Parent constructor should be invoked for subtype if not overridden':
    function()
    {
        var called = false;

        var Sub = this.Sut.extend(
        {
            __construct: function() { called = true; }
        } ).extend( {} );

        new Sub();
        this.assertOk( called );
    },


    /**
     * Classes created through ease.js do not require use of the `new'
     * keyword, which allows for a much more natural, concise, and less
     * error-prone syntax. Ensure that a new instance is created even when
     * it is omitted.
     *
     * The rest of the tests above would then stand, since they use the
     * `new' keyword and this concise format has no choice but to ultimately
     * do the same; otherwise, it would not be recognized by instanceof.
     */
    'Constructor does not require `new\' keyword': function()
    {
        var Foo = this.Sut.extend( {} );

        this.assertOk( new Foo() instanceof Foo );  // sanity check
        this.assertOk( Foo() instanceof Foo );
    },



    /**
     * In certain OO languages, one would prevent a class from being
     * instantiated by declaring the constructor as protected or private. To
     * me (Mike Gerwitz), this is cryptic. A better method would simply be
     * to throw an exception. Perhaps, in the future, an alternative will be
     * provided for consistency.
     *
     * The constructor must be public. (It is for this reason that you will
     * often see the convention of omitting visibility keywords entirely for
     * __construct, since public is the default and there is no other
     * option.)
     */
    '__construct must be public': function()
    {
        var Sut = this.Sut;

        this.assertThrows( function()
        {
            Sut( { 'protected __construct': function() {} } );
        }, TypeError, "Constructor should not be able to be protected" );

        this.assertThrows( function()
        {
            Sut( { 'private __construct': function() {} } );
        }, TypeError, "Constructor should not be able to be private" );
    },


    /**
     * When a constructor is instantiated conventionally in ECMAScript, the
     * instance's `constructor' property is set to the constructor that was
     * used to instantiate it.  The same should be true for class instances.
     *
     * This will also be important for reflection.
     */
    '`constructor\' property is properly set to class object': function()
    {
        var Foo = this.Sut.extend( {} );
        this.assertStrictEqual( Foo().constructor, Foo );
    }
} );
} )( module['test/Class/ConstructorTest'] = {}, 'test/Class' );
/** TEST CASE: Class/ExtendTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Class/ExtendTest...<br />' )
/**
 * Tests class module extend() method
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
 * Note that these tests all use the `new' keyword for instantiating
 * classes, even though it is not required with ease.js; this is both for
 * historical reasons (when `new' was required during early development) and
 * because we are not testing (and do want to depend upon) that feature.
 */

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.test_props = {
            one: 1,
            two: 2
        };

        this.Sut = this.require( 'class' );

        // there are two different means of extending; we want to test them
        // both (this will be denoted Foo)
        this.classes = [
            this.Sut.extend( this.test_props ),
            this.Sut( this.test_props )
        ];
    },


    /**
     * All classes can be easily extended via an extend method, although it
     * is not necessarily recommended to be used directly, as you must
     * ensure that the object is an ease.js class and the resulting class
     * will be anonymous.
     */
    '@each(classes) Created class contains extend method': function( C )
    {
        this.assertOk( typeof C.extend === 'function' );
    },


    /**
     * It would make sense that a subtype returned is an object, since it
     * cannot be a class if it isn't.
     */
    '@each(classes) Subtype is returned as an object': function( C )
    {
        this.assertOk( C.extend() instanceof Object );
    },


    /**
     * Subtypes should inherit all properties of the supertype into their
     * prototype chain.
     */
    '@each(classes) Subtype inherits parent properties': function( C )
    {
        var SubFoo = C.extend();

        for ( var prop in this.test_props )
        {
            this.assertEqual(
                this.test_props[ prop ],
                SubFoo.prototype[ prop ],
                "Missing property: " + prop
            );
        }
    },


    /**
     * A subtype should obvious contain the properties that were a part of
     * its definition.
     */
    '@each(classes) Subtype contains its own properties': function( C )
    {
        var sub_props = {
            three: 3,
            four:  4
        };

        var sub_foo = new C.extend( sub_props )();

        // and ensure that the subtype's properties were included
        for ( var prop in sub_props )
        {
            this.assertEqual(
                sub_props[ prop ],
                sub_foo[ prop ],
                "Missing property: " + prop
            );
        }
    },


    /**
     * In addition to the core functions provided by ease.js for checking
     * instances, we try to ease into the protype model the best we can in
     * order to work with other prototypes; therefore, instances should be
     * recognized as instances of their parent classes even by the
     * ECMAScript `instanceof' operator.
     */
    '@each(classes) Subtypes are ECMAScript instances of their supertypes':
    function( C )
    {
        this.assertOk( C.extend()() instanceof C );
    },


    /**
     * Even though this can be checked using the instanceof operator,
     * ease.js has a more complex type system (e.g. supporting of
     * interfaces) and so we want to provide a consistent alternative.
     */
    '@each(classes) Subtypes are easejs instances of their supertypes':
    function( C )
    {
        var SubFoo       = C.extend(),
            sub_instance = new SubFoo();

        this.assertOk( sub_instance.isInstanceOf( SubFoo ) );
    },


    /*
     *         Foo
     *          |
     *        SubFoo
     *        /   \
     * SubSubFoo  SubSubFoo2
     *
     /

    /**
     * Objects should be considered instances of any classes that their
     * instantiating class inherits from, since they inherit their API and
     * are interchangable, provided that only the common subset of the API
     * is used.
     */
    '@each(classes) Objects are instances of their super-supertypes':
    function( C )
    {
        var sub_sub_instance = new ( C.extend().extend() )();

        this.assertOk(
            ( ( sub_sub_instance instanceof C )
                && sub_sub_instance.isInstanceOf( C )
            )
        );
    },


    /**
     * It would not make sense that an object is considered to be an
     * instance of any possible subtypes---that is, if C inherits B, then an
     * instance of B is not of type C; C could introduce an incompatible
     * interface.
     */
    '@each(classes) Objects are not instances of subtypes': function( C )
    {
        var SubFoo    = C.extend(),
            SubSubFoo = SubFoo.extend(),
            sub_inst  = new SubFoo();

        this.assertOk(
            ( !( sub_inst instanceof SubSubFoo )
                && !( sub_inst.isInstanceOf( SubSubFoo ) )
            )
        );
    },


    /**
     * Two classes that inherit from a common parent are not compatible, as
     * they can introduce their own distinct interfaces.
     */
    '@each(classes) Objects are not instances of sibling types':
    function( C )
    {
        var SubFoo     = C.extend(),
            SubSubFoo  = SubFoo.extend(),
            SubSubFoo2 = SubFoo.extend(),

            sub_sub2_inst = new SubSubFoo2();

        this.assertOk(
            ( !( sub_sub2_inst instanceof SubSubFoo )
                && !( sub_sub2_inst.isInstanceOf( SubSubFoo ) )
            )
        );
    },


    /**
     * We support extending existing prototypes (that is, inherit from
     * constructors that were not created using ease.js).
     */
    'Constructor prototype is copied to subclass': function()
    {
        var Ctor = function() {};
        Ctor.prototype = { foo: {} };

        this.assertStrictEqual(
            this.Sut.extend( Ctor, {} ).prototype.foo,
            Ctor.prototype.foo
        );
    },


    /**
     * This should go without saying---we're aiming for consistency here and
     * subclassing doesn't make much sense if it doesn't work.
     */
    'Subtype of constructor should contain extended members': function()
    {
        var Ctor = function() {};

        this.assertNotEqual(
            ( new this.Sut.extend( Ctor, { foo: {} } )() ).foo,
            undefined
        );
    },


    /**
     * If a subtype provides a property of the same name as its parent, then
     * it should act as a reassignment.
     */
    'Subtypes can override parent property values': function()
    {
        var expect = 'ok',
            C    = this.Sut.extend( { p: null } ).extend( { p: expect } );

        this.assertEqual( C().p, expect );
    },


    /**
     * Prevent overriding the internal method that initializes property
     * values upon instantiation.
     */
    '__initProps() cannot be declared (internal method)': function()
    {
        var _self = this;

        this.assertThrows( function()
        {
            _self.Sut.extend(
            {
                __initProps: function() {}
            } );
        }, Error );
    },


    // TODO: move me into a more appropriate test case (this may actually be
    // tested elsewhere)
    /**
     * If using the short-hand extend, an object is required to represent
     * the class defintiion.
     */
    'Invoking class module requires object as argument if extending':
    function()
    {
        var _self = this;

        // these tests can be run in the browser in pre-ES5 environments, so
        // no forEach()
        var chk = [ 5, false, undefined ],
            i   = chk.length;

        while ( i-- )
        {
            this.assertThrows( function()
                {
                    _self.Sut( chk[ i ] );
                },
                TypeError
            );
        }
    },


    /**
     * We provide a useful default toString() method, but one may wish to
     * override it
     */
    'Can override toString() method': function()
    {
        var str    = 'foomookittypoo',
            result = ''
        ;

        result = this.Sut( 'FooToStr',
        {
            toString: function()
            {
                return str;
            }
        } )().toString();

        this.assertEqual( result, str );
    },


    /**
     * In ease.js's initial design, keywords were not included. This meant
     * that duplicate member definitions were not possible---it'd throw a
     * parse error (maybe). However, with keywords, it is now possible to
     * redeclare a member with the same name in the same class definition.
     * Since this doesn't make much sense, we must disallow it.
     */
    'Cannot provide duplicate member definitions using unique keys':
    function()
    {
        var _self = this;

        this.assertThrows( function()
        {
            _self.Sut(
            {
                // declare as protected first so that we won't get a visibility
                // de-escalation error with the below re-definition
                'protected foo': '',

                // should fail; redefinition
                'public foo': ''
            } );
        }, Error );

        this.assertThrows( function()
        {
            _self.Sut(
            {
                // declare as protected first so that we won't get a visibility
                // de-escalation error with the below re-definition
                'protected foo': function() {},

                // should fail; redefinition
                'public foo': function() {}
            } );
        }, Error );
    },


    /**
     * To understand this test, one must understand how "inheritance" works
     * with prototypes. We must create a new instance of the ctor (class)
     * and add that instance to the prototype chain (if we added an
     * un-instantiated constructor, then the members in the prototype would
     * be accessible only though ctor.prototype). Therefore, when we
     * instantiate this class for use in the prototype, we must ensure the
     * constructor is not invoked, since our intent is not to create a new
     * instance of the class.
     */
    '__construct should not be called when extending class': function()
    {
        var called = false,
            Foo    = this.Sut( {
                'public __construct': function()
                {
                    called = true;
                }
            } ).extend( {} );

        this.assertEqual( called, false );
    },


    /**
     * Previously, when attempting to extend from an invalid supertype,
     * you'd get a CALL_NON_FUNCTION_AS_CONSTRUCTOR error, which is not very
     * helpful to someone who is not familiar with the ease.js internals.
     * Let's provide a more useful error that clearly states what's going
     * on.
     */
    'Extending from non-ctor or non-class provides useful error': function()
    {
        try
        {
            // invalid supertype
            this.Sut.extend( 'oops', {} );
        }
        catch ( e )
        {
            this.assertOk( e.message.search( 'extend from' ),
                "Error message for extending from non-ctor or class " +
                "makes sense"
            );

            return;
        }

        this.assertFail(
            "Attempting to extend from non-ctor or class should " +
            "throw exception"
        );
    },


    /**
     * If we attempt to extend an object (rather than a constructor), we
     * should simply use that as the prototype directly rather than
     * attempting to instantiate it.
     */
    'Extending object will not attempt instantiation': function()
    {
        var obj = { foo: 'bar' };

        this.assertEqual( obj.foo, this.Sut.extend( obj, {} )().foo,
            "Should be able to use object as prototype"
        );
    },


    /**
     * Gathering metadata on public methods of supertypes N>1 distance away
     * is easy, as it is part of the public prototype chain that is
     * naturally traversed by JavaScript. However, we must ensure that we
     * properly recurse on *all* visibility objects.
     *
     * This test addresses a pretty alarming bug that was not caught during
     * initial development---indeed, until the trait implementation, which
     * exploits the class system in some odd ways---because the author
     * dislikes inheritence in general, letalone large hierarchies, so
     * protected members of super-supertypes seems to have gone untested.
     */
    'Extending validates against non-public super-supertype methods':
    function()
    {
        var called = false;

        this.Sut.extend(
        {
            'virtual protected foo': function()
            {
                called = true;
            }
        } ).extend(
        {
            // intermediate to disconnect subtype
        } ).extend(
        {
            'override public foo': function()
            {
                this.__super();
            }
        } )().foo();

        // the override would have only actually taken place if the
        // protected foo was recognized
        this.assertOk( called );
    }
} );
} )( module['test/Class/ExtendTest'] = {}, 'test/Class' );
/** TEST CASE: Class/GeneralTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Class/GeneralTest...<br />' )
/**
 * Tests class module object creation
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


require( 'common' ).testCase(
{
    setUp: function()
    {
        this.Sut = this.require( 'class' );

        this.Foo = this.Sut.extend(
        {
            value: 'foo'
        } );
    },


    /**
     * The most primitve means of creating a class is by calling the extend
     * method on the module itself, which will extend the base class. (Any
     * shorthand forms still do this.)
     */
    'Class module should provide an extend method': function()
    {
        this.assertOk(
            typeof this.Sut.extend === 'function'
        );
    },


    /**
     * The extend method should create a new constructor, which itself is a
     * function.
     */
    'Extend method creates a new function': function()
    {
        this.assertOk( typeof this.Foo === 'function' );
    },


    /**
     * Sanity check.
     */
    'Classes are considered by the system to be classes': function()
    {
        this.assertOk( this.Sut.isClass( this.Foo ) );
    },


    /**
     * Even though we have no problem working with conventional prototypes,
     * there may be certian features that ease.js provides in which it is
     * important to know whether or not the given object is a class created
     * with ease.js.
     */
    'Only actual classes are considered to be classes': function()
    {
        this.assertOk( !( this.Sut.isClass( {} ) ) );
    },


    /**
     * Class instances are objects, not classes.
     */
    'Class instances are not considered to be classes': function()
    {
        var inst = new this.Foo();
        this.assertOk( !( this.Sut.isClass( inst ) ) );
    },


    /**
     * ease.js may expose features that are useful only to instances of
     * classes created through ease.js, so it is useful to know when an
     * object is such.
     */
    'Class instances are considered to be instances': function()
    {
        var inst = new this.Foo();
        this.assertOk( this.Sut.isClassInstance( inst ) );
    },


    /**
     * An instance is, well, an instance of a class; it is not a class.
     */
    'Classes are not considered to be class instances': function()
    {
        this.assertOk(
            ( !( this.Sut.isClassInstance( this.Foo ) ) )
        );
    },


    /**
     * While an object may be an instance of something in the traditional
     * ECMAScript sense, the distinction is important for the framework; you
     * don't need ease.js to determine if an object is an instance of
     * something that is non-ease.js-y.
     */
    'Non-class objects are not considered to be instances': function()
    {
        // plain 'ol object
        this.assertOk( !( this.Sut.isClassInstance( {} ) ) );

        // ctor instance
        var proto = function() {};
        this.assertOk( !( this.Sut.isClassInstance( new proto() ) ) );
    },


    /**
     * A class shoudl be an immutable blueprint for creating objects. Unlike
     * prototypes, they should not be able to be modified at runtime to
     * affect every instance. If you want that, then use prototypes, not
     * classes.
     */
    'Generated classes should be frozen': function()
    {
        // only perform check if supported by the engine
        if ( Object.isFrozen === undefined )
        {
            return;
        }

        this.assertOk( Object.isFrozen( this.Foo ) );
    },


    /**
     * We provide a reflection mechanism that may be used to determine
     * whether an instance was created from a given class; this can be used
     * for typing.
     */
    'Class instance is recognized as instance of class': function()
    {
        this.assertOk(
            this.Sut.isInstanceOf( this.Foo, new this.Foo() )
        );
    },


    /**
     * We're talking about JS here; people do unpredictable things, and this
     * is likely to be a common one if type checking arguments to a
     * function/method.
     */
    'Checking instance of undefined will not throw an error': function()
    {
        this.assertOk(
            this.Sut.isInstanceOf( this.Foo, undefined ) === false
        );
    },


    /**
     * Similar to the above, but instead of providing undefined to be
     * checked against a class, the class to check against is undefined.
     */
    'Checking for instance of undefined will not throw an error': function()
    {
        this.assertOk(
            this.Sut.isInstanceOf( undefined, {} ) === false
        );
    },


    /**
     * Since a class is not an instance, it should never be recognized as an
     * instance of itself.
     */
    'Class is not an instance of itself': function()
    {
        this.assertOk( !( this.Sut.isInstanceOf( this.Foo, this.Foo ) ) );
    },


    /**
     * Sanity check...prevent confoundentry, which is particularily
     * important in the case of accidental argument order switching.
     */
    'Class is not an instance of its instance': function()
    {
        this.assertOk(
            !( this.Sut.isInstanceOf( new this.Foo(), this.Foo ) )
        );
    },


    /**
     * Sometimes it's easier to think in terms of types, not instances. This
     * is also shorter.
     */
    'isA is an alias for isInstanceOf': function()
    {
        this.assertEqual(
            this.Sut.isInstanceOf,
            this.Sut.isA
        );
    },


    /**
     * While more concise if used responsibly, it can also be dangerous in
     * the event that the instance may not be an ease.js class instance.
     */
    'Class instance has partially applied isInstanceOf method': function()
    {
        var inst = new this.Foo();

        this.assertOk(
            ( ( typeof inst.isInstanceOf === 'function' )
                && ( inst.isInstanceOf( this.Foo ) === true )
                && ( inst.isInstanceOf( inst ) === false )
            )
        );
    },


    /**
     * Same as above.
     */
    'Class instance has partially applied isA alias method': function()
    {
        var inst = new this.Foo();

        this.assertEqual(
            inst.isInstanceOf,
            inst.isA
        );
    },


    /**
     * This really should be encapsulated, probably, but it does exist for
     * reference.
     */
    'Class id is available via class': function()
    {
        this.assertOk( this.Foo.__cid !== undefined );
    },


    /**
     * This ensures that the class id is accessible through all instances.
     */
    'Class id is available via class prototype': function()
    {
        this.assertOk(
            ( this.Foo.prototype.__cid !== undefined )
        );
    }
} );
} )( module['test/Class/GeneralTest'] = {}, 'test/Class' );
/** TEST CASE: Class/GetterSetterTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Class/GetterSetterTest...<br />' )
/**
 * Tests class getter/setter inheritance
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut  = this.require( 'class' );
        this.util = this.require( 'util' );
    },


    setUp: function()
    {
        // don't perform these tests if getters/setters are unsupported
        if ( this.util.definePropertyFallback() )
        {
            this.skip();
        }

        var foo_def     = {},
            sub_foo_def = {};

        // to prevent syntax errors in environments that do not support
        // getters/setters in object notation
        Object.defineProperty( foo_def, 'foo', {
            get: function ()
            {
                return this._foo;
            },
            set: function ( val )
            {
                this._foo = ''+( val );
            },

            enumerable: true
        } );

        Object.defineProperty( foo_def, 'virtual bar', {
            get: function ()
            {
                return 'durp';
            },
            set: function ( val )
            {
            },

            enumerable: true
        } );

        Object.defineProperty( sub_foo_def, 'override bar', {
            get: function ()
            {
                return this.bar2;
            },
            set: function ( val )
            {
                this.bar2 = val;
            },

            enumerable: true
        } );

        // this is important since the system may freeze the object, so we
        // must have declared it in advance
        foo_def.bar2 = '';

        var Foo    = this.Sut.extend( foo_def ),
            SubFoo = Foo.extend( sub_foo_def );

        this.sub = new SubFoo();
    },


    /**
     * Getters/setters should be inherited from the prototype as-is (if this
     * doesn't work, someone went out of their way to break it, as it works
     * by default!)
     */
    'Subtypes inherit getters/setters': function()
    {
        var val = 'foo';

        this.sub.foo = val;
        this.assertEqual( this.sub.foo, val );
    },


    /**
     * Just as methods can be overridden, so should getters/setters, which
     * act as methods do.
     */
    'Subtypes should be able to override getters/setters': function()
    {
        var val = 'bar';

        this.sub.bar = val;
        this.assertEqual( this.sub.bar, val );
        this.assertEqual( this.sub.bar2, val );
    }
} );
} )( module['test/Class/GetterSetterTest'] = {}, 'test/Class' );
/** TEST CASE: Class/ImplementTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Class/ImplementTest...<br />' )
/**
 * Tests class interface implement method
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Class         = this.require( 'class' );
        this.Interface     = this.require( 'interface' );
        this.AbstractClass = this.require( 'class_abstract' );

        // test with and without abstract keyword
        this.Type = this.Interface.extend( {
            'abstract foo': []
        } );

        this.Type2 = this.Interface.extend( {
            foo2: []
        } );

        this.PlainFoo = this.Class.extend();
    },


    'Class exports contain implement method for no base class': function()
    {
        this.assertOk(
            ( this.Class.implement instanceof Function ),
            "Class provides method to implement interfaces"
        );
    },


    'Clsss object contains implement method for self as base': function()
    {
        this.assertOk(
            ( this.PlainFoo.implement instanceof Function ),
            "Classes contain an implement() method"
        );
    },


    'Can implement interface from an empty base': function()
    {
        var _self = this;
        this.assertDoesNotThrow( function()
        {
            _self.Class.implement( _self.Type, _self.Type2 );
        }, Error, "Class can implement interfaces" );
    },


    /**
     * Initially, the implement() method returned an abstract class. However, it
     * doesn't make sense to create a class without any actual definition (and
     * there's other implementation considerations that caused this route to be
     * taken). One wouldn't do "class Foo implements Type", and not provide any
     * body.
     *
     * Therefore, implement() should return nothing useful until extend() is
     * called on it.
     */
    'Result of implement is not usable as a class': function()
    {
        var _self  = this,
            result = this.Class.implement( this.Type );

        this.assertEqual(
            ( _self.Class.isClass( result ) ),
            false,
            "Result of implement operation on class is not usable as a Class"
        );
    },


    /**
     * As a consequence of the above, we must extend with an empty definition
     * (base) in order to get our abstract class.
     */
    'Abstract methods are copied into new class using empty base': function()
    {
        var Foo = this.AbstractClass.implement( this.Type, this.Type2 )
            .extend( {} );

        this.assertOk(
            ( ( Foo.prototype.foo instanceof Function )
                && ( Foo.prototype.foo2 instanceof Function )
            ),
            "Abstract methods are copied into the new class prototype " +
                "(empty base)"
        );
    },


    'Can implement interface atop an existing class': function()
    {
        var _self = this;

        this.assertDoesNotThrow( function()
        {
            _self.PlainFoo.implement( _self.Type, _self.Type2 );
        }, Error, "Classes can implement interfaces" );
    },


    /**
     * Ensure the same system mentioned above also applies to the extend()
     * method on existing classes
     */
    'Implementing interface atop existing class not usable by default':
    function()
    {
        var result = this.PlainFoo.implement( this.Type );

        this.assertEqual(
            ( this.Class.isClass( result ) ),
            false,
            "Result of implementing interfaces on an existing base is not " +
                "usable as a Class"
        );
    },


    'Abstract method copied into new class using existing base': function()
    {
        var PlainFoo2 = this.AbstractClass
            .implement( this.Type, this.Type2 )
            .extend( this.PlainFoo, {} );

        this.assertOk(
            ( ( PlainFoo2.prototype.foo instanceof Function )
                && ( PlainFoo2.prototype.foo2 instanceof Function )
            ),
            "Abstract methods are copied into the new class prototype " +
                "(concrete base)"
        );
    },


    /**
     * Since interfaces can contain only abstract methods, it stands to
     * reason that any class implementing an interface without providing any
     * concrete methods should be abstract by default.
     */
    'Classes implementing interfaces are considered abstract by default':
    function()
    {
        var Foo = this.AbstractClass.implement( this.Type ).extend( {} );

        this.assertEqual(
            Foo.isAbstract(),
            true,
            "Classes that implements interface(s) are considered abstract if " +
                "the implemented methods have no concrete implementations"
        );
    },


    'Instances of classes are instances of their implemented interfaces':
    function()
    {
        var Foo = this.AbstractClass.implement( this.Type, this.Type2 )
            .extend( {} );

        // concrete implementation so that we can instantiate it
        var ConcreteFoo = Foo.extend(
            {
                'foo':  function() {},
                'foo2': function() {}
            }),

            concrete_inst = ConcreteFoo()
        ;

        this.assertOk(
            ( concrete_inst.isInstanceOf( this.Type )
                && concrete_inst.isInstanceOf( this.Type2 )
            ),
            "Instances of classes implementing interfaces are considered to " +
                "be instances of the implemented interfaces"
        );

        this.assertEqual(
            ConcreteFoo.isAbstract(),
            false,
            "Concrete implementations are not considered to be abstract"
        );
    },


    /**
     * Consider the following scenario:
     *
     * MyClass.implement( Type ).extend( MyOtherClass, {} );
     *
     * What the above is essentially saying is: "I'd like to extend MyClass by
     * implementing Type. Oh, no, wait, I'd actually like it to extend
     * MyOtherClass." That doesn't make sense! Likely, it's unintended. Prevent
     * confusion and bugs. Throw an error.
     */
    'Cannot specify parent after implementing atop existing class': function()
    {
        var PlainFoo2 = this.AbstractClass
            .implement( this.Type, this.Type2 )
            .extend( this.PlainFoo, {} );

        this.assertThrows( function()
            {
                // should not be permitted
                this.PlainFoo.implement( this.Type, this.Type2 )
                    .extend( PlainFoo2, {} );
            },
            Error,
            "Cannot specify new parent for extend() when implementing from " +
                "existing class"
        );
    },


    /**
     * Opposite of the above test. If a parent wasn't specified to begin with,
     * then we're fine to specify it in extend().
     */
    'Can specify parent if implementing atop empty class': function()
    {
        var _self = this;

        this.assertDoesNotThrow(
            function()
            {
                // this /should/ work
                _self.AbstractClass.implement( _self.Type )
                    .extend( _self.PlainFoo, {} );
            },
            Error,
            "Can specify parent for extend() when implementing atop an " +
                "empty base"
        );
    },


    /**
     * If more than two arguments are given to extend(), then the developer
     * likely does not understand the API. Throw an error to prevent some
     * bugs/confusion.
     */
    'Throws exception if extend contains too many arguments': function()
    {
        var _self = this;

        this.assertThrows( function()
        {
            _self.Class.implement( _self.Type )
                .extend( _self.PlainFoo, {}, 'extra' );
        }, Error, "extend() after implementing accepts no more than two args" );
    }
} );

} )( module['test/Class/ImplementTest'] = {}, 'test/Class' );
/** TEST CASE: Class/InstanceSafetyTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Class/InstanceSafetyTest...<br />' )
/**
 * Tests safety of class instances
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut = this.require( 'class' );
    },


    /**
     * Ensure that we're not getting/setting values of the prototype, which
     * would have disasterous implications (=== can also be used to test for
     * references, but this test demonstrates the functionality that we're
     * looking to ensure)
     */
    'Multiple instances of same class do not share array references':
    function()
    {
        var C    = this.Sut.extend( { arr: [] } ),
            obj1 = new C(),
            obj2 = new C();

        obj1.arr.push( 'one' );
        obj2.arr.push( 'two' );

        // if the arrays are distinct, then each will have only one element
        this.assertEqual( obj1.arr[ 0 ], 'one' );
        this.assertEqual( obj2.arr[ 0 ], 'two' );
        this.assertEqual( obj1.arr.length, 1 );
        this.assertEqual( obj2.arr.length, 1 );
    },


    /**
     * Same concept as above, but with objects instead of arrays.
     */
    'Multiple instances of same class do not share object references':
    function()
    {
        var C    = this.Sut.extend( { obj: {} } ),
            obj1 = new C(),
            obj2 = new C();

        obj1.obj.a = true;
        obj2.obj.b = true;

        this.assertEqual( obj1.obj.a, true );
        this.assertEqual( obj1.obj.b, undefined );

        this.assertEqual( obj2.obj.a, undefined );
        this.assertEqual( obj2.obj.b, true );
    },


    /**
     * Ensure that the above checks extend to subtypes.
     */
    'Instances of subtypes do not share property references': function()
    {
        var C2 = this.Sut.extend( { arr: [], obj: {} } ).extend( {} ),
            obj1 = new C2(),
            obj2 = new C2();

        this.assertNotEqual( obj1.arr !== obj2.arr );
        this.assertNotEqual( obj1.obj !== obj2.obj );
    }
} );
} )( module['test/Class/InstanceSafetyTest'] = {}, 'test/Class' );
/** TEST CASE: Class/InteropTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Class/InteropTest...<br />' )
/**
 * Tests class interoperability with vanilla ECMAScript
 *
 *  Copyright (C) 2014 Mike Gerwitz
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
 * Note that these tests all use the `new' keyword for instantiating
 * classes, even though it is not required with ease.js; this is both for
 * historical reasons (when `new' was required during early development) and
 * because we are not testing (and do want to depend upon) that feature.
 */

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Class    = this.require( 'class' );
        this.fallback = this.require( 'util' ).definePropertyFallback();
    },


    /**
     * While this may seem at odds with ease.js' philosophy (because ease.js
     * methods are *not* virtual by default), we do not have much choice in
     * the matter: JavaScript is very lax and does not offer a way to
     * declare something as virtual or otherwise. Given that, we have to
     * choose between implicit virtual methods, or never allowing the user
     * to override methods inherited from a prototype. The latter is not a
     * wise choice, since there would be no way to change that behavior.
     *
     * Of course, if such a distinction were important, a wrapper class
     * could be created that simply extends the prototype, marks methods
     * virtual as appropriate, and retain only that reference for use from
     * that point forward.
     */
    'Methods inherited from a prototype are implicitly virtual': function()
    {
        var expected = {};

        var P = function()
        {
            this.foo = function()
            {
                return null;
            };
        }

        var Class = this.Class,
            inst;

        // if an error is thrown here, then we're probably not virtual
        this.assertDoesNotThrow( function()
        {
            inst = Class.extend( P,
            {
                'override foo': function()
                {
                    return expected;
                }
            } )();
        } );

        // the sky is falling if the above worked but this didn't
        this.assertStrictEqual( inst.foo(), expected );
    },


    /**
     * Complement to the above test.
     */
    'Prototype method overrides must provide override keyword': function()
    {
        var P = function()
        {
            this.foo = function() {};
        };

        var Class = this.Class;
        this.assertThrows( function()
        {
            Class.extend( P,
            {
                // missing override keyword
                foo: function() {}
            } );
        } );
    },


    /**
     * This was a subtle bug that creeped up in a class that was derived
     * from a prototype: the prototype was setting its property values
     * (which are of course public), which the class was also manipulating.
     * Unfortunately, the class was manipulating a property of a same name
     * on the private visibility object, whereas the prototype instance was
     * manipulating it on the public. Therefore, the value of the property
     * varied depending on whether you asked the class instance or the
     * prototype instance that it inherited. Yikes.
     *
     * The root issue of this was even more subtle: the parent method (that
     * does the manipulation) was invoked, meaning that it was executed
     * within the context of the private visibility object, which is what
     * caused the issue. However, this issue is still valid regardless of
     * whether a parent method is called.
     *
     * Mitigating this is difficult, so we settle for a combination of good
     * guessing and user education. We assume that all non-function fields
     * set on the object (its own fields---not the prototype chain) by the
     * constructor  are public and therefore need to be proxied, and so
     * implicitly declare them as such. Any remaining properties that are
     * set on the object (e.g. set by methods but not initialized in the
     * ctor) will need to be manually handled by declaring them as public in
     * the class. We test the first case here.
     */
    'Recognizes and proxies prototype properties as public': function()
    {
        var expected  = 'baz',
            expected2 = 'buzz';

        // ctor initializes a single property, which is clearly public (as
        // all fields on an object are)
        var P = function()
        {
            this.foo = 'bar';

            this.updateFoo = function( val )
            {
                this.foo = val;
            };
        };

        var inst = this.Class.extend( P,
        {
            // since updateField is invoked within the context of the
            // instance's private visibility object (unless falling back),
            // we need to ensure that the set of foo is properly proxied
            // back to the public property
            'override updateFoo': function( val )
            {
                // consider that we're now invoking the parent updateFoo
                // within the context of the private visibility object,
                // *not* the public visibility object that it is accustomed
                // to
                this.__super( val );
                return this;
            },

            ownUpdateFoo: function( val )
            {
                this.foo = val;
                return this;
            }
        } )();

        // if detection failed, then the value of foo will still be "bar"
        this.assertEqual( inst.ownUpdateFoo( expected ).foo, expected );

        // another interesting case; they should be mutual, but it's still
        // worth demonstrating (see docblock comments)
        this.assertEqual( inst.updateFoo( expected2 ).foo, expected2 );
    },


    /**
     * This demonstrates what happens if ease.js is not aware of a
     * particular property. This test ensures that the result is as
     * expected.
     *
     * This does not apply in the case of a fallback, because there are not
     * separate visibility objects in that case.
     */
    'Does not recognize non-ctor-initialized properties as public':
    function()
    {
        if ( this.fallback )
        {
            // no separate visibility layers; does not apply
            return;
        }

        var expected = 'bar';

        var P = function()
        {
            this.init = function( val )
            {
                // this was not initialized in the ctor
                this.foo = val;
                return this;
            };
        };

        var inst = this.Class.extend( P,
        {
            rmfoo: function()
            {
                // this is not proxied
                this.foo = undefined;
                return this;
            },

            getFoo: function()
            {
                return this.foo;
            }
        } )();

        // the public foo and the foo visible inside the class are two
        // different references, so rmfoo() will have had no effect on the
        // public API
        this.assertEqual(
            inst.init( expected ).rmfoo().foo,
            expected
        );

        // but it will be visible internally
        this.assertEqual( inst.getFoo(), undefined );
    },


    /**
     * In the case where ease.js is unable to do so automatically, we should
     * be able to correct the proxy situation ourselves. This is where the
     * aforementioned "education" part comes in; it will be documented in
     * the manual.
     */
    'Declaring non-ctor-initialized properties as public resolves proxy':
    function()
    {
        var expected = 'bar';

        var P = function()
        {
            this.init = function()
            {
                // this was not initialized in the ctor
                this.foo = null;
                return this;
            };
        };

        var inst = this.Class.extend( P,
        {
            // the magic
            'public foo': null,

            setFoo: function( val )
            {
                this.foo = val;
                return this;
            }
        } )();

        this.assertEqual( inst.init().setFoo( expected ).foo, expected );
    },


    /**
     * While this should follow as a conseuqence of the above, let's be
     * certain, since it would re-introduce the problems that we are trying
     * to avoid (not to mention it'd be inconsistent with OOP conventions).
     */
    'Cannot de-escalate visibility of prototype properties': function()
    {
        var P = function() { this.foo = 'bar'; };

        var Class = this.Class;
        this.assertThrows( function()
        {
            Class.extend( P,
            {
                // de-escalate from public to protected
                'protected foo': ''
            } );
        } );
    },


    /**
     * This check is probably not necessary, but is added to prevent any
     * potential regressions. This ensures that public methods on the
     * prototype will always return the public visibility object---and they
     * would anyway, since that's the context in which they are invoked
     * through the public API.
     *
     * The only other concern is that when they are invoked by other ease.js
     * methods, then they are passed the private member object as the
     * context. In this case, however, the return value is passed back to
     * the caller (the ease.js method), which properly handles returning the
     * public member object instead.
     */
    'Returning `this` from prototype method yields public obj': function()
    {
        var P = function()
        {
            // when invoked by an ease.js method, is passed private member
            // object
            this.pub = function() { return this; }
        };

        var inst = this.Class.extend( P, {} )();

        // should return itself; we should not have modified that behavior
        this.assertStrictEqual( inst.pub(), inst );
    },


    /**
     * This is a regression test for an interesting (and particularily
     * nasty) bug for a situation that is probably reasonably rare. The
     * original check for a non-class supertype checked whether the
     * supertype was an instance of the internal base class. While this
     * works, it unforunately causes problems for subtypes of the class that
     * extended the prototype---the check will fail, since there is no
     * ClassBase in the prototype chain.
     *
     * This resulted in it processing the class fields, which ended up
     * overwriting ___$$vis$$, which clobbered all the methods. Doh.
     */
    'Subtypes of prototype subtypes yield stable classes': function()
    {
        function P() {};

        // sub-subtype of P
        var expected = {};
        var C = this.Class.extend( P, {} ).extend(
        {
            foo: function() { return expected; }
        } );

        var inst = C();

        // this should be recognized as a class (prior to the fix, it was
        // not), and inst should be an instance of a class
        this.assertOk( this.Class.isClass( C ) );
        this.assertOk( this.Class.isClassInstance( inst ) );
        this.assertOk( this.Class.isA( C, inst ) );

        // before the fix, foo is undefined since ___$$vis$$ was clobbered
        this.assertStrictEqual( inst.foo(), expected );
    },


    /**
     * When prototypally extending a class, it is not wise to invoke the
     * constructor (just like ease.js does not invoke the constructor of
     * subtypes until the supertype is instantiated), as the constructor may
     * validate its arguments, or may even have side-effects. Expose this
     * internal deferral functionality for our prototypal friends.
     *
     * It is incredibly unwise to use this function purely to circumvent the
     * constructor, as classes will use the constructor to ensure that the
     * inststance is in a consistent and expected state.
     *
     * This may also have its uses for stubbing/mocking.
     */
    'Can defer invoking __construct': function()
    {
        var expected = {};

        var C = this.Class(
        {
            __construct: function()
            {
                throw Error( "__construct called!" );
            },

            foo: function() { return expected; }
        } );

        var inst;
        this.assertDoesNotThrow( function()
        {
            inst = C.asPrototype();
        } );

        // should have instantiated C without invoking its constructor
        this.assertOk( this.Class.isA( C, inst ) );

        // we should be able to invoke methods even though the ctor has not
        // yet run
        this.assertStrictEqual( expected, inst.foo() );
    },


    /**
     * Ensure that the prototype is able to invoke the deferred constructor.
     * Let's hope they actually do. This should properly bind the context to
     * whatever was provided; it should not be overridden. But see the test
     * case below.
     */
    'Can invoke constructor within context of prototypal subtype':
    function()
    {
        var expected = {};

        var C = this.Class(
        {
            foo: null,
            __construct: function() { this.foo = expected; }
        } );

        function SubC() { this.__construct.call( this ); }
        SubC.prototype = C.asPrototype();

        this.assertStrictEqual(
            ( new SubC() ).foo,
            expected
        );
    },


    /**
     * Despite being used as part of a prototype, it's important that
     * ease.js' context switching between visibility objects remains active.
     */
    'Deferred constructor still has access to private context': function()
    {
        var expected = {};

        var C = this.Class(
        {
            'private _foo': null,
            __construct: function() { this._foo = expected; },
            getFoo: function() { return this._foo }
        } );

        function SubC() { this.__construct.call( this ); }
        SubC.prototype = C.asPrototype();

        this.assertStrictEqual(
            ( new SubC() ).getFoo(),
            expected
        );
    }
} );

} )( module['test/Class/InteropTest'] = {}, 'test/Class' );
/** TEST CASE: Class/NameTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Class/NameTest...<br />' )
/**
 * Tests class naming
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
 * TODO: This would benefit from an assertion that combines an exception
 *       test with an assertion on is message.
 */

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut           = this.require( 'class' );
        this.AbstractClass = this.require( 'class_abstract' );
    },


    /**
     * Classes may be named by passing the name as the first argument to the
     * module
     */
    'Class defined with name is returned as a valid class': function()
    {
        this.assertOk(
            this.Sut.isClass( this.Sut( 'Foo', {} ) )
        );
    },


    /**
     * The class definition must be an object, which is equivalent to the
     * class body
     */
    'Named class definition requires that field definition be an object':
    function()
    {
        var name = 'Foo';

        try
        {
            this.Sut( name, 'Bar' );

            // if all goes well, we'll never get to this point
            this.assertFail(
                "Second argument to named class must be the definition"
            );
        }
        catch ( e )
        {
            this.assertNotEqual(
                e.message.match( name ),
                null,
                "Error string contains class name"
            );
        }
    },


    /**
     * Extraneous arguments likely indicate a misunderstanding of the API
     */
    'Named class definition is strict on argument count': function()
    {
        var name = 'Foo',
            args = [ name, {}, 'extra' ]
        ;

        // we should be permitted only two arguments
        try
        {
            this.Sut.apply( null, args );

            // we should not get to this line (an exception should be thrown
            // due to too many arguments)
            this.assertFail(
                "Should accept only two arguments when creating named class"
            );
        }
        catch ( e )
        {
            var errstr = e.message;

            this.assertNotEqual(
                errstr.match( name ),
                null,
                "Named class error should provide name of class"
            );

            this.assertNotEqual(
                errstr.match( args.length + ' given' ),
                null,
                "Named class error should provide number of given arguments"
            );
        }
    },


    /**
     * By default, anonymous classes should just state that they are a class
     * when they are converted to a string
     */
    'Converting anonymous class to string yields class string': function()
    {
        // concrete
        this.assertEqual(
            this.Sut( {} ).toString(),
            '(Class)'
        );
    },


    /**
     * Similar concept to above
     */
    'Converting abstract anonymous class to string yields class string':
    function()
    {
        this.assertEqual(
            this.AbstractClass( { 'abstract foo': [] } ).toString(),
            '(AbstractClass)'
        );
    },


    /**
     * If the class is named, then the name should be presented when it is
     * converted to a string
     */
    'Converting named class to string yields string containing name':
    function()
    {
        var name = 'Foo';

        // concrete
        this.assertEqual(
            this.Sut( name, {} ).toString(),
            name
        );

        // abstract
        this.assertEqual(
            this.AbstractClass( name, { 'abstract foo': [] } ).toString(),
            name
        );
    },


    /**
     * Class instances are displayed differently than uninstantiated
     * classes. Mainly, they output that they are an object, in addition to
     * the class name.
     */
    'Converting class instance to string yields instance string':
    function()
    {
        var name  = 'Foo',
            anon  = this.Sut( {} )(),
            named = this.Sut( name, {} )()
        ;

        this.assertEqual( anon.toString(), '#<anonymous>' );
        this.assertEqual( named.toString(), '#<' + name + '>' );
    },


    /**
     * In order to accommodate syntax such as extending classes, ease.js
     * supports staging class names. This will return an object that
     * operates exactly like the normal Class module, but will result in a
     * named class once the class is created.
     */
    'Can create named class using staging method': function()
    {
        var name   = 'Foo',
            named  = this.Sut( name ).extend( {} );

        // ensure what was returned is a valid class
        this.assertEqual(
            this.Sut.isClass( named ),
            true,
            "Named class generated via staging method is considered to " +
                "be a valid class"
        );

        // was the name set?
        this.assertEqual(
            named.toString(),
            name,
            "Name is set on named clas via staging method"
        );
    },


    /**
     * We should be able to continue to implement interfaces using the
     * staging method just as we would without it.
     */
    'Can implement interfaces using staging method': function()
    {
        var name      = 'Foo',
            Interface = this.require( 'interface' ),
            namedi    = this.Sut( name )
                .implement( Interface( {} ) )
                .extend( {} );

        // we should also be able to implement interfaces
        this.assertEqual(
            this.Sut.isClass( namedi ),
            true,
            "Named class generated via staging method, implementing an " +
                "interface, is considered to be a valid class"
        );

        this.assertEqual(
            namedi.toString(),
            name,
            "Name is set on named class via staging method when implementing"
        );
    },


    /**
     * Similarily, the extend method should retain its ability to extend
     * existing classes.
     */
    'Can extend existing classes using staging method': function()
    {
        var name   = 'Foo',
            named  = this.Sut( name ).extend( {} ),
            namede = this.Sut( name ).extend( named, {} );

        this.assertEqual( this.Sut.isClass( namede ), true );

        this.assertOk( this.Sut.isInstanceOf( named, namede() ) );
        this.assertEqual( namede.toString(), name );
    },


    /**
     * The class name should be provided in the error thrown when attempting
     * to instantiate an abstract class, if it's available
     */
    'Class name is given when attempting to instantiate abstract class':
    function()
    {
        var name = 'Foo';

        try
        {
            this.Sut( name, { 'abstract foo': [] } )();

            // we're not here to test to make sure it is thrown, but if it's
            // not, then there's likely a problem
            this.assertFail(
                "Was expecting instantiation error; there's a bug somewhere"
            );
        }
        catch ( e )
        {
            this.assertNotEqual(
                e.message.match( name ),
                null,
                "Abstract class instantiation error should contain " +
                    "class name"
            );
        }

        // if no name is provided, then (anonymous) should be indicated
        try
        {
            this.Sut( { 'abstract foo': [] } )();

            // we're not here to test to make sure it is thrown, but if it's
            // not, then there's likely a problem
            this.assertFail(
                "Was expecting instantiation error; there's a bug somewhere"
            );
        }
        catch ( e )
        {
            this.assertNotEqual(
                e.message.match( '(anonymous)' ),
                null,
                "Abstract class instantiation error should recognize " +
                    "that class is anonymous if no name was given"
            );
        }
    }
} );
} )( module['test/Class/NameTest'] = {}, 'test/Class' );
/** TEST CASE: Class/ParentTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Class/ParentTest...<br />' )
/**
 * Tests class parent invocation
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
 * TODO: This should test the appropriate functionality directly, not
 * through the class module.
 */

require( 'common' ).testCase(
{
    setUp: function()
    {
        this.Sut = this.require( 'class' );
    },


    /**
     * An overridden parent method should never be invoked without
     * explicitly requesting such.
     */
    'Subtype does not invoke overridden parent method by default':
    function()
    {
        var called = false;

        this.Sut( { 'virtual foo': function() { called = true; } } )
            .extend( { 'override foo': function() {} } )
            ().foo();

        this.assertOk( !called );
    },


    /**
     * We provide a __super reference for invoking the parent method; all
     * arguments should be forwarded.
     */
    'Subtype can invoke parent method with arguments': function()
    {
        var args     = null,
            expected1 = "foobar",
            expected2 = "baz";

        this.Sut( { 'virtual foo': function( a, b ) { args = [ a, b ]; } } )
            .extend( {
                'override foo': function( a, b ) { this.__super( a, b ); }
            } )
            ().foo( expected1, expected2 );

        this.assertNotEqual( args, null );
        this.assertEqual( args[ 0 ], expected1 );
        this.assertEqual( args[ 1 ], expected2 );
    }
} );
} )( module['test/Class/ParentTest'] = {}, 'test/Class' );
/** TEST CASE: Class/VisibilityTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Class/VisibilityTest...<br />' )
/**
 * Tests class member visibility (public, private, protected)
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

var pub  = 'foo',
    prot = 'bar',
    priv = 'baz',

    pubf  = function() { return pub; },
    protf = function() { return prot; },
    privf = function() { return priv; }
;


require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Class     = this.require( 'class' );
        this.Interface = this.require( 'interface' );
        this.util      = this.require( 'util' );

        // new anonymous class instance
        this.Foo = this.Class.extend( {
            'public pub':      pub,
            'protected peeps': prot,
            'private parts':   priv,

            'public pubf':     pubf,
            'protected protf': protf,
            'private privf':   privf,


            'virtual public getProp': function( name )
            {
                // return property, allowing us to break encapsulation for
                // protected/private properties (for testing purposes)
                return this[ name ];
            },


            /**
             * Does the same as the above, but we won't override this one
             */
            'public nonOverrideGetProp': function( name )
            {
                return this[ name ];
            },


            /**
             * Allows us to set a value from within the class
             */
            'public setValue': function( name, value )
            {
                this[ name ] = value;
            },


            'public getSelf': function()
            {
                return this;
            },


            'virtual public getSelfOverride': function()
            {
                // override me
            },


            'public getPrivProp': function()
            {
                return this.parts;
            },


            'public invokePriv': function()
            {
                return this._priv();
            },


            'private _priv': function()
            {
                return priv;
            }
        } );

        // subtype
        this.SubFoo = this.Foo.extend( {
            'private _pfoo': 'baz',

            'override public getSelfOverride': function()
            {
                // return this from overridden method
                return this;
            },


            /**
             * We have to override this so that 'this' is not bound to the supertype
             */
            'override public getProp': function( name )
            {
                // return property, allowing us to break encapsulation for
                // protected/private properties (for testing purposes)
                return this[ name ];
            },


            'private myOwnPrivateFoo': function() {}
        } );
    },


    setUp: function()
    {
        // instance of Foo
        this.foo     = this.Foo();
        this.sub_foo = this.SubFoo();
    },


    /**
     * Public members are the only members added to the instance's prototype to
     * be accessible externally
     */
    'Public members are accessible externally': function()
    {
        this.assertEqual(
            this.foo.pub,
            pub,
            "Public properties are accessible via public interface"
        );

        this.assertEqual(
            this.foo.pubf(),
            pub,
            "Public methods are accessible via public interface"
        );
    },


    /**
     * For reasons that are discussed in the next test (writing to public
     * properties), we need to make sure public members are available
     * internally.  Actually, we don't need to test public methods, really, but
     * it's in there for good measure. Who knows what bugs may be introduced in
     * the future.
     *
     * This ensures that the getter is properly proxying the value to us.
     */
    'Public members are accessible internally': function()
    {
        this.assertEqual(
            this.foo.getProp( 'pub' ),
            pub,
            "Public properties are accessible internally"
        );

        this.assertEqual(
            this.foo.getProp( 'pubf' )(),
            pub,
            "Public methods are accessible internally"
        );
    },


    /**
     * This may sound like an odd test, but it's actually very important. Due to
     * how private/protected members are implemented, it compromises public
     * members. In fact, public members would not work internally without what
     * is essentially a proxy via setters.
     *
     * This test is to ensure that the setter is properly forwarding writes to
     * the object within the prototype chain containing the public values.
     * Otherwise, setting the value would simply mask it in the prototype chain.
     * The value would appear to have changed internally, but when accessed
     * externally, the value would still be the same. That would obviously be a
     * problem ;)
     */
    'Public properties are writable internally': function()
    {
        var val = 'moomookittypoo';

        // start by setting the value
        this.foo.setValue( 'pub', val );

        // we should see that change internally...
        this.assertEqual(
            this.foo.getProp( 'pub' ),
            val,
            "Setting the value of a public property internally should be " +
                "observable /internally/"
        );

        // ...as well as externally
        this.assertEqual(
            this.foo.pub,
            val,
            "Setting the value of a public property internally should be " +
                "observable /externally/"
        );
    },


    'Protected and private members are not accessible externally': function()
    {
        // browsers that do not support the property proxy will not support
        // encapsulating properties
        if ( this.util.definePropertyFallback() )
        {
            return;
        }

        this.assertEqual(
            this.foo.peeps,
            undefined,
            "Protected properties are inaccessible via public interface"
        );

        this.assertEqual(
            this.foo.parts,
            undefined,
            "Private properties are inaccessible via public interface"
        );

        this.assertEqual(
            this.foo.protf,
            undefined,
            "Protected methods are inaccessible via public interface"
        );

        this.assertEqual(
            this.foo.privf,
            undefined,
            "Private methods are inaccessible via public interface"
        );
    },


    /**
     * Protected members should be accessible from within class methods
     */
    'Protected members are accessible internally': function()
    {
        this.assertEqual(
            this.foo.getProp( 'peeps' ),
            prot,
            "Protected properties are available internally"
        );

        // invoke rather than checking for equality, because the method may be
        // wrapped
        this.assertEqual(
            this.foo.getProp( 'protf' )(),
            prot,
            "Protected methods are available internally"
        );
    },


    /**
     * Private members should be accessible from within class methods
     */
    'Private members are accessible internally': function()
    {
        this.assertEqual(
            this.foo.getProp( 'parts' ),
            priv,
            "Private properties are available internally"
        );

        // invoke rather than checking for equality, because the method may be
        // wrapped
        this.assertEqual(
            this.foo.getProp( 'privf' )(),
            priv,
            "Private methods are available internally"
        );
    },


    /**
     * Inheritance 101; protected members should be available to subtypes
     */
    'Protected members are inherited from parent': function()
    {
        this.assertEqual(
            this.sub_foo.getProp( 'peeps' ),
            prot,
            "Protected properties are available to subtypes"
        );

        // invoke rather than checking for equality, because the method may be
        // wrapped
        this.assertEqual(
            this.sub_foo.getProp( 'protf' )(),
            prot,
            "Protected methods are available to subtypes"
        );
    },


    /**
     * Interface 101-2: We do not want private members to be available to
     * subtypes.
     */
    'Private members of supertypes are inaccessible to subtypes': function()
    {
        // browsers that do not support the property proxy will not support
        // encapsulating properties
        if ( this.util.definePropertyFallback() )
        {
            return;
        }

        this.assertEqual(
            this.sub_foo.getProp( 'parts' ),
            undefined,
            "Private properties of supertypes should be unavailable to subtypes"
        );

        // invoke rather than checking for equality, because the method may be
        // wrapped
        this.assertEqual(
            this.sub_foo.getProp( 'privf' ),
            undefined,
            "Private methods of supertypes should be unavailable to subtypes"
        );
    },


    /**
     * For good measure, let's make sure we didn't screw anything up. To ensure
     * that the same object isn't being passed around to subtypes, ensure that
     * multiple class instances do not share prototypes.
     */
    'Protected members are not shared between class instances': function()
    {
        var val = 'foobar';

        this.foo.setValue( 'prot', val );

        // ensure that class instances do not share values (ensuring the same
        // object isn't somehow being passed around)
        this.assertNotEqual(
            this.sub_foo.getProp( 'prot' ),
            val,
            "Class instances do not share protected values (subtype)"
        );

        // do the same for multiple instances of the same type
        var sub_foo2 = this.SubFoo();
        sub_foo2.setValue( 'prot', val );

        this.assertNotEqual(
            this.sub_foo.getProp( 'prot' ),
            val,
            "Class instances do not share protected values (same type)"
        );
    },


    /**
     * When a method is called, 'this' is bound to the property object
     * containing private and protected members. Returning 'this' would
     * therefore be a very bad thing. Not only would it break encapsulation, but
     * it would likely have other problems down the road.
     *
     * Therefore, we have to check the return value of the method. If the return
     * value is the property object that it was bound to, we need to replace the
     * return value with the actual class instance. This allows us to
     * transparently enforce encapsulation. How sweet is that?
     */
    'Returning self from method should return instance not prop obj': function()
    {
        this.assertDeepEqual(
            this.foo.getSelf(),
            this.foo,
            "Returning 'this' from a method should return instance of self"
        );

        // what happens in the case of inheritance?
        this.assertDeepEqual(
            this.sub_foo.getSelf(),
            this.sub_foo,
            "Returning 'this' from a super method should return the subtype"
        );

        // finally, overridden methods should still return the instance
        this.assertDeepEqual(
            this.sub_foo.getSelfOverride(),
            this.sub_foo,
            "Returning 'this' from a overridden method should return subtype"
        );
    },


    /**
     * This one's a particularly nasty bug that snuck up on me. Private members
     * should not be accessible to subtypes; that's a given. However, they need
     * to be accessible to the parent methods. For example, let's say class Foo
     * contains public method bar(), which invokes private method _baz(). This
     * is perfectly legal. Then SubFoo extends Foo, but does not override method
     * bar().  Invoking method bar() should still be able to invoke private
     * method _baz(), because, from the perspective of the parent class, that
     * operation is perfectly legal.
     *
     * The resolution of this bug required a slight system redesign. The
     * short-term fix was to declare any needed private members are protected,
     * so that they were accessible by the subtype.
     */
    'Parent methods can access private members of parent': function()
    {
        // properties
        this.assertEqual(
            this.sub_foo.getPrivProp(),
            priv,
            "Parent methods should have access to the private properties of " +
                "the parent"
        );

        // methods
        this.assertEqual(
            this.sub_foo.invokePriv(),
            priv,
            "Parent methods should have access to the private methods of the " +
                "parent"
        );

        var sub_sub_foo = this.SubFoo.extend( {} )()

        // should apply to super-supertypes too
        this.assertEqual(
            sub_sub_foo.getPrivProp(),
            priv,
            "Parent methods should have access to the private properties of " +
                "the parent (2)"
        );
        this.assertEqual(
            sub_sub_foo.invokePriv(),
            priv,
            "Parent methods should have access to the private methods of the " +
                "parent (2)"
        );
    },


    /**
     * When a parent method is invoked, the parent should not be given access to
     * the private members of the invoking subtype. Why?
     *
     * This is not a matter of whether or not this is possible to do. In fact
     * it's relatively simple to implement. The issue is whether or not it makes
     * sense.  Consider a compiled language. Let's say Foo and SubFoo (as
     * defined in this test case) were written in C++. Should Foo have access to
     * a private property on SubFoo when it is overridden?
     *
     * No - that doesn't make sense. The private member is not a member of Foo
     * and therefore Foo would fail to even compile. Alright, but we don't have
     * such a restriction in our case. So why not implement it?
     *
     * Proponents of such an implementation are likely thinking of the act of
     * inheriting methods as a copy/paste type of scenario. If we inherit public
     * method baz(), and it were a copy/paste type of situation, then surely
     * baz() would have access to all of SubFoo's private members. But that is
     * not the case. Should baz() be defined as a member of Foo, then its scope
     * is restricted to Foo and its supertypes. That is not how OO works. It is
     * /not/ copy/paste. It is inheriting functionality.
     */
    'Parents should not have access to private members of subtypes': function()
    {
        // browsers that do not support the property proxy will not support
        // encapsulating properties
        if ( this.util.definePropertyFallback() )
        {
            return;
        }

        // property
        this.assertEqual(
            this.sub_foo.nonOverrideGetProp( '_pfoo' ),
            undefined,
            "Parent should not have access to private properties of subtype " +
                "whena parent method is invoked"
        );

        // member
        this.assertEqual(
            this.sub_foo.nonOverrideGetProp( '_myOwnPrivateFoo' ),
            undefined,
            "Parent should not have access to private methods of subtype " +
                "when a parent method is invoked"
        );
    },


    /**
     * Visibility escalation (protected -> private) should be permitted
     */
    'Can escalate member visibility': function()
    {
        var _self = this;

        // escalate
        this.assertDoesNotThrow( function()
        {
            _self.Class(
            {
                'protected foo': 'bar',
                'virtual protected baz': function() {}
            } ).extend( {
                'public foo': 'bar',
                'override public baz': function() {}
            } );
        }, Error, "Can escalate visibility of subtype members" );

        // same level of visibility
        this.assertDoesNotThrow( function()
        {
            _self.Class(
            {
                'protected foo': 'bar',
                'virtual protected baz': function() {}
            } ).extend( {
                'protected foo': 'bar',
                'override protected baz': function() {}
            } );
        }, Error, "Can retain level of visibility for subtype members" );
    },


    /**
     * We should /not/ be able to de-escalate member visibility
     * (public -> {protected,private}
     */
    'Cannot de-escalate member visibility': function()
    {
        var _self = this;

        // public -> protected
        this.assertThrows( function()
        {
            _self.Class(
            {
                'public foo': 'bar'
            } ).extend( {
                'protected foo': 'bar'
            } );
        }, Error, "Cannot de-escalate visibility of sub-props to protected" );

        this.assertThrows( function()
        {
            _self.Class(
            {
                'virtual public baz': function() {}
            } ).extend( {
                'protected baz': function() {}
            } );
        }, Error, "Cannot de-escalate visibility of sub-methods to protected" );


        // public -> private
        this.assertThrows( function()
        {
            _self.Class(
            {
                'public foo': 'bar'
            } ).extend( {
                'private foo': 'bar'
            } );
        }, Error, "Cannot de-escalate visibility of subtype props to private" );

        this.assertThrows( function()
        {
            _self.Class(
            {
                'virtual public baz': function() {}
            } ).extend( {
                'private baz': function() {}
            } );
        }, Error, "Cannot de-escalate visibility of sub-methods to private" );


        // protected -> private
        this.assertThrows( function()
        {
            _self.Class(
            {
                'protected foo': 'bar'
            } ).extend( {
                'private foo': 'bar'
            } );
        }, Error, "Cannot de-escalate visibility of sub-props to private2" );

        this.assertThrows( function()
        {
            _self.Class(
            {
                'virtual protected baz': function() {}
            } ).extend( {
                'private baz': function() {}
            } );
        }, Error, "Cannot de-escalate visibility of sub-methods to private2" );
    },


    /**
     * With the visibility implementation, it's possible that __super() will not
     * work properly with protected methods. This is because of the override
     * lookup process (which hopefully was fixed in the commit before this test
     * was originally introduced: ce736bea).
     */
    'Calling super method works properly with protected methods': function()
    {
        var val = 'foobar',
            result = this.Class( {
                'virtual protected foo': function()
                {
                    return val;
                }
            } ).extend(
            {
                // we override to public just so we can call it externally
                'override public foo': function()
                {
                    return this.__super();
                }
            } )().foo();

        this.assertEqual( result, val,
            "__super() calls work with protected overrides"
        );
    },


    /**
     * Concrete implementations of interfaces should have to follow the same
     * visibility de-escalation rules as defined in the above tests (otherwise,
     * that defeats the purpose of an interface). In other words, they must be
     * public.
     */
    'Visibility de-escalation rulse apply to interfaces': function()
    {
        var _self = this;

        this.assertThrows( function()
        {
            Class.implement( _self.Interface( { 'abstract public foo': [] } ) )
                .extend(
                {
                    // should throw an exception; visibility de-escalation
                    'protected foo': function() {}
                }
            );
        }, Error, "Cannot de-escalate visibility for interface members" );
    },


    /**
     * Due to the way the property object is laid atop of the public members, we
     * need to ensure that protected methods' functionality can /actually/ be
     * overridden, since the protected method is higher in the prototype chain
     * and therefore will be accessed before the public method.
     *
     * We don't care about private -> protected, because that's not possible
     * through inheritance.
     */
    'Can override protected method functionality with public': function()
    {
        // get the result of invoking overridden foo()
        var result = this.Class(
            {
                'virtual protected foo': function()
                {
                    return false;
                }
            } ).extend(
            {
                // override and escalate visibility of method foo()
                'override public foo': function()
                {
                    return true;
                }
            } )().foo();

        // if the override was successful, we'll be able to invoke the
        // overridden method
        this.assertEqual( result, true,
            "Can properly override protected methods with public"
        );
    },


    /**
     * Similar to above test, but ensure that overrides also take effect via
     * the internal visibility object.
     */
    'Protected method overrides are observable by supertype': function()
    {
        var _self  = this,
            called = false;

        var C = this.Class(
            {
                'public doFoo': function()
                {
                    // will be overridden
                    return this.foo();
                },

                // will be overridden
                'virtual protected foo': function()
                {
                    _self.fail( true, false, "Method not overridden" );
                }
            } )
            .extend(
            {
                // should be invoked by doFoo; visibiility escalation
                'public override foo': function()
                {
                    called = true;
                }
            } );

        C().doFoo();
        this.assertOk( called );
    },


    /**
     * There was an issue where the private property object was not proxying
     * values to the true protected values. This would mean that when the parent
     * initialized protected values, those values would be unavailable to the
     * subtype. Instead, the value available to the subtype was the value that
     * was assigned as the default value in the class definition.
     */
    'Protected values are available to subtypes when set by parent': function()
    {
        var expected = 5,
            result   = this.Class(
            {
                'protected val': 0,

                'public __construct': function()
                {
                    this.val = expected;
                }
            } ).extend(
            {
                'public getVal': function()
                {
                    return this.val;
                }
            } )().getVal();

        this.assertEqual( result, expected,
            "Subtypes should have acess to protected properties values set " +
                "by super methods"
        );
    },


    /**
     * There was a bug introduced when we prevented protected members from
     * overriding public (since in the prototype chain, protected members are
     * laid atop public, and this cannot change). This bug would disallow
     * protected members from being overridden by other protected members.
     *
     * This test is both a proof and a regression test.
     */
    'Can properly override protected with protected': function()
    {
        var val    = 'foobar',
            result = this.Class(
            {
                'virtual protected foo': function() {}
            } ).extend(
            {
                // provide concrete implementation
                'override protected foo': function()
                {
                    return val;
                },

                'public doFoo': function()
                {
                    return this.foo();
                }
            } )().doFoo();
        ;

        // if everything worked as expected, the value of 'val' will have been
        // returned and stored in 'result'
        this.assertEqual( result, val,
            "Protected methods can properly be overriden by another " +
                "protected method"
        );
    }
} );

} )( module['test/Class/VisibilityTest'] = {}, 'test/Class' );
/** TEST CASE: FallbackMemberBuilderTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/FallbackMemberBuilderTest...<br />' )
/**
 * Tests fallback method builder (for pre-ES5 environment)
 *
 * Note that this test case can also be run in an ES5 environment.
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

require( './common' ).testCase(
{
    setUp: function()
    {
        // stub factories used for testing
        var stubFactory = this.require( 'MethodWrapperFactory' )(
             function( func ) { return func; }
        );

        this.sut = this.require( 'FallbackMemberBuilder' )(
            stubFactory, stubFactory
        );
    },


    'Inherits from MemberBuilder': function()
    {
        this.assertOk( this.sut instanceof this.require( 'MemberBuilder' ),
            'FallbackMemberBuilder should inherit from MemberBuilder'
        );
    },


    /**
     * Getters and setters are unsupported in pre-ES5 environments
     */
    'buildGetterSetter() method throws an exception': function()
    {
        // getter test
        try
        {
            this.sut.buildGetterSetter();
            this.fail( 'Exception should have been called (getter/setter)' );
        }
        catch ( e )
        {
            this.assertOk(
                e.message.match( /unsupported/ ),
                'Incorrect exception thrown (getter/setter)'
            );
        }
    }
});

} )( module['test/FallbackMemberBuilderTest'] = {}, 'test' );
/** TEST CASE: FallbackVisibilityObjectFactoryTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/FallbackVisibilityObjectFactoryTest...<br />' )
/**
 * Tests fallback visibility object factory
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut = this.require( 'FallbackVisibilityObjectFactory' );

        // parent of SUT
        this.VisibilityObjectFactory =
            this.require( 'VisibilityObjectFactory' );

        this.props = this.methods = {
            'public':    {},
            'protected': {},
            'private':   {}
        };
    },


    /**
     * To keep with the spirit of ease.js, we should be able to instantiate
     * VisibilityObjectFactory both with and without the 'new' keyword
     *
     * Consistency is key with these sorts of things.
     */
    'Can instantiate with and without `new` keyword': function()
    {
        // with 'new' keyword
        this.assertOk(
            ( new this.Sut() ) instanceof this.Sut,
            "Should be able to instantiate FallbackVisibilityObjectFactory " +
            "with 'new' keyword"
        );

        // without 'new' keyword
        this.assertOk(
            this.Sut() instanceof this.Sut,
            "Should be able to instantiate FallbackVisibilityObjectFactory " +
                "without 'new' keyword"
        );
    },


    /**
     * VisibilityObjectFactory should be part of our prototype chain.
     */
    'Inherits from visibility object factory': function()
    {
        // check an instance, rather than __proto__, because older engines do
        // not support it
        this.assertOk(
            this.Sut() instanceof this.VisibilityObjectFactory,
            "Fallback should inherit from VisibilityObjectFactory"
        );
    },


    /**
     * We're falling back because we do not support the private visibility layer
     * (or any layers, for that matter). Ensure it's not created.
     */
    'Setup method should not add private layer': function()
    {
        var dest = {},
            obj  = this.Sut().setup( dest, this.props, this.methods );

        this.assertStrictEqual( dest, obj,
            "Private visibility layer is not added atop destination"
        );
    },


    /**
     * Getters/setters are unsupported (thus the fallback).
     */
    'Creating property proxy should simply return self': function()
    {
        var base = {},
            dest = {};

        this.assertStrictEqual(
            this.Sut().createPropProxy( base, dest, this.props ),
            base,
            "Creating property proxy should simply return original object"
        );
    }
} );

} )( module['test/FallbackVisibilityObjectFactoryTest'] = {}, 'test' );
/** TEST CASE: Interface/ExtendTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Interface/ExtendTest...<br />' )
/**
 * Tests extending of interfaces
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

var common    = require( 'common' ),
    Interface = common.require( 'interface' ),

    // get/set test support
    gst = !( common.require( 'util' ).definePropertyFallback() )
;


common.testCase(
{
    caseSetUp: function()
    {
        // There's a couple ways to create interfaces. Test 'em both.
        this.baseTypes = [
            Interface.extend(
            {
                method: []
            } ),

            Interface( {
                method: []
            } )
        ];

        // non-object values to assert failures upon
        this.invalidExtend = [ 'moo', 5, false, undefined ];

        // bad access modifiers (cannot be used in interfaces)
        this.badAm = [ 'protected', 'private' ];
    },


    'Properties are not permitted within interfaces': function()
    {
        this.assertThrows(
            function()
            {
                Interface.extend(
                {
                    // properties are not permitted
                    prop: 'not permitted'
                });
            },
            TypeError,
            "Properties are not permitted within Interface definitions"
        );
    },


    'Getters are setters are not permitted within intefaces': function()
    {
        // don't perform get/set test if unsupported by environment
        if ( !gst )
        {
            return;
        }

        // so we don't break browsers that do not support getters/setters in object
        // notation
        var data = {};
        Object.defineProperty( data, 'foo', {
            get: function() {},
            set: function() {},

            enumerable: true
        } );

        this.assertThrows( function()
        {
            Interface.extend( data );
        }, TypeError, "Getters/setters not permitted within Interfaces" );
    },


    'Concrete methods are not permitted': function()
    {
        this.assertThrows(
            function()
            {
                Interface.extend(
                {
                    // concrete method
                    method: function() {}
                } );
            },
            TypeError,
            "Concrete methods are not permitted within Interface definitions"
        );
    },


    /**
     * Declaring (but not defining) methods by specifying their arguments as
     * arrays is supported, much like one would would declare an abstract method
     * in a class. We do not require the abstract keyword, as it would be
     * redundant.
     */
    'Method declarations (using arrays) are permitted': function()
    {
        this.assertDoesNotThrow(
            function()
            {
                Interface.extend(
                {
                    method: []
                } );
            },
            TypeError,
            "Abstract method declarations are allowed within Interface " +
                "definitions"
        );
    },


    /**
     * The defined abstract methods should be included in the resulting
     * interface
     */
    '@each(baseTypes) Interface contains defined abstract methods':
    function( T )
    {
        this.assertOk(
            ( typeof T.prototype.method === 'function' ),
            "Interface should contain defined abstract methods"
        );
    },


    /**
     * The resulting interface should be considered, by the system's
     * isInterface() call, to be an interface. Otherwise that would be a pretty
     * useless call, now wouldn't it?
     */
    '@each(baseTypes) Result is considered to be an interface': function( T )
    {
        this.assertEqual(
            Interface.isInterface( T ),
            true
        );
    },


    /**
     * Interfaces can be extended much like classes. In this case, however, we
     * are only extending the API.
     */
    '@each(baseTypes) Can extend interface using Interface.extend()':
    function( T )
    {
        var SubType = Interface.extend( T, {} );

        this.assertOk(
            ( SubType.prototype instanceof T ),
            "Generic interface extend method should be able to extend from " +
                "other interfaces"
        );
    },


    /**
     * As the term 'extending' would apply, sub-interfaces should 'inherit'
     * their parents' API.
     */
    '@each(baseTypes) Interface subtypes inherit abstract methods':
    function( T )
    {
        var SubType = Interface.extend( T, {} );

        this.assertOk(
            ( SubType.prototype.method === T.prototype.method ),
            "Interface subtypes inherit abstract methods"
        );
    },


    /**
     * One should be able to add additional methods to the API of a
     * sub-interface.
     */
    '@each(baseTypes) Interfaces can extend the API with abstract methods':
    function( T )
    {
        var SubType = Interface.extend( T,
        {
            second: []
        } );

        this.assertOk(
            ( typeof  SubType.prototype.second === 'function' ),
            "Should be able to extend interfaces with additional abstract " +
                "methods"
        );
    },


    /**
     * Interfaces should contain a built-in extend() method as a short-hand for
     * subtyping.
     */
    '@each(baseTypes) Interfaces contain an extend() method': function( T )
    {
        this.assertOk(
            ( typeof T.extend === 'function' ),
            "Interface should contain extend() method"
        );
    },


    /**
     * Similar to above, but using the interface itself's extend() method
     */
    '@each(baseTypes) extend() method on interface itself can extend':
    function( T )
    {
        var SubType = T.extend( {} );

        this.assertOk(
            ( SubType.prototype instanceof T ),
            "Interface extend method can extend interfaces"
        );
    },


    /**
     * Similar to above, but using the interface itself's extend() method
     */
    '@each(baseTypes) Interface\'s extend() method can add to the API':
    function( T )
    {
        var SubType = T.extend(
        {
            second: []
        } );

        this.assertOk(
            ( typeof SubType.prototype.second === 'function' ),
            "Interfaces should be able to be extended with additional " +
                "abstract methods using shorthand extend method"
        );
    },


    /**
     * The interface invocation action depends on what arguments are passed in.
     * One use is to pass in an object as the first and only argument, creating
     * a new interface with no supertype.
     */
    '@each(invalidExtend) Invoking module to extend requires object':
    function( val )
    {
        this.assertThrows( function()
            {
                Interface( val );
            },
            TypeError,
            "Invoking interface module should require object as argument if " +
                "extending from base interface"
        );
    },


    /**
     * If defining a new interface (object as the first argument on invocation),
     * then only one argument is permitted.
     */
    'Only one argment for interface definitions is permitted': function()
    {
        var args = [ {}, 'one', 'two', 'three' ];

        // we must only provide one argument if the first argument is an object
        // (the interface definition)
        try
        {
            Interface.apply( null, args );

            // if all goes well, we don't get to this line
            this.fail(
                "Only one argument for interface definitions should be " +
                "permitted"
            );
        }
        catch ( e )
        {
            this.assertOk(
                ( e.message.search( args.length + " given" ) > -1 ),
                "Interface invocation should give argument count on error"
            );
        }
    },


    /**
     * Interfaces represent a public API that must be implemented. It does not
     * make sense to have members be anything but public. If protected members
     * are required, that is appropriate only for an abstract class.
     */
    '@each(badAm) Interface members must be public': function( am )
    {
        // protected
        this.assertThrows( function()
        {
            // am = access modifier
            var dfn = {};
            dfn[ am + ' foo' ] = [];

            Interface( dfn );
        }, Error, "Interface members should not be able to be " + am );
    },


    /**
     * We only want to permit the extending of other interfaces.
     */
    'Interfaces can only extend interfaces': function()
    {
        this.assertThrows( function()
        {
            Interface.extend( function() {}, {} );
        }, TypeError, "Should not be able to extend from non-interface" );
    }
} );

} )( module['test/Interface/ExtendTest'] = {}, 'test/Interface' );
/** TEST CASE: Interface/GeneralTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Interface/GeneralTest...<br />' )
/**
 * Tests interfaces
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

require( 'common' ).testCase(
{
    setUp: function()
    {
        this.FooType = this.require( 'interface' ).extend();
    },


    /**
     * Interface.extend(), like Class.extend(), should result in a new
     * interface.
     */
    'Interface extend method creates a new interface object': function()
    {
        this.assertOk(
            ( typeof this.FooType === 'function' ),
            "Interface extend method creates a new interface object"
        );
    },


    /**
     * Interfaces describe an API; they do not have any actual implementation.
     * It does not make sense to instantiate them.
     */
    'Interfaces cannot be instantiated': function()
    {
        this.assertThrows( function()
        {
            new this.FooType();
        }, Error, "Should not be able to instantiate interfaces" );
    },


    /**
     * To prevent altering the interface after it is defined, the resulting
     * object should be frozen, if supported by the environment.
     */
    'Generated interface should be frozen': function()
    {
        // only perform the assertion if supported by our environment
        if ( Object.isFrozen )
        {
            this.assertEqual(
                Object.isFrozen( this.FooType ),
                true,
                "Generated interface object should be frozen"
            );
        }
    }
} );
} )( module['test/Interface/GeneralTest'] = {}, 'test/Interface' );
/** TEST CASE: Interface/InteropTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Interface/InteropTest...<br />' )
/**
 * Tests interface interoperability with vanilla ECMAScript
 *
 *  Copyright (C) 2014 Free Software Foundation, Inc.
 *
 *  This file is part of GNU ease.js.
 *
 *  GNU ease.js is free software: you can redistribute it and/or modify
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut   = this.require( 'interface' );
        this.Class = this.require( 'class' );

        this.I = this.Sut(
        {
            foo: [ 'a', 'b' ],
            bar: [ 'a' ]
        } );

        this.assertICompat = function( I, inst )
        {
            this.assertOk( I.isCompatible( inst ) );
            this.assertOk( this.Sut.isInstanceOf( I, inst ) );
        };

        this.assertNotICompat = function( I, inst )
        {
            this.assertOk( !I.isCompatible( inst ) );
            this.assertOk( !this.Sut.isInstanceOf( I, inst ) );
        };
    },


    /**
     * Not all developers will wish to use ease.js, even if the library they
     * are interfacing with does. In the case of interfaces, this isn't
     * particularity important. To understand why, consider the three main
     * reasons why interfaces would be used: (1) to ensure that an object
     * conforms to a defined API; (2) to permit polymorphism; and (3) to
     * denote intent of use, meaning that even though a Basketball and Gun
     * may both implement a `shoot' method, they are not intended to be used
     * in the same context, even if both of them can be `shot'.
     *
     * Prototypes in JavaScript, without aid of a static analysis tool,
     * generally rely on duck typing to enforce interfaces. In this sense,
     * (3) can be sacrificed for the sake of interop but it's still
     * important when working with ease.js classes). Since (2) follows as a
     * consequence of (1), we need only a way to ensure that the API of the
     * prototype is compatible with the named interface. In ease.js, this is
     * is quick: the implemented interfaces are cached. With prototypes,
     * even though it's not as efficient, we can still check that each of
     * the methods named in the interface exist and are compatible (have the
     * proper number of arguments).
     *
     * This has two powerful consequences: (1) external code can interface
     * with ease.js without having to buy into its class/interface system;
     * and (2) interfaces can be created to represent existing
     * objects/prototypes (e.g. W3C DOM APIs).
     */
    'Prototype instances and objects can conform to interfaces': function()
    {
        // conforming prototype
        function P() {};
        P.prototype = {
            foo: function( a, b ) {},
            bar: function( a ) {}
        };

        var p = new P();

        // instance should therefore be conforming
        this.assertICompat( this.I, p );

        // ah but why stop there? (note that this implies that *any* object,
        // prototype or not, can conform to an interface)
        this.assertICompat( this.I, P.prototype );
    },


    /**
     * The entire point of interfaces is to ensure that a specific API is in
     * place; methods are the core component of this.
     */
    'Objects missing methods are non-conforming': function()
    {
        // missing method
        function P() {};
        P.prototype = {
            foo: function( a, b ) {}
        };

        this.assertNotICompat( this.I, new P() );
        this.assertNotICompat( this.I, P.prototype );
    },


    /**
     * ease.js enforces parameter count so that implementers are cognisant
     * of the requirements of the API. We have two cases to consider here:
     * (1) that an external prototype is attempting to conform to an ease.js
     * interface; or (2) that an interface is being developed for an
     * existing external prototype. In the former case, the user has control
     * over the parameter list. In the latter case, the interface designer
     * can design an interface that requires only the most common subset of
     * parameters, or none at all.
     */
    'Methods missing parameters are non-conforming': function()
    {
        // missing second param (at this point, we know prototype traversal
        // works, so we will just use any 'ol object)
        var obj = { foo: function( a ) {} },
            I   = this.Sut( { foo: [ 'a', 'b' ] } );

        this.assertNotICompat( I, obj );
    },


    /**
     * This test is consistent with ease.js' functionality.
     */
    'Methods are still compatible with extra parameters': function()
    {
        // extra param is okay
        var obj = { foo: function( a, b, c ) {} },
            I   = this.Sut( { foo: [ 'a', 'b' ] } );

        this.assertICompat( I, obj );
    },


    /**
     * This should go without explanation.
     */
    'Interface methods must be implemented as functions': function()
    {
        // not a function
        var obj = { foo: {} },
            I   = this.Sut( { foo: [] } );

        this.assertNotICompat( I, obj );
    },


    /**
     * Interfaces define only an API that must exist; it does not restrict a
     * more rich API.
     */
    'Additional methods do not trigger incompatibility': function()
    {
        // extra methods are okay
        var obj = { foo: function() {}, bar: function() {} },
            I   = this.Sut( { foo: [] } );

        this.assertICompat( I, obj );
    },


    /**
     * When an object is instantiated from an ease.js class, it does not
     * matter if the interface is compatible: in order to be considered an
     * instance some interface I, the instance's type must implement I; in
     * this sense, ease.js' interface typing is strict, allowing *intent* to
     * be conveyed.
     *
     * An example of why this is important can be found in the
     * interoperability section of the manual.
     */
    'Objects can be compatible but not instances of interface': function()
    {
        // same API, different interface objects
        var Ia = this.Sut( { foo: [] } ),
            Ib = this.Sut( { foo: [] } );

        var dfn = { foo: function() {} },
            Ca  = this.Class.implement( Ia ).extend( dfn ),
            Cb  = this.Class.implement( Ib ).extend( dfn );

        var ia = Ca(),
            ib = Cb();

        // clearly the two are compatible, regardless of their type
        this.assertOk( Ia.isCompatible( ia ) );
        this.assertOk( Ia.isCompatible( ib ) );
        this.assertOk( Ib.isCompatible( ia ) );
        this.assertOk( Ib.isCompatible( ib ) );

        // but ia is *not* an instance of Ib, nor ib of Ia
        this.assertOk( this.Sut.isInstanceOf( Ia, ia ) );
        this.assertOk( !this.Sut.isInstanceOf( Ia, ib ) );
        this.assertOk( this.Sut.isInstanceOf( Ib, ib ) );
        this.assertOk( !this.Sut.isInstanceOf( Ib, ia ) );
    }
} );

} )( module['test/Interface/InteropTest'] = {}, 'test/Interface' );
/** TEST CASE: Interface/NameTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Interface/NameTest...<br />' )
/**
 * Tests interface naming
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut  = this.require( 'interface' );
        this.util = this.require( 'util' );
    },


    /**
     * Interfaces may be named by passing the name as the first argument to
     * the module
     */
    'Interface accepts name': function()
    {
        var _self = this;
        this.assertDoesNotThrow( function()
        {
            var iface = _self.Sut( 'Foo', {} );
            _self.assertOk( _self.Sut.isInterface( iface ) );
        }, Error );
    },


    /**
     * The interface definition, which equates to the body of the interface,
     * must be an object
     */
    'Named interface definition requires that definition be an object':
    function()
    {
        var name = 'Foo';

        try
        {
            this.Sut( name, 'Bar' );

            // if all goes well, we'll never get to this point
            this.assertFail(
                "Second argument to named interface must be the definition"
            );
        }
        catch ( e )
        {
            this.assertNotEqual(
                e.message.match( name ),
                null,
                "Interface definition argument count error string contains " +
                    "interface name"
            );
        }
    },


    /**
     * Extraneous arguments likely indicate a misunderstanding of the API
     */
    'Named interface definition is strict on argument count': function()
    {
        var name = 'Foo',
            args = [ name, {}, 'extra' ]
        ;

        // we should be permitted only two arguments
        try
        {
            this.Sut.apply( null, args );

            // we should not get to this line (an exception should be thrown due to
            // too many arguments)
            assert.fail(
                "Should accept only two arguments when creating named interface"
            );
        }
        catch ( e )
        {
            var errstr = e.message;

            this.assertNotEqual(
                errstr.match( name ),
                null,
                "Named interface error should provide interface name"
            );

            this.assertNotEqual(
                errstr.match( args.length + ' given' ),
                null,
                "Named interface error should provide number of given arguments"
            );
        }
    },


    /**
     * By default, anonymous interfacees should simply state that they are a
     * interface when they are converted to a string
     */
    'Converting anonymous interface to string yields generic string':
    function()
    {
        this.assertEqual(
            this.Sut( {} ).toString(),
            '[object Interface]'
        );
    },


    /**
     * If the interface is named, then the name should be presented when it
     * is converted to a string
     */
    'Converting named interface to string yields string containing name':
    function()
    {
        var name = 'Foo';

        this.assertEqual(
            this.Sut( name, {} ).toString(),
            '[object Interface <' + name + '>]'
        );
    },


    /**
     * If an interface name is available, then error messages should use it
     * to aid the developer in finding its origin.
     */
    'Declaration errors provide interface name if avaiable': function()
    {
        var Sut = this.Sut;

        var name = 'Foo',

            // functions used to cause the various errors
            tries = [
                // properties
                function()
                {
                    Sut( name, { prop: 'str' } );
                },

                // methods
                function()
                {
                    Sut( name, { method: function() {} } );
                }
            ]
        ;

        // if we have getter/setter support, add those to the tests
        if ( !( this.util.definePropertyFallback() ) )
        {
            // getter
            tries.push( function()
            {
                var obj = {};
                Object.defineProperty( obj, 'getter', {
                    get:        function() {},
                    enumerable: true
                } );

                Sut( name, obj );
            } );

            // setter
            tries.push( function()
            {
                var obj = {};
                Object.defineProperty( obj, 'setter', {
                    set:        function() {},
                    enumerable: true
                } );

                Sut( name, obj );
            } );
        }

        // gather the error strings
        var i = tries.length;
        while ( i-- )
        {
            try
            {
                // cause the error
                tries[ i ]();
            }
            catch ( e )
            {
                // ensure the error string contains the interface name
                this.assertNotEqual(
                    e.message.match( name ),
                    null,
                    "Error contains interface name when available (" + i + ")"
                );

                return;
            }

            // we shouldn't get to this point...
            this.assertFail( "Expected error. Something's wrong: " + i );
        }
    },


    /**
     * When attempting to instantiate an interface, the error message should
     * contain its name, if available.
     */
    'Interface name is included in instantiation error': function()
    {
        var name = 'Foo';

        try
        {
            // this should throw an exception (cannot instantiate interfaces)
            this.Sut( name )();

            // we should never get here
            this.assertFail( "Exception expected. There's a bug somewhere." );
        }
        catch ( e )
        {
            this.assertNotEqual(
                e.message.match( name ),
                null,
                "Interface name is included in instantiation error message"
            );
        }
    }
} );
} )( module['test/Interface/NameTest'] = {}, 'test/Interface' );
/** TEST CASE: MemberBuilder/GetterSetterTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/MemberBuilder/GetterSetterTest...<br />' )
/**
 * Tests MemberBuilder getter/setter builder
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

var common = require( 'common' ),
    shared = require( __dirname + '/inc-common' ),
    es5    = !( common.require( 'util' ).definePropertyFallback() )
;

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        var _self = this;

        this.testArgs = function( args, name, value, keywords, state )
        {
            shared.testArgs( _self, args, name, value, keywords, state,
                function(
                    prev_default, pval_given, pkey_given
                )
                {
                    var expected = _self.members[ 'public' ][ name ];

                    if ( !expected )
                    {
                        return prev_default;
                    }

                    return {
                        value: {
                            expected: expected,
                            given:    pval_given.member
                        },
                        keywords: {
                            expected: null, // XXX
                            given:    pkey_given
                        }
                    };
                }
            );
        };
    },


    setUp: function()
    {
        // stub factories used for testing
        var stubFactory = this.require( 'MethodWrapperFactory' )(
             function( func ) { return func; }
        );

        this.sut = this.require( 'MemberBuilder' )(
            stubFactory, stubFactory, stubFactory,
            this.mockValidate = this.getMock( 'MemberBuilderValidator' )
        );

        this.members = this.sut.initMembers();
    },


    /**
     * The validator can only do its job if we're providing it with the correct
     * information
     */
    'Passes proper data to validator when not overriding': function()
    {
        es5 || this.skip();

        var _self  = this,
            called = false,

            name      = 'foo',
            value_get = function get() {},
            value_set = function set() {},
            keywords = {}
        ;

        this.mockValidate.validateGetterSetter = function()
        {
            called = true;

            // XXX: Currently no 'value' argument is passed
            _self.testArgs( arguments, name, {}, keywords );
        };

        this.sut.buildGetterSetter( this.members, {}, name,
            value_get, value_set, keywords, {}
        );

        this.assertEqual( true, called,
            'validateGetterSetter() was not called'
        );
    },


    'Passes proper data to validator when overriding': function()
    {
        es5 || this.skip();

        var _self  = this,
            called = false,

            name     = 'foo',
            value_get = function get() {},
            value_set = function set() {},
            keywords = {}
        ;

        // since we're overriding (XXX)
        this.members[ 'public' ][ name ] = {};

        this.mockValidate.validateGetterSetter = function()
        {
            called = true;

            // XXX: Currently no 'value' argument is passed
            _self.testArgs( arguments, name, {}, keywords );
        };

        this.sut.buildGetterSetter( this.members, {}, name,
            value_get, value_set, keywords, {}
        );

        this.assertEqual( true, called,
            'validateGetterSetter() was not called'
        );
    }
} );

} )( module['test/MemberBuilder/GetterSetterTest'] = {}, 'test/MemberBuilder' );
/** TEST CASE: MemberBuilder/MethodTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/MemberBuilder/MethodTest...<br />' )
/**
 * Tests method builder
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

var shared = require( __dirname + '/inc-common' );

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        var _self = this;

        this.testArgs = function( args, name, value, keywords, state )
        {
            shared.testArgs( _self, args, name, value, keywords, state,
                function(
                    prev_default, pval_given, pkey_given
                )
                {
                    var expected = _self.members[ 'public' ][ name ];

                    if ( !expected )
                    {
                        return prev_default;
                    }

                    return {
                        value: {
                            expected: expected,
                            given:    pval_given.member
                        },
                        keywords: {
                            expected: expected.___$$keywords$$, // XXX
                            given:    pkey_given
                        }
                    };
                }
            );
        };

        // simply intended to execute test two two perspectives
        this.weakab = [
        ];
    },


    setUp: function()
    {
        var _self = this;

        // stub factories used for testing
        var stubFactory = this.require( 'MethodWrapperFactory' )(
             function( func )
             {
                 // still wrap it so that the function is encapsulated
                 return function() { return func() };
             }
        );

        // used for testing proxies explicitly
        var stubProxyFactory = this.require( 'MethodWrapperFactory' )(
             function()
             {
                _self.proxyFactoryCall =
                    Array.prototype.slice.call( arguments );

                return _self.proxyReturnValue;
             }
        );

        this.proxyFactoryCall = null;
        this.proxyReturnValue = function() {};

        this.sut = this.require( 'MemberBuilder' )(
            stubFactory, stubFactory, stubProxyFactory,
            this.mockValidate = this.getMock( 'MemberBuilderValidator' )
        );

        this.members = this.sut.initMembers();
    },


    /**
     * The validator can only do its job if we're providing it with the correct
     * information
     */
    'Passes proper data to validator when not overriding': function()
    {
        var _self  = this,
            called = false,

            name     = 'foo',
            value    = function() {},
            state    = {},
            keywords = {}
        ;

        this.mockValidate.validateMethod = function()
        {
            called = true;
            _self.testArgs( arguments, name, value, keywords, state );
        };

        this.assertOk( this.sut.buildMethod(
            this.members, {}, name, value, keywords, function() {}, 1, {},
            state
        ) );

        this.assertEqual( true, called, 'validateMethod() was not called' );
    },


    'Passes proper data to validator when overriding': function()
    {
        var _self  = this,
            called = false,

            name     = 'foo',
            value    = function() {},
            keywords = { 'override': true }
        ;

        // since we're overriding
        ( this.members[ 'public' ].foo = function() {} ).___$$keywords$$ =
            { 'public': true };

        this.mockValidate.validateMethod = function()
        {
            called = true;
            _self.testArgs( arguments, name, value, keywords );
        };

        this.assertOk( this.sut.buildMethod(
            this.members, {}, name, value, keywords, function() {}, 1, {}
        ) );

        this.assertEqual( true, called, 'validateMethod() was not called' );
    },


    /**
     * The `proxy' keyword should result in a method that proxies to the given
     * object's method (both identified by name).
     */
    "Creates proxy when `proxy' keyword is given": function()
    {
         var _self  = this,
            called = false,

            cid      = 1,
            name     = 'foo',
            value    = 'bar',
            keywords = { 'proxy': true },

            instCallback = function() {}
        ;

        // build the proxy
        this.assertOk( this.sut.buildMethod(
            this.members, {}, name, value, keywords, instCallback, cid, {}
        ) );

        this.assertNotEqual( null, this.proxyFactoryCall,
            "Proxy factory should be used when `proxy' keyword is provided"
        );

        this.assertDeepEqual(
            [ value, null, cid, instCallback, name, keywords ],
            this.proxyFactoryCall,
            "Proxy factory should be called with proper arguments"
        );

        // ensure it was properly generated (use a strict check to ensure the
        // *proper* value is returned)
        this.assertStrictEqual(
            this.proxyReturnValue,
            this.members[ 'public' ][ name ],
            "Generated proxy method should be properly assigned to members"
        );
    },


    /**
     * A weak abstract method may exist in a situation where a code
     * generator is not certain whether a concrete implementation may be
     * provided. In this case, we would not want to actually create an
     * abstract method if a concrete one already exists.
     */
    'Weak abstract methods are not processed if concrete is available':
    function()
    {
         var _self  = this,
            called = false,

            cid      = 1,
            name     = 'foo',
            cval     = function() { called = true; },
            aval     = [],

            ckeywords = {},
            akeywords = { weak: true, 'abstract': true },

            instCallback = function() {}
        ;

        // first define abstract
        this.assertOk( this.sut.buildMethod(
            this.members, {}, name, aval, akeywords, instCallback, cid, {}
        ) );

        // concrete should take precedence
        this.assertOk( this.sut.buildMethod(
            this.members, {}, name, cval, ckeywords, instCallback, cid, {}
        ) );

        this.members[ 'public' ].foo();
        this.assertOk( called, "Concrete method did not take precedence" );

        // now try abstract again to ensure this works from both directions
        this.assertOk( this.sut.buildMethod(
            this.members, {}, name, aval, akeywords, instCallback, cid, {}
        ) === false );

        this.members[ 'public' ].foo();
        this.assertOk( called, "Concrete method unkept" );
    },


    /**
     * Same concept as the above, but with virtual methods (which have a
     * concrete implementation available by default).
     */
    'Weak virtual methods are not processed if override is available':
    function()
    {
         var _self  = this,
            called = false,

            cid      = 1,
            name     = 'foo',
            oval     = function() { called = true; },
            vval     = function()
            {
                _self.fail( true, false, "Method not overridden." );
            },

            okeywords = { 'override': true },
            vkeywords = { weak: true, 'virtual': true },

            instCallback = function() {}
        ;

        // define the virtual method
        this.assertOk( this.sut.buildMethod(
            this.members, {}, name, vval, vkeywords, instCallback, cid, {}
        ) );

        // override should take precedence
        this.assertOk( this.sut.buildMethod(
            this.members, {}, name, oval, okeywords, instCallback, cid, {}
        ) );

        this.members[ 'public' ].foo();
        this.assertOk( called, "Override did not take precedence" );

        // now try virtual again to ensure this works from both directions
        this.assertOk( this.sut.buildMethod(
            this.members, {}, name, vval, vkeywords, instCallback, cid, {}
        ) === false );

        this.members[ 'public' ].foo();
        this.assertOk( called, "Override unkept" );
    },


    /**
     * This is a beautiful consequence of the necessay context in which
     * private methods must be invoked.
     *
     * If a method has the ability to call a private method, then we must
     * already be within a private context (that is---using the private
     * member object, which happens whenever we're executing a method of
     * that class). The purpose of the method wrapper is to (a) determine
     * the proper context, (b) set up super method references, and (c)
     * restore the context in the event that the method returns `this'. Not
     * a single one of these applies: (a) is void beacuse we are already in
     * the proper context; (b) is not applicable since private methods
     * cannot have a super method; and (c) we do not need to restore context
     * before returning because the context would be the same (per (a)).
     *
     * That has excellent performance implications: not only do we reduce
     * class building times for private methods, but we also improve method
     * invocation times, since we do not have to invoke a *closure* for each
     * and every method call. Further, recursive private methods are no
     * longer an issue since they do not gobble up the stack faster and,
     * consequently, the JavaScript engine can now take advantage of tail
     * call optimizations.
     *
     * This is also further encouragement to use private members. :)
     */
    'Private methods are not wrapped': function()
    {
        var f    = function() {},
            name = 'foo';

        this.sut.buildMethod(
            this.members, {}, name, f, { 'private': true },
            function() {}, 1, {}
        );

        // if the private method was not wrapped, then it should have been
        // assigned to the member object unencapsulated
        this.assertStrictEqual( this.members[ 'private' ][ name ], f );
    }
} );
} )( module['test/MemberBuilder/MethodTest'] = {}, 'test/MemberBuilder' );
/** TEST CASE: MemberBuilder/PropTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/MemberBuilder/PropTest...<br />' )
/**
 * Tests MemberBuilder property builder
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

var shared = require( __dirname + '/inc-common' );

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        var _self = this;

        this.testArgs = function( args, name, value, keywords, state )
        {
            shared.testArgs( _self, args, name, value, keywords, state,
                function(
                    prev_default, pval_given, pkey_given
                )
                {
                    var expected = _self.members[ 'public' ][ name ];

                    if ( !expected )
                    {
                        return prev_default;
                    }

                    return {
                        value: {
                            expected: expected[ 0 ],
                            given:    pval_given.member[ 0 ]
                        },
                        keywords: {
                            expected: expected[ 1 ],
                            given:    pkey_given
                        }
                    };
                }
            );
        };
    },


    setUp: function()
    {
        // stub factories used for testing
        var stubFactory = this.require( 'MethodWrapperFactory' )(
             function( func ) { return func; }
        );

        this.sut = this.require( 'MemberBuilder' )(
            stubFactory, stubFactory, stubFactory,
            this.mockValidate = this.getMock( 'MemberBuilderValidator' )
        );

        this.members = this.sut.initMembers();
    },


    /**
     * The validator can only do its job if we're providing it with the correct
     * information
     */
    'Passes proper data to validator when not overriding': function()
    {
        var _self  = this,
            called = false,

            name     = 'foo',
            value    = 'bar',
            keywords = {}
        ;

        this.mockValidate.validateProperty = function()
        {
            called = true;
            _self.testArgs( arguments, name, value, keywords );
        };

        this.sut.buildProp( this.members, {}, name, value, keywords, {} );

        this.assertEqual( true, called, 'validateProperty() was not called' );
    },


    'Passes proper data to validator when overriding': function()
    {
        var _self  = this,
            called = false,

            name     = 'foo',
            value    = 'bar2',
            keywords = {}
        ;

        // since we're overriding
        this.members[ 'public' ][ name ] = [ 'prev', { 'public': true } ];

        this.mockValidate.validateProperty = function()
        {
            called = true;
            _self.testArgs( arguments, name, value, keywords );
        };

        this.sut.buildProp( this.members, {}, name, value, keywords, {} );

        this.assertEqual( true, called, 'validateProperty() was not called' );
    }
} );

} )( module['test/MemberBuilder/PropTest'] = {}, 'test/MemberBuilder' );
/** TEST CASE: MemberBuilderValidator/GetterSetterTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/MemberBuilderValidator/GetterSetterTest...<br />' )
/**
 * Tests member builder validation rules for getters/setters
 *
 * These tests can be run in a pre-ES5 environment since they do not deal with
 * actual getters/setters; they deal only with the data associated with them.
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

var shared = require( __dirname + '/inc-common' );

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        var _self = this;

        this.quickFailureTest = function()
        {
            shared.quickFailureTest.apply( _self, arguments );
        };

        this.quickKeywordTest = function( keywords, identifier, prev )
        {
            shared.quickKeywordTest.call( this,
                'validateGetterSetter', keywords, identifier, prev,
                prev && { get: function() {}, set: function() {} }
            );
        };

        this.quickVisChangeTest = function( start, override, failtest, failstr )
        {
            shared.quickVisChangeTest.call( _self, start, override, failtest,
                function( name, startobj, overrideobj )
                {
                    startobj.virtual     = true;
                    overrideobj.override = true;

                    _self.sut.validateGetterSetter(
                        name, {}, overrideobj,
                        { get: function() {}, set: function() {} },
                        startobj
                    );
                },
                failstr
            );
        };
    },


    setUp: function()
    {
        var _self = this;

        // can be used to intercept warnings; redefine in test
        this.warningHandler = function( warning ) {};

        this.sut = this.require( 'MemberBuilderValidator' )(
            function( warning )
            {
                _self.warningHandler( warning );
            }
        );
    },


    /**
     * Getters/setters should not be able to override methods, for the obvious
     * reason that they are two different types and operate entirely
     * differently. Go figure.
     */
    'Cannot override method with getter or setter': function()
    {
        var name  = 'foo',
            _self = this;

        // getters and setters share the same call, so we don't need two
        // separate tests
        this.quickFailureTest( name, 'method', function()
        {
            _self.sut.validateGetterSetter(
                name, {}, {}, { member: function() {} }
            );
        } );
    },


    'Cannot override property with getter or setter': function()
    {
         var name  = 'foo',
            _self = this;

        // getters and setters share the same call, so we don't need two
        // separate tests
        this.quickFailureTest( name, 'method', function()
        {
            _self.sut.validateGetterSetter(
                name, {}, {}, { member: 'foo' }
            );
        } );
    },


    /**
     * De-escalating the visibility of any member would alter the interface of a
     * subtype, which would not be polymorphic.
     */
    'Getters/setters do not support visibility de-escalation': function()
    {
        this.quickVisChangeTest( 'public', 'protected', true );
        this.quickVisChangeTest( 'protected', 'private', true );
    },


    /**
     * Contrary to the above test, we have no such problem with visibility
     * escalation.
     */
    'Getters/setters support visibility escalation and equality': function()
    {
        var _self = this;
        shared.visEscalationTest( function( cur )
        {
            _self.quickVisChangeTest( cur[ 0 ], cur[ 1 ], false );
        } );
    },


    /**
     * See property/method tests for more information. This is not strictly
     * necessary (since getters/setters can exist only in an ES5+ environment),
     * but it's provided for consistency. It's also easy to remove this feature
     * without breaking BC. The reverse is untrue.
     */
    'Cannot redeclare private getters/setters in subtypes': function()
    {
        var _self = this;
        shared.privateNamingConflictTest( function( cur )
        {
            _self.quickVisChangeTest( cur[ 0 ], cur[ 1 ], true, 'conflict' );
        } );
    },


    /**
     * Abstract getter/setters are not yet supported. They may be supported in
     * the future. Disallowing them now will allow us to determine an
     * implementation in the future without breaking BC.
     */
    'Cannot declare abstract getters/setters': function()
    {
        this.quickKeywordTest( [ 'abstract' ], 'abstract' );
    },


    /**
     * As getters/setters are essentially methods, they are treated very
     * similarity. They cannot be declared as const. Rather, that should be
     * handled by omitting a setter.
     */
    'Cannot declare const getters/setters': function()
    {
        this.quickKeywordTest( [ 'const' ], 'const' );
    },


    /**
     * Getters/setters can be overridden just like methods, so long as they
     * follow the same keyword restrictions.
     */
    'Can override virtual getter/setter with override keyword': function()
    {
        this.quickKeywordTest( [ 'override' ], null, [ 'virtual' ] );
    },


    /**
     * The 'override' keyword must be provided if a member is being overridden.
     */
    'Must provide override keyword when overriding getter/setter': function()
    {
        this.quickKeywordTest( [], 'override', [ 'virtual' ] );
    },


    /**
     * Just like methods, getters/setters may only be overridden if they have
     * been declared 'virtual'.
     */
    'Cannot override non-virtual getter/setter': function()
    {
        this.quickKeywordTest( [ 'override' ], 'non-virtual', [] );
    },


    'Can declare getter/setter as static': function()
    {
        this.quickKeywordTest( [ 'static' ] );
    },


    /**
     * As static members cannot be overridden, it does not make sense to permit
     * the 'static' and 'virtual' keywords to be used together.
     */
    'Cannot declare getter/setter as both static and virtual': function()
    {
        this.quickKeywordTest( [ 'static', 'virtual' ], 'static' );
    },


    /**
     * If a developer uses the 'override' keyword when there is no super member
     * to override, this could hint at a number of problems (see MethodTest for
     * further discussion).
     */
    'Throws warning when using override with no super getter/setter': function()
    {
        var given = null;

        this.warningHandler = function( warning )
        {
            given = warning;
        };

        // trigger warning (override keyword with no super method)
        this.quickKeywordTest( [ 'override' ] );

        this.assertNotEqual( null, given,
            'No warning was provided'
        );

        this.assertOk( given instanceof Error,
            'Provided warning is not of type Error'
        );

        this.assertOk( ( given.message.search( shared.testName ) > -1 ),
            'Override warning should contain getter/setter name'
        );
    }
} );
} )( module['test/MemberBuilderValidator/GetterSetterTest'] = {}, 'test/MemberBuilderValidator' );
/** TEST CASE: MemberBuilderValidator/MethodTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/MemberBuilderValidator/MethodTest...<br />' )
/**
 * Tests member builder validation rules
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

var shared = require( __dirname + '/inc-common' );


require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        var _self = this;
        this.util = this.require( 'util' );

        this.quickKeywordMethodTest = function( keywords, identifier, prev )
        {
            shared.quickKeywordTest.call( this,
                'validateMethod', keywords, identifier, prev
            );
        };


        this.quickFailureTest = function()
        {
            shared.quickFailureTest.apply( _self, arguments );
        };


        this.quickVisChangeTest = function( start, override, failtest, failstr )
        {
            shared.quickVisChangeTest.call( _self, start, override, failtest,
                function( name, startobj, overrideobj )
                {
                    startobj.virtual     = true;
                    overrideobj.override = true;

                    var state = {};

                    _self.sut.validateMethod(
                        name,
                        function() {},
                        overrideobj,
                        { member: function() {} },
                        startobj,
                        state
                    );

                    _self.sut.end( state );
                },
                failstr
            );
        };
    },


    setUp: function()
    {
        var _self = this;

        // can be used to intercept warnings; redefine in test
        this.warningHandler = function( warning ) {};

        this.sut = this.require( 'MemberBuilderValidator' )(
            function( warning )
            {
                _self.warningHandler( warning );
            }
        );
    },


    /**
     * Private, abstract methods do not make sense. Private methods cannot be
     * overridden.
     */
    'Method cannot be both private and abstract': function()
    {
        this.quickKeywordMethodTest( [ 'private', 'abstract' ],
            'private and abstract'
        );
    },


    /**
     * Methods (in terms of a class) are always immutable. As such, `const'
     * would be redundant.
     */
    'Methods cannot be declared const': function()
    {
        this.quickKeywordMethodTest( [ 'const' ], 'const' );
    },


    /**
     * Virtual static methods do not make sense because static methods can only
     * be hidden, not overridden.
     */
    'Method cannot be both virtual and static': function()
    {
        this.quickKeywordMethodTest( [ 'virtual', 'static' ], 'static' );
    },


    /**
     * Getters/setters are treated as properties and should not be able to be
     * overridden with methods.
     */
    'Cannot override getter/setter with method': function()
    {
        var name  = 'foo',
            _self = this;

        // test getter
        this.quickFailureTest( name, 'getter/setter', function()
        {
            _self.sut.validateMethod(
                name, function() {}, {},
                { get: function() {} },
                {}, {}
            );
        } );

        // test setter
        this.quickFailureTest( name, 'getter/setter', function()
        {
            _self.sut.validateMethod(
                name, function() {}, {},
                { set: function() {} },
                {}, {}
            );
        } );
    },


    /**
     * Although a function can certainly be assigned to a property, we cannot
     * allow /declaring/ a method in place of a parent property, as that alters
     * the interface. One may still assign a callback or other function to a
     * property after instantiation.
     */
    'Cannot override property with method': function()
    {
        var name  = 'foo',
            _self = this;

        this.quickFailureTest( name, 'property', function()
        {
            // attempt to override a property
            _self.sut.validateMethod(
                name, function() {}, {},
                { member: 'immaprop' },
                {}, {}
            );
        } );
    },


    /**
     * The `virtual' keyword denotes a method that may be overridden. Without
     * it, we should not allow overriding.
     */
    'Cannot override non-virtual methods': function()
    {
        this.quickKeywordMethodTest( [ 'override' ], 'non-virtual', [] );
    },


    /**
     * Ensure we do not prevent legitimate method overriding
     */
    'Can override virtual method with concrete method': function()
    {
        this.quickKeywordMethodTest( [ 'override' ], null, [ 'virtual' ] );
    },


    /**
     * Overriding a method in ease.js does not immediately make it virtual.
     * Rather, the virtual keyword must be explicitly specified. Let's ensure
     * that it is permitted.
     */
    'Can declare override as virtual': function()
    {
        this.quickKeywordMethodTest( [ 'virtual', 'override' ] );
    },


    /**
     * Abstract methods act as a sort of placeholder, requiring an
     * implementation. Once an implementation has been defined, it does not make
     * sense (in the context of inheritance) to remove it entirely by reverting
     * back to an abstract method.
     */
    'Cannot override concrete method with abstract method': function()
    {
        this.quickKeywordMethodTest( [ 'abstract' ], 'concrete', [] );
    },


    /**
     * Contrary to the above test, an abstract method may appear after its
     * concrete implementation if the `weak' keyword is provided; this
     * exists to allow code generation tools to fall back to abstract
     * without having to invoke the property parser directly, complicating
     * their logic and duplicating work that ease.js will already do.
     */
    'Concrete method may appear with weak abstract method': function()
    {
        this.quickKeywordMethodTest(
            [ 'weak', 'abstract' ], null, []
        );
    },


    /**
     * The parameter list is part of the class interface. Changing the length
     * will make the interface incompatible with that of its parent and make
     * polymorphism difficult. However, since all parameters in JS are
     * technically optional, we can permit extending the parameter list (which
     * itself has its dangers since the compiler cannot detect type errors).
     */
    'Override parameter list must match or exceed parent length': function()
    {
        var name  = 'foo',
            _self = this;

        // check with parent with three params
        this.quickFailureTest( name, 'compatible', function()
        {
            _self.sut.validateMethod(
                name,
                function() {},
                { 'override': true },
                // this function returns each of its arguments, otherwise
                // they'll be optimized away by Closure Compiler.
                { member: function( a, b, c ) { return [a,b,c]; } },
                { 'virtual': true },
                {}
            );
        } );

        // also check with __length property (XXX: testing too closely to the
        // implementation; provide abstraction)
        this.quickFailureTest( name, 'compatible', function()
        {
            var parent_method = function() {};
            parent_method.__length = 3;

            _self.sut.validateMethod(
                name,
                function() {},
                { 'override': true },
                { member: parent_method },
                { 'virtual': true },
                {}
            );
        } );

        // finally, check __length of override will actually work (no error)
        this.assertDoesNotThrow( function()
        {
            var method = function() {};
            method.__length = 3;

            _self.sut.validateMethod(
                name,
                method,
                { 'override': true },
                { member: function( a, b, c ) {} },
                { 'virtual': true },
                {}
            );
        }, Error );
    },


    /**
     * Same concept as the above test, but ensure that the logic for weak
     * abstract members does not skip the valiation. Furthermore, if a weak
     * abstract member is found *after* the concrete definition, the same
     * restrictions should apply retroacively.
     */
    'Weak abstract overrides must meet compatibility requirements':
    function()
    {
        var _self = this,
            name  = 'foo',
            amethod = _self.util.createAbstractMethod( [ 'one' ] );

        // abstract appears before
        this.quickFailureTest( name, 'compatible', function()
        {
            _self.sut.validateMethod(
                name,
                function() {},
                {},
                { member: amethod },
                { 'weak': true, 'abstract': true },
                {}
            );
        } );

        // abstract appears after
        this.quickFailureTest( name, 'compatible', function()
        {
            _self.sut.validateMethod(
                name,
                amethod,
                { 'weak': true, 'abstract': true },
                { member: function() {} },
                {}, {}
            );
        } );
    },


    /**
     * One should not be able to, for example, declare a private method it had
     * previously been declared protected, or declare it as protected if it has
     * previously been declared public. Again - the reason being interface
     * consistency. Otherwise the concept of polymorphism doesn't work.
     */
    'Methods do not support visibiliy de-escalation': function()
    {
        this.quickVisChangeTest( 'public', 'protected', true );
        this.quickVisChangeTest( 'protected', 'private', true );
    },


    /**
     * To ensure we don't have a bug in our validation, let's also test the
     * reverse - ensure that we support escalation and staying at the same
     * level.
     */
    'Methods support visibility escalation or equality': function()
    {
        var _self = this;
        shared.visEscalationTest( function( cur )
        {
            _self.quickVisChangeTest( cur[ 0 ], cur[ 1 ], false );
        } );
    },


    /**
     * If a parent method is defined and the 'override' keyword is not provided,
     * regardless of whether or not it is declared as virtual, we need to
     * provide an error.
     *
     * Note: In the future, this will be replaced with the method hiding
     * implementation.
     */
    'Must provide "override" keyword when overriding methods': function()
    {
        this.quickKeywordMethodTest( [], 'override', [] );
    },


    /**
     * Building off of the previous test - we should be able to omit the
     * 'override' keyword if we are providing a concrete method for an abstract
     * method. In terms of ease.js, this is still "overriding".
     */
    'Can provide abstract method impl. without override keyword': function()
    {
        this.quickKeywordMethodTest( [], null, [ 'abstract' ] );
    },


    /**
     * If a developer uses the 'override' keyword when there is no super method
     * to override, this could hint at a number of problems, including:
     *   - Misunderstanding the keyword
     *   - Misspelling the method name
     *   - Forgetting to specify a class to extend from
     *
     * All of the above possibilities are pretty significant. In order to safe
     * developers from themselves (everyone screws up eventually), let's provide
     * a warning. Since this only hints at a potential bug but does not affect
     * the functionality, there's no use in throwing an error and preventing the
     * class from being defined.
     */
    'Throws warning when using override with no super method': function()
    {
        var given = null;

        this.warningHandler = function( warning )
        {
            given = warning;
        };

        // trigger warning (override keyword with no super method)
        this.quickKeywordMethodTest( [ 'override' ] );

        this.assertNotEqual( null, given,
            'No warning was provided'
        );

        this.assertOk( given instanceof Error,
            'Provided warning is not of type Error'
        );

        this.assertOk( ( given.message.search( shared.testName ) > -1 ),
            'Override warning should contain method name'
        );
    },


    /**
     * The above test provides problems if we have a weak method that
     * follows the definition of the override within the same definition
     * object (that is---A' is defined before A where A' overrides A and A
     * is weak); we must ensure that the warning is deferred until we're
     * certain that we will not encounter a weak method.
     */
    'Does not throw warning when overriding a later weak method': function()
    {
        var _self = this;
        this.warningHandler = function( warning )
        {
            _self.fail( true, false, "Warning was issued." );
        };

        this.assertDoesNotThrow( function()
        {
            var state = {};

            // this should place a warning into the state
            _self.sut.validateMethod(
                'foo',
                function() {},
                { 'override': true },
                undefined,  // no previous because weak was
                undefined,  // not yet encountered
                state
            );

            // this should remove it upon encountering `weak'
            _self.sut.validateMethod(
                'foo',
                function() {},
                { 'weak': true, 'abstract': true },
                { member: function() {} },  // same as previously defined
                { 'override': true },       // above
                state
            );

            // hopefully we don't trigger warnings (if we do, the warning
            // handler defined above will fail this test)
            _self.sut.end( state );
        } );
    },


    /**
     * Wait - what? That doesn't make sense from an OOP perspective, now does
     * it! Unfortunately, we're forced into this restriction in order to
     * properly support fallback to pre-ES5 environments where the visibility
     * object is a single layer, rather than three. With this impl, all members
     * are public and private name conflicts would result in supertypes and
     * subtypes altering eachothers' private members (see manual for more
     * information).
     */
    'Cannot redeclare private members in subtypes': function()
    {
        var _self = this;
        shared.privateNamingConflictTest( function( cur )
        {
            _self.quickVisChangeTest( cur[ 0 ], cur[ 1 ], true, 'conflict' );
        } );
    },


    /**
     * Proxies forward calls to other properties of a given instance. The only
     * way to represent those properties is by name, which we will use a string
     * to accomplish. Therefore, the value of a proxy method must be the name of
     * the property to proxy to (as a string).
     */
    "`proxy' keyword must provide string value": function()
    {
        var name  = 'foo',
            _self = this;

        this.quickFailureTest( name, 'string value expected', function()
        {
            // provide function instead of string
            _self.sut.validateMethod(
                name, function() {}, { 'proxy': true }, {}, {}, {}
            );
        } );
    },


    /**
     * Similar to the above test, but asserts that string values are permitted.
     */
    "`proxy' keyword can provide string value": function()
    {
        var _self = this;

        this.assertDoesNotThrow( function()
        {
            _self.sut.validateMethod(
                'foo', 'dest', { 'proxy': true }, {}, {}, {}
            );
        }, TypeError );
    },


    /**
     * It does not make sense for a proxy to be abstract; proxies are concrete
     * by definition (in ease.js' context, at least).
     */
    'Method proxy cannot be abstract': function()
    {
        this.quickKeywordMethodTest( [ 'proxy', 'abstract' ],
            'cannot be abstract'
        );
    }
} );

} )( module['test/MemberBuilderValidator/MethodTest'] = {}, 'test/MemberBuilderValidator' );
/** TEST CASE: MemberBuilderValidator/PropertyTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/MemberBuilderValidator/PropertyTest...<br />' )
/**
 * Tests member builder validation rules
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

var shared = require( __dirname + '/inc-common' );


require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        var _self = this;

        this.quickFailureTest = function()
        {
            shared.quickFailureTest.apply( _self, arguments );
        };

        this.quickKeywordPropTest = function( keywords, identifier, prev )
        {
            shared.quickKeywordTest.call( this,
                'validateProperty', keywords, identifier, prev
            );
        };

        this.quickVisChangeTest = function( start, override, failtest, failstr )
        {
            shared.quickVisChangeTest.call( _self, start, override, failtest,
                function( name, startobj, overrideobj )
                {
                    _self.sut.validateProperty(
                        name, 'bar', overrideobj,
                        { member: 'foo' },
                        startobj
                    );
                },
                failstr
            );
        };
    },


    setUp: function()
    {
        this.sut = this.require( 'MemberBuilderValidator' )();
    },


    /**
     * Clearly, overriding a method with a property will have terrible
     * polymorphic consequences on the resulting interface.
     */
    'Cannot override method with property': function()
    {
        var name  = 'foo',
            _self = this;

        this.quickFailureTest( name, 'property', function()
        {
            // attempt to override a method
            _self.sut.validateProperty(
                name, 'bar', {},
                { member: function() {} },
                {}
            );
        } );
    },


    /**
     * The concept of an abstract property does not make sense, as properties
     * simply represent placeholders for values. Whether or not they actually
     * hold a value is irrelevant.
     */
    'Cannot declare abstract property': function()
    {
        this.quickKeywordPropTest( [ 'abstract' ], 'abstract' );
    },


    /**
     * Properties, unlike methods, are virtual by default. If a property's value
     * can be reassigned, why would a subclass not be able to reassign it? If
     * one wishes to prevent a property's value from changing, they should use
     * the visibility modifiers or declare the property as a constant.
     */
    'Cannot declare virtual property': function()
    {
        this.quickKeywordPropTest( [ 'virtual' ], 'virtual' );
    },


    /**
     * Declaring a constant as static would be redundant.
     */
    'Cannot declare static const property': function()
    {
        this.quickKeywordPropTest( [ 'static', 'const' ], 'Static' );
    },


    /*
     * While getters act as properties, it doesn't make sense to override
     * getters/setters with properties because they are fundamentally different.
     */
    'Cannot override getter/setter with property': function()
    {
        var name  = 'foo',
            _self = this;

        // test getter
        this.quickFailureTest( name, 'getter/setter', function()
        {
            _self.sut.validateProperty(
                name, 'bar', {},
                { get: function() {} },
                {}
            );
        } );

        // test setter
        this.quickFailureTest( name, 'getter/setter', function()
        {
            _self.sut.validateProperty(
                name, 'bar', {},
                { set: function() {} },
                {}
            );
        } );
    },


    /**
     * De-escalating the visibility of a property would alter the interface of a
     * subtype, which would not be polymorphic.
     */
    'Properties do not support visibility de-escalation': function()
    {
        this.quickVisChangeTest( 'public', 'protected', true );
        this.quickVisChangeTest( 'protected', 'private', true );
    },


    /**
     * Contrary to the above test, we have no such problem with visibility
     * escalation.
     */
    'Properties do support visibility escalation and equality': function()
    {
        var _self = this;
        shared.visEscalationTest( function( cur )
        {
            _self.quickVisChangeTest( cur[ 0 ], cur[ 1 ], false );
        } );
    },


    /**
     * Wait - what? That doesn't make sense from an OOP perspective, now does
     * it! Unfortunately, we're forced into this restriction in order to
     * properly support fallback to pre-ES5 environments where the visibility
     * object is a single layer, rather than three. With this impl, all members
     * are public and private name conflicts would result in supertypes and
     * subtypes altering eachothers' private members (see manual for more
     * information).
     */
    'Cannot redeclare private properties in subtypes': function()
    {
        var _self = this;
        shared.privateNamingConflictTest( function( cur )
        {
            _self.quickVisChangeTest( cur[ 0 ], cur[ 1 ], true, 'conflict' );
        } );
    }
} );

} )( module['test/MemberBuilderValidator/PropertyTest'] = {}, 'test/MemberBuilderValidator' );
/** TEST CASE: MemberBuilder/VisibilityTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/MemberBuilder/VisibilityTest...<br />' )
/**
 * Tests visibility portion of member builder
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

// get-set-test (supported)
var common = require( 'common' ),
    gst    = !( common.require( 'util' ).definePropertyFallback() )


require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        var _self = this;

        this.buildStubMethod = function( name, val, visibility )
        {
            var keywords = {};

            // set visibility level using access modifier
            keywords[ visibility ] = true;

            _self.sut.buildMethod( _self.members, {}, name,
                function() {
                    return val;
                },
                keywords,
                function() {},
                1,
                {}
            );
        };


        this.buildStubProp = function( name, val, visibility )
        {
            var keywords = {};

            // set visibility level using access modifier
            keywords[ visibility ] = true;

            _self.sut.buildProp( _self.members, {}, name, val, keywords, {} );
        };


        this.buildStubGetterSetter = function( name, get, set, visibility )
        {
            var keywords = {};

            // set visibility level using access modifier
            keywords[ visibility ] = true;

            _self.sut.buildGetterSetter(
                _self.members, {}, name, get, set, keywords, {}
            );
        };


        this.assertOnlyIn = function( vis, name )
        {
            var found = false;

            _self.incAssertCount();

            for ( var level in _self.members )
            {
                if ( typeof _self.members[ level ][ name ] === 'undefined' )
                {
                    continue;
                }

                // we found it; ensure it's in the expected visibility level
                found = true;
                if ( level !== vis )
                {
                    _self.fail( name + " should only be accessible in: " + vis );
                }
            }

            found || _self.fail(
                "Did not find '" + name + "' in level: " + vis
            );
        };


        this.basicVisPropTest = function( vis )
        {
            var name = vis + 'propname',
                val  = vis + 'val';

            _self.buildStubProp( name, val, vis );
            _self.assertEqual( _self.members[ vis ][ name ][ 0 ], val );

            _self.assertOnlyIn( vis, name, _self.members );
        };


        this.basicVisMethodTest = function( vis )
        {
            var name = vis + 'methodname',
                val  = vis + 'val';

            _self.buildStubMethod( name, val, vis );

            _self.assertEqual(
                _self.members[ vis ][ name ](),
                val
            );

            _self.assertOnlyIn( vis, name, _self.members );
        };


        /** ES5-only **/
        this.basicVisGetterSetterTest = function( vis )
        {
            // we cannot perform these tests if getters/setters are unsupported
            // by our environment
            if ( !gst )
            {
                return;
            }

            var name   = vis + 'getsetname',
                getval = function() { return true; },
                setval = function() {}
            ;

            // build both the getter and the setter
            _self.buildStubGetterSetter( name, getval, setval, vis, 'get' );

            // get the getter/setter
            var data = Object.getOwnPropertyDescriptor(
                _self.members[ vis ], name
            );

            _self.assertEqual( data.get, getval );
            _self.assertEqual( data.set, setval );

            _self.assertOnlyIn( vis, name, _self.members );
        };


        this.multiVisFailureTest = function( test )
        {
            var multi = [
                    { 'public': true,    'protected': true },
                    { 'public': true,    'private': true },
                    { 'protected': true, 'private': true }
                ],

                name = 'foo'
            ;

            // run the test for each combination of multiple access modifiers
            for ( var i = 0, len = multi.length; i < len; i++ )
            {
                _self.incAssertCount();

                try
                {
                    test( name, multi[ i ] );
                }
                catch ( e )
                {
                    // ensure we received the correct error
                    _self.assertOk(
                        ( e.message.search( 'access modifier' ) > -1 ),
                        'Unexpected error for multiple access modifiers'
                    );

                    // ensure the error message contains the name of the member
                    _self.assertOk(
                        ( e.message.search( name ) > -1 ),
                        'Multiple access modifier error message should ' +
                            'contain name of member; received: ' + e.message
                    );

                    return;
                }

                _self.fail(
                    'Should fail with multiple access modifiers: ' + i
                );
            }
        };
    },


    setUp: function()
    {
        // stub factories used for testing
        var stubFactory = this.require( 'MethodWrapperFactory' )(
             function( func ) { return func; }
        );

        this.sut = this.require( 'MemberBuilder' )(
            stubFactory, stubFactory, stubFactory,
            this.getMock( 'MemberBuilderValidator' )
        );

        this.members = this.sut.initMembers();
    },


    /**
     * The member object stores the members associated with each of the three
     * levels of visibility that are denoted by access modifiers: public,
     * protected and private. The initMembers() method is simply an abstraction.
     */
    'Can create empty member object': function()
    {
        var members = this.sut.initMembers(),
            test    = [ 'public', 'protected', 'private' ];

        // ensure each level of visibility exists in the new member object
        // (aren't these for statements terribly repetitive? 0 <= i < len would
        // be nice to be able to do.)
        for ( var i = 0, len = test.length; i < len; i++ )
        {
            this.assertOk( ( typeof members[ test[ i ] ] !== 'undefined' ),
                'Clean member object is missing visibility level: ' + test[ i ]
            );
        }
    },


    /**
     * The initialization method gives us the option to use existing objects
     * for each level of visibility rather than creating new, empty ones.
     */
    'Can initialize member object with existing objects': function()
    {
        var pub  = { foo: 'bar' },
            prot = { bar: 'baz' },
            priv = { baz: 'foo' },

            members = this.sut.initMembers( pub, prot, priv ),

            test = {
                'public':    pub,
                'protected': prot,
                'private':   priv
            }
        ;

        // ensure we can initialize the values of each visibility level
        for ( var vis in test )
        {
            this.assertStrictEqual( test[ vis ], members[ vis ],
                "Visibility level '" + vis + "' cannot be initialized"
            );
        }
    },


    /**
     * The various members should be copied only to the interface specified by
     * their access modifiers (public, protected, or private).
     */
    'Members are only accessible via their respective interfaces': function()
    {
        var _self = this,
            tests = [ 'public', 'protected', 'private' ];

        for ( var i in tests )
        {
            _self.basicVisPropTest( tests[ i ] );
            _self.basicVisMethodTest( tests[ i ] );
            _self.basicVisGetterSetterTest( tests[ i ] );
        };
    },


    /**
     * If no access modifier is provided, it should be assumed that the member
     * is to be public. This also allows for more concise code should the
     * developer with to omit unnecessary keywords.
     */
    'Members will be declared public if access modifier is omitted': function()
    {
        var name_prop   = 'prop',   val_prop = 'foo',
            name_method = 'method', val_method = function() {},

            name_gs = 'getset',
            getval = function() {},
            setval = function() {}
        ;

        this.sut.buildProp( this.members, {}, name_prop, val_prop, {}, {} );
        this.sut.buildMethod( this.members, {}, name_method, val_method,
            {}, function() {}, 1, {}
        );

        // getter/setter if supported
        if ( gst )
        {
            this.sut.buildGetterSetter(
                this.members, {}, name_gs, getval, setval, {}, {}
            );
        }

        this.assertStrictEqual(
            this.members[ 'public' ][ name_prop ][ 0 ],
            val_prop,
            'Properties should be public by default'
        );

        this.assertStrictEqual(
            this.members[ 'public' ][ name_method ],
            val_method,
            'Methods should be public by default'
        );

        // getter/setter if supported
        if ( gst )
        {
            var data = Object.getOwnPropertyDescriptor(
                this.members[ 'public' ], name_gs
            );

            this.assertStrictEqual(
                data.get,
                getval,
                'Getters should be public by default'
            );

            this.assertStrictEqual(
                data.set,
                setval,
                'Setters should be public by default'
            );
        }
    },


    'Only one access modifier may be used per property': function()
    {
        var _self = this;

        this.multiVisFailureTest( function( name, keywords )
        {
            _self.sut.buildProp( _self.members, {}, name, 'baz', keywords, {} );
        } );
    },


    'Only one access modifier may be used per method': function()
    {
        var _self = this;

        this.multiVisFailureTest( function( name, keywords )
        {
            _self.sut.buildMethod(
                _self.members, {}, name, function() {}, keywords, {}
            );
        } );
    },


    'Only one access modifier may be used per getter/setter': function()
    {
        if ( !gst ) return;

        var _self = this;

        this.multiVisFailureTest( function( name, keywords )
        {
            _self.sut.buildGetterSetter(
                _self.members, {}, name,
                function() {}, function() {}, keywords, {}
            );
        } );
    }
} );
} )( module['test/MemberBuilder/VisibilityTest'] = {}, 'test/MemberBuilder' );
/** TEST CASE: MethodWrapperFactoryTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/MethodWrapperFactoryTest...<br />' )
/**
 * Tests MethodWrapperFactory prototype
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut = this.require( 'MethodWrapperFactory' );
    },


    /**
     * To keep with the spirit of ease.js, we should be able to instantiate
     * MethodWrapperFactory both with and without the 'new' keyword
     *
     * Consistency is key with these sorts of things.
     */
    'Can instantiate with and without new keyword': function()
    {
        // with 'new' keyword
        this.assertOk(
            ( new this.Sut() ) instanceof this.Sut,
            "Should be able to instantiate MethodWrapperFactory with " +
                "'new' keyword"
        );

        // without 'new' keyword
        this.assertOk( ( this.Sut() instanceof this.Sut ),
            "Should be able to instantiate MethodWrapperFactory " +
                "without 'new' keyword"
        );
    },


    /**
     * The factory itself is rather simple. The class should accept a factory
     * function which should return the wrapped method.
     */
    'Provided factory function is properly called': function()
    {
        var _self        = this,
            called       = false,
            method       = function() {},
            super_method = function() {},
            cid          = 55,
            getInst      = function() {},
            name         = 'someMethod',
            keywords     = { 'static': true, 'public': true },
            retval       = 'foobar';

        var result = this.Sut(
            function(
                given_method, given_super, given_cid, givenGetInst, given_name,
                given_keywords
            )
            {
                called = true;

                _self.assertEqual( given_method, method,
                    "Factory method should be provided with method to wrap"
                );

                _self.assertEqual( given_super, super_method,
                    "Factory method should be provided with super method"
                );

                _self.assertEqual( given_cid, cid,
                    "Factory method should be provided with cid"
                );

                _self.assertEqual( givenGetInst, getInst,
                    "Factory method should be provided with proper inst function"
                );

                _self.assertEqual( given_name, name,
                    "Factory method should be provided with proper method name"
                );

                _self.assertEqual( given_keywords, keywords,
                    "Factory method should be provided with proper keywords"
                );

                return retval;
            }
        ).wrapMethod( method, super_method, cid, getInst, name, keywords );

        // we'll include this in addition to the following assertion (which is
        // redundant) to make debugging more clear
        this.assertEqual( called, true,
            "Given factory method should be called"
        );

        this.assertEqual( result, retval,
            "Should return value from factory function"
        );
    }
} );
} )( module['test/MethodWrapperFactoryTest'] = {}, 'test' );
/** TEST CASE: MethodWrappersTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/MethodWrappersTest...<br />' )
/**
 * Tests method sut
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        // common assertions between a couple of proxy tests
        this.proxyErrorAssertCommon = function( e, prop, method )
        {
            this.assertOk(
                e.message.search( 'Unable to proxy' ) > -1,
                "Unexpected error received: " + e.message
            );

            this.assertOk(
                ( ( e.message.search( prop ) > -1 )
                    && ( e.message.search( method ) > -1 )
                ),
                "Error should contain property and method names"
            );
        };
    },


    setUp: function()
    {
        this._sut = this.require( 'MethodWrappers' );
    },


    /**
     * The wrappers accept a function that should return the instance to be
     * bound to 'this' when invoking a method. This has some important
     * consequences, such as the ability to implement protected/private members.
     */
    'Method invocation binds `this` to passed instance': function()
    {
        var instance = function() {},
            val      = 'fooboo',
            val2     = 'fooboo2',
            iid      = 1,
            called   = false,

            getInst = function()
            {
                called = true;
                return instance;
            },

            method = this._sut.standard.wrapNew(
                function()
                {
                    return this.foo;
                },
                null, 0, getInst
            ),

            override = this._sut.standard.wrapOverride(
                function()
                {
                    return this.foo2;
                },
                method, 0, getInst
            )
        ;

        // set instance values
        instance.foo  = val;
        instance.foo2 = val2;

        this.assertEqual( method(), val,
            "Calling method will bind 'this' to passed instance"
        );

        this.assertEqual( override(), val2,
            "Calling method override will bind 'this' to passed instance"
        );
    },


    /**
     * The __super property is defined for method overrides and permits invoking
     * the overridden method (method of the supertype).
     *
     * In this test, we are not looking to assert that __super matches the super
     * method. Rather, we want to ensure it /invokes/ it. This is because the
     * super method may be wrapped to provide additional functionality. We don't
     * know, we don't care. We just want to make sure it's functioning properly.
     */
    'Overriden method should contain reference to super method': function()
    {
        var _self       = this,
            orig_called = false,
            getInst     = function() {},

            // "super" method
            method = this._sut.standard.wrapNew(
                function()
                {
                    orig_called = true;
                },
                null, 0, getInst
            ),

            // override method
            override = this._sut.standard.wrapOverride(
                function()
                {
                    _self.assertNotEqual(
                        this.__super,
                        undefined,
                        "__super is defined for overridden method"
                    );

                    this.__super();
                    _self.assertEqual(
                        orig_called,
                        true,
                        "Invoking __super calls super method"
                    );
                },
                method, 0, getInst
            )
        ;

        // invoke the method to run the above assertions
        override();
    },


    /**
     * If the method is called when bound to a different context (e.g. for
     * protected/private members), __super may not be properly bound.
     *
     * This test is in response to a bug found after implementing visibility
     * support. The __super() method was previously defined on 'this', which may
     * or may not be the context that is actually used. Likely, it's not.
     */
    'Super method works properly when context differs': function()
    {
        var super_called = false,
            retobj       = {},

            getInst = function()
            {
                return retobj;
            },

            // super method to be overridden
            method = this._sut.standard.wrapNew(
                function()
                {
                    super_called = true;
                },
                null, 0, getInst
            ),

            // the overriding method
            override = this._sut.standard.wrapOverride(
                function()
                {
                    this.__super();
                },
                method, 0, getInst
            )
        ;

        // call the overriding method
        override();

        // ensure that the super method was called
        this.assertEqual( super_called, true,
            "__super() method is called even when context differs"
        );

        // finally, ensure that __super is no longer set on the returned object
        // after the call to ensure that the caller cannot break encapsulation
        // by stealing a method reference (sneaky, sneaky)
        this.assertEqual( retobj.__super, undefined,
            "__super() method is unset after being called"
        );
    },


    /**
     * While __super is convenient and concise, it is not general-purpose
     * and does not solve the problem of invoking any arbitrary method on
     * the supertype. In particular, we may override some method foo, but
     * wish to call the parent foo in another method; we cannot do that with
     * __super.
     *
     * Note, however, that this will require foo.super.call( this ) to
     * provide the proper context.
     */
    'Can invoke super method by calling override.super': function()
    {
        var expected = {},
            getInst  = function() { return {}; },

            // super method to be overridden
            method = this._sut.standard.wrapNew(
                function() { return expected; },
                null, 0, getInst
            ),

            // the overriding method (we don't care what this does)
            override = this._sut.standard.wrapOverride(
                function() {}, method, 0, getInst
            )
        ;

        // we should be able to invoke the super method by override.super,
        // which is added atop of the wrapper (note that we quote it to avoid
        // problems with ES3 engines)
        this.assertStrictEqual( override['super'](), expected );
    },


    /**
     * The proxy wrapper should forward all arguments to the provided object's
     * appropriate method. The return value should also be proxied back to the
     * caller.
     */
    'Proxy will properly forward calls to destination object': function()
    {
        var name     = 'someMethod',
            propname = 'dest',

            args       = [ 1, {}, 'three' ],
            args_given = [],

            getInst = function()
            {
                return inst;
            },

            method_retval = {},
            dest          = {
                someMethod: function()
                {
                    args_given = Array.prototype.slice.call( arguments );
                    return method_retval;
                }
            },

            // acts like a class instance
            inst = { dest: dest },

            proxy = this._sut.standard.wrapProxy(
                propname, null, 0, getInst, name
            )
        ;

        this.assertStrictEqual( method_retval, proxy.apply( inst, args ),
            "Proxy call should return the value from the destination"
        );

        this.assertDeepEqual( args, args_given,
            "All arguments should be properly forwarded to the destination"
        );
    },


    /**
     * If the destination object returns itself, then we should return the
     * context in which the proxy was called; this ensures that we do not break
     * encapsulation.  Consequently, it also provides a more consistent and
     * sensical API and permits method chaining.
     *
     * If this is not the desired result, then the user is free to forefit the
     * proxy wrapper and instead use a normal method, manually proxying the
     * call.
     */
    'Proxy retval is replaced with context if dest returns self': function()
    {
        var propname = 'foo',
            method   = 'bar',

            foo = {
                bar: function()
                {
                    // return "self"
                    return foo;
                }
            },

            inst = { foo: foo },

            ret = this._sut.standard.wrapProxy(
                propname, null, 0,
                function()
                {
                    return inst;
                },
                method
            ).call( inst )
        ;

        this.assertStrictEqual( inst, ret,
            "Proxy should return instance in place of destination, if returned"
        );
    },


    /**
     * Rather than allowing a cryptic error to be thrown by the engine, take
     * some initiative and attempt to detect when a call will fail due to the
     * destination not being an object.
     */
    'Proxy throws error if call will faill due to non-object': function()
    {
        var prop   = 'noexist',
            method = 'foo';

        try
        {
            // should fail because 'noexist' does not exist on the object
            this._sut.standard.wrapProxy(
                prop, null, 0,
                function() { return {}; },
                method
            )();
        }
        catch ( e )
        {
            this.proxyErrorAssertCommon( e, prop, method );
            return;
        }

        this.assertFail(
            "Error should be thrown if proxy would fail due to a non-object"
        );
    },


    /**
     * Rather than allowing a cryptic error to be thrown by the engine, take
     * some initiative and attempt to detect when a call will fail due to the
     * destination method not being a function.
     */
    'Proxy throws error if call will fail due to non-function': function()
    {
        var prop   = 'dest',
            method = 'foo';

        try
        {
            // should fail because 'noexist' does not exist on the object
            this._sut.standard.wrapProxy(
                prop, null, 0,
                function() { return { dest: { foo: 'notafunc' } }; },
                method
            )();
        }
        catch ( e )
        {
            this.proxyErrorAssertCommon( e, prop, method );
            return;
        }

        this.assertFail(
            "Error should be thrown if proxy would fail due to a non-function"
        );
    },


    /**
     * If the `static' keyword is provided, then the proxy mustn't operate on
     * instance properties. Instead, the static accessor method $() must be
     * used.
     */
    'Can proxy to static members': function()
    {
        var getInst = function()
            {
                // pretend that we're a static class with a static accessor method
                return {
                    $: function( name )
                    {
                        // implicitly tests that the argument is properly passed
                        // (would otherwise return `undefined`)
                        return s[ name ];
                    }
                };
            },

            keywords = { 'static': true },

            val = [ 'value' ],
            s   = {
                // destination object
                foo: {
                    method: function()
                    {
                        return val;
                    }
                }
            };

        this.assertStrictEqual( val,
            this._sut.standard.wrapProxy(
                'foo', null, 0, getInst, 'method', keywords
            )(),
            "Should properly proxy to static membesr via static accessor method"
        );
    },


    /**
     * A proxy method should be able to be used as a concrete implementation
     * for an abstract method; this means that it must properly expose the
     * number of arguments of the method that it is proxying to. The problem
     * is---it can't, because we do not have a type system and so we cannot
     * know what we will be proxying to at runtime!
     *
     * As such, we have no choice (since validations are not at proxy time)
     * but to set the length to something ridiculous so that it will never
     * fail.
     */
    'Proxy methods are able to satisfy abstract method param requirements':
    function()
    {
        var f = this._sut.standard.wrapProxy(
            {}, null, 0, function() {}, '', {}
        );

        this.assertOk( !( 0 < f.__length ) );
    }
} );

} )( module['test/MethodWrappersTest'] = {}, 'test' );
/** TEST CASE: PropParserKeywordsTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/PropParserKeywordsTest...<br />' )
/**
 * Tests property keyword parser
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut = this.require( 'prop_parser' );
    },


    setUp: function()
    {
        // pre-parsed test data
        this.ptest = this.Sut.parseKeywords(
            'virtual static abstract foo'
        );
    },


    /**
     * The intended name of the field is the last word in the string;
     * everything else is a keyword.
     */
    'Retrieves field name void of keywords': function()
    {
        this.assertEqual( this.ptest.name, 'foo' );
    },


    /**
     * Complements above test.
     */
    'Retrieves all keywords': function()
    {
        var keywords = this.ptest.keywords;

        // reserved words are quoted for environments that do not follow
        // ECMAScript's requirement of treating anything after a `.' as a
        // field
        this.assertOk( keywords['virtual'] );
        this.assertOk( keywords['static'] );
        this.assertOk( keywords['abstract'] );
    },


    /**
     * This is more of a sanity check than anything---it really should never
     * happen unless someone has been drinking heavily.
     */
    'Does not include keywords not explicitly provided': function()
    {
        var keywords = this.ptest.keywords;

        delete keywords['virtual'];
        delete keywords['static'];
        delete keywords['abstract'];

        // there should be no other keywords
        for ( var k in keywords )
        {
            this.assertFail( "Someone has been drinking: " + k );
        }

        // if we've gotten to this point, then we're good
        this.assertOk( true );
    },


    /**
     * Sounds like a good April Fool's joke.
     */
    'Accepts all valid keywords': function()
    {
        var parse = this.Sut.parseKeywords;

        this.assertDoesNotThrow( function()
        {
            // Odd seeing these all together, isn't it? Note that this is
            // not at all valid, but the prop parser doesn't care what
            // appears together.
            parse(
                'public protected private ' +
                'virtual abstract override ' +
                'static const proxy weak ' +
                'var'
            );
        }, Error );
    },


    /**
     * In an effort to prevent unnecessary bugs, notify the user when they
     * use a keyword that is not recognized; this may be a typo,
     * misunderstanding of the API, or differences between versions of
     * ease.js.
     */
    'Does not accept unknown keywords': function()
    {
        var parse = this.Sut.parseKeywords;

        var oddword = 'foobunny',
            oddname = 'moobunny';

        try
        {
            // remember, the last part of the string is the var name and is
            // not considered to be a keyword
            parse( oddword + ' ' + oddname );
        }
        catch ( e )
        {
            this.assertOk( e.message.search( oddword ) !== -1,
                "Error message contains unrecognized keyword"
            );

            this.assertOk( e.message.search( oddname ) !== -1,
                "Error message contains name"
            );

            return;
        }

        this.assertFail( "Should not permit unknown keywords" );
    },


    /**
     * It's accepted convention in nearly every modern object-oriented
     * language that underscore-prefixed members denote private. (Granted,
     * the Java community sometimes uses underscore suffixes, but that's
     * considerably less common in the JavaScript community.)
     *
     * For the sake of conciseness, this allows omission of the `private'
     * keyword; this, coupled with the fact that all non-underscore-prefixed
     * members are public by default, satisfies the two most common
     * visibility modifiers for classes and allows a definition style more
     * natural to JavaScript developers from prototypal development.
     */
    'Implciity marks underscore-prefixed members as private': function()
    {
        this.assertDeepEqual(
            this.Sut.parseKeywords( '_foo' ).keywords,
            { 'private': true }
        );
    },


    /**
     * All that said, we want users to be able to do what they want. Let's
     * have explicit access modifier declarations override the implicit
     * behavior rather than providing confusing errors (because multiple
     * access modifiers were provided).
     */
    'Fields are not implicitly private with explicit access modifier':
    function()
    {
        this.assertDeepEqual(
            this.Sut.parseKeywords( 'public _foo' ).keywords,
            { 'public': true }
        );

        this.assertDeepEqual(
            this.Sut.parseKeywords( 'protected _foo' ).keywords,
            { 'protected': true }
        );

        this.assertDeepEqual(
            this.Sut.parseKeywords( 'private _foo' ).keywords,
            { 'private': true }
        );
    },


    /**
     * Double-underscore members are reserved by ease.js for special purposes
     * and are not included as part of the prototype chain. Further, if we
     * did not have this exception, then __construct would be marked as
     * private, which would be in error.
     */
    'Double-underscore members are not implicitly private': function()
    {
        this.assertDeepEqual(
            this.Sut.parseKeywords( '__foo' ).keywords,
            {}
        );
    },


    /**
     * As the keyword bit values are magic values, they must be exposed if
     * the bitfield is to be used. The bitmasks are useful for quick and
     * convenient checks in other parts of the framework.
     */
    'Exposes keyword bit values and masks': function()
    {
        this.assertOk( this.Sut.kvals );
        this.assertOk( this.Sut.kmasks );
    },


    /**
     * Access modifier checks are common; ensure that the bitmask can
     * properly check them all and does not check for any other keywords.
     */
    'Access modifier bitmask catches all access modifiers': function()
    {
        var kvals = this.Sut.kvals;

        // this can be easily checked by ensuring that the inclusive logical
        // or of all the access modifier bits are no different than the mask
        this.assertEqual(
            this.Sut.kmasks.amods
                | kvals[ 'public' ]
                | kvals[ 'protected' ]
                | kvals[ 'private' ],
            this.Sut.kmasks.amods
        );
    },


    /**
     * Likewise, a virtual bitmask is also useful since it can be denoted by
     * multiple keywords (abstract is implicitly virtual).
     */
    'Virtual bitmask catches abstract and virtual keywords': function()
    {
        var kvals = this.Sut.kvals;

        this.assertEqual(
            this.Sut.kmasks[ 'virtual' ]
                | kvals[ 'abstract' ]
                | kvals[ 'virtual' ],
            this.Sut.kmasks[ 'virtual' ]
        );
    }
} );
} )( module['test/PropParserKeywordsTest'] = {}, 'test' );
/** TEST CASE: Trait/AbstractTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Trait/AbstractTest...<br />' )
/**
 * Tests abstract trait definition and use
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut           = this.require( 'Trait' );
        this.Class         = this.require( 'class' );
        this.AbstractClass = this.require( 'class_abstract' );
    },


    /**
     * If a trait contains an abstract member, then any class that uses it
     * should too be considered abstract if no concrete implementation is
     * provided.
     */
    'Abstract traits create abstract classes when used': function()
    {
        var T = this.Sut( { 'abstract foo': [] } );

        var _self = this;
        this.assertDoesNotThrow( function()
        {
            // no concrete `foo; should be abstract (this test is sufficient
            // because AbstractClass will throw an error if there are no
            // abstract members)
            _self.AbstractClass.use( T ).extend( {} );
        }, Error );
    },


    /**
     * A class may still be concrete even if it uses abstract traits so long
     * as it provides concrete implementations for each of the trait's
     * abstract members.
     */
    'Concrete classes may use abstract traits by definining members':
    function()
    {
        var T      = this.Sut( { 'abstract traitfoo': [ 'foo' ] } ),
            C      = null,
            called = false;

        var _self = this;
        this.assertDoesNotThrow( function()
        {
            C = _self.Class.use( T ).extend(
            {
                traitfoo: function( foo ) { called = true; }
            } );
        } );

        // sanity check
        C().traitfoo();
        this.assertOk( called );
    },


    /**
     * The concrete methods provided by a class must be compatible with the
     * abstract definitions of any used traits. This test ensures not only
     * that the check is being performed, but that the abstract declaration
     * is properly inherited from the trait.
     *
     * TODO: The error mentions "supertype" compatibility, which (although
     * true) may be confusing; perhaps reference the trait that declared the
     * method as abstract.
     */
    'Concrete classes must be compatible with abstract traits': function()
    {
        var T = this.Sut( { 'abstract traitfoo': [ 'foo' ] } );

        var _self = this;
        this.assertThrows( function()
        {
            C = _self.Class.use( T ).extend(
            {
                // missing param in definition
                traitfoo: function() {}
            } );
        } );
    },


    /**
     * If a trait defines an abstract method, then it should be able to
     * invoke a concrete method of the same name defined by a class.
     */
    'Traits can invoke concrete class implementation of abstract method':
    function()
    {
        var expected = 'foobar';

        var T = this.Sut(
        {
            'public getFoo': function()
            {
                return this.echo( expected );
            },

            'abstract protected echo': [ 'value' ]
        } );

        var result = this.Class.use( T ).extend(
        {
            // concrete implementation of abstract trait method
            'protected echo': function( value )
            {
                return value;
            }
        } )().getFoo();

        this.assertEqual( result, expected );
    },


    /**
     * Even more kinky is when a trait provides a concrete implementation
     * for an abstract method that is defined in another trait that is mixed
     * into the same class. This makes sense, because that class acts as
     * though the trait's abstract method is its own. This allows for
     * message passing between two traits with the class as the mediator.
     *
     * This is otherwise pretty much the same as the above test. Note that
     * we use a public `echo' method; this is to ensure that we do not break
     * in the event that protected trait members break (that is: are not
     * exposed to the class).
     */
    'Traits can invoke concrete trait implementation of abstract method':
    function()
    {
        var expected = 'traitbar';

        // same as the previous test
        var Ta = this.Sut(
        {
            'public getFoo': function()
            {
                return this.echo( expected );
            },

            'abstract public echo': [ 'value' ]
        } );

        // but this is new
        var Tc = this.Sut(
        {
            // concrete implementation of abstract trait method
            'public echo': function( value )
            {
                return value;
            }
        } );

        this.assertEqual(
            this.Class.use( Ta, Tc ).extend( {} )().getFoo(),
            expected
        );

        // order shouldn't matter (because that'd be confusing and
        // frustrating to users, depending on how the traits are named), so
        // let's do this again in reverse order
        this.assertEqual(
            this.Class.use( Tc, Ta ).extend( {} )().getFoo(),
            expected,
            "Crap; order matters?!"
        );
    },


    /**
     * If some trait T used by abstract class C defines abstract method M,
     * then some subtype C' of C should be able to provide a concrete
     * definition of M such that T.M() invokes C'.M.
     */
    'Abstract method inherited from trait can be implemented by subtype':
    function()
    {
        var T = this.Sut(
        {
            'public doFoo': function()
            {
                // should invoke the concrete implementation
                this.foo();
            },

            'abstract protected foo': []
        } );

        var called = false;

        // C is a concrete class that extends an abstract class that uses
        // trait T
        var C = this.AbstractClass.use( T ).extend( {} )
            .extend(
            {
                // concrete definition that should be invoked by T.doFoo
                'protected foo': function()
                {
                    called = true;
                }
            } );

        C().doFoo();
        this.assertOk( called );
    },


    /**
     * Ensure that chained mixins (that is, calling `use' multiple times
     * independently) maintains the use of AbstractClass, and properly
     * performs the abstract check at the final `extend' call.
     */
    'Chained mixins properly carry abstract flag': function()
    {
        var _self = this,
            Ta    = this.Sut( { foo: function() {} } ),
            Tc    = this.Sut( { baz: function() {} } ),
            Tab   = this.Sut( { 'abstract baz': [] } );

        // ensure that abstract definitions are carried through properly
        this.assertDoesNotThrow( function()
        {
            // single, abstract
            _self.assertOk(
                _self.AbstractClass
                    .use( Tab )
                    .extend( {} )
                    .isAbstract()
            );

            // single, concrete
            _self.assertOk(
                _self.AbstractClass
                    .use( Ta )
                    .extend( { 'abstract baz': [] } )
                    .isAbstract()
            );

            // chained, both
            _self.assertOk(
                _self.AbstractClass
                    .use( Ta )
                    .use( Tab )
                    .extend( {} )
                    .isAbstract()

            );
            _self.assertOk(
                _self.AbstractClass
                    .use( Tab )
                    .use( Ta )
                    .extend( {} )
                    .isAbstract()
            );
        } );

        // and then ensure that we will properly throw an exception if not
        this.assertThrows( function()
        {
            // not abstract
            _self.AbstractClass.use( Tc ).extend( {} );
        } );

        this.assertThrows( function()
        {
            // initially abstract, but then not (by extend)
            _self.AbstractClass.use( Tab ).extend(
            {
                // concrete definition; no longer abstract
                baz: function() {}
            } );
        } );

        this.assertThrows( function()
        {
            // initially abstract, but then second mix provides a concrete
            // definition
            _self.AbstractClass.use( Tab ).use( Tc ).extend( {} );
        } );
    },


    /**
     * Mixins can make a class auto-abstract (that is, not require the use
     * of AbstractClass for the mixin) in order to permit the use of
     * Type.use when the intent is not to subclass, but to decorate (yes,
     * the result is still a subtype). Let's make sure that we're not
     * breaking the AbstractClass requirement, whose sole purpose is to aid
     * in documentation by creating self-documenting code.
     */
    'Explicitly-declared class will not be automatically abstract':
    function()
    {
        var _self = this,
            Tc    = this.Sut( { foo: function() {} } ),
            Ta    = this.Sut( { 'abstract foo': [] } );

        // if we provide no abstract methods, then declaring the class as
        // abstract should result in an error
        this.assertThrows( function()
        {
            // no abstract methods
            _self.assertOk( !(
                _self.AbstractClass.use( Tc ).extend( {} ).isAbstract()
            ) );
        } );

        // similarily, if we provide abstract methods, then there should be
        // no error
        this.assertDoesNotThrow( function()
        {
            // abstract methods via extend
            _self.assertOk(
                _self.AbstractClass.use( Tc ).extend(
                {
                    'abstract bar': []
                } ).isAbstract()
            );

            // abstract via trait
            _self.assertOk(
                _self.AbstractClass.use( Ta ).extend( {} ).isAbstract()
            );
        } );

        // if we provide abstract methods, then we should not be able to
        // declare a class as concrete
        this.assertThrows( function()
        {
            _self.Class.use( Tc ).extend(
            {
                'abstract bar': []
            } );
        } );

        // similar to above, but via trait
        this.assertThrows( function()
        {
            _self.Class.use( Ta ).extend();
        } );
    }
} );
} )( module['test/Trait/AbstractTest'] = {}, 'test/Trait' );
/** TEST CASE: Trait/ClassVirtualTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Trait/ClassVirtualTest...<br />' )
/**
 * Tests overriding virtual class methods using mixins
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
 * These tests vary from those in VirtualTest in that, rather than a class
 * overriding a virtual method defined within a trait, a trait is overriding
 * a method in the class that it is mixed into. In particular, since
 * overrides require that the super method actually exist, this means that a
 * trait must implement or extend a common interface.
 *
 * It is this very important (and powerful) system that allows traits to be
 * used as stackable modifications, similar to how one would use the
 * decorator pattern (but more tightly coupled).
 */

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut           = this.require( 'Trait' );
        this.Class         = this.require( 'class' );
        this.AbstractClass = this.require( 'class_abstract' );
        this.Interface     = this.require( 'interface' );
    },


    /**
     * A trait may implement an interface I for a couple of reasons: to have
     * the class mixed into be considered to of type I and to override
     * methods. But, regardless of the reason, let's start with the
     * fundamentals.
     */
    'Traits may implement an interface': function()
    {
        var _self = this;

        // simply make sure that the API is supported; nothing more.
        this.assertDoesNotThrow( function()
        {
           _self.Sut.implement( _self.Interface( {} ) ).extend( {} );
        } );
    },


    /**
     * We would expect that the default behavior of implementing an
     * interface I into a trait would create a trait with all abstract
     * methods defined by I.
     */
    'Traits implementing interfaces define abstract methods': function()
    {
        var I = this.Interface( { foo: [], bar: [] } ),
            T = this.Sut.implement( I ).extend( {} );

        var Class         = this.Class,
            AbstractClass = this.AbstractClass;

        // T should contain both foo and bar as abstract methods, which we
        // will test indirectly in the assertions below

        // should fail because of abstract foo and bar
        this.assertThrows( function()
        {
            Class.use( T ).extend( {} );
        } );

        // should succeed, since we can have abstract methods within an
        // abstract class
        this.assertDoesNotThrow( function()
        {
            AbstractClass.use( T ).extend( {} );
        } );

        // one remaining abstract method
        this.assertDoesNotThrow( function()
        {
            AbstractClass.use( T ).extend( { foo: function() {} } );
        } );

        // both concrete
        this.assertDoesNotThrow( function()
        {
            Class.use( T ).extend(
            {
                foo: function() {},
                bar: function() {}
            } );
        } );
    },


    /**
     * Just as classes implementing interfaces may choose to immediately
     * provide concrete definitions for the methods declared in the
     * interface (instead of becoming an abstract class), so too may traits.
     */
    'Traits may provide concrete methods for interfaces': function()
    {
        var called = false;

        var I = this.Interface( { foo: [] } ),
            T = this.Sut.implement( I ).extend(
            {
                foo: function()
                {
                    called = true;
                }
            } );

        var Class = this.Class;
        this.assertDoesNotThrow( function()
        {
            // should invoke concrete foo; class definition should not fail,
            // because foo is no longer abstract
            Class.use( T ).extend( {} )().foo();
        } );

        this.assertOk( called );
    },


    /**
     * Instances of class C mixing in some trait T implementing I will be
     * considered to be of type I, since any method of I would either be
     * defined within T, or would be implicitly abstract in T, requiring its
     * definition within C; otherwise, C would have to be declared astract.
     */
    'Instance of class mixing in trait implementing I is of type I':
    function()
    {
        var I = this.Interface( {} ),
            T = this.Sut.implement( I ).extend( {} );

        this.assertOk(
            this.Class.isA( I, this.Class.use( T ).extend( {} )() )
        );
    },


    /**
     * The API for multiple interfaces should be the same for traits as it
     * is for classes.
     */
    'Trait can implement multiple interfaces': function()
    {
        var Ia = this.Interface( {} ),
            Ib = this.Interface( {} ),
            T  = this.Sut.implement( Ia, Ib ).extend( {} ),
            o  = this.Class.use( T ).extend( {} )();

        this.assertOk( this.Class.isA( Ia, o ) );
        this.assertOk( this.Class.isA( Ib, o ) );
    },


    /**
     * This is a concept borrowed from Scala: consider class C and trait T,
     * both implementing interface I which declares method M. T should be
     * able to override C.M so long as it is concrete, but to do so, we need
     * some way of telling ease.js that we are overriding at time of mixin;
     * otherwise, override does not make sense, because I.M is clearly
     * abstract and there is nothing to override.
     */
    'Mixin can override virtual concrete method defined by interface':
    function()
    {
        var called = false,
            I      = this.Interface( { foo: [] } );

        var T = this.Sut.implement( I ).extend(
        {
            // the keyword combination `abstract override' indicates that we
            // should override whatever concrete implementation was defined
            // before our having been mixed in
            'abstract override foo': function()
            {
                called = true;
            }
        } );

        var _self = this;
        var C = this.Class.implement( I ).extend(
        {
            // this should be overridden by the mixin and should therefore
            // never be called (for __super tests, see LinearizationTest)
            'virtual foo': function()
            {
                _self.fail( false, true,
                    "Concrete class method was not overridden by mixin"
                );
            }
        } );

        // mixing in a trait atop of C should yield the results described
        // above due to the `abstract override' keyword combination
        C.use( T )().foo();
        this.assertOk( called );
    },


    /**
     * Virtual methods for traits are handled via a series of proxy methods
     * that determine, at runtime (as opposed to when the class is created),
     * where the call should go. (At least that was the implementation at
     * the time this test was written.) This test relies on the proper
     * parameter metadata being set on those proxy methods so that the
     * necessary length requirements can be validated.
     *
     * This was a bug in the initial implemenation: the above tests did not
     * catch it because the virtual methods had no arguments. The initial
     * problem was that, since __length was not defined on the generated
     * method that was recognized as the override, it was always zero, which
     * always failed if there were any arguments on the virtual method. The
     * reverse case was also a problem, but it didn't manifest as an
     * error---rather, it did *not* error when it should have.
     *
     * Note the instantiation in these cases: this is because the trait
     * implementation lazily performs the mixin on first use.
     */
    'Subtype must meet compatibility requirements of virtual trait method':
    function()
    {
        var _self = this;

        var C = this.Class.use(
            this.Sut( { 'virtual foo': function( a, b ) {} } )
        );

        this.assertThrows( function()
        {
            // does not meet param requirements (note the
            // instantiation---traits defer processing until they are used)
            C.extend( { 'override foo': function( a ) {} } )();
        } );

        this.assertDoesNotThrow( function()
        {
            // does not meet param requirements (note the
            // instantiation---traits defer processing until they are used)
            C.extend( { 'override foo': function( a, b ) {} } )();
        } );
    }
} );
} )( module['test/Trait/ClassVirtualTest'] = {}, 'test/Trait' );
/** TEST CASE: Trait/DefinitionTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Trait/DefinitionTest...<br />' )
/**
 * Tests basic trait definition
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut           = this.require( 'Trait' );
        this.Class         = this.require( 'class' );
        this.Interface     = this.require( 'interface' );
        this.AbstractClass = this.require( 'class_abstract' );

        this.hasGetSet = !(
            this.require( 'util' ).definePropertyFallback()
        );

        // means of creating anonymous traits
        this.ctor = [
            this.Sut.extend,
            this.Sut
        ];

        // trait field name conflicts (methods)
        this.fconflict = [
            [ 'foo', "same name; no keywords",
                { foo: function() {} },
                { foo: function() {} }
            ],

            [ 'foo', "same keywords; same visibility",
                { 'public foo': function() {} },
                { 'public foo': function() {} }
            ],

            // should (at least for the time being) be picked up by existing
            // class error checks; TODO: but let's provide trait-specific
            // error messages to avoid frustration and infuriation
            [ 'foo', "varying keywords; same visibility",
                { 'virtual public foo': function() {} },
                { 'public virtual foo': function() {} }
            ],

            [ 'foo', "different visibility",
                { 'public foo':    function() {} },
                { 'protected foo': function() {} }
            ]
        ];

        this.base = [ this.Class ];
    },


    /**
     * We continue with the same concept used for class
     * definitions---extending the Trait module itself will create an
     * anonymous trait.
     */
    '@each(ctor) Can extend Trait to create anonymous trait': function( T )
    {
        this.assertOk( this.Sut.isTrait( T( {} ) ) );
    },


    /**
     * A trait can only be used by something else---it does not make sense
     * to instantiate them directly, since they form an incomplete picture.
     *
     * Now, that said, see parameterized traits.
     */
    '@each(ctor) Cannot instantiate trait without error': function( T )
    {
        this.assertThrows( function()
        {
            T( {} )();
        }, Error );
    },


    /**
     * One way that traits acquire meaning is by their use in creating
     * classes. This also allows us to observe whether traits are actually
     * working as intended without testing too closely to their
     * implementation. This test simply ensures that the Class module will
     * accept our traits.
     *
     * Classes consume traits as part of their definition using the `use'
     * method. We should be able to then invoke the `extend' method to
     * provide our own definition, without having to inherit from another
     * class.
     */
    '@each(ctor) Base class definition is applied when using traits':
    function( T )
    {
        var expected = 'bar';

        var C = this.Class.use( T( {} ) ).extend(
        {
            foo: expected
        } );

        this.assertOk( this.Class.isClass( C ) );
        this.assertEqual( C().foo, expected );
    },


    /**
     * Traits contribute to the definition of the class that `use's them;
     * therefore, it would stand to reason that we should still be able to
     * inherit from a supertype while using traits.
     */
    '@each(ctor) Supertype definition is applied when using traits':
    function( T )
    {
        var expected  = 'bar',
            expected2 = 'baz',
            Foo       = this.Class( { foo: expected } ),
            SubFoo    = this.Class.use( T( {} ) )
                .extend( Foo, { bar: expected2  } );

        var inst = SubFoo();

        this.assertOk( this.Class.isA( Foo, inst ) );
        this.assertEqual( inst.foo, expected, "Supertype failure" );
        this.assertEqual( inst.bar, expected2, "Subtype failure" );
    },


    /**
     * The above tests have ensured that classes are still operable with
     * traits; we can now test that traits are mixed into the class
     * definition via `use' by asserting on the trait definitions.
     */
    '@each(ctor) Trait definition is mixed into base class definition':
    function( T )
    {
        var called = false;

        var Trait = T( { foo: function() { called = true; } } ),
            inst  = this.Class.use( Trait ).extend( {} )();

        // if mixin was successful, then we should have the `foo' method.
        this.assertDoesNotThrow( function()
        {
            inst.foo();
        }, Error, "Should have access to mixed in fields" );

        // if our variable was not set, then it was a bs copy
        this.assertOk( called, "Mixed in field copy error" );
    },


    /**
     * The above test should apply just the same to subtypes.
     */
    '@each(ctor) Trait definition is mixed into subtype definition':
    function( T )
    {
        var called = false;

        var Trait = T( { foo: function() { called = true; } } ),
            Foo   = this.Class( {} ),
            inst  = this.Class.use( Trait ).extend( Foo, {} )();

        inst.foo();
        this.assertOk( called );
    },


    //
    // At this point, we assume that each ctor method is working as expected
    // (that is---the same); we will proceed to test only a single method of
    // construction under that assumption.
    //


    /**
     * Traits cannot be instantiated, so they need not define __construct
     * for themselves; however, they may wish to influence the construction
     * of anything that uses them. This is poor practice, since that
     * introduces a war between traits to take over the constructor;
     * instead, the class using the traits should handle calling the methods
     * on the traits and we should disallow traits from attempting to set
     * the constructor.
     */
    'Traits cannot define __construct': function()
    {
        try
        {
            this.Sut( { __construct: function() {} } );
        }
        catch ( e )
        {
            this.assertOk( e.message.match( /\b__construct\b/ ) );
            return;
        }

        this.fail( false, true,
            "Traits should not be able to define __construct"
        );
    },


    /**
     * If two traits attempt to define the same field (by name, regardless
     * of its type), then an error should be thrown to warn the developer of
     * a problem; automatic resolution would be a fertile source of nasty
     * and confusing bugs.
     *
     * TODO: conflict resolution through aliasing
     */
    '@each(fconflict) Cannot mix in multiple concrete methods of same name':
    function( dfns )
    {
        var fname = dfns[ 0 ],
            desc  = dfns[ 1 ],
            A     = this.Sut( dfns[ 2 ] ),
            B     = this.Sut( dfns[ 3 ] );

        // this, therefore, should error
        try
        {
            this.Class.use( A, B ).extend( {} );
        }
        catch ( e )
        {
            // the assertion should contain the name of the field that
            // caused the error
            this.assertOk(
                e.message.match( '\\b' + fname + '\\b' ),
                "Error message missing field name: " + e.message
            );

            // TODO: we can also make less people hate us if we include the
            // names of the conflicting traits; in the case of an anonymous
            // trait, maybe include its index in the use list

            return;
        }

        this.fail( false, true, "Mixin must fail on conflict: " + desc );
    },


    /**
     * Traits in ease.js were designed in such a way that an object can be
     * considered to be a type of any of the traits that its class mixes in;
     * this is consistent with the concept of interfaces and provides a very
     * simple and intuitive type system.
     */
    'A class is considered to be a type of each used trait': function()
    {
        var Ta = this.Sut( {} ),
            Tb = this.Sut( {} ),
            Tc = this.Sut( {} ),
            o  = this.Class.use( Ta, Tb ).extend( {} )();

        // these two were mixed in
        this.assertOk( this.Class.isA( Ta, o ) );
        this.assertOk( this.Class.isA( Tb, o ) );

        // this one was not
        this.assertOk( this.Class.isA( Tc, o ) === false );
    },


    /**
     * Ensure that the named class staging object permits mixins.
     */
    'Can mix traits into named class': function()
    {
        var called = false,
            T = this.Sut( { foo: function() { called = true; } } );

        this.Class( 'Named' ).use( T ).extend( {} )().foo();
        this.assertOk( called );
    },


    /**
     * When explicitly defining a class (that is, not mixing into an
     * existing class definition), which involves the use of Class or
     * AbstractClass, mixins must be terminated with a call to `extend'.
     * This allows the system to make a final determination as to whether
     * the resulting class is abstract.
     *
     * Contrast this with Type.use( T )( ... ), where Type is not the base
     * class (Class) or AbstractClass.
     */
    'Explicit class definitions must be terminated by an extend call':
    function()
    {
        var _self = this,
            Ta    = this.Sut( { foo: function() {} } ),
            Tb    = this.Sut( { bar: function() {} } );

        // does not complete with call to `extend'
        this.assertThrows( function()
        {
            _self.Class.use( Ta )();
        }, TypeError );

        // nested uses; does not complete
        this.assertThrows( function()
        {
            _self.Class.use( Ta ).use( Tb )();
        }, TypeError );

        // similar to above, with abstract; note that we're checking for
        // TypeError here
        this.assertThrows( function()
        {
            _self.AbstractClass.use( Ta )();
        }, TypeError );

        // does complete; OK
        this.assertDoesNotThrow( function()
        {
            _self.Class.use( Ta ).extend( {} )();
            _self.Class.use( Ta ).use( Tb ).extend( {} )();
        } );
    },


    /**
     * Ensure that the staging object created by the `implement' call
     * exposes a `use' method (and properly applies it).
     */
    'Can mix traits into class after implementing interface': function()
    {
        var _self  = this,
            called = false,

            T = this.Sut( { foo: function() { called = true; } } ),
            I = this.Interface( { bar: [] } ),
            A = null;

        // by declaring this abstract, we ensure that the interface was
        // actually implemented (otherwise, all methods would be concrete,
        // resulting in an error)
        this.assertDoesNotThrow( function()
        {
            A = _self.AbstractClass.implement( I ).use( T ).extend( {} );
            _self.assertOk( A.isAbstract() );
        } );

        // ensure that we actually fail if there's no interface implemented
        // (and thus no abstract members); if we fail and the previous test
        // succeeds, that implies that somehow the mixin is causing the
        // class to become abstract, and that is an issue (and the reason
        // for this seemingly redundant test)
        this.assertThrows( function()
        {
            _self.Class.implement( I ).use( T ).extend( {} );
        } );

        A.extend( { bar: function() {} } )().foo();
        this.assertOk( called );
    },


    /**
     * When a trait is mixed into a class, it acts as though it is part of
     * that class. Therefore, it should stand to reason that, when a mixed
     * in method returns `this', it should actually return the instance of
     * the class that it is mixed into (in the case of this test, its
     * private member object, since that's our context when invoking the
     * trait method).
     */
    'Trait method that returns self will return containing class':
    function()
    {
        var _self = this,
            T     = this.Sut( { foo: function() { return this; } } );

        this.Class.use( T ).extend(
        {
            go: function()
            {
                _self.assertStrictEqual( this, this.foo() );
            }
        } )().go();
    },


    /**
     * Support for static members will be added in future versions; this is
     * not something that the author wanted to rush for the first trait
     * release, as static members have their own odd quirks.
     */
    'Trait static members are prohibited': function()
    {
        var Sut = this.Sut;

        // property
        this.assertThrows( function()
        {
            Sut( { 'static private foo': 'prop' } );
        } );

        // method
        this.assertThrows( function()
        {
            Sut( { 'static foo': function() {} } );
        } );
    },


    /**
     * For the same reasons as static members (described immediately above),
     * getters/setters are unsupported until future versions.
     *
     * Note that we use defineProperty instead of the short-hand object
     * literal notation to avoid syntax errors in pre-ES5 environments.
     */
    'Trait getters and setters are prohibited': function()
    {
        // perform these tests only when getters/setters are supported by
        // our environment
        if ( !( this.hasGetSet ) )
        {
            return;
        }

        var Sut = this.Sut;

        this.assertThrows( function()
        {
            var dfn = {};
            Object.defineProperty( dfn, 'foo',
            {
                get: function() {},
                set: function() {},

                enumerable: true
            } );

            Sut( dfn );
        } );
    }
} );
} )( module['test/Trait/DefinitionTest'] = {}, 'test/Trait' );
/** TEST CASE: Trait/ImmediateTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Trait/ImmediateTest...<br />' )
/**
 * Tests immediate definition/instantiation
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut   = this.require( 'Trait' );
        this.Class = this.require( 'class' );
    },


    /**
     * In our most simple case, mixing a trait into an empty base class and
     * immediately invoking the resulting partial class (without explicitly
     * extending) should have the effect of instantiating a concrete version
     * of the trait (so long as that is permitted). While this test exists
     * to ensure consistency throughout the system, it may be helpful in
     * situations where a trait is useful on its own.
     *
     * Note that we cannot simply use Class.use( T ), because this sets up a
     * concrete class definition, not an immediate mixin.
     */
    'Invoking partial class after mixin instantiates': function()
    {
        var called = false;

        var T = this.Sut(
        {
            'public foo': function()
            {
                called = true;
            }
        } );

        // mixes T into an empty base class and instantiates
        this.Class.extend( {} ).use( T )().foo();
        this.assertOk( called );
    },


    /**
     * This is the most useful and conventional form of mixin---runtime,
     * atop of an existing class. In this case, we provide a short-hand form
     * of instantiation to avoid the ugly pattern of `.extend( {} )()'.
     */
    'Can invoke partial mixin atop of non-empty base': function()
    {
        var called_foo = false,
            called_bar = false;

        var C = this.Class(
        {
            'public foo': function() { called_foo = true; }
        } );

        var T = this.Sut(
        {
            'public bar': function() { called_bar = true; }
        } );

        // we must ensure not only that we have mixed in the trait, but that
        // we have also maintained C's interface
        var inst = C.use( T )();
        inst.foo();
        inst.bar();

        this.assertOk( called_foo );
        this.assertOk( called_bar );
    },


    /**
     * Ensure that the partial invocation shorthand is equivalent to the
     * aforementioned `.extend( {} ).apply( null, arguments )'.
     */
    'Partial arguments are passed to class constructor': function()
    {
        var given    = null,
            expected = { foo: 'bar' };

        var C = this.Class(
        {
            __construct: function() { given = arguments; }
        } );

        var T = this.Sut( {} );

        C.use( T )( expected );
        this.assertStrictEqual( given[ 0 ], expected );
    }
} );

} )( module['test/Trait/ImmediateTest'] = {}, 'test/Trait' );
/** TEST CASE: Trait/LinearizationTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Trait/LinearizationTest...<br />' )
/**
 * Tests trait/class linearization
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
 * GNU ease.js adopts Scala's concept of `linearization' with respect to
 * resolving calls to supertypes; the tests that follow provide a detailed
 * description of the concept, but readers may find it helpful to read
 * through the ease.js manual or Scala documentation.
 */

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut       = this.require( 'Trait' );
        this.Class     = this.require( 'class' );
        this.Interface = this.require( 'interface' );
    },


    /**
     * When a class mixes in a trait that defines some method M, and then
     * overrides it as M', then this.__super within M' should refer to M.
     * Note that this does not cause any conflicts with any class supertypes
     * that may define a method of the same name as M, because M must have
     * been an override, otherwise an error would have occurred.
     */
    'Class super call refers to mixin that is part of a class definition':
    function()
    {
        var _self   = this,
            scalled = false;

        var T = this.Sut(
        {
            // after mixin, this should be the super method
            'virtual public foo': function()
            {
                scalled = true;
            }
        } );

        this.Class.use( T ).extend(
        {
            // overrides mixed-in foo
            'override public foo': function()
            {
                // should invoke T.foo
                try
                {
                    this.__super();
                }
                catch ( e )
                {
                    _self.fail( false, true,
                        "Super invocation failure: " + e.message
                    );
                }
            }
        } )().foo();

        this.assertOk( scalled );
    },


    /**
     * If a trait overrides a method of a class that it is mixed into, then
     * super calls within the trait method should resolve to the class
     * method.
     */
    'Mixin overriding class method has class method as super method':
    function()
    {
        var _self = this;

        var expected = {},
            I        = this.Interface( { foo: [] } );

        var T = this.Sut.implement( I ).extend(
        {
            // see ClassVirtualTest case for details on this
            'abstract override foo': function()
            {
                // should reference C.foo
                return this.__super( expected );
            }
        } );

        var priv_expected = Math.random();

        var C = this.Class.implement( I ).extend(
        {
            // asserting on this value will ensure that the below method is
            // invoked in the proper context
            'private _priv': priv_expected,

            'virtual foo': function( given )
            {
                _self.assertEqual( priv_expected, this._priv );
                return given;
            }
        } );

        this.assertStrictEqual( C.use( T )().foo(), expected );
    },


    /**
     * Similar in spirit to the previous test: a supertype with a mixin
     * should be treated just as any other class.
     *
     * Another way of phrasing this test is: "traits are stackable".
     * Importantly, this also means that `virtual' must play nicely with
     * `abstract override'.
     */
    'Mixin overriding another mixin method M has super method M': function()
    {
        var called = {};

        var I = this.Interface( { foo: [] } );

        var Ta = this.Sut.implement( I ).extend(
        {
            'virtual abstract override foo': function()
            {
                called.a = true;
                this.__super();
            }
        } );

        var Tb = this.Sut.implement( I ).extend(
        {
            'abstract override foo': function()
            {
                called.b = true;
                this.__super();
            }
        } );

        this.Class.implement( I ).extend(
        {
            'virtual foo': function() { called.base = true; }
        } ).use( Ta ).use( Tb )().foo();

        this.assertOk( called.a );
        this.assertOk( called.b );
        this.assertOk( called.base );
    },


    /**
     * Essentially the same as the above test, but ensures that a mixin can
     * be stacked multiple times atop of itself with no ill effects. We
     * assume that all else is working (per the previous test).
     *
     * The number of times we stack the mixin is not really relevant, so
     * long as it is >= 2; we did 3 here just for the hell of it to
     * demonstrate that there is ideally no limit.
     */
    'Mixin can be mixed in atop of itself': function()
    {
        var called     = 0,
            calledbase = false;

        var I = this.Interface( { foo: [] } );

        var T = this.Sut.implement( I ).extend(
        {
            'virtual abstract override foo': function()
            {
                called++;
                this.__super();
            }
        } );

        this.Class.implement( I ).extend(
        {
            'virtual foo': function() { calledbase = true; }
        } ).use( T ).use( T ).use( T )().foo();


        // mixed in thrice, so it should have stacked thrice
        this.assertEqual( called, 3 );
        this.assertOk( calledbase );
    }
} );

} )( module['test/Trait/LinearizationTest'] = {}, 'test/Trait' );
/** TEST CASE: Trait/MixedExtendTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Trait/MixedExtendTest...<br />' )
/**
 * Tests extending a class that mixes in traits
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut   = this.require( 'Trait' );
        this.Class = this.require( 'class' );
    },


    /**
     * The supertype should continue to work as it would without the
     * subtype, which means that the supertype's traits should still be
     * available. Note that ease.js does not (at least at the time of
     * writing this test) check to see if a trait is no longer accessible
     * due to overrides, and so a supertype's traits will always be
     * instantiated.
     */
    'Subtype instantiates traits of supertype': function()
    {
        var called = false;

        var T = this.Sut(
        {
            foo: function() { called = true; }
        } );

        // C is a subtype of a class that mixes in T
        var C = this.Class.use( T ).extend( {} )
            .extend(
            {
                // ensure that there is no ctor-dependent trait stuff
                __construct: function() {}
            } );

        C().foo();
        this.assertOk( called );
    },


    /**
     * Just as subtypes inherit the same polymorphisms with respect to
     * interfaces, so too should subtypes inherit supertypes' mixed in
     * traits' types.
     */
    'Subtype has same polymorphic qualities of parent mixins': function()
    {
        var T = this.Sut( {} ),
            o = this.Class.use( T ).extend( {} ).extend( {} )();

        // o's supertype mixes in T
        this.assertOk( this.Class.isA( T, o ) );
    },


    /**
     * Subtyping should impose no limits on mixins (except for the obvious
     * API compatibility restrictions inherent in OOP).
     */
    'Subtype can mix in additional traits': function()
    {
        var a = false,
            b = false;

        var Ta = this.Sut(
            {
                'public ta': function() { a = true; }
            } ),
            Tb = this.Sut(
            {
                'public tb': function() { b = true; }
            } ),
            C  = null;

        var _self = this;
        this.assertDoesNotThrow( function()
        {
            var sup = _self.Class.use( Ta ).extend( {} );

            // mixes in Tb; supertype already mixed in Ta
            C = _self.Class.use( Tb ).extend( sup, {} );
        } );

        this.assertDoesNotThrow( function()
        {
            // ensures that instantiation does not throw an error and that
            // the methods both exist
            var o = C();
            o.ta();
            o.tb();
        } );

        // ensure both were properly called
        this.assertOk( a );
        this.assertOk( b );
    },


    /**
     * As a sanity check, ensure that subtyping does not override parent
     * type data with respect to traits.
     *
     * Note that this test makes the preceding test redundant, but the
     * separation is useful for debugging any potential regressions.
     */
    'Subtype trait types do not overwrite supertype types': function()
    {
        var Ta = this.Sut( {} ),
            Tb = this.Sut( {} ),
            C  = this.Class.use( Ta ).extend( {} ),
            o  = this.Class.use( Tb ).extend( C, {} )();

        // o's supertype mixes in Ta
        this.assertOk( this.Class.isA( Ta, o ) );

        // o mixes in Tb
        this.assertOk( this.Class.isA( Tb, o ) );
    },


    /**
     * This alternative syntax mixes a trait directly into a base class and
     * then omits the base class as an argument to the extend method; this
     * syntax is most familiar with named classes, but we are not testing
     * named classes here.
     */
    'Can mix in traits directly atop of existing class': function()
    {
        var called_foo = false,
            called_bar = false,
            called_baz = false;

        var C = this.Class(
        {
            'public foo': function() { called_foo = true; }
        } );

        var T = this.Sut(
        {
            'public bar': function() { called_bar = true; }
        } );

        // we must ensure not only that we have mixed in the trait, but that
        // we have also maintained C's interface and can further extend it
        var inst = C.use( T ).extend(
        {
            'public baz': function() { called_baz = true; }
        } )();

        inst.foo();
        inst.bar();
        inst.baz();

        this.assertOk( called_foo );
        this.assertOk( called_bar );
        this.assertOk( called_baz );
    },


    /**
     * This test ensures that we can mix in traits using the syntax
     * C.use(T1).use(T2), and so on; this may be necessary to disambiguate
     * overrides if T1 and T2 provide definitions for the same method (and
     * so the syntax C.use(T1, T2) cannot be used). This syntax is also
     * important for the concept of stackable traits (see
     * LinearizationTest).
     *
     * Note that this differs from C.use(T1).use(T2).extend({}); we're
     * talking about C.extend({}).use(T1).use(T2). Therefore, this can be
     * considered to be syntatic sugar for
     * C.use( T1 ).extend( {} ).use( T2 ).
     */
    'Can chain use calls': function()
    {
        var T1 = this.Sut( { foo: function() {} } ),
            T2 = this.Sut( { bar: function() {} } ),
            C  = null;

        var Class = this.Class;
        this.assertDoesNotThrow( function()
        {
            C = Class.extend( {} ).use( T1 ).use( T2 );
        } );

        // ensure that the methods were actually mixed in
        this.assertDoesNotThrow( function()
        {
            C().foo();
            C().bar();
        } );
    }
} );
} )( module['test/Trait/MixedExtendTest'] = {}, 'test/Trait' );
/** TEST CASE: Trait/NamedTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Trait/NamedTest...<br />' )
/**
 * Tests named trait definitions
 *
 *  Copyright (C) 2014 Mike Gerwitz
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut       = this.require( 'Trait' );
        this.Class     = this.require( 'class' );
        this.Interface = this.require( 'interface' );
    },


    /**
     * If a trait is not given a name, then converting it to a string should
     * indicate that it is anonymous. Further, to disambiguate from
     * anonymous classes, we should further indicate that it is a trait.
     *
     * This test is fragile in the sense that it tests for an explicit
     * string: this is intended, since some developers may rely on this
     * string (even though they really should use Trait.isTrait), and so it
     * should be explicitly documented.
     */
    'Anonymous trait is properly indicated when converted to string':
    function()
    {
        var given = this.Sut( {} ).toString();
        this.assertEqual( given, '(Trait)' );
    },


    /**
     * Analagous to named classes: we should provide the name when
     * converting to a string to aid in debugging.
     */
    'Named trait contains name when converted to string': function()
    {
        var name = 'FooTrait',
            T    = this.Sut( name, {} );

        this.assertOk( T.toString().match( name ) );
    },


    /**
     * We assume that, if two or more arguments are provided, that the
     * definition is named.
     */
    'Named trait definition cannot contain zero or more than two arguments':
    function()
    {
        var Sut = this.Sut;
        this.assertThrows( function() { Sut(); } );
        this.assertThrows( function() { Sut( 1, 2, 3 ); } );
    },


    /**
     * Operating on the same assumption as the above test.
     */
    'First argument in named trait definition must be a string':
    function()
    {
        var Sut = this.Sut;
        this.assertThrows( function()
        {
            Sut( {}, {} );
        } );
    },


    /**
     * Just as is the case with classes, providing only a name for the trait
     * should create a staging object with which subsequent calls may be
     * chained, just as if those calls were made on Trait directly. The
     * difference is that the name shall propagate.
     */
    'Providing only trait name creates staging object': function()
    {
        var Sut = this.Sut;
        this.assertDoesNotThrow( function()
        {
            // this does not create a trait, but it should be acceptable
            // just as Class( "Foo" ) is
            Sut( "Foo" );
        } );
    },


    /**
     * The named trait staging object should permit direct extension using
     * an extend method, which should do the same thing as Trait.extend.
     */
    'Can extend named trait staging object': function()
    {
        var Sut      = this.Sut,
            expected = {},
            name     = "Foo",
            T        = null;

        this.assertDoesNotThrow( function()
        {
            // this does not create a trait, but it should be acceptable
            // just as Class( "Foo" ) is
            T = Sut( name )
                .extend( { foo: function() { return expected; } } );
        } );

        // ensure that extending worked as expected
        this.assertStrictEqual(
            this.Class( {} ).use( T )().foo(),
            expected
        );

        // ensure that trait was properly named
        this.assertOk( T.toString().match( name ) );
    },


    /**
     * The implement method on the named staging object should work just as
     * Trait.implement.
     */
    'Can implement interface using named trait staging object':
    function()
    {

        var Sut      = this.Sut,
            expected = {},
            name     = "Foo",
            I        = this.Interface( {} ),
            I2       = this.Interface( {} ),
            T        = null;

        this.assertDoesNotThrow( function()
        {
            // this does not create a trait, but it should be acceptable
            // just as Class( "Foo" ) is
            T = Sut( "Foo" )
                .implement( I, I2 )
                .extend( {} );
        } );

        // ensure that implement worked as intended
        var inst = this.Class( {} ).use( T )();
        this.assertOk( this.Class.isA( I, inst ) );
        this.assertOk( this.Class.isA( I2, inst ) );

        // ensure that trait was properly named
        this.assertOk( T.toString().match( name ) );
    }
} );
} )( module['test/Trait/NamedTest'] = {}, 'test/Trait' );
/** TEST CASE: Trait/ParameterTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Trait/ParameterTest...<br />' )
/**
 * Tests parameterized traits
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

/*** XXX __construct or __mixin first? __mixin with no parameters should
 * permit standard trait with initialization procedure ***/

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut   = this.require( 'Trait' );
        this.Class = this.require( 'class' );

        var _self = this;
        this.createParamTrait = function( f )
        {
            return _self.Sut( { __mixin: ( f || function() {} ) } );
        };
    },


    /**
     * Since traits are reusable components mixed into classes, they
     * themselves do not have a constructor. This puts the user at a
     * disadvantage, because she would have to create a new trait to simply
     * to provide some sort of configuration at the time the class is
     * instantiated. Adding a method to do the configuration is another
     * option, but that is inconvenient, especially when the state is
     * intended to be immutable.
     *
     * This does not suffer from the issue that Scala is having in trying to
     * implement a similar feature because traits cannot have non-private
     * properties; the linearization process disambiguates.
     *
     * When a trait contains a __mixin method, it is created as a
     * ParameterTraitType instead of a TraitType. Both must be recognized as
     * traits so that they can both be mixed in as expected; a method is
     * provided to assert whether or not a trait is a parameter trait
     * programatically, since attempting to configure a non-param trait will
     * throw an exception.
     */
    'Can create parameter traits': function()
    {
        var T = this.createParamTrait();

        this.assertOk( this.Sut.isParameterTrait( T ) );
        this.assertOk( this.Sut.isTrait( T ) );
    },


    /**
     * A parameter trait is in an uninitialized state---it cannot be mixed
     * in until arguments have been provided; same rationale as a class
     * constructor.
     */
    'Cannot mix in a parameter trait': function()
    {
        var _self = this;
        this.assertThrows( function()
        {
            _self.Class.use( _self.createParamTrait() )();
        } );
    },


    /**
     * Invoking a parameter trait will produce an argument trait which may
     * be mixed in. This has the effect of appearing as though the trait is
     * being instantiated (but it's not).
     */
    'Invoking parameter trait produces argument trait': function()
    {
        var _self = this;
        this.assertDoesNotThrow( function()
        {
            _self.assertOk(
                _self.Sut.isArgumentTrait( _self.createParamTrait()() )
            );
        } );
    },


    /**
     * Traits cannot be instantiated; ensure that this remains true, even
     * with the parameterized trait implementation.
     */
    'Invoking a standard trait throws an exception': function()
    {
        var Sut = this.Sut;
        this.assertThrows( function()
        {
            // no __mixin method; not a param trait
            Sut( {} )();
        } );
    },


    /**
     * Argument traits can be mixed in just as non-parameterized traits can;
     * it would be silly not to consider them to be traits through our
     * reflection API.
     */
    'Recognizes argument trait as a trait': function()
    {
        this.assertOk(
            this.Sut.isTrait( this.createParamTrait()() )
        );
    },


    /**
     * A param trait, upon configuration, returns an immutable argument
     * trait; any attempt to invoke it (e.g. to try to re-configure) is in
     * error.
     */
    'Cannot re-configure argument trait': function()
    {
        var _self = this;
        this.assertThrows( function()
        {
            // ParameterTrait => ArgumentTrait => Error
            _self.createParamTrait()()();
        } );
    },


    /**
     * Upon instantiating a class into which an argument trait was mixed,
     * all configuration arguments should be passed to the __mixin method.
     * Note that this means that __mixin *will not* be called at the point
     * that the param trait is configured.
     */
    '__mixin is invoked upon class instantiation': function()
    {
        var called = 0;
        var T = this.createParamTrait( function()
        {
            called++;
        } );

        // ensure we only invoke __mixin a single time
        this.Class( {} ).use( T() )();
        this.assertEqual( called, 1 );
    },


    /**
     * Standard sanity check---make sure that the arguments provided during
     * configuration are passed as-is, by reference, to __mixin. Note that
     * this has the terrible consequence that, should one of the arguments
     * be modified by __mixin (e.g. an object field), then it will be
     * modified for all other __mixin calls. But that is the case with any
     * function. ;)
     */
    '__mixin is passed arguments by reference': function()
    {
        var args,
            a = { a: 'a' },
            b = { b: 'b' };

        var T = this.createParamTrait( function()
        {
            args = arguments;
        } );

        this.Class( {} ).use( T( a, b ) )();

        this.assertStrictEqual( a, args[ 0 ] );
        this.assertStrictEqual( b, args[ 1 ] );
    },


    /**
     * The __mixin method should be invoked within the context of the trait
     * and should therefore have access to its private members. Indeed,
     * parameterized traits would have far more limited use if __mixin did
     * not have access to private members, because that would be the proper
     * place to hold configuration data.
     */
    '__mixin has access to trait private members': function()
    {
        var expected = {};

        var T = this.Sut(
        {
            'private _foo': null,
            __mixin: function( arg ) { this._foo = arg; },
            getFoo: function() { return this._foo; }
        } );

        this.assertStrictEqual( expected,
            this.Class( {} ).use( T( expected ) )().getFoo()
        );
    },


    /**
     * It is still useful to be able to define a __mixin method to be called
     * as an initialization method for default state; otherwise, arbitrary
     * method overrides or explicit method calls are needed.
     */
    '__mixin with empty parameter list is still invoked': function()
    {
        var expected = {},
            given;

        var T = this.createParamTrait( function() { given = expected; } );

        // notice that we still configure T, with an empty argument list
        this.Class( {} ).use( T() )();
        this.assertStrictEqual( expected, given );
    },


    /**
     * Parameterized traits are intended to be configured. However, there
     * are a number of reasons to allow them to be mixed in without
     * configuration (that is---without being converted into argument
     * traits):
     *   - Permits default behavior with no configuration, overridable with;
     *   - If any __mixin definition required configuration, then traits
     *     would break backwards-compatibility if they wished to define it,
     *     with no means of maintaining BC;
     *   - Allows trait itself to determine whether arguments are required.
     */
    'Mixing in param trait will invoke __mixin with no arguments':
    function()
    {
        var n = 0;

        // ensure consistency at any arity; we'll test nullary and unary,
        // assuming the same holds true for any n-ary __mixin method
        var T0 = this.createParamTrait( function() { n |= 1; } ),
            T1 = this.createParamTrait( function( a ) { n |= 2; } );

        // ensure that param traits do not throw errors when mixed in (as
        // opposed to argument traits, which have been tested thusfar)
        var C = this.Class( {} );
        this.assertDoesNotThrow( function()
        {
            C.use( T0 )();
            C.use( T1 )();
        } );

        this.assertEqual( n, 3 );
    },


    /**
     * Sibling traits are an interesting case---rather than stacking, they
     * are mixed in alongside each other, meaning that there may be
     * multiple traits that define __mixin. Ordinarily, this is a problem;
     * however, __mixin shall be treated as if it were private and shall be
     * invoked once per trait, giving each a chance to initialize.
     *
     * Furthermore, each should retain access to their own configuration.
     */
    'Invokes __mixin of each sibling mixin': function()
    {
        var args = [],
            vals = [ {}, [] ],
            c    = function() { args.push( arguments ) };

        var Ta = this.createParamTrait( c ),
            Tb = this.createParamTrait( c );

        this.Class( {} ).use( Ta( vals[0] ), Tb( vals[1] ) )();

        this.assertEqual( args.length, 2 );
        this.assertStrictEqual( args[0][0], vals[0] );
        this.assertStrictEqual( args[1][0], vals[1] );
    },


    /**
     * This decision is not arbitrary.
     *
     * We shall consider two different scenarios: first, the case of mixing
     * in some trait T atop of some class C. Assume that C defines a
     * __construct method; it does not know whether or not a trait will be
     * mixed in, nor should it care---it should proceed initializing its
     * state as normal. However, what if a trait were to be mixed in,
     * overriding certain behaviors? It is then imperative that T be
     * initialized prior to any calls by C#__construct. It is not important
     * that C be initialized prior to T#__mixin, because T can know that it
     * should not invoke any methods that will fail---it should be used only
     * to initialize state. (In the future, ease.js may enforce this
     * restriction.)
     *
     * The second scenario is described in the test that follows.
     */
    'Invokes __mixin before __construct when C.use(T)': function()
    {
        var mixok = false;

        var T = this.createParamTrait( function() { mixok = true } ),
            C = this.Class(
            {
                __construct: function()
                {
                    if ( !mixok ) throw Error(
                        "__construct called before __mixin"
                    );
                }
            } );

        this.assertDoesNotThrow( function()
        {
            C.use( T )();
        } );
    },


    /**
     * (Continued from above test.)
     *
     * In the reverse situation---whereby C effectively extends T---we want
     * __construct to instead be called *after* __mixin of T (and any other
     * traits in the set). This is because __construct may wish to invoke
     * methods of T, but what would cause problems if T were not
     * initialized. Further, T would not have knowledge of C and, if it
     * expected a concrete implementation to be called from T#__mixin, then
     * T would have already been initialized, or C's concrete implementation
     * would know what not to do (in the case of a partial initialization).
     *
     * This is also more intuitive---we are invoking initialize methods as
     * if they were part of a stack.
     */
    'Invokes __construct before __mixin when Class.use(T).extend()':
    function()
    {
        var cok = false;

        var T = this.createParamTrait( function()
            {
                if ( !cok ) throw Error(
                    "__mixin called before __construct"
                );
            } );

        var C = this.Class.use( T ).extend(
        {
            __construct: function() { cok = true }
        } );

        this.assertDoesNotThrow( function()
        {
            C();
        } );
    },


    /**
     * The same concept as above, extended to subtypes. In particular, we
     * need to ensure that the subtype is able to properly initialize or
     * alter state that __mixin of a supertype depends upon.
     */
    'Subtype invokes ctor before supertype __construct or __mixin':
    function()
    {
        var cok = false;

        var T = this.createParamTrait( function()
            {
                if ( !cok ) throw Error(
                    "__mixin called before Sub#__construct"
                );
            } );

        var Sub = this.Class( {} ).use( T ).extend(
        {
            __construct: function() { cok = true }
        } );

        this.assertDoesNotThrow( function()
        {
            Sub();
        } );
    }
} );

} )( module['test/Trait/ParameterTest'] = {}, 'test/Trait' );
/** TEST CASE: Trait/PropertyTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Trait/PropertyTest...<br />' )
/**
 * Tests trait properties
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
 * Or, rather, lack thereof, at least for the time being---this is something
 * that is complicated by pre-ES5 fallback and, while a solution is
 * possible, it is not performant in the case of a fallback and would muddy
 * up ease.js' code.
 */

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut = this.require( 'Trait' );
    },


    /**
     * Since private properties cannot be accessed by anything besides the
     * trait itself, they cannot interfere with anything else and should be
     * permitted. Indeed, it would be obsurd to think otherwise, since the
     * trait should be able to maintain its own local state.
     */
    'Private trait properties are permitted': function()
    {
        var Sut = this.Sut;
        this.assertDoesNotThrow( function()
        {
            Sut( { 'private _foo': 'bar' } );
        } );
    },


    /**
     * See the description at the top of this file. This is something that
     * may be addressed in future releases.
     *
     * Rather than simply ignoring them, we should notify the user that
     * their code is not going to work as intended and prevent bugs
     * associated with it.
     */
    'Public and protected trait properties are prohibited': function()
    {
        var Sut = this.Sut;

        this.assertThrows( function()
        {
            Sut( { 'public foo': 'bar' } );
        } );

        this.assertThrows( function()
        {
            Sut( { 'protected foo': 'bar' } );
        } );
    }
} );
} )( module['test/Trait/PropertyTest'] = {}, 'test/Trait' );
/** TEST CASE: Trait/ScopeTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Trait/ScopeTest...<br />' )
/**
 * Tests trait scoping
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut   = this.require( 'Trait' );
        this.Class = this.require( 'class' );
    },


    /**
     * Since the private scope of classes and the traits that they use are
     * disjoint, traits should never be able to access any private member of
     * a class that uses it.
     *
     * The beauty of this is that we get this ``feature'' for free with
     * our composition-based trait implementation.
     */
    'Private class members are not accessible to used traits': function()
    {
        var T = this.Sut(
        {
            // attempts to access C._priv
            'public getPriv': function() { return this._priv; },

            // attempts to invoke C._privMethod
            'public invokePriv': function() { this._privMethod(); }
        } );

        var inst = this.Class.use( T ).extend(
        {
            'private _priv': 'foo',
            'private _privMethod': function() {}
        } )();

        this.assertEqual( inst.getPriv(), undefined );
        this.assertThrows( function()
        {
            inst.invokePriv();
        }, Error );
    },


    /**
     * Similar concept to the above---class and trait scopes are disjoint.
     * This is particularily important, since traits will have no idea what
     * other traits they will be mixed in with and therefore must be immune
     * from nasty state clashes.
     */
    'Private trait members are not accessible to containing class':
    function()
    {
        var T = this.Sut(
        {
            'private _priv': 'bar',
            'private _privMethod': function() {}
        } );

        // reverse of the previous test case
        var inst = this.Class.use( T ).extend(
        {
            // attempts to access T._priv
            'public getPriv': function() { return this._priv; },

            // attempts to invoke T._privMethod
            'public invokePriv': function() { this._privMethod(); }
        } )();


        this.assertEqual( inst.getPriv(), undefined );
        this.assertThrows( function()
        {
            inst.invokePriv();
        }, Error );
    },


    /**
     * Since all scopes are disjoint, it would stand to reason that all
     * traits should also have their own private scope independent of other
     * traits that are mixed into the same class. This is also very
     * important for the same reasons as the previous test---we cannot have
     * state clashes between traits.
     */
    'Traits do not have access to each others\' private members': function()
    {
        var T1 = this.Sut(
            {
                'private _priv1': 'foo',
                'private _privMethod1': function() {}
            } ),
            T2 = this.Sut(
            {
                // attempts to access T1._priv1
                'public getPriv': function() { return this._priv1; },

                // attempts to invoke T1._privMethod1
                'public invokePriv': function() { this._privMethod1(); }
            } );

        var inst = this.Class.use( T1, T2 ).extend( {} )();

        this.assertEqual( inst.getPriv(), undefined );
        this.assertThrows( function()
        {
            inst.invokePriv();
        }, Error );
    },


    /**
     * If this seems odd at first, consider this: traits provide
     * copy/paste-style functionality, meaning they need to be able to
     * provide public methods. However, we may not always want to mix trait
     * features into a public API; therefore, we need the ability to mix in
     * protected members.
     */
    'Classes can access protected trait members': function()
    {
        var T = this.Sut( { 'protected foo': function() {} } );

        var _self = this;
        this.assertDoesNotThrow( function()
        {
            _self.Class.use( T ).extend(
            {
                // invokes protected trait method
                'public callFoo': function() { this.foo(); }
            } )().callFoo();
        } );
    }
} );
} )( module['test/Trait/ScopeTest'] = {}, 'test/Trait' );
/** TEST CASE: Trait/VirtualTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Trait/VirtualTest...<br />' )
/**
 * Tests virtual trait methods
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
 * Note that tests for super calls are contained within LinearizationTest;
 * these test cases simply ensure that overrides are actually taking place.
 */

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut   = this.require( 'Trait' );
        this.Class = this.require( 'class' );
    },


    /**
     * If a trait specifies a virtual method, then the class should expose
     * the method as virtual.
     */
    'Class inherits virtual trait method': function()
    {
        var called = false;

        var T = this.Sut(
        {
            'virtual foo': function()
            {
                called = true;
            }
        } );

        var C = this.Class.use( T ).extend( {} );

        // ensure that we are actually using the method
        C().foo();
        this.assertOk( called, "Virtual method not called" );

        // if virtual, we should be able to override it
        var called2 = false,
            C2;

        this.assertDoesNotThrow( function()
        {
            C2 = C.extend(
            {
                'override foo': function()
                {
                    called2 = true;
                }
            } );
        } );

        C2().foo();
        this.assertOk( called2, "Method not overridden" );
    },


    /**
     * Virtual trait methods should be treated in a manner similar to
     * abstract trait methods---a class should be able to provide its own
     * concrete implementation. Note that this differs from the above test
     * because we are overriding the method internally at definition time,
     * not subclassing.
     */
    'Class can override virtual trait method': function()
    {
        var _self = this;
        var T = this.Sut(
        {
            'virtual foo': function()
            {
                // we should never execute this (unless we're broken)
                _self.fail( true, false,
                    "Method was not overridden."
                );
            }
        } );

        var expected = 'foobar';
        var C = this.Class.use( T ).extend(
        {
            'override foo': function() { return expected; }
        } );

        this.assertEqual( C().foo(), expected );
    },


    /**
     * If C uses T and overrides T.Ma, and there is some method T.Mb that
     * invokes T.Ma, then T.Mb should instead invoke C.Ma.
     */
    'Class-overridden virtual trait method is accessible by trait':
    function()
    {
        var _self = this;

        var T = this.Sut(
        {
            'public doFoo': function()
            {
                // should call overridden, not the one below
                this.foo();
            },

            // to be overridden
            'virtual protected foo': function()
            {
                _self.fail( true, false, "Method not overridden." );
            }
        } );

        var called = false;

        var C = this.Class.use( T ).extend(
        {
            // should be called by T.doFoo
            'override protected foo': function() { called = true }
        } );

        C().doFoo();
        this.assertOk( called );
    },


    /**
     * If a supertype mixes in a trait that provides a virtual method, a
     * subtype should be able to provide its own concrete implementation.
     * This is especially important to test in the case where a trait
     * invokes its own virtual method---we must ensure that the message is
     * properly passed to the subtype's override.
     *
     * For a more formal description of a similar matter, see the
     * AbstractTest case; indeed, we're trying to mimic the same behavior
     * that we'd expect with abstract methods.
     */
    'Subtype can override virtual method of trait mixed into supertype':
    function()
    {
        var _self = this;

        var T = this.Sut(
        {
            'public doFoo': function()
            {
                // this call should be passed to any overrides
                return this.foo();
            },

            // this is the one we'll try to override
            'virtual protected foo': function()
            {
                _self.fail( true, false, "Method not overridden." );
            }
        } );

        var called = false;

        // C is a subtype of a class that implements T
        var C = this.Class.use( T ).extend( {} )
            .extend(
            {
                // this should be called instead of T.foo
                'override protected foo': function()
                {
                    called = true;
                }
            } );

        C().doFoo();
        this.assertOk( called );
    },


    /**
     * This test unfortunately requires knowledge of implementation details
     * to explain; it is a regression test covering a rather obnoxious bug,
     * especially when the author was away from the implementation for a
     * couple months.
     *
     * Proxying to an overridden protected method was not a problem because
     * it proxies to the protected member object (PMO) which is passed into
     * the ctor and, as is evident by its name, provides both the public and
     * protected API. However, when not overridden, we fall back to having
     * to invoke our original method, which is on our supertype---the
     * abstract trait class. The problem there is that the stored supertype
     * prototype provides only the public API.
     *
     * This test ensures that we properly access the protected API of our
     * supertype. This problem existed before any general solution to this
     * problem for all subtypes. We test public as well to produce a more
     * general test case.
     *
     * The second part of this test is implicit---we're testing multiple
     * virtual methods to ensure that they return distinct results, ensuring
     * that we don't have any variable reassignment issues in the loop that
     * generates the closures.
     */
    'Properly invokes non-overridden virtual trait methods':
    function()
    {
        var expecteda = { a: true },
            expectedb = { b: true };

        var T = this.Sut(
        {
            pub:  function() { return this.vpub(); },
            prot: function() { return this.vprot(); },

            'virtual public vpub':     function() { return expecteda; },
            'virtual protected vprot': function() { return expectedb; }
        } );

        var inst = this.Class.use( T ).extend( {} )();

        this.assertStrictEqual( inst.pub(), expecteda );
        this.assertStrictEqual( inst.prot(), expectedb );
    },


    /**
     * This is the same concept as the non-virtual test found in the
     * DefinitionTest case: since a trait is mixed into a class, if it
     * returns itself, then it should in actuality return the instance of
     * the class it is mixed into.
     */
    'Virtual trait method returning self returns class instance':
    function()
    {
        var _self = this;

        var T = this.Sut( { 'virtual foo': function() { return this; } } );

        this.Class.use( T ).extend(
        {
            go: function()
            {
                _self.assertStrictEqual( this, this.foo() );
            }
        } )().go();
    },


    /**
     * Same concept as the above test case, but ensures that invoking the
     * super method does not screw anything up.
     */
    'Overridden virtual trait method returning self returns class instance':
    function()
    {
        var _self = this;

        var T = this.Sut( { 'virtual foo': function() { return this; } } );

        this.Class.use( T ).extend(
        {
            'override foo': function()
            {
                return this.__super();
            },

            go: function()
            {
                _self.assertStrictEqual( this, this.foo() );
            }
        } )().go();
    },


    /**
     * When a trait method is overridden, ensure that the data are properly
     * proxied back to the caller. This differs from the above tests, which
     * just make sure that the method is actually overridden and invoked.
     */
    'Data are properly returned from trait override super call': function()
    {
        var _self    = this,
            expected = {};

        var T = this.Sut(
        {
            'virtual foo': function() { return expected; }
        } );

        this.Class.use( T ).extend(
        {
            'override foo': function()
            {
                _self.assertStrictEqual( expected, this.__super() );
            }
        } )().foo();
    },


    /**
     * When a trait method is overridden by the class that it is mixed into,
     * and the super method is called, then the trait method should execute
     * within the private member context of the trait itself (as if it were
     * never overridden). Some kinky stuff would have to be going on (at
     * least in the implementation at the time this was written) for this
     * test to fail, but let's be on the safe side.
     */
    'Super trait method overrided in class executed within private context':
    function()
    {
        var expected = {};

        var T = this.Sut(
        {
            'virtual foo': function()
            {
                // should succeed
                return this.priv();
            },

            'private priv': function()
            {
                return expected;
            }
        } );

        this.assertStrictEqual( expected,
            this.Class.use( T ).extend(
            {
                'override virtual foo': function()
                {
                    return this.__super();
                }
            } )().foo()
        );
    }
} );
} )( module['test/Trait/VirtualTest'] = {}, 'test/Trait' );
/** TEST CASE: Util/AbstractTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Util/AbstractTest...<br />' )
/**
 * Tests util abstract functions
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
 * TODO: We are missing tests for various details such as ensuring that the
 * definition and parameter length are properly recorded.
 */

require( 'common' ).testCase(
{
    setUp: function()
    {
        this.Sut = this.require( 'util' );
    },


    /**
     * The purpose is to return a function that can be used as part of a
     * class definition.
     */
    'abstractMethod returns a function': function()
    {
        this.assertEqual(
            typeof this.Sut.createAbstractMethod(),
            'function'
        );
    },


    /**
     * We also expose a means of checking whether or not a given function is
     * abstract; this hides the implementation details.
     */
    'Returned function is considered abstract by isAbstractMethod':
    function()
    {
        this.assertOk(
            this.Sut.isAbstractMethod( this.Sut.createAbstractMethod() )
        );
    },


    'Abstract methods cannot be invoked': function()
    {
        var Sut = this.Sut;
        this.assertThrows( function()
        {
            Sut.createAbstractMethod()();
        }, Error );
    }
} );
} )( module['test/Util/AbstractTest'] = {}, 'test/Util' );
/** TEST CASE: Util/CloneTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Util/CloneTest...<br />' )
/**
 * Tests util.clone
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut = this.require( 'util' );
    },


    /**
     * Cloning is intended to duplicate objects to avoid shared references.
     */
    'Cloned array is not the same object as the original': function()
    {
        var arr = [ 1, 2, 3 ];
        this.assertNotStrictEqual( this.Sut.clone( arr ), arr );
    },


    /**
     * Same concept as above test.
     */
    'Cloned object is not the same object as the original': function()
    {
        var obj = { foo: 'bar' };
        this.assertNotStrictEqual( this.Sut.clone( obj ), obj );
    },


    /**
     * Array data should be cloned such that it strictly matches the
     * original; this means a shallow clone is the default.
     */
    'Cloned array data mirrors original (shallow clone)': function()
    {
        var arr  = [ 1, '2', { three: 3 }, [ 4 ] ],
            arrc = this.Sut.clone( arr );

        for ( var i = 0, len = arr.length; i < len; i++ )
        {
            // note that this implies a shallow clone
            this.assertStrictEqual( arr[ i ], arrc[ i ] );
        }
    },


    /**
     * Same concept as the above test.
     */
    'Cloned object data mirrors original (shallow clone)': function()
    {
        var obj  = { a: 1, b: [ 2 ], c: { three: 3 }, d: '4' },
            objc = this.Sut.clone( obj );

        for ( var f in obj )
        {
            // note that this implies a shallow clone
            this.assertStrictEqual( obj[ f ], objc[ f ] );
        }
    },


    /**
     * Same concept as a shallow clone, but we must recursively check for
     * data equality since all objects should have been recursively cloned.
     */
    'Deeply cloned array data mirrors original': function()
    {
        // TODO: we could benefit from a deepClone method instead of a
        // cryptic second argument
        var arr  = [ [ 1, 2 ], [ 3, 4 ], [ 5, [ 6, 7 ] ], { a: 1 } ],
            arrc = this.Sut.clone( arr, true );

        this.assertDeepEqual( arr, arrc );

        // there should be no shared references (yes, we're only checking
        // one level here...)
        for ( var i = 0, len = arr.length; i < len; i++ )
        {
            this.assertNotStrictEqual( arr[ i ] , arrc[ i ] );
        }
    },


    /**
     * Same concept as above test.
     */
    'Deeply cloned object data mirrors original': function()
    {
        var obj  = { a: [ 1 ], b: [ 2 ], c: { d: 3 } },
            objc = this.Sut.clone( obj, true );

        this.assertDeepEqual( obj, objc );

        // there should be no shared references
        for ( var f in obj )
        {
            this.assertNotStrictEqual( obj[ f ], objc[ f ] );
        }
    },


    /**
     * "Cloning" functions doesn't necessarily make sense, but it can,
     * depending on how you think about it. We can do a toSource() in many
     * circumstances and create a new function from that; but what's the
     * point? It still does the same thing. As such, functions will not be
     * cloned---they'll be returned by reference. This has the obvious
     * downside that any properties set on the function itself are not
     * cloned, but this is not a current consideration for ease.js.
     */
    'Functions are returned by reference, not cloned': function()
    {
        var func = function() {},
            obj  = { foo: func };

        this.assertStrictEqual( func, this.Sut.clone( obj, true ).foo );
    },


    /**
     * Primitives cannot be cloned, so we should expect that they are simply
     * returned
     */
    'Primitives are returned by clone': function()
    {
        // we don't try NaN here because NaN != NaN; we'll try it separately
        var prim = [ null, 1, true, false, undefined ],
            i    = prim.length;

        while ( i-- )
        {
            var val = prim[ i ];

            this.assertEqual( val, this.Sut.clone( val ),
                'Failed to clone primitive value: ' + val
            );
        }

        // test NaN separately
        this.assertOk( isNaN( this.Sut.clone( NaN ) ) );
    }
} );
} )( module['test/Util/CloneTest'] = {}, 'test/Util' );
/** TEST CASE: Util/CopyTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Util/CopyTest...<br />' )
/**
 * Tests util.copy
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut = this.require( 'util' );

        // are getters/setters supported?
        this.hasGetSet = !( this.Sut.definePropertyFallback() );
    },


    /**
     * Just a basic copy test: ensure the values are copied by reference.
     */
    'Values are copied to destination object by reference': function()
    {
        var src = {
                a: 'a',
                b: 2,
                c: true,
                d: false,
                e: undefined,
                f: null,
                g: function() {}
            },
            dest = {}
        ;

        this.Sut.copyTo( dest, src );

        for ( var key in src )
        {
            this.assertStrictEqual( src[ key ], dest[ key ] );
        }
    },


    /**
     * Same concept as above, but with getters/setters
     */
    'Getters and setters are copied to destination object by reference':
    function()
    {
        // no use in performing the test if the engine doesn't support it
        if ( !( this.hasGetSet ) )
        {
            this.skip();
        }

        var get  = function() {},
            set  = function() {},
            src  = {},
            dest = {},

            result = null
        ;

        Object.defineProperty( src, 'foo', {
            get: get,
            set: set,

            // so copy can actually see the property
            enumerable: true
        } );

        this.Sut.copyTo( dest, src );

        // look up the getter/setter in dest
        result = Object.getOwnPropertyDescriptor( dest, 'foo' );

        // check getter
        this.assertStrictEqual( result.get, get,
            "Getter is copied by reference by default"
        );

        // check setter
        this.assertDeepEqual( result.set, set,
            "Setter is copied by reference by default"
        );
    },


    /**
     * For convenience (and a convention familar to uses of, notably, C
     * APIs).
     */
    'Copy operation returns destination object': function()
    {
        var dest = {};
        this.assertStrictEqual( this.Sut.copyTo( dest, {} ), dest );
    },


    /**
     * This is pretty self-explanatory.
     */
    'Throws error if source or dest are not provided': function()
    {
        var copyTo = this.Sut.copyTo;

        this.assertThrows( function()
        {
            copyTo();
        }, TypeError, "Dest parameter is required" );

        this.assertThrows( function()
        {
            copyTo( 'bla', {} );
        }, TypeError, "Dest parameter is required to be an object" );

        this.assertThrows( function()
        {
            copyTo( {} );
        }, TypeError, "Src parameter is required" );

        this.assertThrows( function()
        {
            copyTo( {}, 'foo' );
        }, TypeError, "Src parameter is required to be an object" );
    },


    /**
     * For convenience, let's support a deep copy as well, just in case they
     * don't want to copy everything by reference.
     */
    'Deep copies are supported': function()
    {
        var src  = { foo: [ 1, 2, 3 ] },
            dest = this.Sut.copyTo( {}, src, true );

        // copied values should be equal by value...
        this.assertDeepEqual( src.val, dest.val,
            "Copied values should be comparitively equal with deep copy"
        );

        // ...but not by reference
        this.assertNotStrictEqual( src.foo, dest.foo,
            "Copied values should not be the same object after deep copy"
        );
    }
} );
} )( module['test/Util/CopyTest'] = {}, 'test/Util' );
/** TEST CASE: Util/DefineSecurePropTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Util/DefineSecurePropTest...<br />' )
/**
 * Tests util.defineSecureProp
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut = this.require( 'util' );

        this.expected = ( ( Object.defineProperty instanceof Function )
            ? false
            : true
        );

        this.fallback = this.Sut.definePropertyFallback();

        // IE 8 will fall back on first failure because of its partial
        // implementation (DOM elements only...!)
        if ( !( this.expected ) && this.fallback )
        {
            try
            {
                this.Sut.definePropertyFallback( false );
                this.Sut.defineSecureProp( {}, 'foo', 1 );

                // If the fallback was changed on us, then there was a
                // problem (and this is likely IE8); change the value we're
                // expecting so our tests don't fail.
                if ( this.Sut.definePropertyFallback() === true )
                {
                    this.expected = true;
                }
            }
            catch ( e ) {}
        }

        this.descRestrictionCheck = function( type, expected )
        {
            this.fallback && this.skip();

            var obj = {};
            this.Sut.defineSecureProp( obj, 'foo', null );
            this.assertEqual(
                Object.getOwnPropertyDescriptor( obj, 'foo' )[ type ],
                expected
            );
        };

        // TODO: this is only necessary because we use global state; get rid
        // of that state.
        this.forceFallback = function( c )
        {
            this.Sut.definePropertyFallback( true );
            c.call( this );
            this.Sut.definePropertyFallback( this.fallback );
        };
    },


    /**
     * The definition of ``secure'' fields depends on ECMAScript 5.
     */
    'definePropertyFallback returns whether secure definition is supported':
    function()
    {
        this.assertEqual(
            this.expected,
            this.Sut.definePropertyFallback()
        );
    },


    /**
     * Permits method chaining.
     */
    'definePropertyFallback returns util when used as a setter': function()
    {
        this.assertStrictEqual(
            this.Sut.definePropertyFallback( this.fallback ),
            this.Sut
        );
    },


    /**
     * The data created by the defineSecureProp function should exist
     * regardless of whether or not the concept of a ``secure'' property is
     * supported by the environment.
     */
    'Defining secure prop creates field with given value on given object':
    function()
    {
        var obj = {},
            val = { bar: 'baz' };

        this.Sut.defineSecureProp( obj, 'foo', val );
        this.assertStrictEqual( obj.foo, val );
    },


    /**
     * Our assertions below are going to use the data from the following
     * method. We're not going to test directly whether they're writable,
     * etc, because different engines may have different interpretations at
     * this stage. (Or it may not yet be implemented.) Therefore, we'll
     * simply see if what we requested has been set, and leave the problems
     * up to the engine developers.
     *
     * This is a case of ensuring we're testing our own functionality---we
     * do not want to test engine functionality.
     */
    'Secure property is not writable': function()
    {
        this.descRestrictionCheck( 'writable', false );
    },
    'Secure property is not configurable': function()
    {
        this.descRestrictionCheck( 'configurable', false );
    },
    'Secure property is not enumerable': function()
    {
        this.descRestrictionCheck( 'enumerable', false );
    },


    /**
     * These tests the same as the above set of tests, but forces a fallback
     * to pre-ES5 functionality.
     */
    'Defining secure prop creates field and value when falling back':
    function()
    {
        this.forceFallback( function()
        {
            var obj = {},
                val = { bar: 'baz' };

            this.Sut.defineSecureProp( obj, 'foo', val );
            this.assertStrictEqual( obj.foo, val );
        } );
    },
    'Secure property is writable when falling back': function()
    {
        this.forceFallback( function()
        {
            this.descRestrictionCheck( 'writable', true );
        } );
    },
    'Secure property is configurable when falling back': function()
    {
        this.forceFallback( function()
        {
            this.descRestrictionCheck( 'configurable', true );
        } );
    },
    'Secure property is enumerable when falling back': function()
    {
        this.forceFallback( function()
        {
            this.descRestrictionCheck( 'enumerable', true );
        } );
    }
} );
} )( module['test/Util/DefineSecurePropTest'] = {}, 'test/Util' );
/** TEST CASE: Util/GetPropertyDescriptorTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Util/GetPropertyDescriptorTest...<br />' )
/**
 * Tests util.getPropertyDescriptor
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut = this.require( 'util' );
        this.hasGetSet = !( this.Sut.definePropertyFallback() );
    },


    /**
     * If Object.getOwnPropertyDescriptor is provided by our environment, it
     * should be used by util; anything else we do is a workaround in the
     * event that this is missing.
     */
    'Should use Object.getOwnPropertyDescriptor if available': function()
    {
        if ( !( this.hasGetSet && Object.getOwnPropertyDescriptor ) )
        {
            this.skip();
        }

        this.assertStrictEqual(
            this.Sut.getOwnPropertyDescriptor,
            Object.getOwnPropertyDescriptor
        );
    },


    /**
     * This function should provide a boolean value indicating whether it
     * can traverse the prototype chain
     */
    'Indicates whether property chain traversal is possible': function()
    {
        var traversable = ( typeof Object.getPrototypeOf === 'function' );

        this.assertEqual(
            this.Sut.getPropertyDescriptor.canTraverse,
            traversable
        );
    },


    /**
     * We don't want tricksters to get funky with our system
     */
    'Traversable property is non-writable': function()
    {
        if ( !( this.hasGetSet && Object.getOwnPropertyDescriptor ) )
        {
            this.skip();
        }

        this.assertEqual(
            Object.getOwnPropertyDescriptor(
                this.Sut.getPropertyDescriptor, 'canTraverse'
            ).writable,
            false
        );
    },


    /**
     * The return value should mimic Object.getOwnPropertyDescriptor if
     * we're not having to traverse the prototype chain
     */
    'Acts as ES5 getOwnPropertyDescriptor when one level deep': function()
    {
        var obj   = { foo: 'bar' },
            desc1 = this.Sut.getOwnPropertyDescriptor( obj, 'foo' ),
            desc2 = this.Sut.getPropertyDescriptor( obj, 'foo' )
        ;

        this.assertDeepEqual( desc1, desc2 );
    },


    /**
     * If we *do* have to start traversing the prototype chain (which
     * Object.getOwnPropertyDescriptor() cannot do), then it should be as if
     * we called Object.getOwnPropertyDescriptor() on the object in the
     * prototype chain containing the requested property.
     */
    'Traverses the prototype chain when necessary': function()
    {
        if ( !( this.Sut.getPropertyDescriptor.canTraverse ) )
        {
            this.skip();
        }

        var proto = { foo: 'bar' },
            obj   = function() {}
        ;

        obj.prototype = proto;

        // to give ourselves the prototype chain (we don't want to set __proto__
        // because this test will also be run on pre-ES5 engines)
        var inst = new obj(),

            // get the actual descriptor
            expected = this.Sut.getOwnPropertyDescriptor( proto, 'foo' ),

            // attempt to gather the descriptor from the prototype chain
            given = this.Sut.getPropertyDescriptor( inst, 'foo' )
        ;

        this.assertDeepEqual( given, expected );
    }
} );
} )( module['test/Util/GetPropertyDescriptorTest'] = {}, 'test/Util' );
/** TEST CASE: Util/GlobalTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Util/GlobalTest...<br />' )
/**
 * Tests global scope handling
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

var _global = this;

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut  = this.require( 'util/Global' );
        this.gobj = this.Sut.expose();
        this.uniq = '___$$easejs$globaltest$$';
    },


    /**
     * Check common environments and ensure that the returned object is
     * strictly equal to the global object for that environment. For
     * environments that we do *not* know about, just check for a common
     * object that must exist in ES3 and above.
     */
    'Global object represents environment global object': function()
    {
        switch ( true )
        {
            // browser
            case _global.window:
                this.assertStrictEqual( this.gobj, _global.window );
                break;

            // Node.js
            case _global.root:
                this.assertStrictEqual( this.gobj, _global.root );
                break;

            // something else; we'll just check for something that should
            // exist in >=ES3
            default:
                this.assertStrictEqual( this.gobj.Array, Array );
        }
    },


    /**
     * Since ease.js makes use of ECMAScript features when they are
     * available, it must also find a way to gracefully degrade to support
     * less fortunate environments; the ability to define alternative
     * definitions is key to that.
     */
    'Providing alternative will set value if name does not exist':
    function()
    {
        var sut = this.Sut();

        var field = this.uniq,
            value = { _: 'easejsOK' };

        sut.provideAlt( field, function() { return value; } );
        this.assertStrictEqual( sut.get( field ), value );
    },


    /**
     * It is also important that our own definitions do not pollute the
     * global scope; reasons for this are not just to be polite, but also
     * because other code/libraries may provide their own definitions that
     * we would not want to interfere with. (Indeed, we'd also want to use
     * those definitions, if they already exist before provideAlt is
     * called.)
     */
    'Providing alternative will not pollute the global scope': function()
    {
        this.Sut().provideAlt( this.uniq, function() { return {} } );
        this.assertEqual( this.gobj[ this.uniq ], undefined );
    },


    /**
     * Our alternatives are unneeded if the object we are providing an
     * alternative for is already defined.
     */
    'Providing alternative will not modify global if name exists':
    function()
    {
        var sut = this.Sut();

        // a field that must exist in ES3+
        var field = 'Array',
            orig  = this.gobj[ field ];

        sut.provideAlt( field, function() { return {}; } );
        this.assertStrictEqual( sut.get( field ), orig );
    },


    /**
     * Once an alternative is defined, it shall be treated as though the
     * value were defined globally; providing additional alternatives should
     * therefore have no effect.
     */
    'Providing alternative twice will not modify first alternative':
    function()
    {
        var sut      = this.Sut();
            field    = this.uniq,
            expected = { _: 'easejsOK' };

        // first should provide alternative, second should do nothing
        sut.provideAlt( field, function() { return expected; } );
        sut.provideAlt( field, function() { return 'oops'; } );

        this.assertStrictEqual( sut.get( field ), expected );
    },


    'provideAlt returns self for method chaining': function()
    {
        var sut = this.Sut();

        this.assertStrictEqual( sut,
            sut.provideAlt( 'foo', function() {} )
        );
    }
} );

} )( module['test/Util/GlobalTest'] = {}, 'test/Util' );
/** TEST CASE: Util/PropParseKeywordsTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Util/PropParseKeywordsTest...<br />' )
/**
 * Tests util.propParse keyword parsing
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut = this.require( 'util' );
    },


    /**
     * Use of the `abstract' keyword should result in an abstract method
     * being created from the parameter list.
     */
    '`abstract\' keyword designates method as abstract': function()
    {
        var _self = this;

        var params = [ 'one', 'two' ],
            data   = { 'abstract foo': params },
            found  = null;

        this.Sut.propParse( data, {
            method: function ( name, func, is_abstract )
            {
                _self.assertOk( is_abstract );
                _self.assertEqual( typeof func, 'function' );
                _self.assertOk( _self.Sut.isAbstractMethod( func ) );
                _self.assertEqual( func.__length, params.length );

                found = name;
            }
        } );

        this.assertEqual( found, 'foo' );
    },


    /**
     * As an exception to the above rule, a method shall not considered to be
     * abstract if the `override' keyword is too provided (an abstract
     * override---see the trait tests for more information).
     */
    'Not considered abstract when `override\' also provided': function()
    {
        var _self = this;

        var data  = { 'abstract override foo': function() {} },
            found = null;

        this.Sut.propParse( data, {
            method: function ( name, func, is_abstract )
            {
                _self.assertOk( is_abstract === false );
                _self.assertEqual( typeof func, 'function' );
                _self.assertOk( _self.Sut.isAbstractMethod( func ) === false );

                found = name;
            }
        } );

        this.assertEqual( found, 'foo' );
    },


    /**
     * The idea behind supporting this functionality---which is unsued at
     * the time of writing this test---is to allow eventual customization of
     * ease.js' keywords for domain-specific purposes. Whether or not to
     * expose this feature via a public API will be approached cautiously
     * because it would make classes using custom keyword parsers
     * unportable.
     */
    'Supports custom property keyword parser': function()
    {
        var data = { foo: [] },
            map  = { foo: { 'abstract': true } },

            suffix = 'poo',

            abstract_methods = []
        ;

        this.Sut.propParse( data, {
            keywordParser: function ( prop )
            {
                return {
                    name:     ( prop + suffix ),
                    keywords: map[ prop ]
                };
            },


            method: function ( name, func, is_abstract )
            {
                if ( is_abstract )
                {
                    abstract_methods.push( name );
                }
            }
        } );

        this.assertOk(
            ( abstract_methods[ 0 ] === ( 'foo' + suffix ) ),
            "Can provide custom property keyword parser"
        );
    },


    /**
     * Since we support custom keyword parsers, we must ensure that we can
     * tolerate crap responses without blowing up.
     */
    'Keyword parser tolerates bogus responses': function()
    {
        var propParse = this.Sut.propParse;

        this.assertDoesNotThrow( function()
        {
            var junk = { foo: 'bar' };

            propParse( junk, {
                keywordParser: function ( prop )
                {
                    // return nothing
                }
            } );

            propParse( junk, {
                keywordParser: function ( prop )
                {
                    // return bogus name and keywords
                    return { name: [], keywords: 'slefwef' };
                }
            } );
        }, Error );
    },


    /**
     * Ensure that all keywords are properly parsed and returned.
     *
     * TODO: This re-tests the property parser, which has its own test case;
     * stub it instead.
     */
    'Parser returns keywords': function()
    {
        var data = {
                'public foo': '',
                'const foo2': '',
                'public private const foo3': '',

                'public static virtual method': function() {},

                // tricky tricky (lots of spaces)
                'public  const   spaces': function() {}
            },

            parsed_keywords = {},

            expected = {
                foo:  { 'public': true },
                foo2: { 'const': true },
                foo3: { 'public': true, 'private': true, 'const': true },

                method: { 'public': true, 'static': true, 'virtual': true },

                spaces: { 'public': true, 'const': true }
            }
        ;

        this.Sut.propParse( data, {
            property: function( name, value, keywords )
            {
                parsed_keywords[ name ] = keywords;
            },

            method: function( name, func, is_abstract, keywords )
            {
                parsed_keywords[ name ] = keywords;
            }
        } );

        for ( var prop in parsed_keywords )
        {
            this.assertDeepEqual(
                parsed_keywords[ prop ],
                expected[ prop ],
                "Keywords are properly recognized and made available for " +
                    "interpretation (" + prop + ")"
            );
        }


        // for browsers that support it
        if ( this.Sut.definePropertyFallback() === false )
        {
            data            = {};
            parsed_keywords = {};

            // to prevent syntax errors for environments that don't support
            // getters/setters in object notation
            Object.defineProperty( data, 'public foo', {
                get: function() {},
                set: function() {},

                enumerable: true
            } );


            this.Sut.propParse( data, {
                getset: function( name, get, set, keywords )
                {
                    get && ( parsed_keywords[ name + 'g' ] = keywords );
                    set && ( parsed_keywords[ name + 's' ] = keywords );
                }
            } );

            this.assertDeepEqual(
                parsed_keywords.foog,
                { 'public': true },
                "Getter keywords are properly recognized and available"
            );

            this.assertDeepEqual(
                parsed_keywords.foos,
                { 'public': true },
                "Setter keywords are properly recognized and available"
            );
        }
    }
} );
} )( module['test/Util/PropParseKeywordsTest'] = {}, 'test/Util' );
/** TEST CASE: Util/PropParseTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Util/PropParseTest...<br />' )
/**
 * Tests util.propParse
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut = this.require( 'util' );
        this.hasGetSet = !( this.Sut.definePropertyFallback() );

        this.checkType = function( value, type, c )
        {
            this.checkTypeEx( 'foo', { foo: value }, type, c );
        };

        this.checkTypeEx = function( name, data, type, c )
        {
            var obj   = {},
                found = null;

            obj[ type ] = function( name )
            {
                if ( name === name )
                {
                    found = arguments;
                }
            };

            this.Sut.propParse( data, obj );
            this.assertOk( found !== null, "Type failure" );

            c && c.apply( this, found );
        };
    },


    /**
     * Anything that is not treated as a special case defaults to a
     * property.
     */
    'Detects string as property': function()
    {
        this.checkType( 'string', 'property' );
    },
    'Detects boolean as property': function()
    {
        this.checkType( true, 'property' );
        this.checkType( false, 'property' );
    },
    'Detects integer as property': function()
    {
        this.checkType( 1, 'property' );
    },
    'Detects float as property': function()
    {
        this.checkType( 3.14159, 'property' );
    },
    'Detects array as property': function()
    {
        this.checkType( [], 'property' );
    },
    'Detects object as property': function()
    {
        this.checkType( {}, 'property' );
    },


    /**
     * Any function is treated as a method, but a distinaction is made
     * between concrete and abstract.
     */
    'Detects normal functions as concrete methods': function()
    {
        this.checkType( function() {}, 'method', function( _, __, a )
        {
            // should not be abstract
            this.assertOk( !a );
        } );
    },


    /**
     * Abstract methods are marked specially as such using another utility
     * method.
     */
    'Detects special functions as abstract methods': function()
    {
        var func = this.Sut.createAbstractMethod();
        this.checkType( func, 'method', function( _, __, a )
        {
            // should be abstract
            this.assertOk( a );
        } );
    },


    /**
     * Proxies, since their values are strings, would conventionally be
     * considered properties. Therefore, we must ensure that the `proxy'
     * keyword is properly applied to return a method rather than a
     * property.
     */
    'Detects proxies as methods': function()
    {
        var data = { 'proxy foo': 'bar' };
        this.checkTypeEx( 'foo', data, 'method' );
    },


    /**
     * If supported by the environment, getters and setters are properly
     * recognized as such.
     */
    'Detects getters and setters': function()
    {
        this.hasGetSet || this.skip();

        // use defineProperty so that we don't blow up in pre-ES5
        // environments with a syntax error
        var data = {},
            get, set,
            get_called = false;

        Object.defineProperty( data, 'foo', {
            get: ( get = function () { get_called = true; } ),
            set: ( set = function () {} ),

            enumerable: true
        } );

        this.checkTypeEx( 'foo', data, 'getset', function( _, g, s )
        {
            this.assertStrictEqual( get, g, "Getter mismatch" );
            this.assertStrictEqual( set, s, "Setter mismatch" );

            // bug fix
            this.assertEqual( get_called, false,
                "Getter should not be called during processing"
            );
        } );
    },


    /**
     * The parser should ignore any fields on the prototype.
     */
    'Ignores prototype fields': function()
    {
        var Foo = function() {};
        Foo.prototype.one = 1;

        var instance = new Foo();
        instance.two = 2;

        var found = [];
        this.Sut.propParse( instance, {
            each: function( name )
            {
                found.push( name );
            }
        } );

        // should have only found `two', ignoring `one' on the prototype
        this.assertEqual( found.length, 1 );
        this.assertEqual( found[ 0 ], 'two' );
    },


    /**
     * At this point in time, we are unsure what we will allow within
     * abstract member declarations in the future (e.g. possible type
     * hinting). As such, we will allow only valid variable names for now
     * (like a function definition).
     */
    'Triggers error if invalid variable names are used as param names':
    function()
    {
        var propParse = this.Sut.propParse;

        this.assertThrows( function()
        {
            propParse( { 'abstract foo': [ 'invalid name' ] }, {} );
        }, SyntaxError );

        this.assertThrows( function()
        {
            propParse( { 'abstract foo': [ '1invalid' ] }, {} );
        }, SyntaxError );

        this.assertDoesNotThrow( function()
        {
            propParse( { 'abstract foo': [ 'valid_name' ] }, {} );
        }, SyntaxError );
    },


    /**
     * The motivation behind this feature is to reduce the number of closures
     * necessary to perform a particular task: this allows binding `this' of the
     * handler to a custom context.
     */
    'Supports dynamic context to handlers': function()
    {
        var _self   = this,
            context = {};

        // should trigger all of the handlers
        var all = {
            prop:   'prop',
            method: function() {}
        };

        var get, set;

        // run test on getters/setters only if supported by the environment
        if ( this.hasGetSet )
        {
            Object.defineProperty( all, 'getset', {
                get: ( get = function () {} ),
                set: ( set = function () {} ),

                enumerable: true
            } );
        }

        function _chk()
        {
            _self.assertStrictEqual( this, context );
        }

        // check each supported handler for conformance
        this.Sut.propParse( all, {
            each:     _chk,
            property: _chk,
            getset:   _chk,
            method:   _chk
        }, context );
    }
} );
} )( module['test/Util/PropParseTest'] = {}, 'test/Util' );
/** TEST CASE: Util/symbol/FallbackSymbolTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Util/symbol/FallbackSymbolTest...<br />' )
/**
 * Tests pre-ES6 fallback symbol subset
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


require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut = this.require( 'util/symbol/FallbackSymbol' );
    },


    /**
     * Symbols are used to create an object fields that is accessible only
     * to the holder of a reference to the symbol used to create that field.
     * Since this fallback is intended to be used in environments that do
     * not support symbols, the alternative is to return a random string
     * that is highly unlikely to exist in practice. However, we must also
     * return an object to allow for instanceof checks. See below test for
     * more details.
     */
    'Constructor returns an instance of Symbol': function()
    {
        var result = this.Sut();
        this.assertOk( result instanceof this.Sut );
    },


    /**
     * The generated string should be unique for each call, making it
     * unlikely that its value can be guessed. Of course, this relies on the
     * assumption that the runtime's PRNG is reliable and that it has not
     * been maliciously rewritten.
     *
     * Note that we don't test the various implementation details, as that
     * is intended to be opaque (see SUT source for details).
     */
    'Generated string varies with each call': function()
    {
        var gen = {},
            i   = 32;

        while ( i-- )
        {
            var result = this.Sut();
            if ( gen[ result ] )
            {
                this.fail( result, '' );
            }

            gen[ result ] = true;
        }

        // this prevents the test from being marked as incomplete
        this.assertOk( 'passed' );
    }
} );

} )( module['test/Util/symbol/FallbackSymbolTest'] = {}, 'test/Util/symbol' );
/** TEST CASE: Util/SymbolTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/Util/SymbolTest...<br />' )
/**
 * Tests symbol subset
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
 * N.B. Despite this saying that it tests the index (i.e. entry point), this
 * is not yet the case; it will be in the future, though.
 */


require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut = this.require( 'util/Symbol' );
    },


    /**
     * We don't care about the details of this; just make sure that we fail
     * in an environment that seems to confuse us.
     */
    'Exports a function': function()
    {
        this.assertOk( typeof this.Sut === 'function' );
    }
} );

} )( module['test/Util/SymbolTest'] = {}, 'test/Util' );
/** TEST CASE: VersionTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/VersionTest...<br />' )
/**
 * Tests version.js
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.version = this.require( 'version' );
    },


    'Can retrieve major version number': function()
    {
        this.assertOk( typeof this.version.major === 'number',
            'Major version number should be available'
        );
    },


    'Can retrieve minor version number': function()
    {
        this.assertOk( typeof this.version.minor === 'number',
            'Minor version number should be available'
        );
    },


    'Can retrieve revision version number': function()
    {
        this.assertOk( typeof this.version.rev === 'number',
            'Revision version number should be available'
        );
    },


    'Array of version numbers is available': function()
    {
        this.assertEqual( this.version.major, this.version[ 0 ] );
        this.assertEqual( this.version.minor, this.version[ 1 ] );
        this.assertEqual( this.version.rev, this.version[ 2 ] );
    },


    'Version string is available': function()
    {
        var v = this.version,

            expected = v.major + '.' + v.minor + '.' + v.rev +
                ( v.suffix && ( '-' + v.suffix ) || '' )
        ;

        this.assertEqual( expected, this.version.toString(),
            'Version string should be made available'
        );
    }
} );
} )( module['test/VersionTest'] = {}, 'test' );
/** TEST CASE: VisibilityObjectFactoryFactoryTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/VisibilityObjectFactoryFactoryTest...<br />' )
/**
 * Tests factory for visibility object factory
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.sut = this.require( 'VisibilityObjectFactoryFactory' );

        this.VisibilityObjectFactory =
            this.require( 'VisibilityObjectFactory' );

        this.FallbackVisibilityObjectFactory =
            this.require( 'FallbackVisibilityObjectFactory' );

        this.util = this.require( 'util' );
    },


    /**
     * By default, if supported by our environment, we should use the standard
     * factory to provide proper visibility support.
     */
    'Returns standard factory if not falling back': function()
    {
        // don't bother with the test if we don't support the standard visibility
        // object
        if ( this.util.definePropertyFallback() )
        {
            return;
        }

        this.assertOk(
            ( this.sut.fromEnvironment()
                instanceof this.VisibilityObjectFactory ),
            "Creates standard VisibilityObjectFactory if supported"
        );
    },


    /**
     * If not supported by our environment, we should be permitted to fall back to a
     * working implementation that sacrifices visibility support.
     */
    'Returns fallback factory if falling back': function()
    {
        var old = this.util.definePropertyFallback();

        // force fallback
        this.util.definePropertyFallback( true );

        this.assertOk(
            ( this.sut.fromEnvironment()
                instanceof this.FallbackVisibilityObjectFactory
            ),
            "Creates fallback VisibilityObjectFactory if falling back"
        );

        // restore fallback
        this.util.definePropertyFallback( old );
    }
} );
} )( module['test/VisibilityObjectFactoryFactoryTest'] = {}, 'test' );
/** TEST CASE: VisibilityObjectFactoryTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/VisibilityObjectFactoryTest...<br />' )
/**
 * Tests visibility object factory
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut = this.require( 'VisibilityObjectFactory' );

        // properties are expected to be in a specific format
        this.props = {
            'public': {
                pub: [ [ 'foo' ], {} ]
            },
            'protected': {
                prot: [ [ 'bar' ], {} ]
            },
            'private': {
                priv: [ [ 'baz' ], {} ]
            }
        };

        this.methods = {
            'public': {
                fpub: ( function()
                {
                    var retval = function() {};
                    retval.___$$keywords$$ = { 'public': true };

                    return retval;
                } )()
            },
            'protected': {
                fprot: function() {}
            },
            'private': {
                fpriv: function() {}
            }
        };
    },


    setUp: function()
    {
        // we cannot perform these tests if they are not supported by our
        // environment
        if ( this.require( 'util' ).definePropertyFallback() )
        {
            this.skip();
        }

        this.sut = this.Sut();
    },


    /**
     * To keep with the spirit of ease.js, we should be able to instantiate
     * VisibilityObjectFactory both with and without the 'new' keyword
     *
     * Consistency is key with these sorts of things.
     */
    'Can instantiate with and without `new` keyword': function()
    {
        // with `new` keyword
        this.assertOk(
            ( new this.Sut() ) instanceof this.Sut,
            "Should be able to instantiate VisibilityObjectFactory with " +
                "'new' keyword"
        );

        // without `new` keyword
        this.assertOk( this.Sut() instanceof this.Sut,
            "Should be able to instantiate VisibilityObjectFactory without " +
                "'new' keyword"
        );
    },


    /**
     * One of the core requirements for proper visibility support is the ability
     * to create a proxy object. Proxy objects transfer gets/sets of a certain
     * property to another object. This allows objects to be layered atop each
     * other while still permitting gets/sets to fall through.
     */
    'Can create property proxy': function()
    {
        var _self = this,
            base  = {},
            dest  = {},
            props = { one: true, two: true, three: true },
            val   = 'foo',
            val2  = 'bar'
        ;

        // create proxy of props to base on dest
        this.sut.createPropProxy( base, dest, props );

        // check to ensure the properties are properly proxied
        for ( var prop in props )
        {
            dest[ prop ] = val;

            // check proxy
            _self.assertEqual( dest[ prop ], val,
                "Property can be set/retrieved on destination object"
            );

            // check base
            _self.assertEqual( base[ prop ], val,
                "Property can be set via proxy and retrieved on base"
            );

            // set to new value
            base[ prop ] = val2;

            // re-check proxy
            _self.assertEqual( dest[ prop ], val2,
                "Property can be set on base and retrieved on dest object"
            );
        }
    },


    /**
     * An additional layer should be created, which will hold the private
     * members.
     */
    'Setup creates private layer': function()
    {
        var dest = { foo: [] },
            obj  = this.sut.setup( dest, this.props, this.methods );

        this.assertNotEqual( obj, dest,
            "Returned object should not be the destination object"
        );

        this.assertStrictEqual( obj.foo, dest.foo,
            "Destination object is part of the prototype chain of the " +
                "returned obj"
        );
    },


    /**
     * All protected properties must be proxied from the private layer to the
     * protected. Otherwise, sets would occur on the private object, which would
     * prevent them from being accessed by subtypes if set by a parent method
     * invocation. (The same is true in reverse.)
     */
    'Private layer includes protected member proxy': function()
    {
        var dest = {},
            obj  = this.sut.setup( dest, this.props, this.methods ),
            val  = 'foo'
        ;

        obj.prot = val;
        this.assertEqual( dest.prot, val,
            "Protected values are proxied from private layer"
        );
    },


    /**
     * Public properties should be initialized on the destination object to
     * ensure that references are not shared between instances (that'd be a
     * pretty nasty bug).
     *
     * Note that we do not care about public methods, because they're assumed to
     * already be part of the prototype chain. The visibility object is only
     * intended to handle levels of visibility that are not directly implemented
     * in JS. Public methods are a direct consequence of adding a property to
     * the prototype chain.
     */
    'Public properties are copied to destination object': function()
    {
        var dest = {};
        this.sut.setup( dest, this.props, this.methods );

        // values should match
        this.assertEqual( dest.pub[ 0 ], this.props[ 'public' ].pub[ 0 ],
            "Public properties are properly initialized"
        );

        // ensure references are not shared (should be cloned)
        this.assertNotStrictEqual( dest.pub, this.props[ 'public' ].pub,
            "Public properties should not be copied by reference"
        );

        // method references should NOT be transferred (they're assumed to
        // already be a part of the prototype chain, since they're outside the
        // scope of the visibility object)
        this.assertEqual( dest.fpub, undefined,
            "Public method references should not be copied"
        );
    },


    /**
     * Protected properties should be copied over for the same reason that
     * public properties should, in addition to the fact that the protected
     * members are not likely to be present on the destination object. In
     * addition, methods will be copied over.
     */
    'Protected properties and methods are added to dest object': function()
    {
        var dest = {};
        this.sut.setup( dest, this.props, this.methods );

        // values should match
        this.assertEqual( dest.prot[ 0 ], this.props[ 'protected' ].prot[ 0 ],
            "Protected properties are properly initialized"
        );

        // ensure references are not shared (should be cloned)
        this.assertNotStrictEqual( dest.prot, this.props[ 'protected' ].prot,
            "Protected properties should not be copied by reference"
        );

        // protected method references should be copied
        this.assertStrictEqual( dest.fprot, this.methods[ 'protected' ].fprot,
            "Protected members should be copied by reference"
        );
    },


    /**
     * Public members should *always* take precedence over protected. The reason
     * for this is because, if a protected member is overridden and made public
     * by a subtype, we need to ensure that the protected member of the
     * supertype doesn't take precedence. The reason it would take precedence by
     * default is because the protected visibility object is laid *atop* the
     * public, meaning it comes first in the prototype chain.
     */
    'Public methods are not overwritten by default': function()
    {
        // use the public method
        var dest = { fpub: this.methods[ 'public' ].fpub };

        // add duplicate method to protected
        this.methods[ 'protected' ].fpub = function() {};

        this.sut.setup( dest, this.props, this.methods );

        // ensure our public method is still referenced
        this.assertStrictEqual( dest.fpub, this.methods[ 'public' ].fpub,
            "Public methods should not be overwritten by protected methods"
        );
    },


    /**
     * This test addresses a particularily nasty bug that wasted hours of
     * development time: When a visibility modifier keyword is omitted, then
     * it should be implicitly public. In this case, however, the keyword is
     * not automatically added to the keyword list (maybe one day it will
     * be, but for now we'll maintain the distinction); therefore, we should
     * not be checking for the `public' keyword when determining if we
     * should write to the protected member object.
     */
    'Public methods are not overwritten when keyword is omitted': function()
    {
        var f = function() {};
        f.___$$keywords$$ = {};

        // no keywords; should be implicitly public
        var dest = { fpub: f };

        // add duplicate method to protected
        this.methods[ 'protected' ].fpub = function() {};

        this.sut.setup( dest, this.props, this.methods );

        // ensure our public method is still referenced
        this.assertStrictEqual( dest.fpub, f,
            "Public methods should not be overwritten by protected methods"
        );
    },



    /**
     * Same situation with private members as protected, with the exception that
     * we do not need to worry about the overlay problem (in regards to
     * methods). This is simply because private members are not inherited.
     */
    'Private properties and methods are added to dest object': function()
    {
        var dest = {},
            obj  = this.sut.setup( dest, this.props, this.methods );

        // values should match
        this.assertEqual( obj.priv[ 0 ], this.props[ 'private' ].priv[ 0 ],
            "Private properties are properly initialized"
        );

        // ensure references are not shared (should be cloned)
        this.assertNotStrictEqual( obj.priv, this.props[ 'private' ].priv,
            "Private properties should not be copied by reference"
        );

        // private method references should be copied
        this.assertStrictEqual( obj.fpriv, this.methods[ 'private' ].fpriv,
            "Private members should be copied by reference"
        );
    }
} );
} )( module['test/VisibilityObjectFactoryTest'] = {}, 'test' );
/** TEST CASE: warn/DismissiveHandlerTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/warn/DismissiveHandlerTest...<br />' )
/**
 * Tests dismissive warning handler
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut     = this.require( 'warn/DismissiveHandler' );
        this.Warning = this.require( 'warn/Warning' );
    },


    'Can be instantiated without `new` keyword': function()
    {
        this.assertOk( this.Sut() instanceof this.Sut );
    },


    /**
     * Simply do nothing. We don't want to log, we don't want to throw
     * anything, we just want to pretend nothing ever happened and move on
     * our merry way. This is intended for use in production environments
     * where such warnings are expected to already have been worked out and
     * would only confuse/concern the user.
     *
     * Now, testing whether it does anything or not is difficult, since it
     * could do, well, anything; that said, we are not passing it anything
     * via the ctor, so assuming that it does not rely on or manipulate
     * global state, we need only ensure that no exceptions are thrown.
     */
    'Does nothing': function()
    {
        var _self = this;
        this.assertDoesNotThrow( function()
        {
            _self.Sut().handle( _self.Warning( Error( "Ignore me!" ) ) );
        } );
    }
} );
} )( module['test/warn/DismissiveHandlerTest'] = {}, 'test/warn' );
/** TEST CASE: warn/LogHandlerTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/warn/LogHandlerTest...<br />' )
/**
 * Tests logging warning handler
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut     = this.require( 'warn/LogHandler' );
        this.Warning = this.require( 'warn/Warning' );
    },


    setUp: function()
    {
        this.stubwarn = this.Warning( Error( 'gninraw' ) );
    },


    'Can be instantiated without `new` keyword': function()
    {
        this.assertOk( this.Sut() instanceof this.Sut );
    },


    /**
     * Warnings should be logged to the provided console. By default, the
     * `warn` method is used (see below tests for fallbacks).
     */
    'Logs messages to console': function()
    {
        var _self  = this,
            logged = false;

        // mock console
        this.Sut( {
            warn: function( message )
            {
                // should prefix with `Warning: '
                _self.assertEqual(
                    ( 'Warning: ' + _self.stubwarn.message ),
                    message
                );

                logged = true;
            }
        } ).handle( this.stubwarn );

        this.assertOk( logged, true,
            "Message should be logged to console"
        );
    },


    /**
     * Some environments may not have a console reference, or they may not
     * have console.warn. In this case, we just want to make sure we don't
     * throw an error when attempting to invoke undefined, or access a
     * property of undefined.
     */
    'Ignores missing console': function()
    {
        var _self = this;
        this.assertDoesNotThrow( function()
        {
            _self.Sut( undefined ).handle( _self.warnstub );
        } );
    },


    /**
     * Furthermore, an environment may implement `console.log`, but not
     * `console.warn`. By default, we use `warn`, so let's ensure we can
     * fall back to `log` if `warn` is unavailable.
     */
    'Falls back to log if warn is missing': function()
    {
        var given = '';

        this.Sut( {
            log: function( message )
            {
                given = message;
            }
        } ).handle( this.stubwarn );

        this.assertEqual( ( 'Warning: ' + this.stubwarn.message ), given,
            "Should fall back to log() and log proper message"
        );
    },


    /**
     * If both `console.warn` and `console.log` are defined (which is very
     * likely to be the case), the former should take precedence.
     */
    '`warn` takes precedence over `log`': function()
    {
        var log = warn = false;

        this.Sut( {
            warn: function() { warn = true },
            log:  function() { log = true }
        } ).handle( this.stubwarn );

        this.assertOk( warn );
        this.assertOk( !log );
    }
} );
} )( module['test/warn/LogHandlerTest'] = {}, 'test/warn' );
/** TEST CASE: warn/ThrowHandlerTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/warn/ThrowHandlerTest...<br />' )
/**
 * Tests throwing warning handler
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut     = this.require( 'warn/ThrowHandler' );
        this.Warning = this.require( 'warn/Warning' );
    },


    'Can be instantiated without `new` keyword': function()
    {
        this.assertOk( this.Sut() instanceof this.Sut );
    },


    /**
     * The wrapped error should be thrown as an exception; this effectively
     * undoes the warning wrapper.
     */
    '`throwError\' warning handler throws wrapped error': function()
    {
        var warn = this.Warning( Error( 'gninraw' ) );

        try
        {
            this.Sut().handle( warn );
        }
        catch ( e )
        {
            this.assertStrictEqual( e, warn.getError(),
                "Wrapped exception should be thrown"
            );

            return;
        }

        this.assertFail( "Wrapped exception should be thrown" );
    }
} );
} )( module['test/warn/ThrowHandlerTest'] = {}, 'test/warn' );
/** TEST CASE: warn/WarningTest.js **/
( function( module, __dirname )
{
    var exports = module.exports = {};
    __cwd = '.';
    document.write( 'test/warn/WarningTest...<br />' )
/**
 * Tests the Warning prototype
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

require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        this.Sut = this.require( 'warn' ).Warning;
    },


    /**
     * Warning should be a subtype of Error in an effort to ensure
     * consistency and proper handling where Error is expected
     */
    'Warning has Error prototype': function()
    {
        this.assertOk( new this.Sut( Error() ) instanceof Error );
    },


    /**
     * Make clear that we're working with a warning
     */
    'Warning should alter Error name': function()
    {
        this.assertEqual( this.Sut( Error() ).name, 'Warning' );
    },


    /**
     * Just as with the other Error classes, as well as all ease.js classes,
     * the 'new' operator should be optional when instantiating the class
     */
    '`new\' operator is not necessary to instantiate Warning': function()
    {
        this.assertOk( this.Sut( Error( '' ) ) instanceof this.Sut );
    },


    /**
     * Warning message should be taken from the exception passed to it
     */
    'Warning message is set from wrapped exception': function()
    {
        var err = Error( 'oshit' );

        // bug in FF (tested with 8.0) where, without accessing the message
        // property in this test before passing it to Warning, err.message
        // === "" within the Warning ctor. (Assignment is to silence Closure
        // compiler warning.)
        var _ = err.message;

        var warning = this.Sut( err );

        this.assertEqual( warning.message, err.message );

        // this little trick prevents the compiler from optimizing away the
        // assignment, which would break the test in certain versions of FF.
        return _;
    },


    /**
     * The whole point of Warning is to wrap an exception; so, ensure that
     * one is wrapped.
     */
    'Throws exception if no exception is wrapped': function()
    {
        var Sut = this.Sut;

        this.assertThrows( function()
        {
            Sut( /* nothing provided to wrap */ );
        }, TypeError );

        this.assertThrows( function()
        {
            Sut( 'not an exception' );
        }, TypeError );
    },


    /**
     * We must provide access to the wrapped exception so that it can be
     * properly handled; warning is only intended to provide additional
     * information so that ease.js may handle it differently than other
     * Error instances.
     */
    'Can retrieve wrapped exception': function()
    {
        var err     = Error( 'foo' ),
            warning = this.Sut( err );

        this.assertStrictEqual( err, warning.getError() );
    }
} );
} )( module['test/warn/WarningTest'] = {}, 'test/warn' );
};

    // the following should match the exports of /index.js
    ns_exports.Class         = module['class'].exports;
    ns_exports.AbstractClass = module['class_abstract'].exports;
    ns_exports.FinalClass    = module['class_final'].exports;
    ns_exports.Interface     = module['interface'].exports;
    ns_exports.Trait         = module['Trait'].exports;
    ns_exports.version       = module['version'].exports;
} )( easejs, '.' );

