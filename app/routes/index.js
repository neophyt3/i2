import { Router } from 'express'

let router = Router()

router.get('/',function(req,res){
	res.send('Hello World!')
});

export default router