export const getSingleMessage = (worker) =>
  new Promise((resolve, reject) => {
    const msgHandler = event => {
      worker.removeEventListener('error', errHandler);
      worker.removeEventListener('message', msgHandler);

      resolve(event.data);
    };

    worker.addEventListener('message', msgHandler);

    const errHandler = event => {
      worker.removeEventListener('error', errHandler);
      worker.removeEventListener('message', msgHandler);

      reject(event);
    };

    worker.addEventListener('error', errHandler);
  });
