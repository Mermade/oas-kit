# RefTools

## Constants

<dl>
<dt><a href="#util">util</a></dt>
<dd><p>LICENSE: MIT
 Source: <a href="https://simplapi.wordpress.com/2015/08/19/detect-graph-cycle-in-javascript/">https://simplapi.wordpress.com/2015/08/19/detect-graph-cycle-in-javascript/</a>
removed dependency on underscore, MER</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#clone">clone()</a></dt>
<dd><p>a collection of cloning functions</p>
</dd>
<dt><a href="#flatten">flatten()</a></dt>
<dd><p>flattens an object into an array of properties, takes a callback
which can mutate or filter the entries (by returning null)</p>
</dd>
<dt><a href="#jptr">jptr()</a></dt>
<dd><p>from obj, return the property with a JSON Pointer prop, optionally setting it
to newValue</p>
</dd>
<dt><a href="#recurse">recurse()</a></dt>
<dd><p>recurses through the properties of an object, given an optional starting state
anything you pass in state.payload is passed to the callback each time</p>
</dd>
<dt><a href="#reref">reref()</a></dt>
<dd><p>Simply creates an object without self-references by replacing them
with $ref pointers</p>
</dd>
<dt><a href="#toposort">toposort(nodes)</a> ⇒ <code>Array</code> | <code>Null</code></dt>
<dd><p>Try to get a topological sorting out of directed graph.</p>
</dd>
<dt><a href="#visit">visit()</a></dt>
<dd><p>Given an expanded object and an optional object to compare to (e.g. its $ref&#39;d form), will call
the following functions:
callbacks.before - lets you modify the initial starting state, must return it
callbacks.where - lets you select a subset of properties, return a truthy value
callbacks.filter - called for all selected properties, can mutate/remove (by setting to undefined)
callbacks.compare - allowing the objects to be compared by path (i.e. for $ref reinstating)
callbacks.identity - called on any object identity (previously seen) properties
callbacks.selected - called for all selected/unfiltered properties, does not mutate directly
callbacks.count - called at the end with the number of selected properties
callbacks.finally - called at the end of the traversal</p>
</dd>
</dl>

<a name="util"></a>

## util
LICENSE: MIT
 Source: https://simplapi.wordpress.com/2015/08/19/detect-graph-cycle-in-javascript/
removed dependency on underscore, MER

**Kind**: global constant
<a name="clone"></a>

## clone()
a collection of cloning functions

**Kind**: global function
<a name="flatten"></a>

## flatten()
flattens an object into an array of properties, takes a callback
which can mutate or filter the entries (by returning null)

**Kind**: global function
<a name="jptr"></a>

## jptr()
from obj, return the property with a JSON Pointer prop, optionally setting it
to newValue

**Kind**: global function
<a name="recurse"></a>

## recurse()
recurses through the properties of an object, given an optional starting state
anything you pass in state.payload is passed to the callback each time

**Kind**: global function
<a name="reref"></a>

## reref()
Simply creates an object without self-references by replacing them
with $ref pointers

**Kind**: global function
<a name="toposort"></a>

## toposort(nodes) ⇒ <code>Array</code> \| <code>Null</code>
Try to get a topological sorting out of directed graph.

**Kind**: global function
**Returns**: <code>Array</code> \| <code>Null</code> - An array if the topological sort could succeed, null if there is any cycle somewhere.

| Param | Type | Description |
| --- | --- | --- |
| nodes | <code>Object</code> | A list of nodes, including edges (see below). |

<a name="visit"></a>

## visit()
Given an expanded object and an optional object to compare to (e.g. its $ref'd form), will call
the following functions:
callbacks.before - lets you modify the initial starting state, must return it
callbacks.where - lets you select a subset of properties, return a truthy value
callbacks.filter - called for all selected properties, can mutate/remove (by setting to undefined)
callbacks.compare - allowing the objects to be compared by path (i.e. for $ref reinstating)
callbacks.identity - called on any object identity (previously seen) properties
callbacks.selected - called for all selected/unfiltered properties, does not mutate directly
callbacks.count - called at the end with the number of selected properties
callbacks.finally - called at the end of the traversal

**Kind**: global function
