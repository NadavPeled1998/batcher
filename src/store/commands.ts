import { makeAutoObservable } from "mobx";
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
  approveCommand: CMD = new CMD();

  constructor() {
    makeAutoObservable(this);
  }
}
