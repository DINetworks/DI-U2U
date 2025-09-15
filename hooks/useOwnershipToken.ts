import { useReadContract } from "wagmi";
import { usePublicClient } from "wagmi";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useWeb3 } from "./useWeb3";

import { ERC721_ABI } from "@/contracts/abi";
import { CONTRACT_ADDRESSES } from "@/config/web3";

const OWNERSHIP_TOKEN_ADDRESS =
  CONTRACT_ADDRESSES.OWNERSHIP_TOKEN as `0x${string}`;
const GRAPHQL_API = process.env.NEXT_PUBLIC_DOMA_GRAPHQL_API;
const API_KEY = process.env.NEXT_PUBLIC_DOMA_API_KEY;

export type TokenMetadata = {
  tokenId: bigint;
  image: string;
  name: string;
};

export function useOwnershipToken() {
  const { address, chain } = useWeb3();
  const publicClient = usePublicClient();
  const [isLoading, setIsLoading] = useState(false);

  const { data: balance } = useReadContract({
    address: OWNERSHIP_TOKEN_ADDRESS,
    abi: ERC721_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const fetchOwnedTokens = async (): Promise<TokenMetadata[]> => {
    if (!address || !GRAPHQL_API) {
      console.log("Missing address or GraphQL API");
      return [];
    }

    setIsLoading(true);
    try {
      const response = await fetch(GRAPHQL_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": API_KEY || "",
        },
        body: JSON.stringify({
          query: `
            query names($ownedBy: [AddressCAIP10!]) {
              names(ownedBy: $ownedBy) {
                items {
                  name
                  tokens {
                    tokenId
                    type
                  }
                }
              }
            }
          `,
          variables: {
            ownedBy: [`eip155:${chain?.id}:${address}`],
          },
        }),
      });

      const data = await response.json();

      if (!data.data?.names?.items) {
        return [];
      }

      const result = data.data.names.items
        .flatMap((item: any) =>
          item.tokens
            .filter((token: any) => token.type === "OWNERSHIP")
            .map((token: any) => ({
              tokenId: BigInt(token.tokenId),
              name: item.name,
              image: null, // Will be populated from metadata if needed
            })),
        )
        .sort(
          (a: TokenMetadata, b: TokenMetadata) =>
            Number(a.tokenId) - Number(b.tokenId),
        );

      return result;
    } catch (error) {
      console.error("Error fetching owned tokens:", error);

      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const { data: ownedTokens = [], isLoading: isQueryLoading } = useQuery({
    queryKey: ["ownedTokens", address],
    queryFn: fetchOwnedTokens,
    enabled: !!address && !!publicClient,
    refetchInterval: 30000, // 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
  });

  return {
    balance: balance ? Number(balance) : 0,
    fetchOwnedTokens,
    ownedTokens,
    isLoading: isLoading || isQueryLoading,
  };
}
