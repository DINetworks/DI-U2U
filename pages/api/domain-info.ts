import type { NextApiRequest, NextApiResponse } from "next";

import { CONTRACT_ADDRESSES } from "@/config/web3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { tokenIds } = req.body;

  if (!tokenIds || !Array.isArray(tokenIds)) {
    return res.status(400).json({ error: "tokenIds array is required" });
  }

  try {
    const instancePromises = tokenIds.map(async (tokenId: string) => {
      try {
        const instanceResponse = await fetch(
          `${process.env.NEXT_PUBLIC_METADATA_API}/${CONTRACT_ADDRESSES.OWNERSHIP_TOKEN}/instances/${tokenId}`,
        );

        if (instanceResponse.ok) {
          const instanceData = await instanceResponse.json();

          return {
            id: tokenId,
            name: instanceData.metadata?.name || "",
            image: instanceData.metadata?.image || "",
          };
        }
      } catch (_error) {
        // Return placeholder on error
      }

      return { id: tokenId, name: "", image: "" };
    });

    const filteredInstances = await Promise.all(instancePromises);

    res.status(200).json({ domainInfos: filteredInstances });
  } catch (_error) {
    res.status(500).json({ error: "Failed to fetch domain info" });
  }
}
