export const shortenAddress = (address: string, digits: number = 4): string => {
  const front = address.substring(0, digits + 2);
  const back = address.substring(address.length - digits, address.length);

  return `${front}...${back}`;
};

export const isValidAddress = (address?: string): boolean => {
  if (!address) return false;
  return /^0x[0-9a-fA-F]{40}$/.test(address);
};
