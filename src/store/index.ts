import { Batch } from "./batch";
import { Prices, Tokens } from "./prices";
import { Form } from "./form";

class Store {
  batch = new Batch();
  tokens = new Tokens();
  form = new Form(this.tokens);
}

export const store = new Store();
// ts-ignore
