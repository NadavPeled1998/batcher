import axios from 'axios';

export const DEFAULT_IMAGE = `https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Fxemoji_u1F47E.svg/800px-Fxemoji_u1F47E.svg.png`;
const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';

const ipfsToHttps = (uri: string) => {
  const ipfsPos = uri.search('/ipfs/');
  if (ipfsPos > 0) {
    return `${IPFS_GATEWAY}${uri.slice(ipfsPos + 6)}`;
  }
  if (uri.startsWith('ipfs://')) {
    return `${IPFS_GATEWAY}${uri.replace(`ipfs://`, '')}`;
  }
  if (uri.startsWith('ipfs:/')) {
    return `${IPFS_GATEWAY}${uri.replace(`ipfs:/`, '')}`;
  }
  return uri;
};

export const tryGetImage = ({ url }: { url: string }) => {
    console.log("tryGetImage -1")
    return axios
      .get(`${ipfsToHttps(url)}`)
      .then(response => {
        console.log("tryGetImage ok 0", {response});

        const image = response.data.image;
        console.log("image", {image})
        if (image) {
        console.log("tryGetImage ok", {image})
          return ipfsToHttps(image);
        }
  
        return DEFAULT_IMAGE;
      })
      .catch((e) => {
    
        console.log("tryGetImage failed", {e, url})
        return DEFAULT_IMAGE;
      });
  };

  
export const getImage = async (iconUrl?: string) => {
    if (!iconUrl) return DEFAULT_IMAGE;
    const nftUriArray = iconUrl.split(',');
    let image: string;
    if (nftUriArray[0] === 'data:application/json;base64') {
      image = JSON.parse(atob(nftUriArray[nftUriArray.length - 1]))?.image;
    } else {
      image = await tryGetImage({ url: iconUrl });
    }
    return image;
};
