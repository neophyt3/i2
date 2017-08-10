import { Router } from 'express'
import IndexController from './../controllers/'

let router = Router()

router.get('/list', IndexController.getBattlesList)

router.get('/count', IndexController.getBattlesCount)

router.get('/stat', IndexController.getBattleStat)

router.get('/search', IndexController.searchBattles)


export default router