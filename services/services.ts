import * as SecureStore from 'expo-secure-store'; // Импорт модуля SecureStore

const testhost = "https://masternode-test.ikarusway.com";
const host = "https://server.ikarusway.com";

class Services {
    async TestGetResource(url: string) {
        const jwtToken = await SecureStore.getItemAsync('jwt_token'); // Получение JWT токена из SecureStore
        if (!jwtToken) {
            throw new Error("JWT токен не найден");
        }

        let res;
        res = await fetch(`${testhost}/${url}`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`, // Добавление JWT токена в заголовок Authorization
            }
        });

        if (!res.ok) {
            throw new Error("Ошибка API");
        }

        return await res.json();
    }

    async GetResource(url: string) {
        const jwtToken = await SecureStore.getItemAsync('jwt_token');
        if (!jwtToken) {
            throw new Error("JWT токен не найден");
        }

        let res;
        res = await fetch(`${host}/${url}`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
            }
        });

        if (!res.ok) {
            throw new Error("Ошибка API");
        }

        return await res.json();
    }

    async PostResource(url: string, body: any) {
        const jwtToken = await SecureStore.getItemAsync('jwt_token');
        if (!jwtToken) {
            throw new Error("JWT токен не найден");
        }

        let res = await fetch(`${host}/${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            throw new Error("Ошибка API");
        }

        return await res.json();
    }
}

export { Services };
