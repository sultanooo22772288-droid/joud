module.exports=async function handler(req,res){
  return res.status(410).json({error:'This temporary migration endpoint has been disabled.'});
};