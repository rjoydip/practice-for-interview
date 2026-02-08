const map = new Map();

const key_string = "dymmy_string";
const key_object = {};
const key_function = () => {};

map.set(key_string, "string_value");
map.set(key_object, "object_value");
map.set(key_function, "function_value");

// console.log(Array.from(map))

console.log(map.get(key_string));
console.log(map.has(key_function));
