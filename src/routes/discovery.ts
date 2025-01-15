import { Router, Request, Response } from "express";
import { AppDataSource } from "../data";
import { Business } from "../entities/business";
import { BusinessDto } from "./dtos/businessDto";

const discoveryRoute: Router = Router();

discoveryRoute.get("/discovery", async (req: Request, res: Response) => {
    try {
        const { limit = 10, type, lat, long } = req.query;

        // TODO: add validation of params
        // TODO: add some security checks

        const userLimit = parseInt(limit as string, 10);
        const userLat = parseFloat(lat as string);
        const userLon = parseFloat(long as string);

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

    } catch (er) {
        res.status(500).json({ error: `Failed to retrieve businesses: ${er}` });
    }
});

export default discoveryRoute;