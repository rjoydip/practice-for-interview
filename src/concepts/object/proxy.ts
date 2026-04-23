type UserType = {
  name: string;
  age: number;
  isAdult: boolean;
  address: {
    city: string;
    pincode: number;
  };
};
const target: { [key in string]: UserType } = {
  1: {
    name: "User One",
    age: 18,
    isAdult: false,
    address: {
      city: "Kolkata",
      pincode: 700001,
    },
  },
  2: {
    name: "User Two",
    age: 17,
    isAdult: false,
    address: {
      city: "Kolkata",
      pincode: 700002,
    },
  },
};

type Target = { [key in string]: UserType };

const handler = {
  get(target: Target, prop: string) {
    const user = target[prop as string] as UserType;

    if (user.age < 18) {
      user.isAdult = true;
    }

    target[prop] = user;

    return target;
  },

  set(obj: Target, prop: string, value: UserType) {
    obj[prop] = value;
    if (prop === "age") {
      if (!Number.isInteger(value)) {
        throw new TypeError("The age is not an integer");
      }
      if (value[prop] > 200) {
        throw new RangeError("The age seems invalid");
      }
    }
    return true;
  },
};

const proxy = new Proxy(target, handler);

console.log(proxy[2]);
