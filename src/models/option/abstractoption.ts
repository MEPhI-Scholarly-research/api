export abstract class AbstractOption {
  uuid: string | undefined = undefined;
  question: string = "";

  constructor(init?:Partial<AbstractOption>) {
    Object.assign(this, init);
  }
}