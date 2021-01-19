import {
    Table,
    Column,
    Model,
    ForeignKey,
    PrimaryKey,
    DataType,
} from 'sequelize-typescript';
import Group from './group';
import Permission from './permission';

@Table({
    tableName: 'hasPermissions',
})
class HasPermission extends Model {
    @PrimaryKey
    @ForeignKey(() => Group)
    @Column(DataType.STRING)
    groupName!: string;

    @PrimaryKey
    @ForeignKey(() => Permission)
    @Column(DataType.STRING)
    permissionName!: string;
}


export default HasPermission;