export const getAssetInfo = ({ name }: { name: string }) =>
  fetch(`https://api.coingecko.com/api/v3/coins/${name}`)
    .then(response => response.json())
    .then(response => response)
    .catch(e => {
      console.error(e);
    });