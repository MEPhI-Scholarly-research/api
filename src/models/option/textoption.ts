import { AbstractOption } from "./abstractoption";

export class TextOption extends AbstractOption {
  title: string = "";
  serial: number = 0;
  is_selected: boolean | undefined = undefined;
  is_correct: boolean | undefined = undefined;

  constructor(init?:Partial<TextOption>) {
    super(init);
    Object.assign(this, init);
  }
}