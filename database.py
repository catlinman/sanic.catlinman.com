
# Import Python modules.
import os
import shutil
import time
import platform
from datetime import datetime
import bcrypt
import binascii

# Import SQLAlchemy modules.
from sqlalchemy import create_engine, Column, DateTime, Integer, Float, Boolean, String, func
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Prepare the declarative base.
Base = declarative_base()

# Path to the database file.
DBPATH = "./db"
DBFILE = "catlinman.com.db"


def safe_filename(string):
    '''
    Convert a string into one without illegal characters for the given filesystem.
    Args:
        string (str): the path to remove illegal characters from.
    Returns:
        new path string without illegal characters.
    '''

    string = string.replace('/', '&').replace('\\', '')

    if platform.system() is "Windows":
        string = re.sub('[":*?<>|]', "", string)

    return string


def unique_id():
    '''
    Generates a Unique ID.
    '''

    return hex(int(time.time() * 10000000))[2:]


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    unique_id = Column(String, default=unique_id(), nullable=False, unique=True)
    username = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    template_password = Column(Boolean, default=True, nullable=False)
    administrator = Column(Boolean, default=False, nullable=False)
    create_on = Column(DateTime, default=func.now(), nullable=False)


class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True)
    unique_id = Column(String, default=unique_id(), nullable=False, unique=True)
    user_id = Column(String, nullable=False, unique=True)
    title = Column(String)
    opening_md = Column(String)
    opening_html = Column(String)
    content_md = Column(String)
    content_html = Column(String)
    create_on = Column(DateTime, default=func.now(), nullable=False)
    edit_on = Column(DateTime, default=func.now(), nullable=False)


class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True)
    unique_id = Column(String, nullable=False, unique=True)
    title = Column(String)
    content = Column(String)
    date = Column(DateTime)


class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True)
    unique_id = Column(String, default=unique_id(), nullable=False, unique=True)
    title = Column(String)
    date = Column(DateTime)


class PSA(Base):
    __tablename__ = "psas"
    id = Column(Integer, primary_key=True)
    content = Column(String, nullable=False, unique=True)
    author = Column(String, nullable=False)
    create_on = Column(DateTime, default=func.now(), nullable=False)


class Location(Base):
    __tablename__ = "locations"
    id = Column(Integer, primary_key=True)
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    area = Column(String, default="", nullable=False)
    country = Column(String, default="", nullable=False)
    date = Column(DateTime, default=func.now(), nullable=False)


# Make the engine connection.
engine = create_engine("sqlite:///{}/{}".format(DBPATH, DBFILE), convert_unicode=True)

# Start a scoped session.
db_session = scoped_session(
    sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine
    )
)


def setup():
    if not os.path.exists(DBPATH):
        os.makedirs(DBPATH)

    # Get the database filepath.
    filepath = safe_filename("{}/{}".format(DBPATH, DBFILE))

    # Backup the old database if it exists.
    if os.path.isfile(filepath):
        file_name, file_extension = os.path.splitext(filepath)

        # Copy the old file to the backup timestamped file.
        shutil.copyfile(
            filepath,
            "{}-{}{}".format(
                file_name,
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                file_extension
            )
        )

    # Clear already set tables.
    db_session.execute("DROP TABLE IF EXISTS users")
    db_session.execute("DROP TABLE IF EXISTS psas")
    db_session.execute("DROP TABLE IF EXISTS locations")

    # Recreate tables.
    Base.metadata.create_all(engine)

    # Predefined PSAs that ship with the default setup.
    psa_data = [
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
        ["What happens if you hover this text long enough?", "Catlinman"],
        ["Connoisseur of waveforms.", "Catlinman"],
        ["Expert audio spectrum handler.", "Catlinman"],
        ["Verified scrobbler.", "Catlinman"],
        ["Trades in scrobbles for prizes.", "Catlinman"],
        ["You define who I am.", "Catlinman"],
        ["Running on port 24070.", "Catlinman"],
        ["I can design that.", "Catlinman"],
        ["I once heard CSS was a programming language.", "Catlinman"],
        ["Always pushing the limit.", "Catlinman"],
        ["Speaks a few languages other than this one.", "Catlinman"],
        ["Diese Nachricht ist in Deutsch. Frag nicht warum.", "Catlinman"],
        ["Always hopeful for a good internet connection.", "Catlinman"],
        ["Survivor of 3000+ ms ping.", "Catlinman"],
        ["Let's get trending on these tables.", "Catlinman"],
        ["You can always count on a layer party in my files.", "Catlinman"],
        ["Puts C# on a résumés.", "Catlinman"],
        ["Running on nekodrop.com", "Catlinman"],
    ]

    # Insert the shipping PSAs into the database.
    for message in psa_data:
        db_session.add(
            PSA(
                content=message[0],
                author=message[1]
            )
        )

    location_data = [
        [8.25, 53.55, "Butjadingen", "Germany", "Jun 18 2017"],
        [7.55, 50.36, "Koblenz", "Germany", "Jul 20 2017"]
    ]

    # Insert the shipping locations into the database.
    for location in location_data:
        db_session.add(
            Location(
                x=location[0],
                y=location[1],
                area=location[2],
                country=location[3],
                date=datetime.strptime(location[4], "%b %d %Y")
            )
        )

    # Create a temporary administrator password.
    password = binascii.hexlify(os.urandom(16)).decode("utf-8")

    # Create and insert the administrator.
    admin = User(
        username="administrator",
        password=str(bcrypt.hashpw(bytes(password, "utf-8"), bcrypt.gensalt(13)), "utf8"),
        administrator=True
    )

    # Add the user to the database.
    db_session.add(admin)

    # Commit the changes.
    db_session.commit()

    print("Successfully created database configuration. The password for the base user 'administrator' is: '{}'.".format(password))
