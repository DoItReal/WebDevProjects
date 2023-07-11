import mongoose from 'mongoose';

// Sign Config
const SignSchema = new mongoose.Schema({
    bg: { type: String, required: true },
    en: { type: String, required: false },
    de: { type: String, required: false },
    rus: { type: String, required: false },
    allergens: { type: [Number], required: false }
});

export const SignModel = mongoose.model('signs', SignSchema);

// Sign Actions
export const getSigns = () => SignModel.find();
export const getSignById = (id: string) => SignModel.findOne({ '_id' : id });
export const getSignByBG = (bg: string) => SignModel.findOne({ 'bg' : bg });
export const getSignByEN = (en: string) => SignModel.findOne({ 'en' : en });
export const getSignByDE = (de: string) => SignModel.findOne({ 'de' : de });
export const getSignByRUS = (rus: string) => SignModel.findOne({ 'rus' : rus });
export const createSign = (values: Record<string, any>) => new SignModel(values).save().then((sign) => sign.toObject());
export const deleteSignById = (id: string) => SignModel.findOneAndDelete({ _id : id });
export const updateSignById = (id: string, values: Record<string, any>) => SignModel.findByIdAndUpdate(id, values);