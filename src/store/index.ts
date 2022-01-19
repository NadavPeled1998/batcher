import { Batch } from "./batch";
import { Form } from "./form";
import { Tokens } from "./prices";
import { Commands } from './commands';
import { TransactionHistory } from "./history";
import { NFTs } from './nfts'

class Store {
  commands = new Commands();
  batch = new Batch();
  tokens = new Tokens();
  nfts = new NFTs();
  form = new Form(this.tokens, this.batch);
  history = new TransactionHistory();
}

export const store = new Store();
// @ts-ignore
window.store = store;
