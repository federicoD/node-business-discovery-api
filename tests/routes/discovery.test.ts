import app from "../../src/app";
import request from "supertest";
import { getDataSource } from "../../src/utils/dataSourceProvider";
import { TestDataSource } from "../../src/database/dataSource.test";
import { Business } from "../../src/database/entities/business";

jest.mock("../../src/utils/dataSourceProvider", () => ({
    getDataSource: jest.fn(),
}));

describe("/api/discovery", () => {
    describe("GET", () => {

        describe("200 - OK", () => {
            beforeAll(async () => {
                const mockedGetDataSource = jest.mocked(getDataSource);
                // always return TestDataSource independently from the env file
                mockedGetDataSource.mockReturnValue(TestDataSource);
                await TestDataSource.initialize();
            });
    
            afterAll(async () => {
                await TestDataSource.destroy();
            });
    
            it("Returns valid data", async () => {
                const repo = TestDataSource.getRepository(Business);
                
                // add fake data
                await repo.save({
                    name: "Central Perk",
                    latitude: 38.8976,
                    longitude: -77.0366,
                    type: "restaurant",
                });
                
                const response = await request(app)
                    .get("/api/discovery")
                    .query({ lat: 39.9496, long: -75.1503 })
                    .expect(200);
                    
                expect(response.body).toEqual([
                    {
                        distance: 199.830229,
                        name: "Central Perk",
                        latitude: 38.8976,
                        longitude: -77.0366,
                        type: "restaurant",
                    }
                ]);;
            });

            it("Returns only 2 coffee when limit and type are set ", async () => {
                const repo = TestDataSource.getRepository(Business);
                
                // add fake data
                await repo.save({ name: "Central Coffee", latitude: 38.897600, longitude: -77.036600, type: "coffee" });
                await repo.save({ name: "Pasta & Mandolino", latitude: 38.897601, longitude: -77.036601, type: "restaurant" });
                await repo.save({ name: "Bad Coffee Place", latitude: 38.897602, longitude: -77.036602, type: "coffee" });
                
                const response = await request(app)
                    .get("/api/discovery")
                    .query({ lat: 38.897602, long: -77.036602, type: "coffee" })
                    .expect(200);
                    
                expect(response.body).toEqual([
                    { name: "Bad Coffee Place", latitude: 38.897602, longitude: -77.036602, type: "coffee", distance: 0 },
                    { name: "Central Coffee", latitude: 38.897600, longitude: -77.036600, type: "coffee", distance: 0.000269 }
                ]);;
            });
        });

        describe("400 - BAD_REQUEST", () => {
            it("Returns 400 when none of the mandatory params are passed", async () => {
                const response = await request(app).get("/api/discovery").query({}).expect(400);
                expect(response.body).toEqual(
                    {"error": "lat and long are required and must be coordinates"}
                );
            });

            it("Returns 400 when some of the mandatory params are not passed", async () => {
                const response = await request(app)
                    .get("/api/discovery")
                    .query({ lat: 1 })
                    .expect(400);
                    expect(response.body).toEqual(
                        {"error": "lat and long are required and must be coordinates"}
                    );
            });

            it("Returns 400 when type is wrong", async () => {
                const response = await request(app)
                    .get("/api/discovery")
                    .query({ lat: 1, long: 1, type: "test" })
                    .expect(400);

                expect(response.body).toEqual(
                    {"error": "type is not valid"}
                );

            });
        });
    });
});