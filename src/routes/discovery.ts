import { Router, Request, Response } from "express";
import { AppDataSource } from "../database/dataSource";
import { Business } from "../database/entities/business";
import { BusinessDto } from "./dtos/businessDto";

const discoveryRoute: Router = Router();
const defaultLimit: number = 10;

discoveryRoute.get("/discovery", async (req: Request, res: Response) => {
    try {
        const { limit = defaultLimit, type, lat, long } = req.query;

        // TODO: we can add more validation (like min and max for lat and long)
        if (!lat || !long) {
            res.status(400).json({ error: 'lat and long are required' });
        }

        var userLimit = parseInt(limit as string, 10);
        const userLat = parseFloat(lat as string);
        const userLon = parseFloat(long as string);

        if (userLimit < 0 || userLimit > 100) {
            userLimit = defaultLimit;
        }

        // TODO: we should use an enum
        if (type && type != "restaurant" && type != "coffee") {
            res.status(400).json({ error: 'type is not valid' });
        }

        // Construct the query with the Haversine formula
        const query = AppDataSource.getRepository(Business)
            .createQueryBuilder("business")
            .select([
                "business.id",
                "business.name",
                "business.latitude",
                "business.longitude",
                "business.type",
                `(
            6371 * acos(
              cos(radians(:latitude)) *
              cos(radians(business.latitude)) *
              cos(radians(business.longitude) - radians(:longitude)) +
              sin(radians(:latitude)) *
              sin(radians(business.latitude))
            )
          ) AS distance`,
            ])
            .addSelect("business.id", "id")
            .addSelect("business.name", "name")
            .addSelect("business.latitude", "latitude")
            .addSelect("business.longitude", "longitude")
            .addSelect("business.type", "type")
            .setParameters({
                latitude: userLat,
                longitude: userLon,
            });

        if (type) {
            query.andWhere("business.type = :type", { type });
        }

        const businesses = await query
            .orderBy("distance", "ASC")
            .take(userLimit)
            .getRawMany();

        const mappedBusinesses: BusinessDto[] = businesses.map((business: any) => ({
            name: business.business_name,
            latitude: parseFloat(business.business_latitude),
            longitude: parseFloat(business.business_longitude),
            type: business.business_type,
            distance: parseFloat(business.distance),
        }));

        res.json(mappedBusinesses);

    } catch (error) {
        // TODO: return error only for debug?
        res.status(500).json({ error: `Failed to retrieve businesses: ${error}` });
    }
});

export default discoveryRoute;