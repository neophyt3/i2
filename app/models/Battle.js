import BattleSchema from './../schemas/Battle';
import mongoose from 'mongoose';

const Battle = mongoose.model('Battle', BattleSchema, 'battles');

export default Battle