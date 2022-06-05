const queues: Record<number, (() => void)[]> = {};

// we batch queued events in a range of 4ms (2 right shifts = div by 4 and floor)

export function enqueue(task: () => void, ms: number) {
  const key = (performance.now() + ms) >> 2;

  if (queues[key]) queues[key].push(task);
  else {
    queues[key] = [task];
    setTimeout(() => {
      for (const task of queues[key]) task();
      delete queues[key];
    }, ms);
  }
}
