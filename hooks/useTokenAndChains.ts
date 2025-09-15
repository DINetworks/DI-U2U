import { useAccount } from "wagmi"
import HttpAdapter from "@/utils/http"
import { useEffect, useMemo } from "react"
import { useTokenAndChainStore } from "@/store/useTokenAndChainStore"
import { nativeEvmTokenAddress, sortAllTokens } from "@/utils/token"

export const useTokenAndChains = () => {

	const { chainId } = useAccount()
	const httpInstance = new HttpAdapter()

	const {
			tokens: allTokens,
			initializedAt,
			setTokenAndChain
	} = useTokenAndChainStore(state => state)


	useEffect(() => {
		const now = Date.now() / 1000

		const getTokenAndChains = async () => {
			const response = await httpInstance.get('v2/sdk-info')
			if (response.status != 200) {
				throw new Error('SDK initialization failed')
			}

			return response.data
		}

		if (initializedAt == 0 || now - initializedAt > 3600 * 24) {
			getTokenAndChains().then(data => {
				setTokenAndChain({
					tokens: data.tokens,
					chains: data.chains,
					initializedAt: now
				})
			})
		}
	}, [initializedAt, setTokenAndChain])

	const tokens = useMemo(
		() =>
		allTokens
			?.filter(
			token =>
					token.chainId.toString() == chainId?.toString() &&
					token.address.toLowerCase() !== nativeEvmTokenAddress
			)
			.sort(sortAllTokens),
		[chainId, allTokens]
	)

	return {
		tokens,
	}
}