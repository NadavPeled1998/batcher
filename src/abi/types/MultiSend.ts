import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import {
  PromiEvent,
  TransactionReceipt,
  EventResponse,
  EventData,
  Web3ContractContext,
} from 'ethereum-abi-types-generator';

export interface CallOptions {
  from?: string;
  gasPrice?: string;
  gas?: number;
}

export interface SendOptions {
  from: string;
  value?: number | string | BN | BigNumber;
  gasPrice?: string;
  gas?: number;
}

export interface EstimateGasOptions {
  from?: string;
  value?: number | string | BN | BigNumber;
  gas?: number;
}

export interface MethodPayableReturnContext {
  send(options: SendOptions): PromiEvent<TransactionReceipt>;
  send(
    options: SendOptions,
    callback: (error: Error, result: any) => void
  ): PromiEvent<TransactionReceipt>;
  estimateGas(options: EstimateGasOptions): Promise<number>;
  estimateGas(
    options: EstimateGasOptions,
    callback: (error: Error, result: any) => void
  ): Promise<number>;
  encodeABI(): string;
}

export interface MethodConstantReturnContext<TCallReturn> {
  call(): Promise<TCallReturn>;
  call(options: CallOptions): Promise<TCallReturn>;
  call(
    options: CallOptions,
    callback: (error: Error, result: TCallReturn) => void
  ): Promise<TCallReturn>;
  encodeABI(): string;
}

export interface MethodReturnContext extends MethodPayableReturnContext {}

export type ContractContext = Web3ContractContext<
  MultiSend,
  MultiSendMethodNames,
  MultiSendEventsContext,
  MultiSendEvents
>;
export type MultiSendEvents = undefined;
export interface MultiSendEventsContext {}
export type MultiSendMethodNames =
  | 'multiSendAll'
  | 'multiSendERC20'
  | 'multiSendERC721'
  | 'multiSendNative'
  | 'multiSendNativeAndERC20'
  | 'multiSendNativeAndERC721';
export interface MultiSend {
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _receivers Type: address[], Indexed: false
   * @param _amounts Type: uint256[], Indexed: false
   * @param _tokens Type: address[], Indexed: false
   * @param _types Type: string[], Indexed: false
   */
  multiSendAll(
    _receivers: string[],
    _amounts: string[],
    _tokens: string[],
    _types: string[]
  ): MethodPayableReturnContext;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _receivers Type: address[], Indexed: false
   * @param _amounts Type: uint256[], Indexed: false
   * @param _tokens Type: address[], Indexed: false
   */
  multiSendERC20(
    _receivers: string[],
    _amounts: string[],
    _tokens: string[]
  ): MethodPayableReturnContext;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _receivers Type: address[], Indexed: false
   * @param _tokenIds Type: uint256[], Indexed: false
   * @param _tokens Type: address[], Indexed: false
   */
  multiSendERC721(
    _receivers: string[],
    _tokenIds: string[],
    _tokens: string[]
  ): MethodPayableReturnContext;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _receivers Type: address[], Indexed: false
   * @param _amounts Type: uint256[], Indexed: false
   */
  multiSendNative(
    _receivers: string[],
    _amounts: string[]
  ): MethodPayableReturnContext;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _receivers Type: address[], Indexed: false
   * @param _amounts Type: uint256[], Indexed: false
   * @param _tokens Type: address[], Indexed: false
   */
  multiSendNativeAndERC20(
    _receivers: string[],
    _amounts: string[],
    _tokens: string[]
  ): MethodPayableReturnContext;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _receivers Type: address[], Indexed: false
   * @param _amounts Type: uint256[], Indexed: false
   * @param _tokens Type: address[], Indexed: false
   */
  multiSendNativeAndERC721(
    _receivers: string[],
    _amounts: string[],
    _tokens: string[]
  ): MethodPayableReturnContext;
}
