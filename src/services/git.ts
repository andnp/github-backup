import * as _ from 'lodash';
import { exec } from 'child_process';
import { promisify } from 'util';
import { files } from 'utilities-ts';

const execAsync = promisify(exec);

function up(path: string) {
    const parts = path.split('/');
    return parts.slice(0, -1).join('/');
}

export async function clone(url: string, to?: string) {
    let command = `git clone ${url}`;
    if (to) {
        command += ` ${to}`;
        await files.createFolder(up(to));
    }
    await execAsync(command);
}

export async function pull(loc: string) {
    await execAsync('git pull', { cwd: loc });
}
