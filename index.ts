type Identity<A> = A

type Transform<A, B> = (a: A) => B;

type Compose<T1, T2, T3> = (a: T1) => Transform<Transform<T1, T2>, T3>

type ComposeMany<Functions extends unknown[], Composed = Functions[0]> = 
  Functions extends [Transform<infer T1, infer T2>, ...infer Rest]
    ? ComposeMany<
      Rest,
      Composed extends Functions[0]
       ? Transform<T1, T2>
       : Composed extends Transform<infer TIn, infer TOut>
        ? T1 extends TOut
            ? Transform<TIn, T2>
            : never
        : never
    >
    : Composed;

const identity = <T,>(a: T) => a;

const compose = <
  T1 extends unknown,
  T2 extends unknown,
  T3 extends unknown,
  F1 extends Transform<T2, T3>,
  F2 extends Transform<T1, T2>,
>(a: F1, b: F2): Transform<T1, T3> => ((x: T1): Compose<T1, T2, T3> => a(b(x)) as Compose<T1, T2, T3>) as Transform<T1, T3>;

const composeMany = <
  T extends Transform<any, unknown>[]
>(...funcs: T): ComposeMany<T> =>
  funcs.reduceRight(compose, identity) as ComposeMany<T>;

const stringToNum = (s: string) => Number(s);

const arrayFrom = (n: number): number[] => Array(n).fill(0);

const mapToStrings = (arr: number[]) => arr.map(n => n.toString());

const composed = composeMany(
  stringToNum,
  arrayFrom,
  mapToStrings
);

// x: string[]
const x = composed('4');
