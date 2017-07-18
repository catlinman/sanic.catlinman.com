
# Import Python modules.
import json

# Import and setup this blueprint.
from sanic import Blueprint, response

# Import SQLAlchemy modules.
from sqlalchemy import desc

# Import the database connection.
import database

location = Blueprint("location")


@location.route("/location", methods=["GET"])
async def location_all_json(request):
    # On GET requests return a all location data.
    if request.method == "GET":
        # Query the database and get all locations.
        result = database.db_session.query(database.Location).order_by(desc(database.Location.date)).all()

        # Handle the result if it was found.
        if result:
            # Create the GEOJSON formatting.
            data = {
                "type": "FeatureCollection",
                "features": []
            }

            first = True
            for location in result:
                data["features"].append({
                    "type": "Feature",
                    "properties": {
                        "title": location.title,
                        "date": location.date.strftime("%Y-%m-%d %H:%M:%S"),
                        "checkin": location.checkin,
                        "newest": first
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            location.x,
                            location.y
                        ]
                    }
                })

                first = False

            # Return the JSON.
            return response.json(data)

        else:
            return response.json(
                {"message": "PSA entry not found!"},
                status=404
            )
