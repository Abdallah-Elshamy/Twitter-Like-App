import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    BelongsToMany,
} from 'sequelize-typescript';
import HasPermission from './hasPermission';
import Group from './group';


@Table({
    tableName: 'permissions',
})
class Permission extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    name!: string;

    @BelongsToMany(() => Group, () => HasPermission, 'permissionName', 'groupName')
    groups?: Group[];
}


export default Permission;