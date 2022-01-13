import MoralisType from "moralis";

export const etherToWei = (
    web3: MoralisType.Web3,
    value: number | string,
    decimals?: string
): string => {
    if (value?.toString() && decimals) {
        const val = value.toString()
        let [whole, fraction] = val.split('.')
        if (!whole) whole = '0'
        if (!fraction) fraction = '0'
        while (fraction.length < +decimals) fraction += '0'
        const { toBN } = web3.utils
        const wei = toBN(whole)
            .mul(toBN(+`1e${decimals}`))
            .add(toBN(fraction))
        return toBN(wei?.toString())?.toString()
    }
    return web3.utils.toWei(value?.toString() || '0', 'ether')
}