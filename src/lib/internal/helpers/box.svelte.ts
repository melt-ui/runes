type Getter<T> = () => T;
type Setter<T> = (value: T) => void;

type Read<T> = [Getter<T>];
type Write<T> = [Getter<T>, Setter<T>];

export type Box<T extends Read<any> | Write<any>> = T extends Read<infer U> ? {
  get: Getter<U>;
} : T extends Write<infer U> ? {
  get: Getter<U>;
  set: Setter<U>;
} : never;


// Overload for Read<T>
export function box<T>(getter: Getter<T>): Box<Read<T>>;
// Overload for Write<T>
export function box<T>(getter: Getter<T>, setter: Setter<T>): Box<Write<T>>;
// Implementation of the function
export function box<T>(getter: Getter<T>, setter?: Setter<T>): Box<Read<T> | Write<T>> {
  if (setter) {
    return {
      get: getter,
      set: setter,
    }
  } else {
    return {
      get: getter,
    }
  }
}

export type BoxOr<T> = T | Box<Read<T>> | Box<Write<T>>;


function isBox<T>(value: BoxOr<T>): value is Box<Read<T>> | Box<Write<T>> {
  return value instanceof Object && 'get' in value;
}

function boxFrom<T>(value: Box<Write<T>>): Box<Write<T>>;
function boxFrom<T>(value: Box<Read<T>>): Box<Read<T>>;
function boxFrom<T>(value: T): Box<Write<T>>;
function boxFrom<T>(value: BoxOr<T>) {
  if (isBox(value)) {
    return value;
  }
  let v = $state(value)

  return v
}

box.from = boxFrom;
