import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    BelongsToMany,
} from 'sequelize-typescript';
import Permission from './permission';
import HasPermission from './hasPermission';
import User from './user';
import UserBelongsToGroup from './userBelongsToGroup';


@Table({
    timestamps: true,
    tableName: 'groups',
})
class Group extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    name!: string;

    // many-to-many relation between group and permission
    @BelongsToMany(() => Permission, () => HasPermission, 'permissionName', 'groupName')
    permissions?: Permission[];

    // many-to-many relation between group and user
    @BelongsToMany(() => User, () => UserBelongsToGroup, 'userId', 'groupName')
    users?: User[];
}


export default Group;