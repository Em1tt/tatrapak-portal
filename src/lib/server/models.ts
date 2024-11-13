import {
	type CreationOptional,
	type InferAttributes,
	type InferCreationAttributes,
	Model,
	DataTypes,
	type NonAttribute
} from '@sequelize/core';
import {
	AllowNull,
	Attribute,
	AutoIncrement,
	CreatedAt,
	HasOne,
	NotNull,
	PrimaryKey,
	Table,
	Unique,
	UpdatedAt
} from '@sequelize/core/decorators-legacy';

@Table({ tableName: 'Pouzivatelia' })
export class Pouzivatel extends Model<InferAttributes<Pouzivatel>, InferCreationAttributes<Pouzivatel>> {
	@Attribute(DataTypes.INTEGER)
	@PrimaryKey
	@AutoIncrement
	declare PouzivatelID: CreationOptional<number>;

	@Attribute(DataTypes.STRING)
	@NotNull
	@Unique
	declare Meno: string;

	@Attribute(DataTypes.STRING)
	@NotNull
	@Unique
	declare Email: string;

	@Attribute(DataTypes.ENUM("obchodnik", "administrativny pracovnik", "vyroba", "spravca"))
	@NotNull
	declare Rola: "obchodnik" | "administrativny pracovnik" | "vyroba" | "spravca";

	@Attribute(DataTypes.STRING)
	@NotNull
	declare Heslo: string;

	@HasOne(() => Oddelenie, /* foreign key */ 'oddelenieid')
  	declare OddelenieID?: NonAttribute<Oddelenie>;

	// This is the foreign key
	@Attribute(DataTypes.INTEGER)
	@NotNull
	declare oddelenieid: number;

	@CreatedAt
	declare created_at: CreationOptional<Date>;

	@UpdatedAt
	declare updated_at: CreationOptional<Date>;
}

@Table({ timestamps: false })
export class Session extends Model<
	InferAttributes<Session>,
	InferCreationAttributes<Session>
> {
	@Attribute(DataTypes.STRING)
	@PrimaryKey
	@AutoIncrement
	declare session_id: CreationOptional<string>;

	@Attribute(DataTypes.DATE)
	@NotNull
	declare expires_at: Date;

	@Attribute(DataTypes.INTEGER)
	@NotNull
	declare user_id: number;
}

export class Oddelenie extends Model<InferAttributes<Oddelenie>, InferCreationAttributes<Oddelenie>> {
	@Attribute(DataTypes.INTEGER)
	@PrimaryKey
	@AutoIncrement
	declare OddelenieID: CreationOptional<number>

	@Attribute(DataTypes.STRING)
	@NotNull
	declare Nazov: string;

	@Attribute(DataTypes.TEXT)
	declare Popis: CreationOptional<string>

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
		underscored: true
	},
	models: [Pouzivatel, Session]
});