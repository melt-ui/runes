type Getter<T> = () => T;
type Setter<T> = (value: T) => void;

export type Read<T> = [Getter<T>];
export type Write<T> = [Getter<T>, Setter<T>];

export type Box<T extends Read<any> | Write<any>> = T extends Read<infer U>
  ? {
    get: Getter<U>;
  }
  : T extends Write<infer U>
  ? {
    get: Getter<U>;
    set: Setter<U>;
  }
  : never;

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
    };
  } else {
    return {
      get: getter,
    };
  }
}

export type BoxOr<T extends Read<any> | Write<any>> = T extends Read<infer U>
  ? Box<Read<U>> | U
  : T extends Write<infer U>
  ? Box<Write<U>> | U
  : never;

function isBox<T extends Read<any> | Write<any>>(value: BoxOr<T>): value is Box<T> {
  return typeof value === "object" && "get" in value;
}

function boxFrom<T>(value: BoxOr<Write<T>>): Box<Write<T>>;
function boxFrom<T>(value: Box<Write<T>>): Box<Write<T>>;
function boxFrom<T>(value: BoxOr<Read<T>>): Box<Read<T>>;
function boxFrom<T>(value: Box<Read<T>>): Box<Read<T>>;
function boxFrom<T>(value: T): Box<Write<T>>;
function boxFrom(value: unknown): unknown {
  if (isBox(value)) {
    return value;
  }
  let v = $state(value);

  return box(
    () => v,
    (value) => (v = value),
  );
}

box.from = boxFrom;

type CorrectBool<T> = T extends true | false ? boolean : T;

export type BoxFrom<T extends BoxOr<any>> = T extends Box<Write<infer U>>
  ? Box<Write<U>>
  : T extends Box<Read<infer U>>
  ? Box<Read<U>>
  : Box<Write<CorrectBool<T>>>;



