import { makeAutoObservable } from "mobx";
import { Token } from "../hooks/useERC20Balance";

interface Command {
    running: boolean;
    done: boolean;
    failed: boolean;
}

export class Commands {
  approveCommand: Command = {
    running: false,
    done: false,
    failed: false
  }

  constructor() {
    makeAutoObservable(this);
  }
  approveCommandFailed = () => {
    this.approveCommand.running = false;
    this.approveCommand.done = false;
    this.approveCommand.failed = true;
  }
  approveCommandDone = () => {
    this.approveCommand.running = false;
    this.approveCommand.done = true;
    this.approveCommand.failed = false;
  }
  approveCommandRunning = () => {
    this.approveCommand.running = true;
    this.approveCommand.done = false;
    this.approveCommand.failed = false;
  }
  approveCommandReset = () => {
    this.approveCommand.running = false;
    this.approveCommand.done = false;
    this.approveCommand.failed = false;
  }
}
