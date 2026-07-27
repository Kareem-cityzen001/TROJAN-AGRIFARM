import sequelizePkg from 'sequelize';
const { DataTypes } = sequelizePkg;
import { sequelize } from './index.js';

export const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rating: {
    type: DataTypes.JSON,
    allowNull: false,
    get() {
      const value = this.getDataValue('rating');
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return value;
    },
    set(value) {
      this.setDataValue('rating', typeof value === 'string' ? value : JSON.stringify(value));
    }
  },
  priceCents: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  keywords: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      return this.getDataValue('keywords').split(',');
    },
    set(val) {
      this.setDataValue('keywords', val.join(','));
    }
  },
  createdAt: {
    type: DataTypes.DATE(3)
  },
  updatedAt: {
    type: DataTypes.DATE(3)
  },
}, {
  defaultScope: {
    order: [['createdAt', 'ASC']]
  }
});
