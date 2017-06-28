
# Import Python modules.
import bcrypt

# Import application secret module.
import secrets

# Import Async PostgresSQL engine.
import asyncio
from aiopg.sa import create_engine

# Import SQLAlchemy.
import sqlalchemy as sa

metadata = sa.MetaData()

users = sa.Table(
    "users",
    metadata,
    sa.Column("id", sa.Integer, primary_key=True),
    sa.Column("username", sa.String(255), nullable=False),
    sa.Column("password", sa.String(60), nullable=False)
)


async def create_tables(engine):
    async with engine.acquire() as conn:
        await conn.execute("DROP TABLE IF EXISTS users")

        await conn.execute(sa.schema.CreateTable(users))


async def go():
    async with create_engine(
        user=secrets.dbuser,
        database="catlinman.com",
        host="127.0.0.1",
        password=secrets.dbpass
    ) as engine:

        # Make sure that the table exists before continuing.
        await create_tables(engine)

        async with engine.acquire() as conn:
            await conn.execute(users.insert().values(
                username=secrets.siteuser,
                password=str(bcrypt.hashpw(bytes(secrets.sitepass, "utf-8"), bcrypt.gensalt(13)), "utf8")
            ))


def setup():
    loop = asyncio.get_event_loop()
    loop.run_until_complete(go())
