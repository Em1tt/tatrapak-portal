import {
	type CreationOptional,
	type InferAttributes,
	type InferCreationAttributes,
	Model,
	DataTypes,
	type NonAttribute,
	type HasOneGetAssociationMixin,
	type HasManyGetAssociationsMixin,
	type HasOneSetAssociationMixin,
	type BelongsToGetAssociationMixin
} from '@sequelize/core';
import {
	Attribute,
	AutoIncrement,
	BeforeCreate,
	BeforeUpdate,
	CreatedAt,
	HasMany,
	HasOne,
	NotNull,
	PrimaryKey,
	Table,
	Unique,
	UpdatedAt
} from '@sequelize/core/decorators-legacy';

@Table({ tableName: 'Pouzivatelia', modelName: 'Pouzivatel' })
export class Pouzivatel extends Model<
	InferAttributes<Pouzivatel>,
	InferCreationAttributes<Pouzivatel>
> {
	@Attribute(DataTypes.INTEGER)
	@PrimaryKey
	@AutoIncrement
	@Unique
	declare PouzivatelID: CreationOptional<number>;

	@Attribute(DataTypes.STRING)
	@NotNull
	@Unique
	declare Meno: string;

	@Attribute(DataTypes.STRING)
	@NotNull
	@Unique
	declare Email: string;

	@Attribute(DataTypes.ENUM('obchodnik', 'administrativny pracovnik', 'vyroba', 'spravca'))
	@NotNull
	declare Rola: 'obchodnik' | 'administrativny pracovnik' | 'vyroba' | 'spravca';

	@Attribute(DataTypes.STRING)
	@NotNull
	declare Heslo: string;

	@HasOne(() => Oddelenie, { foreignKey: 'OddelenieID', inverse: 'pouzivatelia' })
	declare oddelenie: NonAttribute<Oddelenie>;
	declare getOddelenie: HasOneGetAssociationMixin<Oddelenie>;
	declare setOddelenie: HasOneSetAssociationMixin<Oddelenie, Oddelenie['OddelenieID']>;

	@HasMany(() => Session, { foreignKey: 'user_id', inverse: 'pouzivatel' })
	declare sessions?: NonAttribute<Session[]>;
	declare getSessions: HasManyGetAssociationsMixin<Session>;

	@HasMany(() => Objednavka, { foreignKey: 'PouzivatelID', inverse: 'pouzivatel' })
	declare objednavky?: NonAttribute<Objednavka[]>;
	declare getObjednavky: HasManyGetAssociationsMixin<Objednavka>;

	@HasMany(() => Produkt, { foreignKey: "VytvorilPouzivatelID", inverse: 'pouzivatel' })
	declare produkty?: NonAttribute<Produkt[]>;
	declare getProdukty: HasManyGetAssociationsMixin<Produkt>;

	@CreatedAt
	declare created_at: CreationOptional<Date>;

	@UpdatedAt
	declare updated_at: CreationOptional<Date>;
}

@Table({ timestamps: false, tableName: 'Sessions', modelName: 'Session' })
export class Session extends Model<InferAttributes<Session>, InferCreationAttributes<Session>> {
	@Attribute(DataTypes.STRING)
	@PrimaryKey
	@AutoIncrement
	declare session_id: CreationOptional<string>;

	@Attribute(DataTypes.DATE)
	@NotNull
	declare expires_at: Date;

	/** Defined by {@link Pouzivatel.sessions} */
	declare pouzivatel?: NonAttribute<Pouzivatel>;
	declare getPouzivatel: BelongsToGetAssociationMixin<Pouzivatel>;

	// This is the foreign key
	@Attribute(DataTypes.INTEGER)
	@NotNull
	declare user_id: number;
}

@Table({ tableName: 'Oddelenia' })
export class Oddelenie extends Model<
	InferAttributes<Oddelenie>,
	InferCreationAttributes<Oddelenie>
> {
	@Attribute(DataTypes.INTEGER)
	@PrimaryKey
	@AutoIncrement
	declare OddelenieID: CreationOptional<number>;

	@Attribute(DataTypes.STRING)
	@NotNull
	declare Nazov: string;

	@Attribute(DataTypes.TEXT)
	declare Popis: CreationOptional<string>;

	/** Defined by {@link Pouzivatel.oddelenie} */
	declare oddelenie: NonAttribute<Oddelenie>;
	declare getOddelenie: BelongsToGetAssociationMixin<Oddelenie>;

	@CreatedAt
	declare created_at: CreationOptional<Date>;

	@UpdatedAt
	declare updated_at: CreationOptional<Date>;
}

@Table({ tableName: 'Objednavky' })
export class Objednavka extends Model<
	InferAttributes<Objednavka>,
	InferCreationAttributes<Objednavka>
