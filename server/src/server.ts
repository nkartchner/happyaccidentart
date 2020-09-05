import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors";
import { config } from "dotenv";
import {
    Sequelize,
    Model,
    DataTypes,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    Association,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    Optional,
    HasOneGetAssociationMixin,
    HasOneCreateAssociationMixin,
    HasOneSetAssociationMixin,
} from "sequelize";

config();

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "../db.sqlite"),
});

interface AddressAttributes {
    address: string;
}

class Address extends Model<AddressAttributes> implements AddressAttributes {
    public address!: string;
}

interface WorkshopAttributes {
    id: number;
    desc: string;
    coverImage: string;
    title: string;
    capacity: number;
    isOnline: boolean;
}

interface WorkshopCreationAttributes
    extends Optional<WorkshopAttributes, "id"> {}

class Workshop
    extends Model<WorkshopAttributes, WorkshopCreationAttributes>
    implements WorkshopAttributes {
    public id!: number;
    public desc!: string;
    public coverImage!: string;
    public title!: string;
    public capacity!: number;
    public isOnline!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public getAddress!: HasOneGetAssociationMixin<Address>;
    public createAddress!: HasOneCreateAssociationMixin<Address>;
    public setAddress!: HasOneSetAssociationMixin<Address, number>;
    public static assiciations: {
        users: Association<Workshop, User>;
        address: Association<Workshop, Address>;
    };
}

interface UserAttributes {
    id: number;
    name: string;
    email: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // ! Workshop association methods
    public getWorkshops!: HasManyGetAssociationsMixin<Workshop>;
    public addWorkshop!: HasManyAddAssociationMixin<Workshop, number>;
    public hasWorkshop!: HasManyHasAssociationMixin<Workshop, number>;
    public countWorkshops!: HasManyCountAssociationsMixin;
    public createWorkshop!: HasManyCreateAssociationMixin<Workshop>;
    // ! Workshop static association
    public readonly workshops?: Workshop[];
    public static associations: {
        workshops: Association<User, Workshop>;
    };
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { tableName: "users", sequelize }
);

Workshop.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        coverImage: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        desc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isOnline: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { tableName: "workshops", sequelize }
);

Address.init(
    {
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "addresses",
        sequelize,
        createdAt: false,
        updatedAt: false,
    }
);
Workshop.hasOne(Address);
Address.belongsTo(Workshop);

User.belongsToMany(Workshop, { through: "UserWorkshops", onDelete: "cascade" });
Workshop.belongsToMany(User, { through: "UserWorkshops", onDelete: "cascade" });

sequelize
    .authenticate()
    .then(async () => {
        await sequelize.sync({ alter: false });
        console.log("Connected to the database");
    })
    .catch(error => console.log("Unable to connect to the database", error));

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../../client/build")));
app.use(cors());

app.post(
    "/api/users",
    async (req: Request, res: Response, next: NextFunction) => {
        // req.body = { email: "fdshfjshfd", name: "shdjafjhsadflh" }
        try {
            const newUser = await User.create({
                email: req.body.email,
                name: req.body.name,
            });
            res.status(201).json({ user: newUser.toJSON() });
        } catch (error) {
            return next(error);
        }
    }
);

app.get(
    "/api/users",
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const users = (
                await User.findAll({
                    include: [User.associations.workshops],
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                })
            ).map(u => u.toJSON());
            console.log(users);
            res.status(200).json({ users });
        } catch (error) {
            return next(error);
        }
    }
);
app.get("/api/users/:id", (req: Request, res: Response, next: NextFunction) => {
    User.findOne({ where: { id: req.params.id } })
        .then(user => res.status(200).json({ user }))
        .catch(err => next(err));
});

app.put("/api/users/:id", (req: Request, res: Response, next: NextFunction) => {
    // req.body = WHOLE USER;
    User.update(req.body, { where: { id: req.params.id } })
        .then(user => res.status(200).json({ user }))
        .catch(err => next(err));
});

app.delete(
    "/api/users/:id",
    (req: Request, res: Response, next: NextFunction) => {
        User.destroy({ where: { id: req.params.id } })
            .then(confirmation => res.status(200).json({ confirmation }))
            .catch(err => next(err));
    }
);

app.get("/api/quotes", (_req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ quotes: {} });
});
app.post("/api/quotes", (_req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ quotes: {} });
});
app.put(
    "/api/quotes/:id",
    (_req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({ quotes: {} });
    }
);
app.delete(
    "/api/quotes/:id",
    (_req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({ quotes: {} });
    }
);

app.get("/", (_req, res) =>
    res.sendFile(path.join(__dirname, "../../client", "build", "index.html"))
);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.log("An error happened. I think..... => ", err);
    res.json(err);
});

app.listen(8081, () => console.log("Server is running on port 8081"));
