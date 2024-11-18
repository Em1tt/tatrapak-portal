import {
	type CreationOptional,
	type InferAttributes,
	type InferCreationAttributes,
	Model,
	DataTypes,
	type NonAttribute,
	type HasOneGetAssociationMixin,
	type HasOneSetAssociationMixin,
	type BelongsToGetAssociationMixin
} from '@sequelize/core';
import {
	Attribute,
	AutoIncrement,
	BelongsTo,
	CreatedAt,
	HasOne,
	NotNull,
	PrimaryKey,
	Table,
	Unique,
	UpdatedAt
} from '@sequelize/core/decorators-legacy';

@Table({ tableName: 'Pouzivatelia' })
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

	@HasOne(() => Oddelenie, 'OddelenieID')
	declare OddelenieID?: NonAttribute<Oddelenie>;
	declare getOddelenie: HasOneGetAssociationMixin<Oddelenie>;
	declare setOddelenie: HasOneSetAssociationMixin<Oddelenie, Oddelenie['OddelenieID']>;

	@CreatedAt
	declare created_at: CreationOptional<Date>;

	@UpdatedAt
	declare updated_at: CreationOptional<Date>;
}

@Table({ timestamps: false, tableName: 'Sessions' })
export class Session extends Model<InferAttributes<Session>, InferCreationAttributes<Session>> {
	@Attribute(DataTypes.STRING)
	@PrimaryKey
	@AutoIncrement
	declare session_id: CreationOptional<string>;

	@Attribute(DataTypes.DATE)
	@NotNull
	declare expires_at: Date;

	@HasOne(() => Pouzivatel, "PouzivatelID")
	declare user_id?: NonAttribute<Pouzivatel>;
	declare getUser: HasOneGetAssociationMixin<Pouzivatel>;
	declare setUser: HasOneSetAssociationMixin<Pouzivatel, Pouzivatel['PouzivatelID']>;
}

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

	@HasOne(() => Zakaznik, 'ZakaznikID')
	declare ZakaznikID?: NonAttribute<Zakaznik>;
	declare getCustomer: HasOneGetAssociationMixin<Zakaznik>;
	declare setCustomer: HasOneSetAssociationMixin<Zakaznik, Zakaznik['ZakaznikID']>;

	@BelongsTo(() => Pouzivatel, "PouzivatelID")
  	declare Pouzivatel?: NonAttribute<Pouzivatel>;
	declare getUser: BelongsToGetAssociationMixin<Pouzivatel>;

	@Attribute(DataTypes.JSON)
	@NotNull
	declare Produkt: Array<{id: string, name: string, quantity: number}>;

	@Attribute(DataTypes.DATE)
	@NotNull
	declare DatumExpedicie: CreationOptional<Date>;

	@Attribute(DataTypes.ENUM("prijata", "vo vyrobe", "expedovana"))
	@NotNull
	declare Stav: CreationOptional<"prijata" | "vo vyrobe" | "expedovana">;

	@CreatedAt
	declare created_at: CreationOptional<Date>;

	@UpdatedAt
	declare updated_at: CreationOptional<Date>;
}

@Table({ tableName: 'Zakaznici' })
export class Zakaznik extends Model<
	InferAttributes<Zakaznik>,
	InferCreationAttributes<Zakaznik>
> {
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
		underscored: false
	},
	models: [Pouzivatel, Session, Oddelenie, Objednavka, Zakaznik]
});