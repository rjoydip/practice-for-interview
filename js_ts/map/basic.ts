import { logger } from "../utils";

const map = new Map();

const key_string = "dymmy_string";
const key_object = {};
const key_function = () => {};

map.set(key_string, "string_value");
map.set(key_object, "object_value");
map.set(key_function, "function_value");

// logger.log(Array.from(map))

logger.log(map.get(key_string));
logger.log(map.has(key_function));
