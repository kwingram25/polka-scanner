import { ApiPromise } from '@polkadot/api';

import { EventRecord } from '../types';

type OnSuccess = (_: number, __: EventRecord[], ___: number) => void;

async function queryEvents(
  api: ApiPromise,
  at: number
): Promise<EventRecord[]> {
  try {
    const hash = await api.rpc.chain.getBlockHash(at);
    const apiAt = await api.at(hash);

    // Filter frequent clutter events as is done on @polkadot-js/apps
    return (
      (await apiAt.query.system.events()) as unknown as EventRecord[]
    ).filter(
      ({ event: { method, section } }) =>
        section !== 'system' &&
        (!['balances', 'treasury'].includes(section) ||
          !['Deposit', 'Withdraw'].includes(method)) &&
        (!['transactionPayment'].includes(section) ||
          !['TransactionFeePaid'].includes(method)) &&
        (!['paraInclusion', 'parasInclusion', 'inclusion'].includes(section) ||
          !['CandidateBacked', 'CandidateIncluded'].includes(method)) &&
        (!['relayChainInfo'].includes(section) ||
          !['CurrentBlockNumbers'].includes(method))
    );
  } catch (e) {
    throw new Error(e);
  }
}

export async function getEventsFromBlocks(
  api: ApiPromise | null,
  blockNumbers: number[],
  onSuccess: OnSuccess
): Promise<void> {
  if (!api) {
    return;
  }

  const count = blockNumbers.length;
  let completed = 0;

  if (blockNumbers.length === 0) {
    onSuccess(null, [], 1);
  }

  // Fetch events for each block, increment completion percent
  Promise.allSettled(
    blockNumbers.map(async (at) => {
      try {
        const events = await queryEvents(api, at);

        onSuccess(at, events, (completed += 1) / count);
      } catch (e) {
        onSuccess(at, [], (completed += 1) / count);
      }
    })
  );
}
