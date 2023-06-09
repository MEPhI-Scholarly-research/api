export abstract class AbstractQuestion {
  uuid: string = "";
  quiz: string = "";
  type: number = 0;
  title: string = "";
  description: string = "";
  serial: number = 0;

  public constructor(init?:Partial<AbstractQuestion>) {
    Object.assign(this, init);
  }

  abstract select(uuid: string): Promise<AbstractQuestion | undefined>;
}