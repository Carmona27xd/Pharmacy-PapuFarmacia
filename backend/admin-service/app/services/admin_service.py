import os
import httpx
from fastapi import HTTPException
from app.schemas.user import User
from app.services.http_client import AuthHTTPClient


class AdminService:
    def __init__(self):
        self.client = AuthHTTPClient()

    async def list_users(self, token: str, limit: int, offset: int):
        response = await self.client.get(
            "/users",
            token=token,
            params={"limit": limit, "offset": offset},
        )
        return [User(**u) for u in response.json()]

    async def ban_user(self, token: str, user_id: int):
        return await self._update_user(token, user_id, False)

    async def unban_user(self, token: str, user_id: int):
        return await self._update_user(token, user_id, True)

    async def _update_user(self, token, user_id, active):
        response = await self.client.patch(
            f"/users/{user_id}",
            token=token,
            json={"is_active": active},
        )

        print("AUTH STATUS:", response.status_code)
        print("AUTH BODY:", response.text)

        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="User not found")

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.text
            )

        return User(**response.json())


