import os, httpx

class AuthHTTPClient:
    def __init__(self):
        self.base_url = os.getenv("AUTH_SERVICE_URL") + "/api/auth"

    async def get(self, path, token, params=None):
        async with httpx.AsyncClient() as client:
            return await client.get(
                self.base_url + path,
                headers={"Authorization": f"Bearer {token}"},
                params=params,
            )

    async def patch(self, path, token, json):
        async with httpx.AsyncClient() as client:
            return await client.patch(
                self.base_url + path,
                headers={"Authorization": f"Bearer {token}"},
                json=json,
            )
