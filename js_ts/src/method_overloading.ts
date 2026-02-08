class Greeting {
	public sayHello(name?: string): string;
	public sayHello(name: string, age?: number): string;
	public sayHello(name?: string, age?: number): string {
		let message = "Hello";

		if (name) {
			message += ` ${name}`;
		}

		if (age) {
			message += ` ${age}`;
		}

		if (!name && !age) {
			message += " Stranger";
		}

		return message;
	}
}

const greet = new Greeting();

console.log(greet.sayHello());
console.log(greet.sayHello("Sam"));
console.log(greet.sayHello("Sam", 22));
