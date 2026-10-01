export interface Observable<T> {
  value: T;
}

export interface Opt {
  req: number;
  optional?: string;
  obs: Observable<string>;
}
