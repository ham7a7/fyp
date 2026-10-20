const queues = new Map<string, Promise<void>>();

// Runs tasks that share a key one after another, in the order they were added.
// Errors are logged, so one failed task doesn't stop the next ones.
export const runInOrder = (
  key: string,
  task: () => Promise<void>,
  errorMessage: string,
) => {
  const next = (queues.get(key) ?? Promise.resolve())
    .then(task)
    .catch((error) => console.error(`${errorMessage}:`, error?.message));
  queues.set(key, next);
  next.then(() => {
    if (queues.get(key) === next) queues.delete(key);
  });
};
