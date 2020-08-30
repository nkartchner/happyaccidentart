import express, { Application, Request, Response } from "express";
import path from "path";
import cors from "cors";
import Db from "mongodb";
import { config } from "dotenv";
config();
const DB_NAME = process.env.MONGO_CLIENT_DB;
const uri = `mongodb+srv://new-user_31:${process.env.MONGO_CLIENT_PW}@cluster0.lgbqd.gcp.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
const client = new Db.MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

client.connect();

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../../client/build")));
app.use(cors());
app.get("/api/users", async (_req: Request, res: Response) => {
    const Users = client.db().collection("users");
    try {
        const users = await Users.find({}).toArray();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json(error);
    }
});
app.get("/api/workshops", async (_req: Request, res: Response) => {
    const Workshops = client.db().collection("workshops");
    try {
        const workshops = await Workshops.aggregate([
            {
                $lookup: {
                    from: "locations",
                    localField: "locationId",
                    foreignField: "_id",
                    as: "location",
                },
            },
        ])
            .toArray()
            .then(r => r.map(e => ({ ...e, location: e.location[0] })));
        console.log(workshops);
        return res.status(200).json(workshops);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});
const p = path.join(__dirname, "../../client", "build", "index.html");
console.log(p);
app.get("/", (_req, res) => res.sendFile(p));

app.listen(8081, () => console.log("Server is running on port 8081"));
