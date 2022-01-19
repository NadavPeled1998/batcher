import { MultiSend } from "./MultiSend";

export type MultiSendAllParams = Parameters<MultiSend["multiSendAll"]>;
export type MultiSendERC20Params = Parameters<MultiSend["multiSendERC20"]>;
export type MultiSendERC721Params = Parameters<MultiSend["multiSendERC721"]>;
export type MultiSendNativeParams = Parameters<MultiSend["multiSendNative"]>;
export type MultiSendNativeAndERC20Params = Parameters<
  MultiSend["multiSendNativeAndERC20"]
>;
export type MultiSendNativeAndERC721Params = Parameters<
  MultiSend["multiSendNativeAndERC721"]
>;

export type MultiSendParams =
  | MultiSendAllParams
  | MultiSendERC20Params
  | MultiSendERC721Params
  | MultiSendNativeParams
  | MultiSendNativeAndERC20Params
  | MultiSendNativeAndERC721Params;
