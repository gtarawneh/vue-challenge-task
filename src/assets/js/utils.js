export const wait = (timeToDelay = 1000) => new Promise((resolve) => setTimeout(resolve, timeToDelay));