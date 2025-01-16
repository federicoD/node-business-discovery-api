import { Router, Request, Response } from "express";
import { Business } from "../database/entities/business";
import { BusinessDto } from "./dtos/businessDto";
import logger from "../utils/logger";
import { getDataSource } from "../utils/dataSourceProvider";
import { isNullOrUndefinedOrEmptyOrNotNumber, roundToDecimals } from "../utils/utils";

const discoveryRoute: Router = Router();
const defaultLimit: number = 10;

discoveryRoute.get("/discovery", async (req: Request, res: Response) => {
    try {
        const { limit = defaultLimit, type, lat, long } = req.query;

        // TODO: we can add more validation (like min and max for lat and long)
        if (isNullOrUndefinedOrEmptyOrNotNumber(lat) || isNullOrUndefinedOrEmptyOrNotNumber(long)) {
            // TODO: the error is not logged by morgan?
            res.status(400).json({ error: "lat and long are required and must be coordinates" });
            return;
        }

        var userLimit = parseInt(limit as string, 10);
        const userLat = parseFloat(lat as string);
        const userLon = parseFloat(long as string);

        if (userLimit < 0 || userLimit > 100) {
            userLimit = defaultLimit;
        }

        // TODO: we should use an enum
        if (type && type !== "restaurant" && type !== "coffee") {
            // TODO: the error is not logged by morgan?
            res.status(400).json({ error: 'type is not valid' });
            return;
        }

        // Query using Haversine formula
        const query = getDataSource().getRepository(Business)
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
            latitude: business.business_latitude,
            longitude: business.business_longitude,
            type: business.business_type,
            distance: roundToDecimals(business.distance, 6), // round to meter
        }));

        res.json(mappedBusinesses);

    } catch (error) {
        // TODO: log/return error only for debug?
        logger.error(`Failed to retrieve businesses: ${error}`);
        res.status(500).json({ error: `Failed to retrieve businesses: ${error}` });
    }
});

export default discoveryRoute;