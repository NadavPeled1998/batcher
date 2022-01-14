import { Batch } from "./batch";
import { Form } from "./form";
import { Tokens } from "./prices";
import { Commands } from './commands';

class Store {
  commands = new Commands();
  batch = new Batch();
  tokens = new Tokens();
  form = new Form(this.tokens, this.batch);
}

export const store = new Store();
// ts-ignore
