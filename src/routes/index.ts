import { Router, Request, Response } from "express";
import { Business } from "../entities/business";
// import { AppDataSource } from "../entities"
import { getRepository } from "typeorm";

const router: Router = Router();

// Get all businesses
router.get("/businesses", async (req: Request, res: Response) => {
  try {
    const businessRepository = getRepository(Business);
    const { page = 1, limit = 10, type } = req.query;

    // Parse query parameters
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);

    // Build query with optional filtering by type
    const query = businessRepository.createQueryBuilder("business");

    if (type) {
      query.where("business.type = :type", { type });
    }

    // Pagination
    const [businesses, total] = await query
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    // Response with pagination metadata
    res.json({
      total,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
      data: businesses,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve businesses" });
  }
});

export default router;