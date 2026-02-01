import { spawn } from 'child_process';
import prompts from 'prompts';

const TASK_TYPES = {
  feat: '✨',
  fix: '🐛',
  build: '📦',
  chore: '🧹',
  docs: '📝',
  refactor: '🛠️',
  test: '🧪',
  perf: '🚀',
  revert: '⏪',
};

const COMMIT_MSG = 'A short, impertative description';
const MAX_COMMIT_MSG_LEN = 80;

async function cmd(c) {
  const proc = spawn('sh', ['-c', c]);
  let stdout = '';
  let stderr = '';

  for await (const chunk of proc.stdout) stdout += chunk;
  for await (const chunk of proc.stderr) stderr += chunk;

  const exit = await new Promise((r) => proc.on('close', r));

  if (exit !== 0) {
    process.stdout.write(stdout);
    throw new Error(stderr);
  }
  return stdout;
}

const colorize = (...args) => ({
  gray: `\x1b[90m${args.join(' ')}\x1b[39m`,
  red: `\x1b[31m${args.join(' ')}\x1b[39m`,
  green: `\x1b[32m${args.join(' ')}\x1b[39m`,
});

async function prompt() {
  const {
    type,
    body = '',
    breaking,
    ticketNumber,
    short,
  } = await prompts(
    [
      {
        name: 'type',
        type: 'select',
        message: 'Type of change',
        limit: 300,
        choices: [
          {
            title: `${TASK_TYPES.feat} feat`,
            value: 'feat',
            description: 'a newly added feature',
          },
          {
            title: `${TASK_TYPES.fix} fix`,
            value: 'fix',
            description: 'fixes a bug',
          },
          {
            title: `${TASK_TYPES.build} build`,
            value: 'build',
            description: 'changes a build configuration',
          },
          {
            title: `${TASK_TYPES.chore} chore`,
            value: 'chore',
            description: 'merges and releases',
          },
          {
            title: `${TASK_TYPES.docs} docs`,
            value: 'docs',
            description: 'adds documentation',
          },
          {
            title: `${TASK_TYPES.refactor} refactor`,
            value: 'refactor',
            description: 'neither a feature nor a fix',
          },
          {
            title: `${TASK_TYPES.test} test`,
            value: 'test',
            description: 'adds a missing test',
          },
          {
            title: `${TASK_TYPES.perf} perf`,
            value: 'perf',
            description: 'changes that imporve performance',
          },
          {
            title: `${TASK_TYPES.revert} revert`,
            value: 'revert',
            description: 'reverts a previous change',
          },
        ],
      },
      {
        type: 'text',
        name: 'short',
        message: `${COMMIT_MSG} ${colorize(`(Max chars left: ${MAX_COMMIT_MSG_LEN})`).gray}`,
        onRender() {
          const left = MAX_COMMIT_MSG_LEN - this.rendered.length;
          this.msg = `${COMMIT_MSG} ${colorize(`(Max chars left: ${left})`).gray}`;
        },
      },
      {
        type: 'text',
        name: 'ticketNumber',
        message: `Notion Task Number ${colorize(`(Use only numbers)`).gray}`,
        validate: (ticketNumber) => {
          if (!ticketNumber) {
            return 'Ticker number is required';
          }

          if (!/^\d+$/.test(ticketNumber)) {
            return 'Ticket number should contain only digits';
          }

          return true;
        },
      },
      {
        type: 'confirm',
        name: 'breaking',
        message: 'Is this a BREAKING change',
      },
    ],
    {
      onCancel: () => {
        console.log(colorize('The git commit process was rejected').red);
        process.exit(1);
      },
    },
  );

  let msg = `${TASK_TYPES[type]} ${type}${breaking ? '!' : ''}: WP-${ticketNumber} ${short}
    
    NOTION: [WP-${ticketNumber}](https://www.notion.so/work-pace/WP-${ticketNumber})
    BREAKING-CHANGE: ${breaking ? 'yes' : 'no'}
    `;
  if (body.length) {
    msg += `\n\n${body.join('\n')}`;
  }

  await cmd(`git commit -m '${msg}'`);
  console.log(`${colorize('Your changes were successfully commited').green}`);
}

prompt();
