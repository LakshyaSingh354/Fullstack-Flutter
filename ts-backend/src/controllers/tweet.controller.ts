import { Request, Response } from "express";
import { getTweetRepo, createTweetRepo, deleteTweetRepo, updateTweetRepo } from "../repositories/tweet.repository";
import { ITweetInterface } from "../database/interfaces/tweet.interface";
import { updateUserWithDeleteTweetIdRepo, updateUserWithTweetIdRepo } from "../repositories/user.repository";

export const getTweetController = async (req: Request, res: Response) => {
    const tweetId = req.params.tweetId as string;

    try {
        const tweet = await getTweetRepo(tweetId);
        if (tweet) {
            res.status(200).json({"data": tweet});
        } else {
            res.status(500).json({"message": "Tweet not found"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({"error": error})
    }
}

export const createTweetController = async (req: Request, res: Response) => {
    const tweet : ITweetInterface = req.body;

    try {
        const success = await createTweetRepo(tweet);
        if (success) {
            const updateSuccess = await updateUserWithTweetIdRepo(tweet.adminId, tweet.tweetId);
            if (updateSuccess) {
                res.status(200).json({"data": tweet});
            } else {
                res.status(500).json({"message": "User not updated"});
            }
        } else {
            res.status(500).json({"message": "Tweet not created"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({"error": error})
    }
}

export const updateTweetController = async (req: Request, res: Response) => {
    const updatedTweet : ITweetInterface = req.body;

    try {
        const tweet = await updateTweetRepo(updatedTweet.tweetId, updatedTweet);
        if (tweet) {
            res.status(200).json({"data": "Tweet updated"});
        } else {
            res.status(500).json({"message": "Tweet not updated"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({"error": error})
    }
}

export const deleteTweetController = async (req: Request, res: Response) => {
    const tweetId = req.params.tweetId as string;
    try {
        const tweet = await deleteTweetRepo(tweetId);
        if (tweet.status) {
            const updateSuccess = await updateUserWithDeleteTweetIdRepo(tweet.adminId, tweetId);
            if (updateSuccess) {
                res.status(200).json({"data": "Tweet deleted"});
            } else {
                res.status(500).json({"message": "User not updated"});
            }
        } else {
            res.status(500).json({"message": "Tweet not deleted"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({"error": error})
    }
}