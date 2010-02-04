Normal Template
===============

Normal templates are simple, yet powerful. They are safe, usable in non XML/HTML contexts and portable to any programming language. 

This package contains a CommonJS compatible JavaScript implementation. It is part of the [Nitro](http://www.nitrojs.org/) ecosystem of Web Application development tools.

A Python port is available at: [http://github.com/tkouts/py-normal-template](http://github.com/tkouts/py-normal-template)

* Homepage: [http://www.nitrojs.org/](http://www.nitrojs.org/)
* Status updates: [http://twitter.com/nitrojs](http://twitter.com/nitrojs)
* Source & Download: [http://github.com/gmosx/normal-template/](http://github.com/gmosx/normal-template/)
* Mailing list: [http://groups.google.com/group/normal-template](http://groups.google.com/group/normal-template)
* Issue tracking: [http://github.com/gmosx/normal-template/issues](http://github.com/gmosx/normal-template/issues)


Usage
-----

template.html:

    <html>
    <h1>Hello {=name}</h1>

    {:select profile}
    <p>
        {=age}<br/>
        {=gender}<br/>
    </p>
    {/:select}

    <p>Your age is {=profile/age}</p>
        
    <ul>
    {:reduce articles}
        <li>{=title} - {=count}</li>
    {:else}
        <li>No articles found</li>    
    {/:reduce}
    </ul>
    
    {:if admin}
        You have admin rights
    {:else}
        You don't have admin rights
    {/:if}
    </html>

template.js:

    var FILE = require("file"),
        TEMPLATE = requier("normal-template"),
        src = FILE.read("template.html").decodeToString(),
        template = TEMPLATE.compile(src); // compile the input string into a template function

    var data = { // the data dictionary in JSON format
        name: "George",
        profile: {
            age: 34,
            gender: "M"
        },
        articles: [
            { title: "Hello world", count: 34 },
            { title: "Another article", count: 23 },
            { title: "The final", count: 7 }
        ],
        admin: true
    }

    // calling the template with the data dictionary returns the rendered output
    print(template(data)); 

output:

    <html>
    <h1>Hello George</h1>

    <p>
        34<br/>
        M<br/>
    </p>

    <p>Your age is 34</p>
        
    <ul>
        <li>Hello world - 34</li>
        <li>Another article - 23</li>
        <li>The final - 7</li>
    </ul>

    You have admin rights
    </html>


Syntax
------

Template commands are enclosed in curly braces. A carefully defined set of commands are provided:

* Interpolation {=path}
* Select {:select} .. {:else} .. {/:select}
* Reduce {:reduce} .. {:reduce} .. {/:reduce}
* If {:if} .. {:else} .. {/:if}
* Comment {:! this is a comment }
* Escape {:lb}, {:rb} emit the delimeters '{', '}'

Moreover, a number of static commands are applied during an optional compile-time pre-processing step:

* Static inclusion {#include /path/to/fragment}
* Meta template {#template /path/to/meta/template}
* Block definitions to be injected in the meta template {#def name} .. {/#def}

Please note that the paths in #include and #template include a leading '/'. 

The template compiler performs syntax error checks and detects unbalanced commands or not closed command tags.


Interpolation
-------------

Values from the data dictionary can be interpolated with the {=path} command where 'path' is the location of the value in the dictionary using a subset of the xpath notation:

    data = {
        "name": "George",
        "article": {
            "title": "Hello",
            "content": "World"
        }
    }
    
    {=name} => George
    {=article/title} => Hello
    {=/article/title} => Hello
    {=article.title} => Hello (you can use '.' instead of '/')
    
You can prefix the path with one or more filters:

    {=html name}
    {=head html name}
    
The following filters are provided by default:

* str, no escaping (useful to override the default filter)
* html, html escaping
* attibute, tag attribute escaping
* uri, URI escaping

Custom filters can be provided to the template compiler:

    var template = TEMPLATE.compile("Hello {=upcase name}", {filters: {
        upcase: function(val) {
            return val.toString().toUpperCase();
        }
    }});
    var data = {name: "George"};
    template(data) // => Hello GEORGE
    
    
Condition
---------

Conditional rendering is supported through a standard if-else construct:

    {:if admin}
    Hello Admin
    {:else}
    Go away
    {/:if}
           
           
Selection
---------

Select is an extension of the if statement that walks the data dictionary tree. Inside a selection block the path in the selection command is considered as the root of the data tree:

    data = {
        "name": "George",
        "article": {
            "title": "Hello",
            "content": "World"
        }
    }

    {:select article}
        {=title}, {=html content}
    {/:select} 
    
    {:select comments}
        {=content}
    {:else}
        no comments
    {/:select}
    
As a shortcut you can use the {:s path}, {:e}, {/:s} tags.


Reduction
---------

Iteration of collections is supported with the {:reduce} statement, itself an extension of the {:select} statement:

    data = {
        "name": "George",
        articles: [
            { title: "Hello world", count: 34 },
            { title: "Another article", count: 23 },
            { title: "The final", count: 7 }
        ]
    }

    {:reduce article}
        {=title} {=count}
    {:else}
        no articles
    {/:reduce}

As a shortcut you can use the {:r collectionpath}, {:e}, {/:r} tags.


More examples
-------------

Here are some more complicated examples that demonstrate the usage of xpath for extracting values from the data dictionary:

    data = {
        version: 1,
        admin: "true",
        articles: [
            {title: "Hello", content: "World"},
            {title: "Hello", content: "World"},
            {title: "Hello", content: "World"},
        ]
    }
    
    {:! this is a comment, ignore me }
    
    {:r articles}
        {=title} {=/version}
    {/:r articles} {:! you can repeat the path of the opening tag for extra readability }
    
    {:s admin}
        {=.}
    {/:s}


Meta Template
-------------

A meta-templating mechanism similar to Django's inherited templates and Rails' layout system is provided. Let's demonstrate with an example:

layout.html

    <html>
        {=head}
        <body>
            {=content}
            <br>
            {:lb}=key{:rb}
        </body>
    </html>
    
fragment.inc.html

    <p>this is a fragment</p>
        
template.html

    {#template layout.html}
    
    {#def head}
        <head>
            <title>Normal Template</title>
        </head>
    {/#def}    
    
    {#def content}
        This is an example
        {#include /fragment.inc.html}
    {/#def}
    
compiled template:

    <html>
        <head>
            <title>Normal Template</title>
        </head>
        <body>
            This is an example
            <p>this is a fragment</p>
            <br>
            {=key}
        </body>
    </html>

In essence, the blocks defined in the template are passed as the values in the data dictionary passed to the meta-template. Both templates are evaluated.


Implementations
---------------

Normal Template is programming language agnostic. At the moment implementations are available for JavaScript and Python.


Credits
-------

* George Moschovitis <george.moschovitis@gmail.com>

Normal templates are inspired by StringTemplate, JSON-Template and Mustache.


License
-------

Copyright (c) 2010 George Moschovitis, http://www.gmosx.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER 
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
