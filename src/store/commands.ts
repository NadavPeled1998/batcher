import { makeAutoObservable } from "mobx";
import { Token } from "../hooks/useERC20Balance";

interface Command {
  running: boolean;
  done: boolean;
  failed: boolean;
}
export class CMD {
  constructor() {
    makeAutoObservable(this);
  }

  done: boolean = false;
  failed: boolean = false;
  running: boolean = false;

  setRunning() {
    this.done = false;
    this.failed = false;
    this.running = true;
  }
  setDone() {
    this.done = true;
    this.failed = false;
    this.running = false;
  }
  setFailed() {
    this.done = false;
    this.failed = true;
    this.running = false;
  }
  reset() {
    this.done = false;
    this.failed = false;
    this.running = false;
  }
}

export class Commands {
  // approveCommand: Command = {
  //   running: false,
  //   done: false,
  //   failed: false,
  // };

  approveCommand: CMD = new CMD();

  constructor() {
    makeAutoObservable(this);
  }
}
