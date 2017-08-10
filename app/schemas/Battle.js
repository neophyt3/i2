import { Schema } from 'mongoose'

const BattleSchema = new Schema({

	name: { type: String, required: true, trim: true },
    
    year: { type: Number },

    battle_num: { type: Number },

    attacker_king: { type: String },

    defender_king: { type: String },

    attacker: { type: [String] },

    defender: { type: [String] },

    attacker_outcome: { type: String },

    battle_type: { type: String },

    major_death: { type: Number },
    
    major_capture: { type: Number },

    attacker_size: { type: Number },

    defender_size: { type: Number },

    attacker_commander: { type: [String] },

    defender_commander: { type: [String] },

    summer: { type: Number },

    location: { type: String },

    region: { type: String },

    note: { type: String }
},
{
    timestamps: true
});

BattleSchema.index({name: 'text'})

export default BattleSchema;
