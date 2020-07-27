const fetchTimeout = (url, ms = 0, { signal, ...options } = {}) => {
  const controller = new AbortController();
  const promise = fetch(url, { signal: controller.signal, ...options });

  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  const timeoutId = setTimeout(() => controller.abort(), ms);
  return promise.finally(() => clearTimeout(timeoutId));
};

export default fetchTimeout;
