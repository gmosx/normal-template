docNormal Template
===============

Normal templates are simple, yet powerful. They are safe, usable in non XML/HTML contexts and portable to any programming language. This package contains a CommonJS compatible JavaScript implementation.


Using the template
------------------

var TEMPLATE = require("normal-template");

var template = TEMPLATE.compile("hello {=name}"), // compile the input string into a template function
    data = {name: "George"}; // the data dictionary passed as a JSON structure
    
print(template(data)); // renders the template using the provided data dictionary, prints 'hello George'    


Syntax
------

Template commands are enclosed in curly braces. A carefully defined set of commands are provided.

* Interpolation {=key}

Interpolates the value of 'key' from the data dictionary. You can provide optional filters

{=uri key}
{=html uri key}

* Condition

{:if key}...{:else}...{/:if}

* Reduce

{:reduce array}
    {=key}
{/:reduce}

* With

{:with obj}

{/:w}


Preprocessor
------------

{#template path}

{#def name}
{/#def}

{#include path}

- comments
- shortcuts
- doc names


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
