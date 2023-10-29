import { DefaultNamingStrategy } from 'typeorm';
export class PluralNamingStrategy extends DefaultNamingStrategy {
  tableName(targetName, userSpecifiedName) {
    return userSpecifiedName || targetName.toLowerCase() + 's'; // Pluralize the table name
  }
  columnName(propertyName, customName, embeddedPrefixes) {
    return propertyName;
  }
  relationName(propertyName) {
    return propertyName;
  }
}
//# sourceMappingURL=plural-naming.strategy.js.map
