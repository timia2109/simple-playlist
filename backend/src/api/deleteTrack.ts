import { RequestHandler } from "express";
import getCollection from "../database/getDatabaseConnection";
import isAdmin from "../isAdmin";

export function deleteTrack(): RequestHandler {
    return async (req, res) => {
        // Only for Admins
        if (!(await isAdmin(req.cookies["userToken"]))) {
            res.sendStatus(401);
            return;
        }

        const collection = await getCollection();
        await collection.updateOne(
            {
                id: req.params["trackId"]
            },
            {
                $set: {
                    banned: true
                }
            }
        );

        res.send({ok: true});
    };
}

export function undeleteTrack(): RequestHandler {
    return async (req,res) => {
        // Only for Admins
        if (!(await isAdmin(req.cookies["userToken"]))) {
            res.sendStatus(401);
            return;
        }

        const collection = await getCollection();
        await collection.updateOne(
            {
                id: req.params["trackId"]
            },
            {
                $set: {
                    banned: false
                }
            }
        );

        res.send({ok: true});
    }
}