> {
	@Attribute(DataTypes.INTEGER)
	@PrimaryKey
	@AutoIncrement
	declare ObjednavkaID: CreationOptional<number>;

	@Attribute(DataTypes.INTEGER)
	declare ZakaznikID: number;

	@Attribute(DataTypes.INTEGER)
	declare PouzivatelID: number;

	/** Defined by {@link Pouzivatel.objednavky} */
	declare pouzivatel: NonAttribute<Pouzivatel>;
	declare getPouzivatel: BelongsToGetAssociationMixin<Pouzivatel>;

	/** Defined by {@link Zakaznik.objednavky} */
	declare zakaznik: NonAttribute<Zakaznik>;
	declare getZakaznik: BelongsToGetAssociationMixin<Zakaznik>;

	@Attribute(DataTypes.JSON)
	@NotNull
	declare Produkt: Array<{ id: string; name: string; quantity: number }>;

	@Attribute(DataTypes.DATE)
	@NotNull
	declare DatumExpedicie: Date;

	@Attribute(DataTypes.ENUM('prijata', 'vo vyrobe', 'expedovana'))
	@NotNull
	declare Stav: CreationOptional<'prijata' | 'vo vyrobe' | 'expedovana'>;

	@CreatedAt
	declare created_at: CreationOptional<Date>;

	@UpdatedAt
	declare updated_at: CreationOptional<Date>;

	// Custom validation to ensure the id within the JSON references a valid Produkt
    static async validateProdukty(produkty: Array<{ id: string; name: string; quantity: number }>) {
        for (const produkt of produkty) {
            const exists = await Produkt.findByPk(produkt.id);
            if (!exists) {
                throw new Error(`Produkt with id ${produkt.id} does not exist`);
            }
        }
    }

    @BeforeCreate
    @BeforeUpdate
    static async validateProduktyHook(instance: Objednavka) {
        await Objednavka.validateProdukty(instance.Produkt);
    }
}

@Table({ tableName: 'Zakaznici' })
export class Zakaznik extends Model<InferAttributes<Zakaznik>, InferCreationAttributes<Zakaznik>> {
	@Attribute(DataTypes.INTEGER)
	@PrimaryKey
	@AutoIncrement
	declare ZakaznikID: CreationOptional<number>;

	@Attribute(DataTypes.STRING)
	@NotNull
	declare Meno: string;

	@Attribute(DataTypes.STRING)
	@NotNull
	declare Telefon: CreationOptional<string>;

	@Attribute(DataTypes.STRING)
	@NotNull
	declare Email: CreationOptional<string>;

	@HasMany(() => Objednavka, { foreignKey: 'ZakaznikID', inverse: 'zakaznik' })
	declare objednavky?: NonAttribute<Objednavka[]>;
	declare getObjednavky: HasManyGetAssociationsMixin<Objednavka>;

	@CreatedAt
	declare created_at: CreationOptional<Date>;

	@UpdatedAt
	declare updated_at: CreationOptional<Date>;
}

@Table({ tableName: 'Produkty' })
export class Produkt extends Model<InferAttributes<Produkt>, InferCreationAttributes<Produkt>> {
	@Attribute(DataTypes.INTEGER)
	@PrimaryKey
	@AutoIncrement
	declare ProduktID: CreationOptional<number>;

	@Attribute(DataTypes.STRING)
	@NotNull
	declare Nazov: string;

	@Attribute(DataTypes.INTEGER)
	@NotNull
	declare VytvorilPouzivatelID: number;

	@Attribute(DataTypes.DECIMAL(10, 2))
	declare Cena: string;

	

	@Attribute(DataTypes.STRING)
	@NotNull
	declare KatalogoveCislo: string;

	@Attribute(DataTypes.DECIMAL(7, 1))
    @NotNull
    declare Hmotnost: string;

	/** Defined by {@link Pouzivatel.produkty} */
	declare pouzivatel: NonAttribute<Pouzivatel>;
	declare getPouzivatel: BelongsToGetAssociationMixin<Pouzivatel>;

	@CreatedAt
	declare created_at: CreationOptional<Date>;

	@UpdatedAt
	declare updated_at: CreationOptional<Date>;
}

import { Sequelize } from '@sequelize/core';
import { MySqlDialect } from '@sequelize/mysql';
import { SQLURI } from '$env/static/private';

export const sequelize = new Sequelize({
	dialect: MySqlDialect,
	url: SQLURI,
	pool: {
		max: 10,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	define: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		underscored: false,
	},
	models: [Pouzivatel, Session, Oddelenie, Objednavka, Zakaznik, Produkt]
});
/*
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        return sequelize.sync();
    })
    .then(() => {
        console.log('Models synchronized successfully.');
        // Now you can use the models and their association mixin methods
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });*/
