import express from 'express';
import mongoose from 'mongoose';
import { deleteSignById, getSigns, getSignByBG, createSign, getSignById } from '../db/signs';

export const getAllSigns = async (req: express.Request, res: express.Response) => {
    try {
        const signs = await getSigns();

        return res.status(200).json(signs);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getSignByID = async (req: express.Request, res: express.Response) => {
    try {
	const { id } = req.params;
	
	const getSign = await getSignById(id);

	return res.json(getSign);
    } catch (error) {
	console.log(error);
	return res.sendStatus(400);
    }

}

export const deleteSign = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const deletedSign = await deleteSignById(id);

        return res.json(deletedSign);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateSign = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { bg } = req.body;
	const { en } = req.body;
	const { de } = req.body;
	const { rus } = req.body;
	const { allergens } = req.body;

        if (!bg) {
            return res.sendStatus(400);
        }

        const sign = await getSignById(id);
        sign.bg = bg;
	sign.en = en;
	sign.de = de;
	sign.rus = rus;
	sign.allergens = allergens;
        await sign.save();

        return res.status(200).json(sign).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
export const CreateSign = async (req: express.Request, res: express.Response) => {
    try {
        const { bg, en, de, rus, allergens } = req.body;

        if (!bg ) {
            return res.sendStatus(400);
        }
        
        const existingSign = await getSignByBG(bg);

        if (existingSign) {
            return res.sendStatus(400);
        }
        
        const sign = await createSign({
            bg,
            en,
            de,
            rus,
            allergens
        });
        return res.status(200).json(sign).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}


