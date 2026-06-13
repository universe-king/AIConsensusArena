"use client";

import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

export const CONTRACT_ADDRESS =
    "0x2c9cA65D1F8c1feEd9161419D14d5Ae66F8e7bE0";
/*"0xe9ac65AaD83b6962ab036D2C4F581e7a3328a89D";*/

let client = null;

async function restoreClient() {
    if (client) {
        return client;
    }

    const provider =
        window.ethereum ||
        window.genlayer;

    if (!provider) {
        throw new Error(
            "Wallet not found"
        );
    }

    const accounts =
        await provider.request({
            method: "eth_accounts",
        });

    if (!accounts.length) {
        throw new Error(
            "Wallet not connected"
        );
    }

    client = createClient({
        chain: studionet,
        account: accounts[0],
        provider,
    });

    return client;
}

export async function connectWallet() {
    const provider =
        window.ethereum ||
        window.genlayer;

    if (!provider) {
        throw new Error(
            "Wallet not found"
        );
    }

    const accounts =
        await provider.request({
            method: "eth_requestAccounts",
        });

    client = createClient({
        chain: studionet,
        account: accounts[0],
        provider,
    });

    return {
        address: accounts[0],
        client,
    };
}

export async function getClient() {
    return await restoreClient();
}

export async function getTopics() {
    const client =
        await getClient();

    const data =
        await client.readContract({
            address: CONTRACT_ADDRESS,
            functionName: "get_topics",
            stateStatus: "accepted",
        });

    console.log(
        "TOPICS FULL:",
        JSON.stringify(data, null, 2)
    );

    return data;
}

export async function generateRound() {
    const client =
        await getClient();

    return await client.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: "generate_round",
        args: [],
    });
}

export async function vote(
    topicId,
    choice,
    reason
) {
    const client =
        await getClient();

    return await client.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: "vote",
        args: [
            topicId,
            choice,
            reason,
        ],
    });
}

export async function resolveTopic(
    topicId
) {
    const client =
        await getClient();

    return await client.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: "resolve_topic",
        args: [topicId],
    });
}

export async function getTopicVotes(
    topicId
) {
    const client =
        await getClient();

    return await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName:
            "get_topic_votes",
        args: [topicId],
        stateStatus: "accepted",
    });
}

export async function getUserScore(
    address
) {
    const client =
        await getClient();

    return await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName:
            "get_user_score",
        args: [address],
        stateStatus: "accepted",
    });
}
export async function getLeaderboard() {
    const client =
        await getClient();

    return await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName:
            "get_leaderboard",
        stateStatus: "accepted",
    });
}
export async function getPlatformStats() {
    const client =
        await getClient();

    return await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName:
            "get_platform_stats",
        stateStatus: "accepted",
    });
}