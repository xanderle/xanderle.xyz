---
template: post
title: Code Every Day no. 1 Dependency Injection with JS Lambdas 
slug: depndency-injection-js-lambdas 
date: "2020-12-30T23:46:37.121Z"
category: Javascript 
tags: ["js", "aws", "lambda"]
---

Thought it might be fun to try get out a useful coding oriented thing I've learnt every single day... so welcome to coding every day number one!

So to start things off..

## Dependency Injection JS Lambdas

This was shown to me by a co-worker because for some reason this basic idea just didn't click.

So starting with a lambda that reacts to an S3 Event you might have something like this

```jsx
exports.handler = async (event, context, callback) => {
	//do something with the event
}
```

Seems straight forward.

Now lets try do literally anything with it and instantly reach a dependency

```jsx
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event, context, callback) => {
	const bucket = event.Records[0].s3.bucket.name;
	const key    = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

  const params = {
      Bucket: bucket,
      Key: key
  };
  var file = await s3.getObject(params).promise();
	// do something with the file
}
```

So straight off the bat we are now tied to AWS, we're hitting a real service. Now you could use 'aws-mock-sdk' to mock it out, BUT that doesn't really help if you're trying to mock a non AWS service.

### Higher Order Functions to the Rescue

Brief overview: Higher order functions are functions which return functions. i.e

```jsx
let a = (b) => {
	return (c) => b+c
}
```

So a is a function that accepts b as a parameter then returns a function that accepts c as a parameter then returns the b+c.

so

```jsx
a(2)(3) // returns 5
const z = a(2) // the anonymous function (c) => b+c
z(3) //returns 5
```

Its so blindingly obvious once you know the answer but instead of using jest to arbitrarily mock out everything just use a higher order function to pass in and set up your dependencies!

```jsx
const AWS = require('aws-sdk')
// what can be called inside tests
const createHandler = async (s3) => {
  async (event, context, callback) => {
		const bucket = event.Records[0].s3.bucket.name;
		const key    = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
	
	  const params = {
	      Bucket: bucket,
	      Key: key
	  };
	  var file = await s3.getObject(params).promise();
		// do something with the file
	}
}
// what can be called by lambda
const handler = async (event: S3Event) => {
	const s3 = new AWS.S3();
	return createHandler(s3)(event)
}
```

You can now use `createHandler` inside your jest tests (passing in whatever mocks you need!
