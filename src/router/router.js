
import notFound from './404'
import system from './system';
import platform from "./platform";
import tenant from "./tenant";
import org from "./org";
import orgGroup from "./org-group"
import iframe from './iframe'

function concatArray(...arr) {
    return arr.reduce((prev,cur) =>prev.concat(cur),[]);

}

export const appRouter = concatArray(
    notFound,
    system,
    platform,
    tenant,
    org,
    orgGroup,
    iframe
)

export const routers = [
    ...appRouter
]
