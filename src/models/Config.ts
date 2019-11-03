import * as _ from 'lodash';
import * as v from 'validtyped';
import { WatchedConfig } from '../utils/WatchedConfig';

const configSchema = v.object({
    auth_token: v.string(),
});

export const getConfig = _.once(() => {
    return new WatchedConfig('./config.json', configSchema);
});
