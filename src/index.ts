import * as v from 'validtyped';
import * as fs from 'fs';
import * as request from './utils/request';
import * as git from './services/git';
import { getConfig } from './models/Config';
import { buildScheduler } from './utils/schedule';
import { attempt } from './utils/tryCatch';
import { promise } from 'utilities-ts';

import { repoSchema } from './models/Github';

const config = getConfig();

const schedule = buildScheduler({
    time: "01:30",
    debug: true,
});

async function exists(path: string) {
    return attempt(false, () => fs.promises.access(path).then(() => true));
}

function expandHome(path: string) {
    return path.replace('~', process.env.HOME!);
}

schedule(async () => {
    const configData = await config.blockUntilLoaded();
    const auth = { Authorization: `token ${configData.auth_token}` };

    const repos = await request.get('https://api.github.com/user/repos?per_page=200', v.array(repoSchema), auth);

    await promise.map(repos, async (repo) => {
        if (!repo.permissions.pull) return;

        const path = expandHome(`~/tmp/backups/${repo.name}`);
        if (await exists(path)) {
            console.log('pulling ' + repo.full_name);
            await git.pull(path);
        } else {
            console.log('cloning ' + repo.full_name);
            await git.clone(repo.clone_url, path);
        }
    });

    console.log('done');
});
