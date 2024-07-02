const testhost="https://masternode-test.ikarusway.com"
const host="https://server.ikarusway.com"
class Services{
    async TestGetResource(url:string){
        let res
        res=await fetch(`${testhost}/${url}`)
        if (!res.ok){
            throw new Error(" ошибка API")
        }
        return await res.json();
    }
    async GetResource(url:string){
        let res
        res=await fetch(`${host}/${url}`)
        if (!res.ok){
            throw new Error(" ошибка API")
        }
        return await res.json();
    }
    async PostResource(url:string,body:any){
        let res=await fetch(`${host}/${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:body,
        });
        if (!res.ok){
            throw new Error("ошибка API")
        }
        return await res.json()
    }
}

export {Services}
