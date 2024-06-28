const host="https://masternode-test.ikarusway.com"
class Services{
    async GetResource(url:string){
        let res
        res=await fetch(`${host}/${url}`)
        if (!res.ok){
            throw new Error(" ошибка API")
        }
        return await res.json();
    }
}

export {Services}
