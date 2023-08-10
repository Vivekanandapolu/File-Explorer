import { environment } from "../environments/environment.development"
const domain = environment.appurl

export const apiurls = {
    login: domain + "/auth/login",
    buckets: domain + "/bucket/list",
    bucketsData: domain + "/bucket/get_bucket_data/",
    downloadFile: domain + '/bucket/file/download'
}