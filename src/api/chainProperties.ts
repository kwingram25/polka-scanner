import { ApiPromise } from '@polkadot/api';

import { ChainProperties } from '../types';

export async function getChainProperties(
  api: ApiPromise
): Promise<ChainProperties | null> {
  const [chainProperties, systemChain] = await Promise.all([
    api.rpc.system.properties(),
    api.rpc.system.chain(),
  ]);

  const result = {
    systemChain: systemChain.toString(),
    tokenDecimals: chainProperties.tokenDecimals.isSome
      ? chainProperties.tokenDecimals.unwrap().toArray()[0].toNumber()
      : 12,
    tokenSymbol: chainProperties.tokenSymbol.isSome
      ? chainProperties.tokenSymbol
          .unwrap()
          .toArray()
          .map((s) => s.toString())[0]
      : 'Unit',
  };

  return result;
}
