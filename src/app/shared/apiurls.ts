import { environment } from "../environments/environment.development"
const domain = environment.appurl

export const apiurls = {
    login: domain + "/auth/login",
    buckets: domain + "/bucket/list",
    bucketsData: domain + "/bucket/get_bucket_data/",
    downloadFile: domain + '/bucket/file/download',
    forgotPass: domain + '/auth/forgot_password',
    usertype: domain + "/auth/show",
    newBucket: domain + "/api/bucket_create",
    createUser: domain + '/auth/user_create',
    allUsers: domain + '/api/user_list',
    enableuser: domain + '/api/user_status',
    addBuckets: domain + '/api/user/add_bucket',
    allGroups: domain + '/api/group_list',
    addGroup: domain + '/api/group_create',
    manageBuckets: domain + '/api/group/add_bucket',
    manageUsers: domain + '/api/group/add_users'
}