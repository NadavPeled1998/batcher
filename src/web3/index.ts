import Moralis from "moralis";

let _web3 = new Moralis.Web3();

const globals = {
  get web3() {
    return _web3;
  },
  set web3(instance: Moralis.Web3) {
    _web3 = instance;
  },
};

export default globals;
