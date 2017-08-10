import mongoose from 'mongoose'
import Battle from './../models/Battle'
import Promise from 'bluebird'

export default new (class IndexController{
    constructor() { }

    async getBattlesList(req, res, next){
        try{
            const battles = await Battle.distinct('location')
            return res.json({
                data:{
                    battles
                }
            })
        }catch(err){
            next(err)
        }
    }

    async getBattlesCount(req, res, next){
        try{
            const count = await Battle.find({attacker_outcome: { $exists: true}}).count()
            return res.json({
                data:{
                    count
                }
            })
        }catch(err){
            next(err)
        }
    }

    async getBattleStat(req, res, next){
        try{
            const activeBattle = Battle.find()
                                        .limit(1)
                                        .sort({$natural:-1})
                                        .select('attacker_king defender_king region name')
                                        .exec()
                                        .then(res => res.length > 0 ? res[0] : {})

            const attackerOutcomeStat = Battle.aggregate([
                                            {
                                                $match: {
                                                    attacker_outcome: {
                                                        $exists : true
                                                    }
                                                }
                                            },
                                            {
                                                $group: { 
                                                    _id: "$attacker_outcome", 
                                                    count: { 
                                                        $sum: 1.0 
                                                    } 
                                                }
                                            }
                                        ]).then((res) => {
                                            return {
                                                'win': res.filter(item => item._id == "win").map(item => item.count).pop(),
                                                'loss': res.filter(item => item._id == "loss").map(item => item.count).pop()
                                            }
                                        })
            
            const uniqueBattleType = Battle.distinct('location')
            
            const defenderSizeStat = Battle.aggregate([
                                        {
                                            $group: {
                                                _id: "_id",
                                                avg: { $avg: "$defender_size" },
                                                min: { $min: "$defender_size" },
                                                max: { $max: "$defender_size" },
                                            }
                                        }
                                    ]).then((res) => {
                                        return res.length > 0 ? res[0] : {}
                                    })
            
            const result = await Promise.all([activeBattle,attackerOutcomeStat,uniqueBattleType,defenderSizeStat])
            
            res.json({
                data:{
                    most_active: result[0],
                    attacker_outcome:result[1],
                    battle_type:result[2],
                    defender_size:result[3]        
                }
            })

        }catch(err){
            next(err)
        }
    }

    async searchBattles(req, res, next){

        const searchCriteria = {}

        if('king' in req.query && req.quer.king.length > 0){
            searchCriteria['$or'] = [
                {'attacker_king' : req.query.king},
                {'defender_king' : req.query.king}
            ]
        }

        if('location' in req.query && req.query.location.length > 0){
            searchCriteria['location'] = req.query.location
        }

        if('type' in req.query && req.query.type.length > 0){
            searchCriteria['battle_type'] = req.query.type
        }

        try{
            const battles = await Battle.find(searchCriteria)
            return res.json({
                data:{
                    battles
                }
            })
        }
        catch(err){
            next(err)
        }
    }
})