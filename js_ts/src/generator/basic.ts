// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*

function* increment() {
	let counter = 0;
	while (true) {
		counter++;
		yield counter;
	}
}

const inc = increment();

console.log(inc.next());
console.log(inc.next());
