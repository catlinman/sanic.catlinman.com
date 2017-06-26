
# Import Python modules.
import bcrypt

# Import application secret module variables.
from secrets import dbuser
from secrets import dbpass
from secrets import siteuser
from secrets import sitepass

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


async def create_table(engine):
    async with engine.acquire() as conn:
        await conn.execute("DROP TABLE IF EXISTS users")

        await conn.execute("""
            CREATE TABLE users (
                id serial PRIMARY KEY,
                username varchar(255),
                password varchar(60)
            )
        """)


async def go():
    async with create_engine(
        user=dbuser,
        database="catlinman.com",
        host="127.0.0.1",
        password=dbpass
    ) as engine:

        # Make sure that the table exists before continuing.
        await create_table(engine)

        async with engine.acquire() as conn:
            await conn.execute(users.insert().values(
                username=siteuser,
                password=str(bcrypt.hashpw(bytes(sitepass, "utf-8"), bcrypt.gensalt(13)), "utf8")
            ))


def setup():
    loop = asyncio.get_event_loop()
    loop.run_until_complete(go())
