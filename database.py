
# Import Python modules.
import os
import shutil
from datetime import datetime
import bcrypt

# Import application secret module.
import secrets

# Import SQLAlchemy modules.
from sqlalchemy import create_engine, Column, DateTime, Integer, Boolean, String, func
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Prepare the declarative base.
Base = declarative_base()

# Path to the database file.
DATABASE = './db/catlinman.com.db'

# Create database models.


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    administrator = Column(Boolean, nullable=False)
    create_on = Column(DateTime, default=func.now())


class PSA(Base):
    __tablename__ = "psas"
    id = Column(Integer, primary_key=True)
    content = Column(String, nullable=False, unique=True)
    author = Column(String, nullable=False)
    create_on = Column(DateTime, default=func.now())


# Make the engine connection.
engine = create_engine("sqlite:///{}".format(DATABASE), convert_unicode=True)

# Start a scoped session.
db_session = scoped_session(
    sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine
    )
)


def setup():
    # Backup the old database if it exists.
    if os.path.isfile(DATABASE):
        file_name, file_extension = os.path.splitext(DATABASE)

        # Copy the old file to the backup timestamped file.
        shutil.copyfile(
            DATABASE,
            "{}-{}{}".format(
                file_name,
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                file_extension
            )
        )

    # Clear already set tables.
    db_session.execute("DROP TABLE IF EXISTS users")
    db_session.execute("DROP TABLE IF EXISTS psas")

    # Recreate tables.
    Base.metadata.create_all(engine)

    # Predefined PSAs that ship with the default setup.
    psa_messages = [
        ["I made a game once.", "Catlinman"],
        ["Your humble fishstick and fiendlord.", "Catlinman"],
        ["Professional button presser.", "Catlinman"],
        ["I'm alright at video games.", "Catlinman"],
        ["Javascript is disabled. Right?", "Catlinman"],
        ["Pngyvazna in ROT13!", "Trif"],
        ["Meister of the Kugelscreibers.", "Trif"],
        ["Half my code is for calculators!", "Trif"],
        ["100% photoshoppable.", "Trif"],
        ["My hand is a printer!", "Trif"],
        ["Exception: sleep() returned null", "Trif"],
        ["500% more particles than our competitors!", "Trif"],
        ["Probably not a robot.", "Trif"],
        ["Favourite hat is a melon.", "Jan Dolanský"],
        ["I come with lots of *pats*.", "Jan Dolanský"],
        ["My name is Cat but you can call me any time.", "Jan Dolanský"],
        ["Isn't a cat actually.", "Jan Dolanský"],
        ["I will break your game.", "Jan Dolanský"],
        ["Internet professional.", "Jan Dolanský"],
        ["Gotta go fast like this website.", "Jan Dolanský"],
        ["This page is served as HTML. Fascinating.", "Jan Dolanský"],
        ["*tap tap tap*", "Jan Dolanský"],
        ["No HTML, CSS or JS. Only Bash. Apex of web design.", "Jan Dolanský"],
        ["Friends write these messages for me.", "Jan Dolanský"],
        ["Can basically do anything. Mostly confirmed.", "Jan Dolanský"],
        ["Content aware scale ethusiast.", "Jan Dolanský"],
        ["TOP 10 in 'Riding Club Championships'.", "Jan Dolanský"],
        ["Mostly safe for work.", "Catlinman"],
        ["The only truly certified sandshark!", "Mixilaxi"],
        ["You should see my other projects.", "Catlinman"],
        ["Uses MS Paint if required.", "Catlinman"],
        ["Fresh from the north coast.", "Catlinman"],
        ["The black wind howls...", "Catlinman"],
        ["Radical dreamer.", "Catlinman"],
        ["Dreaming of a shore bordering another world.", "Catlinman"],
        ["Tornado spinning all day long.", "Catlinman"],
        ["Your personal support for everything.", "Catlinman"],
        ["This page is written in Python.", "Catlinman"],
        ["Forgets to keep up commit streaks.", "Catlinman"],
        ["Writes programs you didn't think you needed.", "Catlinman"],
        ["There's a script for that.", "Catlinman"],
        ["Coming up with messages like this one is hard.", "Catlinman"],
        ["Buy my mixtape.", "Chantaro"],
        ["Relatable until marriage.", "Chantaro"],
        ["Rated 9 out of 7 for some reason.", "Chantaro"],
        ["Don't read this. Oh come on.", "Chantaro"],
        ["This is a girls only zone.", "Chantaro"],
        ["Wanna buy some fresh home grown memes?", "Chantaro"],
        ["*insert message here*", "Chantaro"],
        ["H0w do 1 pr0gr4m", "Chantaro"],
        ["Proud knight of the holy watermelon.", "Kagedreng"],
        ["About to kugelschreiber your wunderbar.", "Kagedreng"],
        ["The hero that just happened to be.", "Kagedreng"],
        ["Your personal bæ.", "Kagedreng"],
        ["Requires more RAM. Download more RAM.", "Kagedreng"],
        ["Master exploiter of games all around.", "Kagedreng"],
        ["How did you get here?", "Kagedreng"],
        ["NO TIME TO EXPLAIN JUST HOVER THIS TEXT.", "Kagedreng"],
        ["May have lost the game once or twice.", "Kagedreng"],
        ["What happens if you hover this text long enough?", "Catlinman"]
    ]

    # Insert the shipping PSAs into the database.
    for message in psa_messages:
        db_session.add(
            PSA(
                content=message[0],
                author=message[1]
            )
        )

    # Create and insert the administrator.
    admin = User(
        username=secrets.siteuser,
        password=str(bcrypt.hashpw(bytes(secrets.sitepass, "utf-8"), bcrypt.gensalt(13)), "utf8"),
        administrator=True
    )

    # Add the user to the database.
    db_session.add(admin)

    # Commit the changes.
    db_session.commit()
